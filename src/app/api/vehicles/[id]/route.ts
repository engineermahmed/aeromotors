import { NextRequest, NextResponse } from "next/server";
import { getVehicle, updateVehicle, deleteVehicle } from "@/lib/vehicles";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(vehicle);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const patch: Record<string, unknown> = {};
    const fields = [
      "make", "model", "year", "price", "mileage", "transmission", "fuelType",
      "bodyStyle", "color", "driveType", "engineSize", "horsepower",
      "images", "description", "features", "isNew", "isFeatured", "status", "vin", "carfaxUrl",
    ] as const;
    for (const f of fields) {
      if (body[f] !== undefined) patch[f] = body[f];
    }
    const updated = updateVehicle(id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!deleteVehicle(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
