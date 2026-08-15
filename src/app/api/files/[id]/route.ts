import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { action, originalName, category, visibility, tags, status } = data;

    let updateData: any = {};

    if (action === "RESTORE") {
      updateData = { deletedAt: null, status: "READY" };
    } else if (action === "ARCHIVE") {
      updateData = { status: "ARCHIVED" };
    } else if (action === "TRASH") {
      updateData = { deletedAt: new Date(), status: "TRASHED" };
    } else {
      if (originalName) updateData.originalName = originalName;
      if (category) updateData.category = category;
      if (visibility) updateData.visibility = visibility;
      if (tags !== undefined) updateData.tags = tags;
      if (status) updateData.status = status;
    }

    const updated = await prisma.fileRecord.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, file: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const permanent = searchParams.get("permanent") === "true";

    const file = await prisma.fileRecord.findUnique({
      where: { id: params.id },
    });

    if (!file) {
      return NextResponse.json({ error: "Fayl topilmadi" }, { status: 404 });
    }

    if (permanent) {
      // Hard delete from disk & db
      await deleteStoredFile(file.path);
      await prisma.fileRecord.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true, message: "Fayl butunlay o'chirildi" });
    } else {
      // Soft delete
      await prisma.fileRecord.update({
        where: { id: params.id },
        data: { deletedAt: new Date(), status: "TRASHED" },
      });
      return NextResponse.json({ success: true, message: "Fayl savatga yuborildi" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
