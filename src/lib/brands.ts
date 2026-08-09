import fs from "fs";
import path from "path";

export interface BrandRecord {
  id: string;
  name: string;
  count: number;
}

const FILE = path.join(process.cwd(), "data", "brands.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readBrands(): BrandRecord[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8")) as BrandRecord[];
  } catch {
    return [];
  }
}

export function writeBrands(brands: BrandRecord[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(brands, null, 2), "utf-8");
}

export function getBrand(id: string): BrandRecord | undefined {
  return readBrands().find((b) => b.id === id);
}

export function addBrand(brand: BrandRecord): BrandRecord {
  const all = readBrands();
  all.push(brand);
  writeBrands(all);
  return brand;
}

export function updateBrand(id: string, patch: Partial<BrandRecord>): BrandRecord | null {
  const all = readBrands();
  const idx = all.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeBrands(all);
  return all[idx];
}

export function deleteBrand(id: string): boolean {
  const all = readBrands();
  const next = all.filter((b) => b.id !== id);
  if (next.length === all.length) return false;
  writeBrands(next);
  return true;
}
