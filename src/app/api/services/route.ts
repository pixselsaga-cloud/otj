import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const slug = data.slug ? slugify(data.slug) : slugify(data.titleUz || "service");

    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.service.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const service = await prisma.service.create({
      data: {
        slug: uniqueSlug,
        titleUz: data.titleUz || "Yangi xizmat",
        titleRu: data.titleRu || data.titleUz || "Новая услуга",
        titleEn: data.titleEn || data.titleUz || "New Service",
        shortDescUz: data.shortDescUz || "",
        shortDescRu: data.shortDescRu || data.shortDescUz || "",
        shortDescEn: data.shortDescEn || data.shortDescUz || "",
        fullDescUz: data.fullDescUz || "",
        fullDescRu: data.fullDescRu || "",
        fullDescEn: data.fullDescEn || "",
        icon: data.icon || "Sparkles",
        startingPrice: data.startingPrice || "$1,000",
        deliveryTime: data.deliveryTime || "2-3 hafta",
        category: data.category || "Design",
        featuresUz: typeof data.featuresUz === "string" ? data.featuresUz : JSON.stringify(data.featuresUz || []),
        featuresRu: typeof data.featuresRu === "string" ? data.featuresRu : JSON.stringify(data.featuresRu || []),
        featuresEn: typeof data.featuresEn === "string" ? data.featuresEn : JSON.stringify(data.featuresEn || []),
        featured: Boolean(data.featured),
        status: data.status || "PUBLISHED",
        sortOrder: Number(data.sortOrder) || 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Service",
        entityId: service.id,
        metadata: JSON.stringify({ title: service.titleUz }),
      },
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
