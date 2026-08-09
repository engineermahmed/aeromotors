import { NextRequest, NextResponse } from "next/server";
import { addBrand, readBrands } from "@/lib/brands";
import crypto from "crypto";

export async function GET() {
  const brands = readBrands();
  return NextResponse.json(brands);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name || String(body.name).trim() === "") {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }
    const all = readBrands();
    const exists = all.some((b) => b.name.toLowerCase() === String(body.name).trim().toLowerCase());
    if (exists) {
      return NextResponse.json({ error: "Brand already exists" }, { status: 409 });
    }
    const brand = addBrand({
      id: crypto.randomUUID(),
      name: String(body.name).trim(),
      count: Number(body.count) || 0,
    });
    return NextResponse.json(brand, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
