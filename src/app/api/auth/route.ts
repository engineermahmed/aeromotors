import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AUTH_FILE = path.join(process.cwd(), "data", "auth.json");

function readAuth(): { adminPassword: string } {
  try {
    if (!fs.existsSync(AUTH_FILE)) {
      const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD ?? "";
      const init = { adminPassword: defaultPass };
      fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
      fs.writeFileSync(AUTH_FILE, JSON.stringify(init, null, 2), "utf-8");
      return init;
    }
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
  } catch {
    return { adminPassword: process.env.ADMIN_DEFAULT_PASSWORD ?? "" };
  }
}

function writeAuth(data: { adminPassword: string }) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    if (!password) return NextResponse.json({ ok: false }, { status: 401 });
    const auth = readAuth();

    // Bootstrap: if no password has been configured yet, accept and save
    if (!auth.adminPassword) {
      writeAuth({ adminPassword: password });
      return NextResponse.json({ ok: true });
    }

    if (password === auth.adminPassword) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }
    const auth = readAuth();
    if (currentPassword !== auth.adminPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }
    writeAuth({ adminPassword: newPassword });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }
}
