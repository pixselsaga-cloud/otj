import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const steps = await prisma.processStep.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ steps });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const step = await prisma.processStep.create({
      data: {
        stepNumber: data.stepNumber || "01",
        titleUz: data.titleUz,
        titleRu: data.titleRu || data.titleUz,
        titleEn: data.titleEn || data.titleUz,
        descUz: data.descUz,
        descRu: data.descRu || data.descUz,
        descEn: data.descEn || data.descUz,
        icon: data.icon || "Compass",
        sortOrder: Number(data.sortOrder) || 0,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
      },
    });
    return NextResponse.json({ success: true, step });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
