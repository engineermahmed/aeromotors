import fs from "fs";
import path from "path";
import { MediaItem } from "@/types";

const FILE = path.join(process.cwd(), "data", "media.json");
const UPLOADS_DIR = path.join(process.cwd(), "data", "uploads");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function readMedia(): MediaItem[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeMedia(items: MediaItem[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export function addMediaItem(item: MediaItem): MediaItem {
  const items = readMedia();
  items.unshift(item);
  writeMedia(items);
  return item;
}

export function getAllMedia(): MediaItem[] {
  return readMedia();
}

export function deleteMediaItem(id: string): { deleted: boolean; filePath?: string } {
  const items = readMedia();
  const item = items.find((m) => m.id === id);
  if (!item) return { deleted: false };
  const filtered = items.filter((m) => m.id !== id);
  writeMedia(filtered);
  if (item.type === "upload") {
    // support both old /uploads/ and new /api/uploads/ paths
    const filename = path.basename(item.url);
    const filePath = path.join(process.cwd(), "data", "uploads", filename);
    return { deleted: true, filePath };
  }
  return { deleted: true };
}
