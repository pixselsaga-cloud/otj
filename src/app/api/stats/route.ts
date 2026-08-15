import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const stats = await prisma.statistic.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const stat = await prisma.statistic.create({
      data: {
        labelUz: data.labelUz,
        labelRu: data.labelRu || data.labelUz,
        labelEn: data.labelEn || data.labelUz,
        value: data.value,
        prefix: data.prefix || null,
        suffix: data.suffix || null,
        icon: data.icon || "TrendingUp",
        sortOrder: Number(data.sortOrder) || 0,
        isVisible: data.isVisible !== undefined ? Boolean(data.isVisible) : true,
      },
    });
    return NextResponse.json({ success: true, stat });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
