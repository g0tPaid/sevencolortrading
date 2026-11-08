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

import sys
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "documents" / "nda" / "mutual-nda.md"
OUT_DIR = ROOT / "public" / "downloads"
PDF_NAME = "sourcing-center-mutual-nda-template.pdf"
DOCX_NAME = "sourcing-center-mutual-nda-template.docx"

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


def build_pdf(doc: dict, destination: Path) -> None:
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
            # header() runs before body text. Restore the top margin afterwards
            # so a spilled paragraph cannot draw through the running header.
            self.set_font("Sans", "", 8)
            self.set_text_color(70, 70, 70)
            usable = self.w - self.l_margin - self.r_margin
            self.set_xy(self.l_margin, 8)
            self.cell(usable - 42, 4, doc["title"], align="L")
            self.cell(42, 4, "Unsigned template", align="R")
            self.set_draw_color(190, 190, 190)
            self.set_line_width(0.2)
            self.line(self.l_margin, 14.5, self.w - self.r_margin, 14.5)
            self.set_text_color(20, 20, 20)
            self.set_y(self.t_margin)

        def footer(self) -> None:
            self.set_draw_color(190, 190, 190)
            self.set_line_width(0.2)
            self.line(self.l_margin, self.h - 16, self.w - self.r_margin, self.h - 16)
            self.set_y(-14.5)
            self.set_font("Sans", "", 7.5)
            self.set_text_color(55, 55, 55)
            self.cell(0, 3.6, doc["caveat"], align="C", new_x="LMARGIN", new_y="NEXT")
            self.set_x(self.l_margin)
            self.cell(
                0,
                3.6,
                f"{doc['title']}  ·  Unsigned  ·  Page {self.page_no()} of {{nb}}",
                align="C",
            )
            self.set_text_color(20, 20, 20)

    pdf = Form(format="A4", unit="mm")
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=22)
    pdf.set_margins(18, 22, 18)
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

    def ensure(space: float) -> None:
        if pdf.get_y() > pdf.h - 22 - space:
            pdf.add_page()

    pdf.set_font("Sans", "B", 8.5)
    pdf.set_text_color(120, 20, 20)
    pdf.cell(0, 4.5, doc["kicker"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1.5)
    pdf.set_text_color(15, 15, 15)
    pdf.set_font("Serif", "B", 18)
    pdf.multi_cell(0, 8, doc["title"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(1)
    pdf.set_font("Serif", "I", 11)
    pdf.set_text_color(40, 40, 40)
    pdf.multi_cell(0, 5.2, doc["subtitle"], align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2.5)
    pdf.set_fill_color(245, 245, 245)
    pdf.set_draw_color(30, 30, 30)
    pdf.set_text_color(15, 15, 15)
    pdf.set_font("Serif", "B", 10.5)
    pdf.multi_cell(
        0,
        5,
        doc["caveat"],
        align="C",
        fill=True,
        border=1,
        padding=2.4,
        new_x="LMARGIN",
        new_y="NEXT",
    )
    pdf.ln(3)

    def paragraph(text: str, *, size: float = 10.5, style: str = "", gap: float = 1.8) -> None:
        pdf.set_text_color(20, 20, 20)
        pdf.set_font("Serif", style, size)
        pdf.multi_cell(0, 5.05, text, align="J", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(gap)

    def field(label: str) -> None:
        ensure(12)
        pdf.set_text_color(20, 20, 20)
        pdf.set_font("Serif", "", 10.5)
        y = pdf.get_y()
        pdf.set_xy(pdf.l_margin, y)
        pdf.cell(pdf.get_string_width(label) + 2, 6, label, new_x="END", new_y="TOP")
        x_start = pdf.get_x()
        x_end = pdf.w - pdf.r_margin
        pdf.set_draw_color(25, 25, 25)
        pdf.set_line_width(0.25)
        if x_end - x_start > 24:
            pdf.line(x_start, y + 5.1, x_end, y + 5.1)
        pdf.set_xy(pdf.l_margin, y + 8)

    def signature(party: str) -> None:
        ensure(52)
        pdf.ln(1.5)
        pdf.set_font("Serif", "B", 12)
        pdf.set_text_color(15, 15, 15)
        pdf.cell(0, 6, party, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(0.5)
        for label in (
            "Legal name",
            "Authorized representative (print name)",
            "Signature",
            "Title",
            "Date",
        ):
            field(label)
        pdf.ln(1)

    def choices() -> None:
        ensure(18)
        pdf.ln(1.2)
        pdf.set_font("Serif", "", 10.5)
        pdf.set_text_color(20, 20, 20)
        y = pdf.get_y() + 0.4
        x = pdf.l_margin
        pdf.set_draw_color(20, 20, 20)
        pdf.set_line_width(0.3)
        pdf.rect(x, y, 3.5, 3.5)
        pdf.set_xy(x + 5, pdf.get_y())
        pdf.cell(34, 5, "exclusive", new_x="END", new_y="TOP")
        x2 = pdf.get_x() + 8
        pdf.rect(x2, y, 3.5, 3.5)
        pdf.set_xy(x2 + 5, pdf.get_y())
        pdf.cell(50, 5, "non-exclusive", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Serif", "I", 9.5)
        pdf.set_text_color(45, 45, 45)
        pdf.multi_cell(
            0,
            4.6,
            "The Parties mark one box. An empty box is not a selection.",
            new_x="LMARGIN",
            new_y="NEXT",
        )
        pdf.ln(1.6)

    for block in doc["blocks"]:
        kind = block["type"]
        if kind == "h":
            ensure(24)
            pdf.ln(1.4)
            pdf.set_text_color(15, 15, 15)
            pdf.set_font("Serif", "B", 12.5)
            pdf.multi_cell(0, 6, block["text"], new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)
        elif kind == "p":
            style = ""
            text = block["text"]
            if text.startswith("(") and len(text) > 3 and text[1].isalpha() and text[2] == ")":
                paragraph(text, gap=1.2)
            elif text == doc["caveat"]:
                pdf.ln(1)
                pdf.set_font("Serif", "B", 10.5)
                pdf.set_text_color(15, 15, 15)
                pdf.multi_cell(0, 5, text, align="C", new_x="LMARGIN", new_y="NEXT")
                pdf.ln(1)
            else:
                paragraph(text, style=style)
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


def w_text(text: str, *, bold: bool = False, italic: bool = False, size: int = 22) -> str:
    props = [f'<w:sz w:val="{size}"/>', f'<w:szCs w:val="{size}"/>', '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:cs="Times New Roman"/>']
    if bold:
        props.append("<w:b/>")
    if italic:
        props.append("<w:i/>")
    return f"<w:rPr>{''.join(props)}</w:rPr><w:t xml:space=\"preserve\">{xml_escape(text)}</w:t>"


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


def signature_block(party: str) -> str:
    parts = [paragraph(party, style="Heading1", bold=True, size=24)]
    for label in (
        "Legal name",
        "Authorized representative (print name)",
        "Signature",
        "Title",
        "Date",
    ):
        parts.append(field_paragraph(f"{label}:"))
    parts.append(paragraph(" ", size=20))
    return "".join(parts)


def choices_paragraph() -> str:
    return (
        paragraph("Forum basis — the Parties mark one. An empty box is not a selection.", italic=True, size=21)
        + paragraph("[ ] exclusive          [ ] non-exclusive", size=22)
    )


def build_docx(doc: dict, destination: Path) -> None:
    body: list[str] = [
        paragraph(doc["kicker"], style="Kicker", bold=True, size=18),
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
            body.append(paragraph(block["text"], style="Heading1", bold=True, size=24))
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
    <w:rPr><w:b/><w:sz w:val="18"/><w:szCs w:val="18"/><w:color w:val="7A1414"/></w:rPr>
  </w:style>
  <w:style w:type="paragraph" w:styleId="Heading1">
    <w:name w:val="heading 1"/>
    <w:pPr><w:spacing w:before="280" w:after="80"/><w:keepNext/></w:pPr>
    <w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
  </w:style>
</w:styles>
"""

    header_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:hdr xmlns:w="{W_NS}">
  <w:p>
    <w:pPr><w:jc w:val="right"/></w:pPr>
    <w:r>{w_text("Unsigned template", italic=True, size=16)}</w:r>
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
</Relationships>
"""
    content_types = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="{CT_NS}">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
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
    full = "\n".join(extracted)
    for phrase in (
        doc["title"],
        doc["caveat"],
        "independently developed",
        "does not transfer ownership",
        "Authorized representative (print name)",
        "Years after the Effective Date",
        "Governing law",
        "non-exclusive",
    ):
        if phrase not in full:
            raise SystemExit(f"PDF text is missing: {phrase}")
    for phrase in FORBIDDEN_SNIPPETS:
        if phrase in full:
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
    build_pdf(doc, pdf_path)
    build_docx(doc, docx_path)
    assert_docx(docx_path, doc)
    try:
        assert_pdf(pdf_path, doc)
    except ModuleNotFoundError:
        print("pypdfium2 is not installed; skipped raster and text read-back.", file=sys.stderr)
        if pdf_path.stat().st_size < 2000:
            raise SystemExit("PDF is unexpectedly small") from None


if __name__ == "__main__":
    main()
