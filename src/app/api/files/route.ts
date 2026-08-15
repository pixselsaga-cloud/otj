import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "READY";
    const projectId = searchParams.get("projectId") || "";

    const where: any = {
      deletedAt: status === "TRASHED" ? { not: null } : null,
    };

    if (status !== "TRASHED" && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (search) {
      where.originalName = { contains: search };
    }

    const files = await prisma.fileRecord.findMany({
      where,
      include: {
        versions: { orderBy: { versionNumber: "desc" } },
        project: { select: { id: true, titleUz: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
