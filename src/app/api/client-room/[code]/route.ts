import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const accessCode = params.code.toUpperCase().trim();

    const room = await prisma.clientRoom.findUnique({
      where: { accessCode },
      include: {
        client: true,
        project: {
          select: {
            id: true,
            titleUz: true,
            slug: true,
            coverImage: true,
          },
        },
        milestones: { orderBy: { sortOrder: "asc" } },
        deliverables: { orderBy: { sortOrder: "asc" } },
        messages: { orderBy: { createdAt: "asc" } },
        revisions: { orderBy: { createdAt: "desc" } },
        approvals: true,
      },
    });

    if (!room || room.deletedAt) {
      return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
    }

    // Track client room login
    trackEvent({
      eventType: "client_login",
      path: `/client/${accessCode}`,
      entityType: "client_room",
      entityId: room.id,
      metadata: { clientName: room.client?.name },
    }).catch(() => {});

    return NextResponse.json({ room });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const accessCode = params.code.toUpperCase().trim();
    const data = await req.json();
    const { action } = data;

    const room = await prisma.clientRoom.findUnique({
      where: { accessCode },
      include: { client: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Xona topilmadi" }, { status: 404 });
    }

    // 1. SEND MESSAGE
    if (action === "SEND_MESSAGE") {
      const message = await prisma.clientMessage.create({
        data: {
          clientRoomId: room.id,
          senderType: data.senderType || "CLIENT",
          senderName: data.senderName || room.client.name,
          content: data.content,
          attachments: data.attachments ? JSON.stringify(data.attachments) : null,
        },
      });

      // Notify admin
      if (data.senderType === "CLIENT") {
        await prisma.notification.create({
          data: {
            title: "Mijoz xonasi yangi xabar",
            message: `${room.client.name}: "${data.content.slice(0, 60)}..."`,
            type: "MESSAGE",
            link: `/admin/clients/${room.clientId}`,
          },
        });
      }

      return NextResponse.json({ success: true, message });
    }

    // 2. REQUEST REVISION
    if (action === "REQUEST_REVISION") {
      const revision = await prisma.revisionRequest.create({
        data: {
          clientRoomId: room.id,
          title: data.title,
          description: data.description,
          attachments: data.attachments ? JSON.stringify(data.attachments) : null,
          priority: data.priority || "MEDIUM",
          status: "REQUESTED",
        },
      });

      // Update room status
      await prisma.clientRoom.update({
        where: { id: room.id },
        data: { status: "REVIEW" },
      });

      await prisma.notification.create({
        data: {
          title: "O'zgartirish talabi keldi",
          message: `${room.client.name} "${data.title}" bo'yicha o'zgartirish so'radi`,
          type: "REVISION",
          link: `/admin/clients/${room.clientId}`,
        },
      });

      return NextResponse.json({ success: true, revision });
    }

    // 3. APPROVE PROJECT
    if (action === "APPROVE_PROJECT") {
      const approval = await prisma.projectApproval.create({
        data: {
          clientRoomId: room.id,
          approvedBy: data.approvedBy || room.client.name,
          feedback: data.feedback || null,
          rating: Number(data.rating) || 5,
        },
      });

      // Mark room as approved and completed
      await prisma.clientRoom.update({
        where: { id: room.id },
        data: {
          isApproved: true,
          approvedAt: new Date(),
          approvedBy: data.approvedBy || room.client.name,
          status: "COMPLETED",
          progress: 100,
        },
      });

      // Track analytics
      await trackEvent({
        eventType: "project_approval",
        path: `/client/${accessCode}`,
        entityType: "client_room",
        entityId: room.id,
        metadata: { clientName: room.client.name, rating: data.rating },
      });

      // Create admin notification
      await prisma.notification.create({
        data: {
          title: "🎉 Loyiha to'liq tasdiqlandi!",
          message: `${room.client.name} loyihani qabul qildi (${data.rating} yulduz)`,
          type: "APPROVAL",
          link: `/admin/clients/${room.clientId}`,
        },
      });

      return NextResponse.json({ success: true, approval });
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch (error: any) {
    console.error("Client Room Action error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
