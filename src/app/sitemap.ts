import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://otj.studio";

  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticPages = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/works`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/request`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const projectPages = projects.map((p) => ({
    url: `${baseUrl}/works/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...projectPages];
}
