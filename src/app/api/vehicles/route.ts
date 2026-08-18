import { NextRequest, NextResponse } from "next/server";
import { readVehicles, addVehicle } from "@/lib/vehicles";
import { Vehicle } from "@/types";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  let vehicles = readVehicles();
  if (status) vehicles = vehicles.filter((v) => v.status === status);
  if (featured === "true") vehicles = vehicles.filter((v) => v.isFeatured);
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.make?.trim() || !body.model?.trim() || !body.price) {
      return NextResponse.json({ error: "make, model and price are required" }, { status: 400 });
    }
    const vehicle: Vehicle = {
      id: crypto.randomUUID(),
      make: String(body.make).trim(),
      model: String(body.model).trim(),
      year: Number(body.year) || new Date().getFullYear(),
      price: Number(body.price),
      mileage: Number(body.mileage) || 0,
      transmission: body.transmission || "Automatic",
      fuelType: body.fuelType || "Petrol",
      bodyStyle: body.bodyStyle || "Sedan",
      color: String(body.color || "").trim(),
      driveType: body.driveType || "FWD",
      engineSize: String(body.engineSize || "").trim(),
      horsepower: Number(body.horsepower) || 0,
      images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
      description: String(body.description || "").trim(),
      features: Array.isArray(body.features) ? body.features : [],
      isNew: Boolean(body.isNew),
      isFeatured: Boolean(body.isFeatured),
      status: body.status || "available",
      vin: body.vin || undefined,
      carfaxUrl: body.carfaxUrl || undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };
    return NextResponse.json(addVehicle(vehicle), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
