import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const original = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!original) {
      return NextResponse.json({ error: "Loyiha topilmadi" }, { status: 404 });
    }

    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;

    const duplicate = await prisma.project.create({
      data: {
        slug: newSlug,
        titleUz: `${original.titleUz} (Nusxa)`,
        titleRu: `${original.titleRu} (Копия)`,
        titleEn: `${original.titleEn} (Copy)`,
        descUz: original.descUz,
        descRu: original.descRu,
        descEn: original.descEn,
        fullDescUz: original.fullDescUz,
        fullDescRu: original.fullDescRu,
        fullDescEn: original.fullDescEn,
        client: original.client,
        category: original.category,
        subcategory: original.subcategory,
        year: original.year,
        location: original.location,
        services: original.services,
        tools: original.tools,
        tags: original.tags,
        coverImage: original.coverImage,
        gallery: original.gallery,
        status: "DRAFT",
        featured: false,
        sortOrder: original.sortOrder + 1,
        watermarkEnabled: original.watermarkEnabled,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "DUPLICATE",
        entity: "Project",
        entityId: duplicate.id,
        metadata: JSON.stringify({ originalId: original.id, newTitle: duplicate.titleUz }),
      },
    });

    return NextResponse.json({ success: true, project: duplicate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
