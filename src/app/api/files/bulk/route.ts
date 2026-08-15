import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { action, ids, category, tags } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Fayllar tanlanmagan" }, { status: 400 });
    }

    if (action === "TRASH") {
      await prisma.fileRecord.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: new Date(), status: "TRASHED" },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === "RESTORE") {
      await prisma.fileRecord.updateMany({
        where: { id: { in: ids } },
        data: { deletedAt: null, status: "READY" },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === "ARCHIVE") {
      await prisma.fileRecord.updateMany({
        where: { id: { in: ids } },
        data: { status: "ARCHIVED" },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === "DELETE_PERMANENT") {
      const files = await prisma.fileRecord.findMany({
        where: { id: { in: ids } },
      });
      for (const f of files) {
        await deleteStoredFile(f.path);
      }
      await prisma.fileRecord.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    if (action === "CHANGE_CATEGORY" && category) {
      await prisma.fileRecord.updateMany({
        where: { id: { in: ids } },
        data: { category },
      });
      return NextResponse.json({ success: true, count: ids.length });
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
