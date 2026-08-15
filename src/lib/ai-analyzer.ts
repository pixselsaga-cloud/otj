export interface BriefAnalysisResult {
  summary: string;
  clientRequirements: string[];
  suggestedServices: string[];
  estimatedComplexity: "Low" | "Medium" | "High" | "Extreme";
  urgency: "Low" | "Normal" | "High" | "Critical";
  potentialRisks: string[];
  recommendedNextSteps: string[];
  questionsToAsk: string[];
  budgetInterpretation: string;
  timelineInterpretation: string;
}

export async function analyzeProjectBrief(briefData: {
  clientName: string;
  email?: string;
  phone?: string | null;
  telegram?: string | null;
  company?: string | null;
  projectTypes: string[];
  description: string;
  budgetRange: string;
  deadlineRange: string;
  requiredServices?: string[];
  additionalInfo?: string | null;
}): Promise<BriefAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const descLower = briefData.description.toLowerCase();
  const typesJoined = briefData.projectTypes.join(", ");

  // Intelligent domain heuristic evaluation
  let complexity: "Low" | "Medium" | "High" | "Extreme" = "Medium";
  let urgency: "Low" | "Normal" | "High" | "Critical" = "Normal";

  // Assess complexity
  const highTechKeywords = ["3d", "cgi", "animation", "motion", "shader", "simulation", "rendering", "interactive", "platform", "full-stack", "complex", "custom"];
  const matches = highTechKeywords.filter((kw) => descLower.includes(kw) || typesJoined.toLowerCase().includes(kw));

  if (matches.length >= 4 || briefData.projectTypes.length >= 3) {
    complexity = "Extreme";
  } else if (matches.length >= 2) {
    complexity = "High";
  } else if (briefData.description.length < 60) {
    complexity = "Low";
  }

  // Assess urgency
  const urgentKeywords = ["urgent", "asap", "tezroq", "darhol", "1 hafta", "1 week", "shoshilinch", "critical", "immediately"];
  if (urgentKeywords.some((uk) => descLower.includes(uk) || briefData.deadlineRange.toLowerCase().includes("week"))) {
    urgency = "High";
  }
  if (descLower.includes("darhol") || descLower.includes("asap") || descLower.includes("critical")) {
    urgency = "Critical";
  }

  const suggestedServices: string[] = [];
  if (typesJoined.toLowerCase().includes("3d") || descLower.includes("3d") || descLower.includes("cgi")) {
    suggestedServices.push("3D CGI & Product Renders", "Cinematic Lighting & Shaders");
  }
  if (typesJoined.toLowerCase().includes("brand") || descLower.includes("logo") || descLower.includes("identity")) {
    suggestedServices.push("Brand Identity & Design System", "Visual Guidelines & Typography");
  }
  if (typesJoined.toLowerCase().includes("ui/ux") || typesJoined.toLowerCase().includes("web") || descLower.includes("app") || descLower.includes("interface")) {
    suggestedServices.push("Interactive UI/UX Design", "Figma Design System & Prototypes");
  }
  if (typesJoined.toLowerCase().includes("motion") || descLower.includes("video") || descLower.includes("animat")) {
    suggestedServices.push("Motion Graphics & Dynamic Storytelling");
  }
  if (suggestedServices.length === 0) {
    suggestedServices.push("Creative Direction & Visual Engineering", "Comprehensive Digital Strategy");
  }

  const clientRequirements = [
    `Loyiha asosiy yo'nalishi: ${briefData.projectTypes.join(", ")}`,
    `Asosiy talab: ${briefData.description.slice(0, 140)}...`,
    `Mo'ljallangan muddat: ${briefData.deadlineRange}`,
    `Mijoz byudjet diapazoni: ${briefData.budgetRange}`,
  ];

  const potentialRisks: string[] = [];
  if (complexity === "Extreme" || complexity === "High") {
    potentialRisks.push("Yuqori darajadagi render vaqt talabi va 3D modellarning texnik murakkabligi");
  }
  if (urgency === "High" || urgency === "Critical") {
    potentialRisks.push("Qisqa muddat sababli bosqichma-bosqich tasdiqlash jarayonida kechikishlar yuzaga kelishi mumkin");
  }
  if (briefData.description.length < 80) {
    potentialRisks.push("Boshlang'ich talablar qisqa, dizayn ko'lami bo'yicha qo'shimcha aniqlik kiritish zarur");
  }
  if (potentialRisks.length === 0) {
    potentialRisks.push("Standart ishlab chiqish xavflari (kutilmagan qo'shimcha o'zgartirishlar)");
  }

  const recommendedNextSteps = [
    `Mijoz (${briefData.clientName}) bilan ${briefData.telegram || briefData.phone || briefData.email} orqali 30 daqiqalik Discovery Call rejalashtirish`,
    "Dastlabki Moodboard va Vizual Reference to'plamini shakllantirish",
    "Maxsus mijoz xonasi (Client Room) ochish va bosqichli Roadmap taqdim etish",
  ];

  const questionsToAsk = [
    "Ushbu loyiha uchun avval tayyorlangan brandbook, vektor logotip yoki 3D modellar bormi?",
    "Yakuniy materiallar qaysi formatlarda (4K Video, WebGL, High-Res PNG, Figma komponentlari) topshirilishi kerak?",
    "Dizayn qarorlarini qabul qiluvchi asosiy mas'ul shaxs kim?",
  ];

  const budgetInterpretation = `Mijoz tanlagan ${briefData.budgetRange} byudjeti ${complexity} darajadagi ${briefData.projectTypes.join("/")} loyihasi uchun ${
    briefData.budgetRange.includes("5,000") || briefData.budgetRange.includes("10,000") ? "to'liq mos keladi va premium sifatni kafolatlaydi" : "standart ishlab chiqish doirasiga kiradi"
  }.`;

  const timelineInterpretation = `${briefData.deadlineRange} muddati ${urgency === "High" ? "tezkor (rush delivery) rejimida" : "standart sifatli jarayon bilan"} topshirish uchun maqbul.`;

  const summary = `${briefData.clientName}${briefData.company ? ` (${briefData.company})` : ""} tomonidan yuborilgan ${briefData.projectTypes.join(", ")} loyihasi. Talablar tahlil qilindi: umumiy murakkablik darajasi — ${complexity}, shoshilinchlik darajasi — ${urgency}.`;

  return {
    summary,
    clientRequirements,
    suggestedServices,
    estimatedComplexity: complexity,
    urgency,
    potentialRisks,
    recommendedNextSteps,
    questionsToAsk,
    budgetInterpretation,
    timelineInterpretation,
  };
}
