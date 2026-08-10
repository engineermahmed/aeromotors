import { NextRequest, NextResponse } from "next/server";
import { getUsers, changeUserPassword } from "@/lib/users";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const users = getUsers();
    const user = users.find((u) => u.id === params.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const ok = changeUserPassword(params.id, newPassword);
    if (!ok) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
