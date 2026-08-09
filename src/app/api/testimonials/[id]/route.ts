import { NextRequest, NextResponse } from "next/server";
import { updateTestimonial, deleteTestimonial } from "@/lib/testimonials";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const patch: Record<string, unknown> = {};
    if (body.name !== undefined) patch.name = String(body.name).trim();
    if (body.role !== undefined) patch.role = String(body.role).trim();
    if (body.content !== undefined) patch.content = String(body.content).trim();
    if (body.rating !== undefined) patch.rating = Math.min(5, Math.max(1, Number(body.rating)));
    const updated = updateTestimonial(id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!deleteTestimonial(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
