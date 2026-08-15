import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://otj.studio";

  let projects: { slug: string; updatedAt: Date }[] = [];
  let services: { slug: string; updatedAt: Date }[] = [];

  try {
    const res = await Promise.all([
      prisma.project.findMany({
        where: { deletedAt: null, status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.service.findMany({
        where: { deletedAt: null, status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);
    projects = res[0] || [];
    services = res[1] || [];
  } catch (err) {
    console.warn("Sitemap build-time query skipped gracefully.");
  }

  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/request`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/client`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const projectPages = projects.map((p) => ({
    url: `${baseUrl}/works/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const servicePages = services.map((s) => ({
    url: `${baseUrl}/services`,
    lastModified: s.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages, ...servicePages];
}
