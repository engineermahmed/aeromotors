import { NextRequest, NextResponse } from "next/server";
import { addMediaItem, getAllMedia, ensureUploadsDir } from "@/lib/media";
import { MediaItem } from "@/types";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const items = getAllMedia();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: "Failed to load media" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      ensureUploadsDir();
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

      const ext = path.extname(file.name) || ".jpg";
      const filename = `${randomUUID()}${ext}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const filePath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);

      const item: MediaItem = {
        id: randomUUID(),
        url: `/uploads/${filename}`,
        name: file.name,
        type: "upload",
        uploadedAt: new Date().toISOString(),
      };
      return NextResponse.json(addMediaItem(item), { status: 201 });
    }

    const body = await req.json();
    const { url, name } = body;
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    const item: MediaItem = {
      id: randomUUID(),
      url: String(url).trim(),
      name: name ? String(name).trim() : String(url).trim(),
      type: "url",
      uploadedAt: new Date().toISOString(),
    };
    return NextResponse.json(addMediaItem(item), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to add media" }, { status: 500 });
  }
}
