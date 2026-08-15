import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [settings, skills, experiences, awards] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.skill.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.experience.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
      prisma.award.findMany({ orderBy: { sortOrder: "asc" } }),
    ]);

    return NextResponse.json({ settings, skills, experiences, awards });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();

    const updated = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: { ...data },
      create: { id: "default", ...data },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "AboutSettings",
        entityId: "default",
        metadata: JSON.stringify({ authorName: updated.authorName }),
      },
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
