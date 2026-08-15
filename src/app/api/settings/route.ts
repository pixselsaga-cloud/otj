import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const data = await req.json();
    const { newPassword, ...settingsData } = data;

    // Optional admin password update
    if (newPassword) {
      const hashed = await hashPassword(newPassword);
      await prisma.user.updateMany({
        where: { role: "ADMIN" },
        data: { passwordHash: hashed },
      });
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: "default" },
      update: settingsData,
      create: { id: "default", ...settingsData },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_SETTINGS",
        entity: "SiteSettings",
        entityId: "default",
        metadata: JSON.stringify({ siteTitle: settings.siteTitle }),
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
