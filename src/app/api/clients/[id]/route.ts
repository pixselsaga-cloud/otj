import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: {
        rooms: {
          include: {
            milestones: { orderBy: { sortOrder: "asc" } },
            deliverables: { orderBy: { sortOrder: "asc" } },
            messages: { orderBy: { createdAt: "asc" } },
            revisions: { orderBy: { createdAt: "desc" } },
            approvals: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Mijoz topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ client });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();

    // Client updates
    const client = await prisma.client.update({
      where: { id: params.id },
      data: {
        name: data.name || undefined,
        company: data.company !== undefined ? data.company : undefined,
        email: data.email ? data.email.toLowerCase().trim() : undefined,
        phone: data.phone !== undefined ? data.phone : undefined,
        telegram: data.telegram !== undefined ? data.telegram : undefined,
        notes: data.notes !== undefined ? data.notes : undefined,
        status: data.status || undefined,
      },
    });

    return NextResponse.json({ success: true, client });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.client.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Mijoz butunlay o'chirildi" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
