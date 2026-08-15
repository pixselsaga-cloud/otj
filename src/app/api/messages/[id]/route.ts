import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const { status, replyMessage } = data;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (replyMessage) {
      updateData.replyMessage = replyMessage;
      updateData.repliedAt = new Date();
      updateData.status = "REPLIED";
    }

    const updated = await prisma.contactMessage.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message: updated });
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
      await prisma.contactMessage.delete({
        where: { id: params.id },
      });
      return NextResponse.json({ success: true, message: "Xabar butunlay o'chirildi" });
    } else {
      await prisma.contactMessage.update({
        where: { id: params.id },
        data: { deletedAt: new Date(), status: "DELETED" },
      });
      return NextResponse.json({ success: true, message: "Xabar savatga yuborildi" });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
