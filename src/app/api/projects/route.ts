import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "ALL";

    const where: any = {
      deletedAt: status === "TRASHED" ? { not: null } : null,
    };

    if (status !== "TRASHED" && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { titleUz: { contains: search } },
        { titleRu: { contains: search } },
        { titleEn: { contains: search } },
        { client: { contains: search } },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        versions: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const slug = data.slug ? slugify(data.slug) : slugify(data.titleUz || data.titleEn || "project");
    
    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const project = await prisma.project.create({
      data: {
        slug: uniqueSlug,
        titleUz: data.titleUz || "Yangi loyiha",
        titleRu: data.titleRu || data.titleUz || "Новый проект",
        titleEn: data.titleEn || data.titleUz || "New Project",
        descUz: data.descUz || "",
        descRu: data.descRu || data.descUz || "",
        descEn: data.descEn || data.descUz || "",
        fullDescUz: data.fullDescUz || "",
        fullDescRu: data.fullDescRu || data.fullDescUz || "",
        fullDescEn: data.fullDescEn || data.fullDescUz || "",
        client: data.client || null,
        category: data.category || "3D CGI & Motion",
        subcategory: data.subcategory || null,
        year: data.year || new Date().getFullYear().toString(),
        location: data.location || "Tashkent, UZ",
        services: data.services || null,
        tools: data.tools || null,
        tags: data.tags || null,
        coverImage: data.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        gallery: typeof data.gallery === "string" ? data.gallery : JSON.stringify(data.gallery || []),
        status: data.status || "PUBLISHED",
        featured: Boolean(data.featured),
        sortOrder: Number(data.sortOrder) || 0,
        watermarkEnabled: Boolean(data.watermarkEnabled),
        seoTitleUz: data.seoTitleUz || null,
        seoDescUz: data.seoDescUz || null,
      },
    });

    // Log to audit log
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Project",
        entityId: project.id,
        metadata: JSON.stringify({ title: project.titleUz, slug: project.slug }),
      },
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Project create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
