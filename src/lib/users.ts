import fs from "fs";
import path from "path";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

const USERS_FILE = path.join(process.cwd(), "data", "users.json");
const ROLES_FILE = path.join(process.cwd(), "data", "roles.json");

function readFile<T>(file: string, fallback: T[]): T[] {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeFile(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

export const getUsers = (): AdminUser[] => readFile<AdminUser>(USERS_FILE, []);
export const getRoles = (): Role[] => readFile<Role>(ROLES_FILE, []);

export function saveUser(user: AdminUser) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  writeFile(USERS_FILE, users);
}

export function deleteUser(id: string) {
  const users = getUsers().filter((u) => u.id !== id);
  writeFile(USERS_FILE, users);
}

export function saveRole(role: Role) {
  const roles = getRoles();
  const idx = roles.findIndex((r) => r.id === role.id);
  if (idx >= 0) roles[idx] = role;
  else roles.push(role);
  writeFile(ROLES_FILE, roles);
}

export function deleteRole(id: string) {
  const roles = getRoles().filter((r) => r.id !== id);
  writeFile(ROLES_FILE, roles);
}
