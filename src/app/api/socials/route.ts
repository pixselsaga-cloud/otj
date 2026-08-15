import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const socials = await prisma.socialLink.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ socials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const social = await prisma.socialLink.create({
      data: {
        platform: data.platform,
        username: data.username,
        url: data.url,
        icon: data.icon || "Globe",
        labelUz: data.labelUz || data.platform,
        labelRu: data.labelRu || data.platform,
        labelEn: data.labelEn || data.platform,
        sortOrder: Number(data.sortOrder) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
    return NextResponse.json({ success: true, social });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
