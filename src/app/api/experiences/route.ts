import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ experiences });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const exp = await prisma.experience.create({
      data: {
        company: data.company,
        roleUz: data.roleUz,
        roleRu: data.roleRu || data.roleUz,
        roleEn: data.roleEn || data.roleUz,
        startYear: data.startYear,
        endYear: data.endYear || null,
        isCurrent: Boolean(data.isCurrent),
        descUz: data.descUz || null,
        descRu: data.descRu || data.descUz || null,
        descEn: data.descEn || data.descUz || null,
        location: data.location || "Tashkent, UZ",
        achievementsUz: data.achievementsUz ? JSON.stringify(data.achievementsUz) : null,
        achievementsRu: data.achievementsRu ? JSON.stringify(data.achievementsRu) : null,
        achievementsEn: data.achievementsEn ? JSON.stringify(data.achievementsEn) : null,
        sortOrder: Number(data.sortOrder) || 0,
      },
    });
    return NextResponse.json({ success: true, experience: exp });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
