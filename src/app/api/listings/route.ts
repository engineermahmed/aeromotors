import { NextRequest, NextResponse } from "next/server";
import { addListing, readListings } from "@/lib/listings";
import { Listing } from "@/types";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const all = readListings();
  const filtered = status ? all.filter((l) => l.status === status) : all;
  return NextResponse.json(filtered.reverse());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["sellerName", "sellerPhone", "sellerEmail", "make", "model", "year", "mileage"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const listing: Listing = {
      id: crypto.randomUUID(),
      sellerName: String(body.sellerName).trim(),
      sellerPhone: String(body.sellerPhone).trim(),
      sellerEmail: String(body.sellerEmail).trim().toLowerCase(),
      make: String(body.make).trim(),
      model: String(body.model).trim(),
      year: Number(body.year),
      mileage: Number(body.mileage),
      color: String(body.color || "").trim(),
      transmission: String(body.transmission || "Automatic").trim(),
      condition: String(body.condition || "Good").trim(),
      vin: body.vin ? String(body.vin).trim() : undefined,
      comments: body.comments ? String(body.comments).trim() : undefined,
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const saved = addListing(listing);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
