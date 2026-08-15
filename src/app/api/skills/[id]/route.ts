import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const updated = await prisma.skill.update({
      where: { id: params.id },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        percentage: data.percentage !== undefined ? Number(data.percentage) : undefined,
        category: data.category !== undefined ? data.category : undefined,
        sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
    return NextResponse.json({ success: true, skill: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
