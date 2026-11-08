#!/usr/bin/env python3
"""Regenerate the public mutual NDA template (PDF and DOCX) from documents/nda/mutual-nda.md.

No paid library and no network call. PDF generation uses fpdf2 (BSD) and the free
Liberation fonts (Debian/Ubuntu package fonts-liberation). DOCX generation uses the
Python standard library only.

    python3 -m pip install --user fpdf2
    sudo apt-get install fonts-liberation   # if the .ttf files are not already present
    python3 scripts/generate-mutual-nda.py

The site serves the files written to public/downloads/. Runtime does not need this script.
"""

from __future__ import annotations

import re
import sys
import tempfile
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "documents" / "nda" / "mutual-nda.md"
OUT_DIR = ROOT / "public" / "downloads"
PDF_NAME = "sourcing-center-mutual-nda-template.pdf"
DOCX_NAME = "sourcing-center-mutual-nda-template.docx"
MARK_PATH = ROOT / "public" / "seven-color-mark-clear.png"
WORD_PATH = ROOT / "public" / "sourcing-center-logo.png"

# Site accent used by the sourcing.center wordmark. Not a new color.
BRAND = (227, 28, 35)
INK = (22, 22, 22)
MUTED = (82, 82, 84)
HAIRLINE = (214, 214, 214)

FONT_DIRS = [
    Path("/usr/share/fonts/truetype/liberation"),
    Path("/usr/share/fonts/liberation"),
    Path("/usr/share/fonts/truetype/liberation2"),
]

REQUIRED_PHRASES = [
    "Sourcing Center — Mutual NDA Template",
    "General template—review with legal counsel before signing.",
    "Confidential Information",
    "independently developed",
    "need to know",
    "reasonable care",
    "legally permitted",
    "does not transfer ownership",
    "ordinary backup",
    "does not require either Party to continue discussions",
    "as is",
    "trade secret",
    "Governing law",
    "Effective Date",
    "Authorized representative",
    "writing signed by both Parties",
    "Permitted purpose",
    "UNSIGNED",
]

# The template must not pretend a company, office, or person is already a party,
# and it must not cite a statute or claim official approval.
FORBIDDEN_SNIPPETS = [
    "Xiamen Ajmal",
    "Seven Color Trading Co",
    "DUNS",
    "509419282",
    "1493012",
    "approved by counsel",
    "legally binding upon download",
    "U.S.C.",
    "Export Administration",
]


def find_font(filename: str) -> Path:
    for directory in FONT_DIRS:
        candidate = directory / filename
        if candidate.is_file():
            return candidate
    raise SystemExit(
        f"Missing {filename}. Install the free fonts-liberation package and rerun."
    )


def parse_source(text: str) -> dict:
    lines = text.splitlines()
    if not lines or not lines[0].startswith("# "):
        raise SystemExit("Source must start with a level-1 title.")

    doc = {
        "title": lines[0][2:].strip(),
        "kicker": "",
        "subtitle": "",
        "caveat": "",
        "blocks": [],
    }
    i = 1
    while i < len(lines) and lines[i].strip() == "":
        i += 1
    while i < len(lines) and ":" in lines[i] and not lines[i].startswith("#"):
        key, value = lines[i].split(":", 1)
        key = key.strip()
        if key in {"kicker", "subtitle", "caveat"}:
            doc[key] = value.strip()
            i += 1
            continue
        break

    paragraph: list[str] = []

    def flush() -> None:
        if paragraph:
            doc["blocks"].append({"type": "p", "text": " ".join(paragraph).strip()})
            paragraph.clear()

    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()
        if stripped == "":
            flush()
            i += 1
            continue
        if stripped.startswith("## "):
            flush()
            doc["blocks"].append({"type": "h", "text": stripped[3:].strip()})
            i += 1
            continue
        if stripped in {"[[field]]", "[[signature]]", "[[choices]]"}:
            flush()
            kind = stripped[2:-2]
            i += 1
            if kind == "choices":
                doc["blocks"].append({"type": "choices"})
                continue
            if i >= len(lines) or not lines[i].strip():
                raise SystemExit(f"{kind} marker is missing its label.")
            doc["blocks"].append({"type": kind, "text": lines[i].strip()})
            i += 1
            continue
        if stripped.startswith("[["):
            raise SystemExit(f"Unknown marker: {stripped}")
        paragraph.append(stripped)
        i += 1
    flush()
    if not doc["caveat"] or not doc["subtitle"]:
        raise SystemExit("Source is missing subtitle or caveat.")
    return doc


def load() -> dict:
    return parse_source(SOURCE.read_text(encoding="utf-8"))


def crop_to_ink(image):
    """Trim empty canvas so the existing artwork can be placed at its true ratio."""
    from PIL import ImageChops

    rgba = image.convert("RGBA")
    alpha = rgba.getchannel("A").point(lambda value: 255 if value > 16 else 0)
    ink = rgba.convert("RGB").convert("L").point(lambda value: 255 if value < 250 else 0)
    bbox = ImageChops.multiply(alpha, ink).getbbox()
    if not bbox:
        raise SystemExit("Logo asset has no visible pixels.")
    return rgba.crop(bbox)


def prepare_logos(directory: Path) -> dict:
    """Crop the official mark and wordmark. Do not redraw or recolor them."""
    try:
        from PIL import Image
    except ImportError as exc:
        raise SystemExit("Pillow is required to place the logo. Install fpdf2, which includes it.") from exc

    if not MARK_PATH.is_file() or not WORD_PATH.is_file():
        raise SystemExit("Official logo files are missing from public/.")

    mark = crop_to_ink(Image.open(MARK_PATH).convert("RGBA"))
    word = crop_to_ink(Image.open(WORD_PATH).convert("RGBA"))
    # Pad the wordmark canvas to the mark height so the two images share a baseline.
    word_height = max(1, int(round(mark.height * 0.46)))
    word_width = max(1, int(round(word.width * (word_height / word.height))))
    scaled = word.resize((word_width, word_height), Image.Resampling.LANCZOS)
    word_canvas = Image.new("RGBA", (word_width, mark.height), (255, 255, 255, 0))
    word_canvas.paste(scaled, (0, (mark.height - word_height) // 2), scaled)

    mark_file = directory / "mark.png"
    word_file = directory / "wordmark.png"
    mark.save(mark_file)
    word_canvas.save(word_file)
    return {
        "mark": mark_file,
        "word": word_file,
        "mark_ratio": mark.width / mark.height,
        "word_ratio": word_canvas.width / word_canvas.height,
    }


def build_pdf(doc: dict, destination: Path, logos: dict) -> None:
    from fpdf import FPDF

    regular = find_font("LiberationSerif-Regular.ttf")
    bold = find_font("LiberationSerif-Bold.ttf")
    italic = find_font("LiberationSerif-Italic.ttf")
    bold_italic = find_font("LiberationSerif-BoldItalic.ttf")
    sans = find_font("LiberationSans-Regular.ttf")
    sans_bold = find_font("LiberationSans-Bold.ttf")

    class Form(FPDF):
        def header(self) -> None:
            if self.page_no() == 1:
                return
            # add_page() sets y to the top margin, then calls header().
            # Draw the running brand above that margin and put y back.
            mark_h = 5.4
            mark_w = mark_h * logos["mark_ratio"]
            self.image(str(logos["mark"]), x=self.l_margin, y=8.2, h=mark_h)
            self.set_font("Sans", "", 8)
            self.set_text_color(*MUTED)
            text_x = self.l_margin + mark_w + 2.4
            self.set_xy(text_x, 8.6)
            self.cell(self.w - self.r_margin - text_x - 36, 4.6, doc["title"], align="L")
            self.set_xy(self.l_margin, 8.6)
            self.cell(self.w - self.l_margin - self.r_margin, 4.6, "Unsigned template", align="R")
            self.set_draw_color(*HAIRLINE)
            self.set_line_width(0.2)
            self.line(self.l_margin, 15.6, self.w - self.r_margin, 15.6)
            self.set_draw_color(*BRAND)
            self.set_line_width(0.45)
            self.line(self.l_margin, 15.6, self.l_margin + 16, 15.6)
            self.set_text_color(*INK)
            self.set_y(self.t_margin)

        def footer(self) -> None:
            self.set_draw_color(*HAIRLINE)
            self.set_line_width(0.2)
            self.line(self.l_margin, self.h - 18, self.w - self.r_margin, self.h - 18)
            self.set_draw_color(*BRAND)
            self.set_line_width(0.45)
            self.line(self.l_margin, self.h - 18, self.l_margin + 16, self.h - 18)
            self.set_y(-16.2)
            self.set_font("Sans", "", 7.5)
            self.set_text_color(*MUTED)
            self.cell(0, 3.8, doc["caveat"], align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_x(self.l_margin)
            self.cell(
                0,
                3.8,
                f"Unsigned template  ·  Page {self.page_no()} of {{nb}}",
                align="C",
            )
            self.set_text_color(*INK)

    pdf = Form(format="A4", unit="mm")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=26)
    pdf.set_margins(22, 20, 22)
    pdf.set_title(doc["title"])
    pdf.set_author("Sourcing Center")
    pdf.set_subject("Unsigned generic mutual non-disclosure agreement template")
    pdf.set_creator("scripts/generate-mutual-nda.py")
    pdf.set_keywords("mutual NDA, template, sourcing, unsigned")
    for name, style, path in (
        ("Serif", "", regular),
        ("Serif", "B", bold),
        ("Serif", "I", italic),
        ("Serif", "BI", bold_italic),
        ("Sans", "", sans),
        ("Sans", "B", sans_bold),
    ):
        pdf.add_font(name, style, str(path))
    pdf.add_page()
    usable = pdf.w - pdf.l_margin - pdf.r_margin
    label_width = 72.0
    body_leading = 5.55

    def remaining() -> float:
        return pdf.h - 26 - pdf.get_y()

    def ensure(space: float) -> None:
        if remaining() < space:
            pdf.add_page()

    mark_h = 13.2
    mark_w = mark_h * logos["mark_ratio"]
    word_h = mark_h
    word_w = word_h * logos["word_ratio"]
    logo_y = pdf.get_y()
    pdf.image(str(logos["mark"]), x=pdf.l_margin, y=logo_y, h=mark_h)
    pdf.image(str(logos["word"]), x=pdf.l_margin + mark_w + 3.0, y=logo_y, h=word_h)
    pdf.set_font("Sans", "B", 8)
    pdf.set_text_color(*BRAND)
    pdf.set_xy(pdf.l_margin, logo_y + 4.2)
    pdf.cell(usable, 4.5, doc["kicker"], align="R")
    rule_y = logo_y + mark_h + 3.2
    pdf.set_draw_color(*HAIRLINE)
    pdf.set_line_width(0.25)
    pdf.line(pdf.l_margin, rule_y, pdf.w - pdf.r_margin, rule_y)
    pdf.set_draw_color(*BRAND)
    pdf.set_line_width(0.7)
    pdf.line(pdf.l_margin, rule_y, pdf.l_margin + 28, rule_y)
    pdf.set_y(rule_y + 5.5)

    pdf.set_text_color(*INK)
    pdf.set_font("Serif", "B", 18)
    pdf.multi_cell(0, 8.2, doc["title"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.2)
    pdf.set_font("Serif", "I", 11)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(0, 5.4, doc["subtitle"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3.2)

    pdf.set_font("Serif", "", 10.5)
    caveat_h = pdf.multi_cell(usable - 8, 5.2, doc["caveat"], dry_run=True, output="HEIGHT")
    box_h = caveat_h + 5.2
    box_y = pdf.get_y()
    pdf.set_fill_color(247, 247, 247)
    pdf.rect(pdf.l_margin, box_y, usable, box_h, style="F")
    pdf.set_fill_color(*BRAND)
    pdf.rect(pdf.l_margin, box_y, 1.15, box_h, style="F")
    pdf.set_xy(pdf.l_margin + 4.2, box_y + 2.5)
    pdf.set_text_color(*INK)
    pdf.multi_cell(usable - 8, 5.2, doc["caveat"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(box_y + box_h + 5)

    def paragraph(text: str, *, gap: float = 2.15) -> None:
        pdf.set_text_color(*INK)
        pdf.set_font("Serif", "", 11)
        height = pdf.multi_cell(0, body_leading, text, dry_run=True, output="HEIGHT")
        if remaining() < 22 and height > remaining():
            pdf.add_page()
        pdf.multi_cell(0, body_leading, text, align="J", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(gap)

    def field(label: str) -> None:
        ensure(12)
        y = pdf.get_y()
        pdf.set_text_color(*INK)
        pdf.set_font("Serif", "", 11)
        pdf.set_xy(pdf.l_margin, y)
        pdf.cell(label_width, 6, label, new_x="RIGHT", new_y="TOP")
        pdf.set_draw_color(35, 35, 35)
        pdf.set_line_width(0.3)
        pdf.line(pdf.l_margin + label_width, y + 5.5, pdf.w - pdf.r_margin, y + 5.5)
        pdf.set_xy(pdf.l_margin, y + 9.2)

    def signature(party: str) -> None:
        labels = (
            "Legal name",
            "Authorized representative (print name)",
            "Signature",
            "Title",
            "Date",
        )
        ensure(16 + len(labels) * 13)
        pdf.ln(2)
        pdf.set_font("Serif", "B", 13)
        pdf.set_text_color(*INK)
        pdf.cell(0, 6.5, party, new_x="LMARGIN", new_y="NEXT")
        name_w = pdf.get_string_width(party)
        y = pdf.get_y() + 0.4
        pdf.set_draw_color(*BRAND)
        pdf.set_line_width(0.45)
        pdf.line(pdf.l_margin, y, pdf.l_margin + name_w + 0.6, y)
        pdf.set_y(y + 3.2)
        for label in labels:
            pdf.set_font("Sans", "", 8)
            pdf.set_text_color(*MUTED)
            pdf.cell(0, 4, label, new_x="LMARGIN", new_y="NEXT")
            line_y = pdf.get_y() + 6.4
            pdf.set_draw_color(32, 32, 32)
            pdf.set_line_width(0.35)
            pdf.line(pdf.l_margin, line_y, pdf.w - pdf.r_margin, line_y)
            pdf.set_y(line_y + 3.4)
        pdf.ln(1.5)

    def choices() -> None:
        ensure(16)
        pdf.ln(1.4)
        pdf.set_font("Serif", "", 11)
        pdf.set_text_color(*INK)
        y = pdf.get_y() + 0.5
        x = pdf.l_margin
        pdf.set_draw_color(32, 32, 32)
        pdf.set_line_width(0.35)
        pdf.rect(x, y, 3.6, 3.6)
        pdf.set_xy(x + 5.2, pdf.get_y())
        pdf.cell(36, 5.2, "exclusive", new_x="END", new_y="TOP")
        x2 = pdf.get_x() + 6
        pdf.rect(x2, y, 3.6, 3.6)
        pdf.set_xy(x2 + 5.2, pdf.get_y())
        pdf.cell(48, 5.2, "non-exclusive", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(0.8)
        pdf.set_font("Serif", "I", 10)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(
            0,
            5,
            "The Parties mark one box. An empty box is not a selection.",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        pdf.ln(1.8)

    def heading(text: str) -> None:
        # Keep both signature blocks on one page instead of splitting them.
        if text.startswith("16.") and pdf.get_y() > pdf.t_margin + 12:
            pdf.add_page()
        ensure(30)
        pdf.ln(2.6)
        match = re.match(r"^(\d+\.)\s+(.*)$", text)
        pdf.set_font("Serif", "B", 12.5)
        if match:
            pdf.set_text_color(*BRAND)
            number = match.group(1)
            pdf.cell(pdf.get_string_width(number) + 1.8, 6.6, number, new_x="END", new_y="TOP")
            pdf.set_text_color(*INK)
            pdf.multi_cell(0, 6.6, match.group(2), new_x="LMARGIN", new_y="NEXT")
        else:
            pdf.set_text_color(*INK)
            pdf.multi_cell(0, 6.6, text, new_x="LMARGIN", new_y="NEXT")
        y = pdf.get_y() + 0.8
        pdf.set_draw_color(*HAIRLINE)
        pdf.set_line_width(0.2)
        pdf.line(pdf.l_margin, y, pdf.w - pdf.r_margin, y)
        pdf.set_y(y + 2.4)

    for block in doc["blocks"]:
        kind = block["type"]
        if kind == "h":
            heading(block["text"])
        elif kind == "p":
            text = block["text"]
            if text == doc["caveat"]:
                pdf.ln(2)
                pdf.set_font("Serif", "B", 11)
                pdf.set_text_color(*INK)
                pdf.multi_cell(0, 5.4, text, align="C", new_x="LMARGIN", new_y="NEXT")
                pdf.ln(1)
            elif text.startswith("(") and len(text) > 3 and text[1].isalpha() and text[2] == ")":
                paragraph(text, gap=1.35)
            else:
                paragraph(text)
        elif kind == "field":
            field(block["text"])
        elif kind == "signature":
            signature(block["text"])
        elif kind == "choices":
            choices()
        else:
            raise SystemExit(f"Unhandled block {kind}")

    destination.parent.mkdir(parents=True, exist_ok=True)
    pdf.output(destination)


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
CT_NS = "http://schemas.openxmlformats.org/package/2006/content-types"
DC_NS = "http://purl.org/dc/elements/1.1/"
DCTERMS_NS = "http://purl.org/dc/terms/"
DCMITYPE_NS = "http://purl.org/dc/dcmitype/"
XSI_NS = "http://www.w3.org/2001/XMLSchema-instance"
EP_NS = "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"


def w_p(inner: str, ppr: str = "") -> str:
    return f"<w:p>{ppr}<w:r>{inner}</w:r></w:p>"


def w_text(text: str, *, bold: bool = False, italic: bool = False, size: int = 22, color: str = "") -> str:
    props = [f'<w:sz w:val="{size}"/>', f'<w:szCs w:val="{size}"/>', '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>']
    if bold:
        props.append("<w:b/>")
    if italic:
        props.append("<w:i/>")
    if color:
        props.append(f'<w:color w:val="{color}"/>')
    return f"<w:rPr>{''.join(props)}</w:rPr><w:t xml:space=\"preserve\">{xml_escape(text)}</w:t>"


def emu(mm: float) -> int:
    return int(round(mm * 36000))


def inline_image(rel_id: str, name: str, width_mm: float, height_mm: float, doc_pr: int) -> str:
    cx = emu(width_mm)
    cy = emu(height_mm)
    return f"""<w:r>
      <w:drawing>
        <wp:inline distT="0" distB="0" distL="0" distR="114300" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing">
          <wp:extent cx="{cx}" cy="{cy}"/>
          <wp:effectExtent l="0" t="0" r="0" b="0"/>
          <wp:docPr id="{doc_pr}" name="{xml_escape(name)}" descr="{xml_escape(name)}"/>
          <wp:cNvGraphicFramePr>
            <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
          </wp:cNvGraphicFramePr>
          <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
            <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                <pic:nvPicPr>
                  <pic:cNvPr id="{doc_pr}" name="{xml_escape(name)}"/>
                  <pic:cNvPicPr/>
                </pic:nvPicPr>
                <pic:blipFill>
                  <a:blip r:embed="{rel_id}"/>
                  <a:stretch><a:fillRect/></a:stretch>
                </pic:blipFill>
                <pic:spPr>
                  <a:xfrm>
                    <a:off x="0" y="0"/>
                    <a:ext cx="{cx}" cy="{cy}"/>
                  </a:xfrm>
                  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
                </pic:spPr>
              </pic:pic>
            </a:graphicData>
          </a:graphic>
        </wp:inline>
      </w:drawing>
    </w:r>"""


def paragraph(text: str, *, style: str = "Body", bold: bool = False, italic: bool = False, size: int = 22, align: str = "") -> str:
    ppr = [f'<w:pStyle w:val="{style}"/>']
    if align:
        ppr.append(f'<w:jc w:val="{align}"/>')
    return (
        f"<w:p><w:pPr>{''.join(ppr)}</w:pPr>"
        f"<w:r>{w_text(text, bold=bold, italic=italic, size=size)}</w:r></w:p>"
    )


def field_paragraph(label: str) -> str:
    # Tab stop sits inside the text area of an A4 page with 2 cm margins (9638 twips wide).
    return f"""<w:p>
      <w:pPr>
        <w:tabs><w:tab w:val="left" w:leader="underscore" w:pos="9200"/></w:tabs>
        <w:spacing w:before="80" w:after="40" w:line="276" w:lineRule="auto"/>
      </w:pPr>
      <w:r>{w_text(label)}</w:r>
      <w:r><w:tab/></w:r>
    </w:p>"""


def signature_blank(label: str) -> str:
    return (
        f"<w:p><w:pPr><w:spacing w:before=\"140\" w:after=\"0\"/></w:pPr>"
        f"<w:r>{w_text(label, size=18, color='555555')}</w:r></w:p>"
        f"<w:p><w:pPr>"
        f"<w:spacing w:before=\"60\" w:after=\"80\"/>"
        f"<w:pBdr><w:bottom w:val=\"single\" w:sz=\"8\" w:space=\"1\" w:color=\"222222\"/></w:pBdr>"
        f"</w:pPr><w:r>{w_text(' ', size=24)}</w:r></w:p>"
    )


def signature_block(party: str) -> str:
    parts = [
        f"<w:p><w:pPr><w:spacing w:before=\"280\" w:after=\"40\"/>"
        f"<w:pBdr><w:bottom w:val=\"single\" w:sz=\"8\" w:space=\"1\" w:color=\"E31C23\"/></w:pBdr>"
        f"</w:pPr><w:r>{w_text(party, bold=True, size=26)}</w:r></w:p>"
    ]
    for label in (
        "Legal name",
        "Authorized representative (print name)",
        "Signature",
        "Title",
        "Date",
    ):
        parts.append(signature_blank(label))
    return "".join(parts)


def heading_paragraph(text: str) -> str:
    match = re.match(r"^(\d+\.)\s+(.*)$", text)
    if not match:
        return paragraph(text, style="Heading1", bold=True, size=24)
    return (
        "<w:p><w:pPr><w:pStyle w:val=\"Heading1\"/></w:pPr>"
        f"<w:r>{w_text(match.group(1) + ' ', bold=True, size=24, color='E31C23')}</w:r>"
        f"<w:r>{w_text(match.group(2), bold=True, size=24)}</w:r></w:p>"
    )


def choices_paragraph() -> str:
    return (
        paragraph("Forum basis — the Parties mark one. An empty box is not a selection.", italic=True, size=21)
        + paragraph("[ ] exclusive          [ ] non-exclusive", size=22)
    )


def build_docx(doc: dict, destination: Path, logos: dict) -> None:
    mark_h = 14.0
    mark_w = mark_h * logos["mark_ratio"]
    word_w = mark_h * logos["word_ratio"]
    lockup = (
        "<w:p><w:pPr><w:spacing w:before=\"0\" w:after=\"80\"/></w:pPr>"
        + inline_image("rId5", "Seven Color mark", mark_w, mark_h, 1)
        + inline_image("rId6", "sourcing.center wordmark", word_w, mark_h, 2)
        + f"<w:r>{w_text('    ' + doc['kicker'], bold=True, size=18, color='E31C23')}</w:r>"
        + "</w:p>"
    )
    body: list[str] = [
        lockup,
        paragraph(doc["title"], style="Title", bold=True, size=36),
        paragraph(doc["subtitle"], style="Subtitle", italic=True, size=22),
        f"""<w:p>
          <w:pPr>
            <w:shd w:val="clear" w:color="auto" w:fill="F3F3F3"/>
            <w:pBdr>
              <w:top w:val="single" w:sz="8" w:space="6" w:color="222222"/>
              <w:left w:val="single" w:sz="8" w:space="8" w:color="222222"/>
              <w:bottom w:val="single" w:sz="8" w:space="6" w:color="222222"/>
              <w:right w:val="single" w:sz="8" w:space="8" w:color="222222"/>
            </w:pBdr>
            <w:spacing w:before="160" w:after="160"/>
            <w:jc w:val="center"/>
          </w:pPr>
          <w:r>{w_text(doc["caveat"], bold=True, size=22)}</w:r>
        </w:p>"""
    ]
    for block in doc["blocks"]:
        kind = block["type"]
        if kind == "h":
            body.append(heading_paragraph(block["text"]))
        elif kind == "p":
            italic = block["text"] == doc["caveat"]
            align = "center" if italic else ""
            body.append(paragraph(block["text"], italic=italic, bold=italic, align=align))
        elif kind == "field":
            body.append(field_paragraph(f"{block['text']}:"))
        elif kind == "signature":
            body.append(signature_block(block["text"]))
        elif kind == "choices":
            body.append(choices_paragraph())

    document_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{W_NS}" xmlns:r="{R_NS}">
  <w:body>
    {''.join(body)}
    <w:sectPr>
      <w:headerReference w:type="default" r:id="rId2"/>
      <w:footerReference w:type="default" r:id="rId3"/>
      <w:pgSz w:w="11906" w:h="16838" w:orient="portrait"/>
      <w:pgMar w:top="1134" w:right="1134" w:bottom="1300" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>
      <w:pgNumType w:start="1"/>
    </w:sectPr>
  </w:body>
</w:document>
"""

    styles_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="{W_NS}">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>
        <w:sz w:val="22"/><w:szCs w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:spacing w:after="120" w:line="276" w:lineRule="auto"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Body">
    <w:name w:val="Body"/>
    <w:pPr><w:jc w:val="both"/><w:spacing w:after="140" w:line="288" w:lineRule="auto"/></w:pPr>
    <w:rPr><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Title">
    <w:name w:val="Title"/>
    <w:pPr><w:spacing w:before="80" w:after="80"/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="36"/><w:szCs w:val="36"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Subtitle">
    <w:name w:val="Subtitle"/>
    <w:pPr><w:spacing w:after="160"/></w:pPr>
    <w:rPr><w:i/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Kicker">
    <w:name w:val="Kicker"/>
    <w:rPr><w:b/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="E31C23"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr>
      <w:spacing w:before="280" w:after="80"/>
      <w:keepNext/>
      <w:pBdr><w:bottom w:val="single" w:sz="4" w:space="1" w:color="D6D6D6"/></w:pBdr>
    </w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
  </w:style>
</w:styles>
"""

    header_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="{W_NS}">
  <w:p>
    <w:pPr>
      <w:jc w:val="right"/>
      <w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="E31C23"/></w:pBdr>
    </w:pPr>
    <w:r>{w_text("Unsigned template", italic=True, size=16, color="555555")}</w:r>
  </w:p>
</w:hdr>
"""

    footer_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr xmlns:w="{W_NS}">
  <w:p>
    <w:pPr><w:jc w:val="center"/></w:pPr>
    <w:r>{w_text(doc["caveat"] + "  ·  Page ", size=16)}</w:r>
    <w:r><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="separate"/></w:r>
    <w:r>{w_text("1", size=16)}</w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
    <w:r>{w_text(" of ", size=16)}</w:r>
    <w:r><w:fldChar w:fldCharType="begin"/></w:r>
    <w:r><w:instrText xml:space="preserve"> NUMPAGES </w:instrText></w:r>
    <w:r><w:fldChar w:fldCharType="separate"/></w:r>
    <w:r>{w_text("1", size=16)}</w:r>
    <w:r><w:fldChar w:fldCharType="end"/></w:r>
  </w:p>
</w:ftr>
"""

    rels = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="{PKG_NS}">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""
    word_rels = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="{PKG_NS}">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/header" Target="header1.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/seven-color-mark.png"/>
  <Relationship Id="rId6" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/sourcing-center-wordmark.png"/>
</Relationships>
"""
    content_types = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="{CT_NS}">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="png" ContentType="image/png"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
  <Override PartName="/word/header1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml"/>
  <Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>
  <Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>
"""
    settings_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="{W_NS}">
  <w:updateFields w:val="true"/>
</w:settings>
"""
    core_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="{DC_NS}" xmlns:dcterms="{DCTERMS_NS}" xmlns:dcmitype="{DCMITYPE_NS}" xmlns:xsi="{XSI_NS}">
  <dc:title>{xml_escape(doc["title"])}</dc:title>
  <dc:subject>Unsigned generic mutual non-disclosure agreement template</dc:subject>
  <dc:description>{xml_escape(doc["caveat"] + " Not a signed agreement.")}</dc:description>
  <dc:creator>Sourcing Center</dc:creator>
  <cp:lastModifiedBy>scripts/generate-mutual-nda.py</cp:lastModifiedBy>
</cp:coreProperties>
"""
    app_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="{EP_NS}">
  <Application>scripts/generate-mutual-nda.py</Application>
</Properties>
"""

    # settings.xml is referenced; include the relationship only if the part exists.
    # word/_rels lists rId4 but document.xml does not point at settings. Add settings via document rel
    # and also a settings reference is optional. Word reads word/settings.xml when the rel exists.
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        destination.unlink()
    with zipfile.ZipFile(destination, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        def add(name: str, payload: str) -> None:
            archive.writestr(name, payload.encode("utf-8"))

        add("[Content_Types].xml", content_types)
        add("_rels/.rels", rels)
        add("word/document.xml", document_xml)
        add("word/styles.xml", styles_xml)
        add("word/header1.xml", header_xml)
        add("word/footer1.xml", footer_xml)
        add("word/settings.xml", settings_xml)
        add("word/_rels/document.xml.rels", word_rels)
        add("docProps/core.xml", core_xml)
        add("docProps/app.xml", app_xml)
        archive.write(logos["mark"], "word/media/seven-color-mark.png")
        archive.write(logos["word"], "word/media/sourcing-center-wordmark.png")

def plain_text(doc: dict) -> str:
    chunks = [doc["title"], doc["kicker"], doc["subtitle"], doc["caveat"]]
    for block in doc["blocks"]:
        if block["type"] == "choices":
            chunks.append("exclusive non-exclusive")
        else:
            chunks.append(block.get("text", ""))
            if block["type"] == "signature":
                chunks.append("Authorized representative Signature Title Date")
    return "\n".join(chunks)


def assert_copy(doc: dict) -> None:
    text = plain_text(doc)
    missing = [phrase for phrase in REQUIRED_PHRASES if phrase not in text]
    if missing:
        raise SystemExit("Source is missing required phrases:\n- " + "\n- ".join(missing))
    banned = [phrase for phrase in FORBIDDEN_SNIPPETS if phrase in text]
    if banned:
        raise SystemExit("Source contains forbidden snippets:\n- " + "\n- ".join(banned))


def assert_pdf(path: Path, doc: dict) -> None:
    import pypdfium2 as pdfium

    pdf = pdfium.PdfDocument(path)
    if len(pdf) < 3 or len(pdf) > 8:
        raise SystemExit(f"Unexpected PDF page count: {len(pdf)}")
    extracted: list[str] = []
    for index in range(len(pdf)):
        page = pdf[index]
        extracted.append(page.get_textpage().get_text_bounded())
        bitmap = page.render(scale=2)
        image = bitmap.to_pil().convert("RGB")
        width, height = image.size
        # 7 mm of quiet edge at 144 dpi (scale 2 of PDF points ≈ 144 dpi).
        border = int(7 / 25.4 * 144)
        pixels = image.load()
        for x in list(range(border)) + list(range(width - border, width)):
            for y in range(0, height, 3):
                red, green, blue = pixels[x, y]
                if red < 250 or green < 250 or blue < 250:
                    raise SystemExit(f"Ink in the side margin on PDF page {index + 1} at {x},{y}")
        for y in list(range(border)) + list(range(height - border, height)):
            for x in range(0, width, 3):
                red, green, blue = pixels[x, y]
                if red < 250 or green < 250 or blue < 250:
                    raise SystemExit(f"Ink in the vertical margin on PDF page {index + 1} at {x},{y}")
        preview_dir = Path("/tmp/nda-preview")
        preview_dir.mkdir(parents=True, exist_ok=True)
        image.save(preview_dir / f"page-{index + 1}.png")
    raw = " ".join(" ".join(page.split()) for page in extracted)
    body_parts: list[str] = []
    for page_text in extracted:
        kept: list[str] = []
        for line in page_text.splitlines():
            collapsed = " ".join(line.split())
            if not collapsed or collapsed == "Unsigned template":
                continue
            if collapsed.startswith("Unsigned template"):
                continue
            if "Page " in collapsed and " of " in collapsed:
                continue
            kept.append(collapsed)
        body_parts.append(" ".join(kept))
    body_text = " ".join(body_parts)
    normalized = " ".join(body_text.split())
    missing_blocks = []
    for block in doc["blocks"]:
        if block["type"] == "choices":
            continue
        phrase = " ".join(block["text"].split())
        if phrase not in normalized and phrase not in " ".join(raw.split()):
            missing_blocks.append(phrase[:120])
    if missing_blocks:
        raise SystemExit("PDF dropped source text:\n- " + "\n- ".join(missing_blocks))
    for phrase in (
        doc["title"],
        doc["caveat"],
        doc["kicker"],
        "independently developed",
        "does not transfer ownership",
        "Authorized representative (print name)",
        "Years after the Effective Date",
        "Governing law",
        "non-exclusive",
    ):
        if phrase not in raw:
            raise SystemExit(f"PDF text is missing: {phrase}")
    for phrase in FORBIDDEN_SNIPPETS:
        if phrase in raw:
            raise SystemExit(f"PDF text contains forbidden snippet: {phrase}")
    print(f"PDF ok: {len(pdf)} pages, {path.stat().st_size} bytes")


def assert_docx(path: Path, doc: dict) -> None:
    from xml.etree import ElementTree

    with zipfile.ZipFile(path) as archive:
        names = set(archive.namelist())
        required = {
            "[Content_Types].xml",
            "word/document.xml",
            "word/styles.xml",
            "word/footer1.xml",
            "word/_rels/document.xml.rels",
            "word/media/seven-color-mark.png",
            "word/media/sourcing-center-wordmark.png",
        }
        missing = required - names
        if missing:
            raise SystemExit(f"DOCX missing parts: {sorted(missing)}")
        document = archive.read("word/document.xml")
        footer = archive.read("word/footer1.xml")
        ElementTree.fromstring(document)
        ElementTree.fromstring(footer)
        ElementTree.fromstring(archive.read("[Content_Types].xml"))
    text = document.decode("utf-8")
    for phrase in (doc["title"], doc["caveat"], "Authorized representative", "Governing law"):
        if phrase not in text:
            raise SystemExit(f"DOCX is missing: {phrase}")
    if path.stat().st_size < 2000:
        raise SystemExit("DOCX is unexpectedly small")
    print(f"DOCX ok: {path.stat().st_size} bytes")


def main() -> None:
    doc = load()
    assert_copy(doc)
    pdf_path = OUT_DIR / PDF_NAME
    docx_path = OUT_DIR / DOCX_NAME
    with tempfile.TemporaryDirectory(prefix="nda-logos-") as temporary:
        logos = prepare_logos(Path(temporary))
        build_pdf(doc, pdf_path, logos)
        build_docx(doc, docx_path, logos)
    assert_docx(docx_path, doc)
    try:
        assert_pdf(pdf_path, doc)
    except ModuleNotFoundError:
        print("pypdfium2 is not installed; skipped raster and text read-back.", file=sys.stderr)
        if pdf_path.stat().st_size < 2000:
            raise SystemExit("PDF is unexpectedly small") from None


if __name__ == "__main__":
    main()
