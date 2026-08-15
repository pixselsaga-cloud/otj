import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        versions: { orderBy: { createdAt: "desc" } },
        media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { action } = data;

    if (action === "RESTORE") {
      const restored = await prisma.project.update({
        where: { id: params.id },
        data: { deletedAt: null, status: "PUBLISHED" },
      });
      return NextResponse.json({ success: true, project: restored });
    }

    if (action === "ARCHIVE") {
      const archived = await prisma.project.update({
        where: { id: params.id },
        data: { status: "ARCHIVED" },
      });
      return NextResponse.json({ success: true, project: archived });
    }

    if (action === "PUBLISH") {
      const pub = await prisma.project.update({
        where: { id: params.id },
        data: { status: "PUBLISHED" },
      });
      return NextResponse.json({ success: true, project: pub });
    }

    if (action === "UNPUBLISH") {
      const unpub = await prisma.project.update({
        where: { id: params.id },
        data: { status: "DRAFT" },
      });
      return NextResponse.json({ success: true, project: unpub });
    }

    // Format gallery if needed
    if (data.gallery && typeof data.gallery !== "string") {
      data.gallery = JSON.stringify(data.gallery);
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...data,
        action: undefined,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Project",
        entityId: updated.id,
        metadata: JSON.stringify({ title: updated.titleUz }),
      },
    });

    return NextResponse.json({ success: true, project: updated });
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

    if (permanent) {
      await prisma.project.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true, message: "Loyiha butunlay o'chirildi" });
    } else {
      await prisma.project.update({
        where: { id: params.id },
        data: { deletedAt: new Date(), status: "ARCHIVED" },
      });
      return NextResponse.json({ success: true, message: "Loyiha savatga yuborildi" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
