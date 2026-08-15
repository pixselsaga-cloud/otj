import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";

    const where: any = {
      deletedAt: null,
    };

    if (status !== "ALL") {
      where.status = status;
    }

    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        telegram: data.telegram || null,
        subject: data.subject || null,
        message: data.message,
        status: "UNREAD",
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        title: "Yangi kontakt xabari",
        message: `${message.name} (${message.email}) xabar yozdi`,
        type: "MESSAGE",
        link: "/admin/messages",
      },
    });

    // Track analytics
    await trackEvent({
      eventType: "contact_submit",
      path: "/contact",
      entityType: "contact_message",
      entityId: message.id,
      metadata: { name: message.name, email: message.email },
    });

    return NextResponse.json({ success: true, messageId: message.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
