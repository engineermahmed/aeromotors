import { NextRequest, NextResponse } from "next/server";
import { deleteMediaItem } from "@/lib/media";
import fs from "fs";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const result = deleteMediaItem(id);
    if (!result.deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (result.filePath && fs.existsSync(result.filePath)) {
      fs.unlinkSync(result.filePath);
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
