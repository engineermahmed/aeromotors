import { NextRequest, NextResponse } from "next/server";
import { getUsers, saveUser, deleteUser } from "@/lib/users";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const updated = { ...user, ...body, id };
  saveUser(updated);
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteUser(id);
  return NextResponse.json({ deleted: true });
}
