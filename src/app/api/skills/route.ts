import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ skills });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const skill = await prisma.skill.create({
      data: {
        name: data.name,
        percentage: Number(data.percentage) || 90,
        category: data.category || "3D & Visual",
        icon: data.icon || "Layers",
        sortOrder: Number(data.sortOrder) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
    return NextResponse.json({ success: true, skill });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
