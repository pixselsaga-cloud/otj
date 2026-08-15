import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteStoredFile } from "@/lib/storage";

export async function GET() {
  try {
    const [projects, services, files, briefs, messages] = await Promise.all([
      prisma.project.findMany({ where: { deletedAt: { not: null } } }),
      prisma.service.findMany({ where: { deletedAt: { not: null } } }),
      prisma.fileRecord.findMany({ where: { deletedAt: { not: null } } }),
      prisma.brief.findMany({ where: { deletedAt: { not: null } } }),
      prisma.contactMessage.findMany({ where: { deletedAt: { not: null } } }),
    ]);

    return NextResponse.json({
      items: {
        projects,
        services,
        files,
        briefs,
        messages,
      },
      total:
        projects.length +
        services.length +
        files.length +
        briefs.length +
        messages.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, entity, id } = await req.json();

    if (action === "RESTORE") {
      if (entity === "project") {
        await prisma.project.update({
          where: { id },
          data: { deletedAt: null, status: "PUBLISHED" },
        });
      } else if (entity === "service") {
        await prisma.service.update({
          where: { id },
          data: { deletedAt: null, status: "PUBLISHED" },
        });
      } else if (entity === "file") {
        await prisma.fileRecord.update({
          where: { id },
          data: { deletedAt: null, status: "READY" },
        });
      } else if (entity === "brief") {
        await prisma.brief.update({
          where: { id },
          data: { deletedAt: null, status: "NEW" },
        });
      } else if (entity === "message") {
        await prisma.contactMessage.update({
          where: { id },
          data: { deletedAt: null, status: "UNREAD" },
        });
      }
      return NextResponse.json({ success: true, message: "Element qaytarildi" });
    }

    if (action === "PURGE") {
      if (entity === "project") {
        await prisma.project.delete({ where: { id } });
      } else if (entity === "service") {
        await prisma.service.delete({ where: { id } });
      } else if (entity === "file") {
        const file = await prisma.fileRecord.findUnique({ where: { id } });
        if (file) await deleteStoredFile(file.path);
        await prisma.fileRecord.delete({ where: { id } });
      } else if (entity === "brief") {
        await prisma.brief.delete({ where: { id } });
      } else if (entity === "message") {
        await prisma.contactMessage.delete({ where: { id } });
      }
      return NextResponse.json({ success: true, message: "Element butunlay o'chirildi" });
    }

    if (action === "EMPTY_ALL") {
      const trashedFiles = await prisma.fileRecord.findMany({
        where: { deletedAt: { not: null } },
      });
      for (const f of trashedFiles) {
        await deleteStoredFile(f.path);
      }

      await Promise.all([
        prisma.project.deleteMany({ where: { deletedAt: { not: null } } }),
        prisma.service.deleteMany({ where: { deletedAt: { not: null } } }),
        prisma.fileRecord.deleteMany({ where: { deletedAt: { not: null } } }),
        prisma.brief.deleteMany({ where: { deletedAt: { not: null } } }),
        prisma.contactMessage.deleteMany({ where: { deletedAt: { not: null } } }),
      ]);

      return NextResponse.json({ success: true, message: "Savat butunlay tozalandi" });
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
