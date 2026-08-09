import { NextRequest, NextResponse } from "next/server";
import { getListing, updateListing, deleteListing } from "@/lib/listings";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(listing);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = getListing(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const body = await req.json();

    const allowed = ["status", "adminNote"] as const;
    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) patch[key] = body[key];
    }

    if (patch.status && !["pending", "approved", "rejected"].includes(patch.status as string)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    if ("status" in patch) {
      patch.reviewedAt = new Date().toISOString();
    }

    const updated = updateListing(id, patch);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = deleteListing(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
