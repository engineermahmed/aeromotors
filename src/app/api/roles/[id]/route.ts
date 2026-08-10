import { NextRequest, NextResponse } from "next/server";
import { getRoles, saveRole, deleteRole } from "@/lib/users";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const roles = getRoles();
  const role = roles.find((r) => r.id === id);
  if (!role) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = { ...role, ...body, id };
  saveRole(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteRole(id);
  return NextResponse.json({ deleted: true });
}
