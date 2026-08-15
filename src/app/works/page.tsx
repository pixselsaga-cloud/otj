import prisma from "@/lib/prisma";
import { WorksGrid } from "@/components/public/WorksGrid";

export const revalidate = 0;

export default async function WorksPage() {
  const projects = await prisma.project.findMany({
    where: {
      deletedAt: null,
      status: "PUBLISHED",
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  const categories = [
    "ALL",
    "3D CGI & Motion",
    "Interior Design",
    "Photo Manipulation",
    "Brand Identity",
    "UI/UX Design",
    "Architecture & 3D Render",
    "Posters & Key Visuals",
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono font-bold tracking-widest text-[#A3E635] uppercase">
          PORTFOLIO & CASE STUDIES
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-[#F5F7F2]">
          Tanlangan Loyihalar
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          3D CGI, Interyer dizayni, Fotomanipulyatsiya va Brending sohasidagi professional ishlar to'plami.
        </p>
      </div>

      {/* Grid with category filters */}
      <WorksGrid projects={projects} categories={categories} />
    </div>
  );
}
