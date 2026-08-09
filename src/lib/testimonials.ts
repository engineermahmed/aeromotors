import fs from "fs";
import path from "path";

export interface TestimonialRecord {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

const FILE = path.join(process.cwd(), "data", "testimonials.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readTestimonials(): TestimonialRecord[] {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); } catch { return []; }
}

export function writeTestimonials(items: TestimonialRecord[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function addTestimonial(t: TestimonialRecord): TestimonialRecord {
  const all = readTestimonials();
  all.push(t);
  writeTestimonials(all);
  return t;
}

export function updateTestimonial(id: string, patch: Partial<TestimonialRecord>): TestimonialRecord | null {
  const all = readTestimonials();
  const idx = all.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeTestimonials(all);
  return all[idx];
}

export function deleteTestimonial(id: string): boolean {
  const all = readTestimonials();
  const next = all.filter((t) => t.id !== id);
  if (next.length === all.length) return false;
  writeTestimonials(next);
  return true;
}
