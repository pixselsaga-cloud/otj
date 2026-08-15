import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateAccessCode } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { roomId } = await req.json();

    let newCode = generateAccessCode();
    while (await prisma.clientRoom.findUnique({ where: { accessCode: newCode } })) {
      newCode = generateAccessCode();
    }

    const updated = await prisma.clientRoom.update({
      where: { id: roomId },
      data: { accessCode: newCode },
    });

    return NextResponse.json({ success: true, accessCode: newCode });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
