import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Eye, Heart, Bookmark, Calendar, User, MapPin, Wrench, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { WorksGrid } from "@/components/public/WorksGrid";
import { getWatermarkStyle } from "@/lib/watermark";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let project: any = null;
  try {
    project = await prisma.project.findUnique({
      where: { slug: params.slug },
      include: {
        media: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } },
        versions: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch (err) {
    console.warn("Project detail build-time fetch skipped:", err);
  }

  if (!project || project.deletedAt || project.status !== "PUBLISHED") {
    notFound();
  }

  // Increment view counter asynchronously
  prisma.project
    .update({
      where: { id: project.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  // Fetch related projects
  const relatedProjects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
      id: { not: project.id },
      category: project.category,
    },
    take: 2,
  });

  let galleryUrls: string[] = [];
  try {
    if (project.gallery) {
      galleryUrls = typeof project.gallery === "string" ? JSON.parse(project.gallery) : project.gallery;
    }
  } catch {}

  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  const watermarkStyle = project.watermarkEnabled
    ? getWatermarkStyle({
        text: settings?.watermarkText || "OTAJON JAHONGIROV STUDIO",
        position: (settings?.watermarkPosition as any) || "BOTTOM_RIGHT",
        opacity: settings?.watermarkOpacity || 0.35,
        size: settings?.watermarkSize || 16,
        enabled: true,
      })
    : {};

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/works"
          className="inline-flex items-center gap-2 text-xs font-mono text-[#9CA3AF] hover:text-[#A3E635] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha ishlarga qaytish</span>
        </Link>
      </div>

      {/* Project Title & Category */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3.5 py-1 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 text-xs font-mono text-[#A3E635] uppercase tracking-wider">
            {project.category}
          </span>
          <span className="text-xs font-mono text-[#6B7280]">YEAR: {project.year}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F5F7F2] font-display tracking-tight leading-tight mb-6">
          {project.titleUz}
        </h1>

        <p className="text-lg sm:text-xl text-[#9CA3AF] max-w-3xl leading-relaxed">
          {project.descUz}
        </p>
      </div>

      {/* Main Cover with optional Watermark */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 mb-16 bg-[#080A0B]">
        <img
          src={project.coverImage}
          alt={project.titleUz}
          className="w-full h-auto max-h-[750px] object-cover"
        />
        {project.watermarkEnabled && (
          <div style={watermarkStyle}>
            {settings?.watermarkText || "OTAJON JAHONGIROV STUDIO"}
          </div>
        )}
      </div>

      {/* Project Info Specs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/60 mb-16">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] mb-1">
            <User className="w-3.5 h-3.5 text-[#A3E635]" /> MIJOZ
          </div>
          <p className="text-sm font-bold text-[#F5F7F2]">{project.client || "Self-Initiated"}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#A3E635]" /> YIL & MUDDAT
          </div>
          <p className="text-sm font-bold text-[#F5F7F2]">{project.year}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] mb-1">
            <Layers className="w-3.5 h-3.5 text-[#A3E635]" /> XIZMATLAR
          </div>
          <p className="text-sm font-bold text-[#F5F7F2]">{project.services || project.category}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] mb-1">
            <Wrench className="w-3.5 h-3.5 text-[#A3E635]" /> ASBOBLAR
          </div>
          <p className="text-sm font-bold text-[#F5F7F2]">{project.tools || "Cinema 4D, Figma"}</p>
        </div>
      </div>

      {/* Full Case Study Content */}
      <div className="space-y-12 mb-20">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#F5F7F2] mb-6">
            Loyiha konsepsiyasi va jarayoni
          </h2>
          <div className="prose prose-invert max-w-none text-[#9CA3AF] text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {project.fullDescUz || project.descUz}
          </div>
        </div>

        {/* Gallery Images */}
        {galleryUrls.length > 0 && (
          <div className="space-y-8 pt-8">
            <h3 className="text-xl font-bold font-display text-[#F5F7F2]">
              Vizual materiallar va renderlar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryUrls.map((url, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 group">
                  <img
                    src={url}
                    alt={`${project.titleUz} render ${i + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {project.watermarkEnabled && (
                    <div style={watermarkStyle}>
                      {settings?.watermarkText || "OTAJON JAHONGIROV STUDIO"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Version History if any */}
        {project.versions.length > 0 && (
          <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/40">
            <h4 className="text-sm font-mono uppercase text-[#A3E635] tracking-wider mb-4">
              VERSIYALAR TARIXI (VERSION CONTROL)
            </h4>
            <div className="space-y-3">
              {project.versions.map((ver) => (
                <div key={ver.id} className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                  <span className="font-bold text-[#F5F7F2]">{ver.versionNumber} — {ver.versionName}</span>
                  <span className="text-[#6B7280]">{ver.changes}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="p-10 rounded-3xl glass-panel border border-[#A3E635]/30 bg-[#0D1112] text-center mb-20">
        <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#F5F7F2] mb-3">
          Shunga o'xshash loyiha yaratmoqchimisiz?
        </h3>
        <p className="text-sm text-[#9CA3AF] max-w-md mx-auto mb-6">
          Briefni to'ldiring yoki to'g'ridan-to'g'ri bog'laning, g'oyangizni birgalikda muhokama qilamiz.
        </p>
        <Link href="/request">
          <Button size="lg" variant="primary">
            Loyiha so'rovini yuborish
          </Button>
        </Link>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold font-display text-[#F5F7F2] mb-8">
            O'xshash loyihalar
          </h3>
          <WorksGrid projects={relatedProjects} showFilter={false} />
        </div>
      )}
    </div>
  );
}
