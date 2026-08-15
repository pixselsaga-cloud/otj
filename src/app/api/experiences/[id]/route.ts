import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    if (data.achievementsUz && typeof data.achievementsUz !== "string") {
      data.achievementsUz = JSON.stringify(data.achievementsUz);
    }
    const updated = await prisma.experience.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ success: true, experience: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.experience.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
