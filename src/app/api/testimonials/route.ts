import { NextRequest, NextResponse } from "next/server";
import { addTestimonial, readTestimonials } from "@/lib/testimonials";
import crypto from "crypto";

export async function GET() {
  return NextResponse.json(readTestimonials());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.name?.trim() || !body.content?.trim()) {
      return NextResponse.json({ error: "Name and review text are required" }, { status: 400 });
    }
    const t = addTestimonial({
      id: crypto.randomUUID(),
      name: String(body.name).trim(),
      role: String(body.role || "Customer").trim(),
      content: String(body.content).trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
    });
    return NextResponse.json(t, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
