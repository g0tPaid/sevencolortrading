import { getDb, withImmediate } from "@/lib/tracking/db";

type Partner = { number: string; prefix: string; name: string };

function db() {
  const connection = getDb();
  connection.exec(`CREATE TABLE IF NOT EXISTS soloflow_staff_partners (
    number TEXT PRIMARY KEY, prefix TEXT NOT NULL, name TEXT NOT NULL
  )`);
  return connection;
}

export function saveStaffPartners(input: unknown) {
  if (!Array.isArray(input) || input.length > 10000) return false;
  const partners = input as Partial<Partner>[];
  if (partners.some((p) => !p || !/^[0-9]{4}$/.test(p.number ?? "") ||
    typeof p.prefix !== "string" || !/^[A-Z0-9]{0,12}$/.test(p.prefix) ||
    typeof p.name !== "string" || !p.name.trim() || p.name.length > 250)) return false;
  db();
  withImmediate((connection) => {
    connection.exec("DELETE FROM soloflow_staff_partners");
    const insert = connection.prepare("INSERT INTO soloflow_staff_partners VALUES (?, ?, ?)");
    for (const { number, prefix, name } of partners as Partner[]) insert.run(number, prefix, name);
  });
  return true;
}

export function getStaffPartnersByReference() {
  const rows = db().prepare("SELECT number, prefix, name FROM soloflow_staff_partners").all() as Partner[];
  const aliases = new Map<string, Partner | null>();
  function add(key: string, partner: Partner) {
    aliases.set(key, aliases.has(key) ? null : partner);
  }
  for (const { prefix, number, name } of rows) {
    const partner = { prefix, number, name: name.trim() };
    add(prefix ? prefix + "-" + number : number, partner);
    if (prefix) {
      for (const alias of new Set([prefix + number, number + prefix])) add(alias, partner);
    }
  }
  return (reference: string | null) => {
    if (!reference) return null;
    const clean = reference.trim().toUpperCase();
    return (aliases.get(clean) ?? aliases.get(clean.replace(/[\s-]/g, ""))) ?? null;
  };
}

export function getStaffPartnerLabels() {
  const find = getStaffPartnersByReference();
  return (reference: string | null) => find(reference)?.name ?? null;
}
