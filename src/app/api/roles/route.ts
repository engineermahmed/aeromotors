import { NextRequest, NextResponse } from "next/server";
import { getRoles, saveRole, Role } from "@/lib/users";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json(getRoles());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, permissions, color } = body;
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const role: Role = {
    id: randomUUID(),
    name: String(name).trim(),
    description: String(description || "").trim(),
    permissions: Array.isArray(permissions) ? permissions : [],
    color: String(color || "gray").trim(),
  };
  saveRole(role);
  return NextResponse.json(role, { status: 201 });
}
