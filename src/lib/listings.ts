import fs from "fs";
import path from "path";
import { Listing } from "@/types";

const FILE = path.join(process.cwd(), "data", "listings.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readListings(): Listing[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Listing[];
  } catch {
    return [];
  }
}

export function writeListings(listings: Listing[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(listings, null, 2), "utf-8");
}

export function getListing(id: string): Listing | undefined {
  return readListings().find((l) => l.id === id);
}

export function addListing(listing: Listing): Listing {
  const all = readListings();
  all.push(listing);
  writeListings(all);
  return listing;
}

export function updateListing(id: string, patch: Partial<Listing>): Listing | null {
  const all = readListings();
  const idx = all.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeListings(all);
  return all[idx];
}

export function deleteListing(id: string): boolean {
  const all = readListings();
  const next = all.filter((l) => l.id !== id);
  if (next.length === all.length) return false;
  writeListings(next);
  return true;
}
