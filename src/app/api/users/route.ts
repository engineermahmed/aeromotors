import { NextRequest, NextResponse } from "next/server";
import { getUsers, getRoles, saveUser, AdminUser } from "@/lib/users";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json({ users: getUsers(), roles: getRoles() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, role } = body;
  if (!name || !email || !role)
    return NextResponse.json({ error: "name, email and role are required" }, { status: 400 });
  const user: AdminUser = {
    id: randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    role: String(role).trim(),
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
  };
  saveUser(user);
  return NextResponse.json(user, { status: 201 });
}
