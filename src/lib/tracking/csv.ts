import { TrackingInputError } from "@/lib/tracking/types";

export const CSV_MAX_BYTES = 1_000_000;
export const CSV_MAX_ROWS = 500;

export const CSV_HEADERS = [
  "customer_name",
  "customer_ref",
  "order_number",
  "tracking_number",
  "carrier",
  "origin",
  "destination",
  "postcode",
  "notes",
] as const;

const FORMULA = /^[=+\-@\t\r]/;

/** Prefix spreadsheet formulas so Excel/Sheets treat the cell as text. */
export function csvEscape(value: string | null | undefined): string {
  let text = (value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (FORMULA.test(text)) text = `'${text}`;
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

export function toCsv(rows: Array<Record<string, string | null>>): string {
  const lines = [CSV_HEADERS.join(",")];
  for (const row of rows) {
    lines.push(CSV_HEADERS.map((header) => csvEscape(row[header])).join(","));
  }
  return `${lines.join("\n")}\n`;
}

export function parseCsv(text: string): string[][] {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
          continue;
        }
        quoted = false;
        continue;
      }
      cell += char;
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ",") {
      row.push(cell);
      cell = "";
      continue;
    }
    if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    if (char === "\r") continue;
    cell += char;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((value) => value.trim() !== ""));
}

export function stripFormulaGuard(value: string): string {
  if (value.startsWith("'") && FORMULA.test(value.slice(1))) return value.slice(1);
  return value;
}

export function csvRecords(text: string): Array<Record<string, string>> {
  if (Buffer.byteLength(text) > CSV_MAX_BYTES) {
    throw new TrackingInputError("CSV is larger than 1 MB.");
  }
  const rows = parseCsv(text);
  if (rows.length === 0) throw new TrackingInputError("CSV is empty.");
  const header = rows[0]!.map((cell) => cell.trim().toLowerCase());
  if (!header.includes("tracking_number")) {
    throw new TrackingInputError("CSV must include a tracking_number column.");
  }
  const data = rows.slice(1);
  if (data.length > CSV_MAX_ROWS) {
    throw new TrackingInputError("CSV is limited to 500 data rows.");
  }
  return data.map((cells) => {
    const record: Record<string, string> = {};
    header.forEach((name, index) => {
      if (!name) return;
      record[name] = stripFormulaGuard(cells[index] ?? "").trim();
    });
    return record;
  });
}
