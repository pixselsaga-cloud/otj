import prisma from "./prisma";

export type EventType =
  | "page_view"
  | "project_view"
  | "like"
  | "bookmark"
  | "share"
  | "download"
  | "contact_submit"
  | "brief_submit"
  | "client_login"
  | "file_download"
  | "project_approval"
  | "cta_click";

export interface TrackEventParams {
  eventType: string;
  path: string;
  entityType?: string;
  targetType?: string;
  entityId?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  referrer?: string;
}

export async function trackEvent(params: TrackEventParams) {
  try {
    return await prisma.analyticsEvent.create({
      data: {
        eventType: params.eventType,
        path: params.path,
        entityType: params.targetType || params.entityType,
        entityId: params.targetId || params.entityId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        ipHash: params.ip ? simpleHash(params.ip) : null,
        userAgent: params.userAgent,
        referrer: params.referrer,
      },
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    return null;
  }
}

export const trackAnalyticsEvent = trackEvent;

function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

export async function getAnalyticsMetrics(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const totalEvents = await prisma.analyticsEvent.count({
    where: { createdAt: { gte: since } },
  });

  const pageViews = await prisma.analyticsEvent.count({
    where: { eventType: "page_view", createdAt: { gte: since } },
  });

  const projectViews = await prisma.analyticsEvent.count({
    where: { eventType: "project_view", createdAt: { gte: since } },
  });

  const likes = await prisma.analyticsEvent.count({
    where: { eventType: "like", createdAt: { gte: since } },
  });

  const bookmarks = await prisma.analyticsEvent.count({
    where: { eventType: "bookmark", createdAt: { gte: since } },
  });

  const briefSubmissions = await prisma.analyticsEvent.count({
    where: { eventType: "brief_submit", createdAt: { gte: since } },
  });

  const contactSubmissions = await prisma.analyticsEvent.count({
    where: { eventType: "contact_submit", createdAt: { gte: since } },
  });

  const fileDownloads = await prisma.analyticsEvent.count({
    where: { eventType: "file_download", createdAt: { gte: since } },
  });

  const activeClients = await prisma.client.count({
    where: { status: "ACTIVE" },
  });

  // Calculate conversion rate: (briefs + contacts) / pageViews * 100
  const conversions = briefSubmissions + contactSubmissions;
  const conversionRate = pageViews > 0 ? ((conversions / pageViews) * 100).toFixed(1) : "0.0";

  // Recent 14-day daily chart data
  const chartDays = 14;
  const dailyData: { date: string; views: number; interactions: number; conversions: number }[] = [];

  for (let i = chartDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const dayViews = await prisma.analyticsEvent.count({
      where: {
        eventType: { in: ["page_view", "project_view"] },
        createdAt: { gte: d, lt: nextD },
      },
    });

    const dayInteractions = await prisma.analyticsEvent.count({
      where: {
        eventType: { in: ["like", "bookmark", "share", "file_download"] },
        createdAt: { gte: d, lt: nextD },
      },
    });

    const dayConversions = await prisma.analyticsEvent.count({
      where: {
        eventType: { in: ["brief_submit", "contact_submit"] },
        createdAt: { gte: d, lt: nextD },
      },
    });

    const formattedDate = `${d.getMonth() + 1}/${d.getDate()}`;
    dailyData.push({
      date: formattedDate,
      views: dayViews,
      interactions: dayInteractions,
      conversions: dayConversions,
    });
  }

  // Top projects by views
  const topProjects = await prisma.project.findMany({
    where: { deletedAt: null, status: "PUBLISHED" },
    orderBy: { views: "desc" },
    take: 5,
    select: {
      id: true,
      titleUz: true,
      slug: true,
      category: true,
      views: true,
      likes: true,
      coverImage: true,
    },
  });

  return {
    totalEvents,
    pageViews,
    projectViews,
    likes,
    bookmarks,
    briefSubmissions,
    contactSubmissions,
    fileDownloads,
    activeClients,
    conversionRate,
    dailyData,
    topProjects,
  };
}
