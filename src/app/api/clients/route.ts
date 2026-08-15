import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAccessCode } from "@/lib/utils";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        rooms: {
          include: {
            milestones: true,
            deliverables: true,
            revisions: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ clients });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const client = await prisma.client.create({
      data: {
        name: data.name,
        company: data.company || null,
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
        telegram: data.telegram || null,
        notes: data.notes || null,
        status: "ACTIVE",
      },
    });

    // Create client room if title provided
    let room = null;
    if (data.createRoom) {
      let accessCode = generateAccessCode();
      while (await prisma.clientRoom.findUnique({ where: { accessCode } })) {
        accessCode = generateAccessCode();
      }

      room = await prisma.clientRoom.create({
        data: {
          accessCode,
          clientId: client.id,
          projectId: data.projectId || null,
          title: data.roomTitle || `${client.name} — Maxsus Loyiha Xonasi`,
          welcomeMessageUz: data.welcomeMessage || "Xush kelibsiz! Loyihaning barcha bosqichlari va materiallari shu yerda jamlangan.",
          status: "ACTIVE",
          progress: 10,
          deadline: data.deadline ? new Date(data.deadline) : null,
        },
      });

      // Create default initial milestones
      await prisma.milestone.createMany({
        data: [
          { clientRoomId: room.id, titleUz: "Discovery & Moodboard", titleRu: "Аудит и Мудборд", titleEn: "Discovery & Moodboard", status: "IN_PROGRESS", sortOrder: 1 },
          { clientRoomId: room.id, titleUz: "Design Concept & Draft", titleRu: "Концепция и Черновик", titleEn: "Design Concept & Draft", status: "WAITING", sortOrder: 2 },
          { clientRoomId: room.id, titleUz: "Refinement & Polish", titleRu: "Доработка и Полировка", titleEn: "Refinement & Polish", status: "WAITING", sortOrder: 3 },
          { clientRoomId: room.id, titleUz: "Final Delivery & Assets", titleRu: "Сдача и Материалы", titleEn: "Final Delivery & Assets", status: "WAITING", sortOrder: 4 },
        ],
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Client",
        entityId: client.id,
        metadata: JSON.stringify({ name: client.name, roomCode: room?.accessCode }),
      },
    });

    return NextResponse.json({ success: true, client, room });
  } catch (error: any) {
    console.error("Client create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
