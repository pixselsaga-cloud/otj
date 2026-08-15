import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "Uncategorized";
    const visibility = (formData.get("visibility") as string) || "CLIENT_VISIBLE";
    const projectId = (formData.get("projectId") as string) || null;
    const clientId = (formData.get("clientId") as string) || null;
    const tags = (formData.get("tags") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "Fayl yuborilmadi" }, { status: 400 });
    }

    const uploadRes = await saveUploadedFile(file);

    const fileRecord = await prisma.fileRecord.create({
      data: {
        originalName: uploadRes.originalName,
        fileName: uploadRes.fileName,
        mimeType: uploadRes.mimeType,
        size: uploadRes.size,
        path: uploadRes.path,
        publicUrl: uploadRes.publicUrl,
        category,
        visibility,
        tags,
        projectId,
        clientId,
        status: "READY",
      },
    });

    // Create initial FileVersion
    await prisma.fileVersion.create({
      data: {
        fileRecordId: fileRecord.id,
        versionNumber: 1,
        versionName: "v1.0 (Original)",
        path: uploadRes.path,
        publicUrl: uploadRes.publicUrl,
        size: uploadRes.size,
      },
    });

    return NextResponse.json({ success: true, file: fileRecord });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error.message || "Fayl yuklashda xatolik yuz berdi" },
      { status: 500 }
    );
  }
}
