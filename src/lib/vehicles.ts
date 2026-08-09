import fs from "fs";
import path from "path";
import { Vehicle } from "@/types";

const FILE = path.join(process.cwd(), "data", "vehicles.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readVehicles(): Vehicle[] {
  ensureFile();
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); } catch { return []; }
}

export function writeVehicles(items: Vehicle[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function getVehicle(id: string): Vehicle | null {
  return readVehicles().find((v) => v.id === id) ?? null;
}

export function addVehicle(v: Vehicle): Vehicle {
  const all = readVehicles();
  all.unshift(v);
  writeVehicles(all);
  return v;
}

export function updateVehicle(id: string, patch: Partial<Vehicle>): Vehicle | null {
  const all = readVehicles();
  const idx = all.findIndex((v) => v.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  writeVehicles(all);
  return all[idx];
}

export function deleteVehicle(id: string): boolean {
  const all = readVehicles();
  const next = all.filter((v) => v.id !== id);
  if (next.length === all.length) return false;
  writeVehicles(next);
  return true;
}
