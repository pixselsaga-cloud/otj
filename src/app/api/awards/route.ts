import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const awards = await prisma.award.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json({ awards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const award = await prisma.award.create({
      data: {
        titleUz: data.titleUz,
        titleRu: data.titleRu || data.titleUz,
        titleEn: data.titleEn || data.titleUz,
        issuer: data.issuer,
        year: data.year || new Date().getFullYear().toString(),
        icon: data.icon || "Trophy",
        projectLink: data.projectLink || null,
        sortOrder: Number(data.sortOrder) || 0,
      },
    });
    return NextResponse.json({ success: true, award });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
