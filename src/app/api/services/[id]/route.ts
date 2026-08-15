import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    if (data.featuresUz && typeof data.featuresUz !== "string") {
      data.featuresUz = JSON.stringify(data.featuresUz);
    }
    if (data.featuresRu && typeof data.featuresRu !== "string") {
      data.featuresRu = JSON.stringify(data.featuresRu);
    }
    if (data.featuresEn && typeof data.featuresEn !== "string") {
      data.featuresEn = JSON.stringify(data.featuresEn);
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
      data: {
        ...data,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Service",
        entityId: updated.id,
        metadata: JSON.stringify({ title: updated.titleUz }),
      },
    });

    return NextResponse.json({ success: true, service: updated });
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
      await prisma.service.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true, message: "Xizmat butunlay o'chirildi" });
    } else {
      await prisma.service.update({
        where: { id: params.id },
        data: { deletedAt: new Date(), status: "ARCHIVED" },
      });
      return NextResponse.json({ success: true, message: "Xizmat savatga yuborildi" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
