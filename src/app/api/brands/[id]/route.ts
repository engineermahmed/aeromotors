import { NextRequest, NextResponse } from "next/server";
import { getBrand, updateBrand, deleteBrand } from "@/lib/brands";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    if (body.name !== undefined && String(body.name).trim() === "") {
      return NextResponse.json({ error: "Brand name cannot be empty" }, { status: 400 });
    }
    const patch: { name?: string; count?: number } = {};
    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.count !== undefined) patch.count = Number(body.count);
    const updated = updateBrand(id, patch);
    if (!updated) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteBrand(id);
  if (!ok) return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
