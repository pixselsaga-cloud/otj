import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAnalyticsMetrics, trackAnalyticsEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";
    const referrer = req.headers.get("referer") || "";

    const event = await trackAnalyticsEvent({
      eventType: body.eventType,
      targetType: body.targetType,
      targetId: body.targetId,
      path: body.path || "/",
      metadata: body.metadata,
      ip,
      userAgent,
      referrer,
    });

    // If it's a project like or share, also increment the project model counter
    if (body.targetType === "PROJECT" && body.targetId) {
      if (body.eventType === "PROJECT_LIKE" || body.eventType === "LIKE") {
        await prisma.project.update({
          where: { id: body.targetId },
          data: { likes: { increment: 1 } },
        }).catch(() => {});
      } else if (body.eventType === "PROJECT_VIEW" || body.eventType === "VIEW") {
        await prisma.project.update({
          where: { id: body.targetId },
          data: { views: { increment: 1 } },
        }).catch(() => {});
      }
    }

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log event" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "30", 10);
    const exportType = url.searchParams.get("export");

    const metrics = await getAnalyticsMetrics(days);

    // Fetch granular activity logs
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const rawLogs = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: "desc" },
      take: 150,
    });

    // Resolve target project names
    const projectIds = rawLogs
      .filter((l) => (l.entityType === "PROJECT" || l.entityType === "project") && l.entityId)
      .map((l) => l.entityId as string);

    const projects = await prisma.project.findMany({
      where: { id: { in: projectIds } },
      select: { id: true, titleUz: true, slug: true, coverImage: true },
    });

    const projectMap = new Map(projects.map((p) => [p.id, p]));

    const activityLogs = rawLogs.map((log) => {
      const proj = log.entityId ? projectMap.get(log.entityId) : null;
      let meta: any = {};
      try {
        if (log.metadata) meta = typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata;
      } catch {}

      return {
        id: log.id,
        eventType: log.eventType,
        targetType: log.entityType || "PAGE",
        targetName: proj?.titleUz || meta?.title || log.path || "Sahifa",
        targetSlug: proj?.slug || meta?.slug || "",
        ipHash: log.ipHash ? log.ipHash.slice(0, 12) + "..." : "Localhost",
        userAgent: log.userAgent ? log.userAgent.slice(0, 45) + "..." : "Browser",
        referrer: log.referrer || "To'g'ridan-to'g'ri (Direct)",
        createdAt: log.createdAt,
      };
    });

    // If CSV export requested
    if (exportType === "csv") {
      let csv = "ID,Event Type,Target,IP Hash,User Agent,Referrer,Date\n";
      activityLogs.forEach((l) => {
        csv += `"${l.id}","${l.eventType}","${l.targetName}","${l.ipHash}","${l.userAgent}","${l.referrer}","${l.createdAt.toISOString()}"\n`;
      });

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=otj-analytics-${days}d.csv`,
        },
      });
    }

    // If JSON export requested
    if (exportType === "json") {
      return new Response(JSON.stringify({ metrics, activityLogs }, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename=otj-analytics-${days}d.json`,
        },
      });
    }

    return NextResponse.json({ ...metrics, activityLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch analytics" }, { status: 500 });
  }
}
