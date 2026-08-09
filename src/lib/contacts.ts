import fs from "fs";
import path from "path";
import { ContactSubmission } from "@/types";

const FILE = path.join(process.cwd(), "data", "contacts.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf-8");
}

export function readContacts(): ContactSubmission[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

export function writeContacts(contacts: ContactSubmission[]) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(contacts, null, 2), "utf-8");
}

export function addContact(contact: ContactSubmission): ContactSubmission {
  const contacts = readContacts();
  contacts.unshift(contact);
  writeContacts(contacts);
  return contact;
}

export function getAllContacts(): ContactSubmission[] {
  return readContacts();
}

export function deleteContact(id: string): boolean {
  const contacts = readContacts();
  const filtered = contacts.filter((c) => c.id !== id);
  if (filtered.length === contacts.length) return false;
  writeContacts(filtered);
  return true;
}

export function markContactRead(id: string): ContactSubmission | null {
  const contacts = readContacts();
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  contacts[idx] = { ...contacts[idx], read: true };
  writeContacts(contacts);
  return contacts[idx];
}
