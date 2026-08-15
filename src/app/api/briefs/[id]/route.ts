import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await prisma.brief.findUnique({
      where: { id: params.id },
      include: { analysis: true },
    });

    if (!brief) {
      return NextResponse.json({ error: "Brief topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ brief });
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
    const { status, additionalInfo } = data;

    const updated = await prisma.brief.update({
      where: { id: params.id },
      data: {
        status: status || undefined,
        additionalInfo: additionalInfo !== undefined ? additionalInfo : undefined,
      },
      include: { analysis: true },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_STATUS",
        entity: "Brief",
        entityId: updated.id,
        metadata: JSON.stringify({ status: updated.status }),
      },
    });

    return NextResponse.json({ success: true, brief: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brief.update({
      where: { id: params.id },
      data: { deletedAt: new Date(), status: "ARCHIVED" },
    });
    return NextResponse.json({ success: true, message: "Brief arxivlandi" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
