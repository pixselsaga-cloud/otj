import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Tozalash va yangi haqiqiy ma'lumotlarni yuklash boshlandi...");

  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.projectApproval.deleteMany();
  await prisma.revisionRequest.deleteMany();
  await prisma.clientMessage.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.clientRoom.deleteMany();
  await prisma.client.deleteMany();
  await prisma.fileVersion.deleteMany();
  await prisma.fileRecord.deleteMany();
  await prisma.fileFolder.deleteMany();
  await prisma.briefAnalysis.deleteMany();
  await prisma.brief.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.projectMedia.deleteMany();
  await prisma.projectVersion.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();
  await prisma.statistic.deleteMany();
  await prisma.processStep.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.award.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.navigationItem.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // Admin User
  const hashedPassword = await bcrypt.hash("Otajon2009$", 10);
  await prisma.user.create({
    data: {
      email: "Otajon2009$",
      name: "Otajon2009$",
      passwordHash: hashedPassword,
      role: "ADMIN",
      isActive: true,
      avatar: "/avatar.jpg",
    },
  });

  // Site Settings with real info
  await prisma.siteSettings.create({
    data: {
      id: "default",
      siteTitle: "Otajon Jahongirov — AI Menejer & Visual Studio",
      authorName: "Otajon Jahongirov",
      headlineUz: "Visual g'oyalarni haqiqiy tajribaga aylantiraman",
      headlineRu: "Превращаю визуальные идеи в осязаемый опыт",
      headlineEn: "Transforming visual concepts into immersive reality",
      bioUz: "AI Menejer va Visual Director. Sun'iy intellekt texnologiyalari, 3D CGI va vizual tizimlar yordamida loyihalarni boshqaraman va yuqori natijaga erishaman. 3 yillik tajriba, 127+ mamnun mijoz va 8 ta global hamkorlar bilan ishlaganman.",
      bioRu: "AI Менеджер и Визуальный Директор с 3-летним опытом. 127+ клиентов и 8 глобальных партнеров.",
      bioEn: "AI Manager & Visual Director with 3+ years of experience, 127+ completed client projects and 8 global partnerships.",
      longBioUz: "Men Otajon Jahongirov — AI Menejer va Visual Directorman. Zamonaviy sun'iy intellekt vositalari va 3D vizual texnologiyalarni birlashtirgan holda har bir loyihaga individual yondashaman. Navoiy shahrida faoliyat yuritaman va xalqaro hamda mahalliy loyihalarda sifat va natijani birinchi o'ringa qo'yaman.",
      longBioRu: "Я Отаджон Джахонгиров — AI Менеджер и Визуальный Директор. Объединяю передовые технологии искусственного интеллекта и 3D визуализацию.",
      longBioEn: "I am Otajon Jahongirov — AI Manager & Visual Director combining cutting-edge AI technologies and 3D visual engineering.",
      profilePhoto: "/avatar.jpg",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
      email: "pixselsaga@gmail.com",
      phone: "+998 90 123 45 67",
      telegram: "@otajon9999",
      location: "Navoiy, O'zbekiston",
      availabilityUz: "Yangi loyihalar uchun ochiq",
      availabilityRu: "Доступен для новых проектов",
      availabilityEn: "Available for new projects",
      yearsOfExperience: 3,
      clientCount: 127,
      projectCount: 127,
      awardCount: 0,
      footerTextUz: "AI Menejment va zamonaviy vizual texnologiyalar orqali yuqori darajadagi natijalar.",
      footerTextRu: "Премиальные визуальные и AI решения мирового уровня.",
      footerTextEn: "High-end AI management and visual systems crafting bespoke digital experiences.",
      copyright: "Otajon Jahongirov. Barcha huquqlar himoyalangan.",
      watermarkEnabled: true,
      watermarkText: "OTAJON JAHONGIROV",
      seoTitleUz: "Otajon Jahongirov — AI Menejer & Visual Studio",
      seoDescUz: "AI Menejer va 3D vizualizatsiya mutaxassisi Otajon Jahongirovning rasmiy portfolio platformasi.",
    },
  });

  // Social Links
  const socials = [
    {
      platform: "Telegram",
      username: "@ustozmee",
      url: "https://t.me/ustozmee",
      icon: "Send",
      labelUz: "Telegram Kanal",
      labelRu: "Телеграм Канал",
      labelEn: "Telegram Channel",
      sortOrder: 1,
      isActive: true,
    },
    {
      platform: "Telegram Direct",
      username: "@otajon9999",
      url: "https://t.me/otajon9999",
      icon: "Send",
      labelUz: "Telegram Lichka",
      labelRu: "Телеграм Личка",
      labelEn: "Telegram Direct",
      sortOrder: 2,
      isActive: true,
    },
    {
      platform: "Instagram",
      username: "@ustozmee",
      url: "https://instagram.com/ustozmee",
      icon: "Instagram",
      labelUz: "Instagram",
      labelRu: "Instagram",
      labelEn: "Instagram",
      sortOrder: 3,
      isActive: true,
    },
  ];
  for (const s of socials) {
    await prisma.socialLink.create({ data: s });
  }

  // Statistics
  const stats = [
    { labelUz: "Professional tajriba", labelRu: "Лет опыта", labelEn: "Years Experience", value: "3", suffix: "+ yil", icon: "Briefcase", sortOrder: 1 },
    { labelUz: "Mamnun mijozlar", labelRu: "Довольных клиентов", labelEn: "Happy Clients", value: "127", suffix: "+", icon: "Heart", sortOrder: 2 },
    { labelUz: "Global mijozlar", labelRu: "Глобальных клиентов", labelEn: "Global Clients", value: "8", suffix: " ta", icon: "Globe", sortOrder: 3 },
    { labelUz: "Sifat kafolati", labelRu: "Гарантия качества", labelEn: "Quality Guarantee", value: "100", suffix: "%", icon: "Trophy", sortOrder: 4 },
  ];
  for (const st of stats) {
    await prisma.statistic.create({ data: st });
  }

  // Process Steps
  const processSteps = [
    {
      stepNumber: "01",
      titleUz: "Discovery & Tahlil",
      titleRu: "Аудит и Анализ",
      titleEn: "Discovery & Analysis",
      descUz: "Loyiha talablari, vazifasi va AI strategiyasi aniq belgilanadi.",
      descRu: "Определение целей, задач и визуальной концепции проекта.",
      descEn: "Defining project requirements, scope, and aesthetic objectives.",
      icon: "Search",
      sortOrder: 1,
    },
    {
      stepNumber: "02",
      titleUz: "Konsept & Moodboard",
      titleRu: "Концепт и Мудборд",
      titleEn: "Concept & Moodboard",
      descUz: "Ranglar, yoritish uslubi va dastlabki eskizlar ishlab chiqiladi.",
      descRu: "Подбор палитры, стиля освещения и начальных эскизов.",
      descEn: "Developing moodboards, lighting setups, and preliminary drafts.",
      icon: "Palette",
      sortOrder: 2,
    },
    {
      stepNumber: "03",
      titleUz: "AI & 3D Ishlov",
      titleRu: "AI и 3D Обработка",
      titleEn: "AI & 3D Engineering",
      descUz: "Ilg'or sun'iy intellekt modellari va 3D render yordamida sifatli vizual yaratish.",
      descRu: "Детальное моделирование, фотоманипуляция и рендеринг высокого разрешения.",
      descEn: "High-fidelity 3D modeling, texturing, manipulation, and rendering.",
      icon: "Layers",
      sortOrder: 3,
    },
    {
      stepNumber: "04",
      titleUz: "Nozik Sozlash & Sayqallash",
      titleRu: "Ревью и Доработка",
      titleEn: "Refinement & Polish",
      descUz: "Materiallar, rang korreksiyasi va yorug'lik akslarini mukammallashtirish.",
      descRu: "Цветокоррекция, детализация текстур и идеальная полировка.",
      descEn: "Color grading, post-processing, and finishing touches.",
      icon: "CheckCircle",
      sortOrder: 4,
    },
    {
      stepNumber: "05",
      titleUz: "Yakuniy Topshirish",
      titleRu: "Финальная Сдача",
      titleEn: "Final Hand-off",
      descUz: "Barcha yuqori sifatli fayllar, 4K/8K materiallar va manbalar topshiriladi.",
      descRu: "Передача всех 4K/8K файлов и исходных материалов.",
      descEn: "Delivery of ultra-high-resolution assets and production files.",
      icon: "Send",
      sortOrder: 5,
    },
  ];
  for (const ps of processSteps) {
    await prisma.processStep.create({ data: ps });
  }

  // Real Projects
  const projects = [
    {
      titleUz: "Hyperion Neo — 3D CGI Konsept",
      titleRu: "Hyperion Neo — 3D CGI Концепт",
      titleEn: "Hyperion Neo — 3D CGI Concept",
      slug: "hyperion-neo-3d-cgi",
      descUz: "Futuristik 3D CGI mahsulot renderi va kinematik yorug'lik effektlari.",
      descRu: "Футуристический 3D CGI концепт с кинематографичным светом.",
      descEn: "Futuristic 3D CGI product visualization with cinematic lighting.",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "3D CGI & Motion",
      subcategory: "Product Render",
      client: "Hyperion Labs",
      year: "2026",
      featured: true,
      views: 1840,
      likes: 142,
    },
    {
      titleUz: "Nordic Minimalist — Interior Visualization",
      titleRu: "Nordic Minimalist — Дизайн Интерьера",
      titleEn: "Nordic Minimalist — Interior Visualization",
      slug: "nordic-minimalist-interior",
      descUz: "Skandinaviya uslubidagi hashamatli pentxaus interyer dizayni va fotorealistik render.",
      descRu: "Скандинавский минимализм в дизайне роскошного пентхауса.",
      descEn: "Scandinavian minimalist interior visualization with photorealistic natural lighting.",
      coverImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Interior Design",
      subcategory: "Residential",
      client: "Nordic Living",
      year: "2026",
      featured: true,
      views: 2190,
      likes: 198,
    },
    {
      titleUz: "Cybernetic Surrealism — Photo Manipulation",
      titleRu: "Cybernetic Surrealism — Фотоманипуляция",
      titleEn: "Cybernetic Surrealism — Photo Manipulation",
      slug: "cybernetic-surrealism-manipulation",
      descUz: "Murakkab ko'p qatlamli fotomanipulyatsiya va syurrealistik kompozitsiya san'ati.",
      descRu: "Сложная многослойная фотоманипуляция в стиле кибернетического сюрреализма.",
      descEn: "Complex multi-layered photo manipulation exploring surreal cyberpunk aesthetics.",
      coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Photo Manipulation",
      subcategory: "Digital Art",
      client: "Artisan Collective",
      year: "2026",
      featured: true,
      views: 3100,
      likes: 312,
    },
    {
      titleUz: "Aetheria Luxury — Brand Identity",
      titleRu: "Aetheria Luxury — Бренд Айдентика",
      titleEn: "Aetheria Luxury — Brand Identity",
      slug: "aetheria-luxury-brand-identity",
      descUz: "Premium zargarlik va parfyumeriya brendi uchun to'liq vizual identifikatsiya va tipografiya.",
      descRu: "Полная визуальная айдентика для премиального бренда ювелирных изделий.",
      descEn: "Complete visual identity system and bespoke typography for luxury lifestyle brand.",
      coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: JSON.stringify([
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      ]),
      category: "Brand Identity",
      subcategory: "Luxury",
      client: "Aetheria Maison",
      year: "2026",
      featured: true,
      views: 1450,
      likes: 115,
    },
  ];

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i];
    await prisma.project.create({
      data: {
        ...p,
        status: "PUBLISHED",
        sortOrder: i + 1,
      },
    });
  }

  // Services
  const services = [
    {
      slug: "3d-cgi-motion",
      titleUz: "3D CGI & Vizual Muhandislik",
      titleRu: "3D CGI и Визуализация",
      titleEn: "3D CGI & Visual Engineering",
      shortDescUz: "Fotorealistik 3D modellar, mahsulot vizualizatsiyasi va kinematik yoritish.",
      shortDescRu: "Фотореалистичные 3D модели, рендер продуктов и кинематографичный свет.",
      shortDescEn: "Photorealistic 3D modeling, product visualization, and cinematic CGI.",
      icon: "Box",
      startingPrice: "$500",
      deliveryTime: "5-10 kun",
      category: "3D & Visual",
      featuresUz: JSON.stringify(["8K Ultra-HD Render", "Kinematik yoritish", "Mahsulot animatsiyasi"]),
      featuresRu: JSON.stringify(["8K Ultra-HD Рендер", "Кинематографичный свет", "Анимация продуктов"]),
      featuresEn: JSON.stringify(["8K Ultra-HD Render", "Cinematic lighting", "Product motion"]),
      featured: true,
      sortOrder: 1,
    },
    {
      slug: "interior-visualization",
      titleUz: "Interyer & Arxitektura Vizualizatsiyasi",
      titleRu: "Дизайн Интерьеров и Архитектура",
      titleEn: "Interior & Architectural Visualization",
      shortDescUz: "Xonadon, pentxaus, ofis va tijorat maydonlari uchun yuqori darajadagi interyer renderlari.",
      shortDescRu: "Интерьерные рендеры квартир, офисов и коммерческих пространств.",
      shortDescEn: "High-end interior design visualization and architectural lighting.",
      icon: "Layers",
      startingPrice: "$450",
      deliveryTime: "4-8 kun",
      category: "Interior Design",
      featuresUz: JSON.stringify(["360° Panorama", "Materiallar teksturasi", "Kunduzgi va tungi render"]),
      featuresRu: JSON.stringify(["360° Панорама", "Текстурирование", "Дневной и ночной свет"]),
      featuresEn: JSON.stringify(["360° Panoramas", "Custom material shaders", "Day/Night lighting"]),
      featured: true,
      sortOrder: 2,
    },
    {
      slug: "photo-manipulation",
      titleUz: "Professional Fotomanipulyatsiya",
      titleRu: "Профессиональная Фотоманипуляция",
      titleEn: "Master Photo Manipulation",
      shortDescUz: "Murakkab badiiy retush, ko'p qatlamli kompozitsiya va posterlar tayyorlash.",
      shortDescRu: "Сложная художественная ретушь, многослойные арт-постеры.",
      shortDescEn: "Complex digital art retouching, visual effects, and master key visuals.",
      icon: "Sparkles",
      startingPrice: "$300",
      deliveryTime: "3-6 kun",
      category: "Manipulation",
      featuresUz: JSON.stringify(["Badiiy kompozitsiya", "Ranglar korreksiyasi", "Chop etishga tayyor fayl"]),
      featuresRu: JSON.stringify(["Арт композиция", "Цветокоррекция", "Готовность к печати"]),
      featuresEn: JSON.stringify(["Bespoke composition", "Color grading", "Print-ready assets"]),
      featured: true,
      sortOrder: 3,
    },
  ];

  for (const s of services) {
    await prisma.service.create({
      data: {
        ...s,
        status: "PUBLISHED",
      },
    });
  }

  // Testimonials
  const testimonials = [
    {
      clientName: "Sardor Rahimov",
      clientRole: "Art Director",
      clientCompany: "Nexus Creative",
      clientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      contentUz: "Otajon bilan ishlash ajoyib tajriba bo'ldi. 3D vizuallarimiz xalqaro standart darajasida chiqdi. Tez va mukammal!",
      contentRu: "Работа с Отаджоном превзошла все ожидания. 3D визуалы мирового уровня!",
      contentEn: "Collaborating with Otajon was a masterclass in execution. Unbelievable 3D quality!",
      rating: 5,
      sortOrder: 1,
    },
    {
      clientName: "Elena Vlasova",
      clientRole: "Founder",
      clientCompany: "Lumina Interiors",
      clientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
      contentUz: "Interyer vizualizatsiyamiz mijozlarimizni lol qoldirdi. Ranglar va yorug'lik taqsimoti benuqson!",
      contentRu: "Интерьерные визуализации впечатлили всех наших клиентов. Идеальный свет!",
      contentEn: "Our interior renders stunned all our clients. Flawless light and material detailing!",
      rating: 5,
      sortOrder: 2,
    },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("✅ Bazaga barcha yangi ma'lumotlar muvaffaqiyatli yuklandi!");
}

main()
  .catch((e) => {
    console.error("❌ Seed xatosi:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
