import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "finance-applications.json");

function read() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function write(data: unknown[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  return NextResponse.json(read());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 });
    }
    const list = read();
    const entry = {
      id: Date.now().toString(),
      ...body,
      submittedAt: new Date().toISOString(),
      status: "new",
    };
    list.unshift(entry);
    write(list);
    return NextResponse.json({ ok: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Failed to save application" }, { status: 500 });
  }
}
