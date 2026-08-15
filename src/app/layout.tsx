import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { LanguageProvider } from "@/components/ui/LanguageSelector";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });

  return {
    title: {
      default: settings?.siteTitle || "Otajon Jahongirov — Visual & 3D Studio",
      template: "%s | Otajon Jahongirov",
    },
    description:
      settings?.seoDescUz ||
      "3D CGI, Interyer dizayn, Fotomanipulyatsiya va Brending bo'yicha professional portfolio.",
    keywords: ["3D CGI", "Interior Design", "Manipulation", "UI/UX", "Branding", "Otajon Jahongirov"],
    authors: [{ name: settings?.authorName || "Otajon Jahongirov" }],
    metadataBase: new URL(settings?.canonicalUrl || "https://otj.studio"),
    openGraph: {
      title: settings?.seoTitleUz || "Otajon Jahongirov — Visual & 3D Studio",
      description: settings?.seoDescUz || "Otajon Jahongirov ijodiy ishlari va dizayn xizmatlari.",
      images: [settings?.ogImage || "/og-image.jpg"],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [socials, settings] = await Promise.all([
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
  ]);

  return (
    <html lang="uz">
      <body className="bg-[#050607] text-[#F5F7F2] font-sans antialiased selection:bg-[#A3E635] selection:text-[#050607] min-h-screen flex flex-col justify-between">
        <LanguageProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer
              socials={socials}
              settings={{
                authorName: settings?.authorName,
                footerTextUz: settings?.footerTextUz,
                footerTextRu: settings?.footerTextRu,
                footerTextEn: settings?.footerTextEn,
                copyright: settings?.copyright,
                email: settings?.email,
                telegram: settings?.telegram,
                location: settings?.location,
              }}
            />
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
