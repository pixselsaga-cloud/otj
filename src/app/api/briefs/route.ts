import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { analyzeProjectBrief } from "@/lib/ai-analyzer";
import { trackEvent } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";

    const where: any = {
      deletedAt: null,
    };

    if (status !== "ALL") {
      where.status = status;
    }

    const briefs = await prisma.brief.findMany({
      where,
      include: {
        analysis: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ briefs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const brief = await prisma.brief.create({
      data: {
        clientName: data.clientName,
        email: data.email,
        phone: data.phone || null,
        telegram: data.telegram || null,
        company: data.company || null,
        projectTypes: Array.isArray(data.projectTypes)
          ? JSON.stringify(data.projectTypes)
          : data.projectTypes,
        description: data.description,
        budgetRange: data.budgetRange || "Moslashuvchan",
        deadlineRange: data.deadlineRange || "3-4 hafta",
        referenceLinks: data.referenceLinks || null,
        status: "NEW",
      },
    });

    // Run AI brief analysis
    let parsedTypes: string[] = [];
    try {
      parsedTypes = Array.isArray(data.projectTypes)
        ? data.projectTypes
        : JSON.parse(data.projectTypes);
    } catch {
      parsedTypes = [data.projectTypes || "General Design"];
    }

    const aiResult = await analyzeProjectBrief({
      clientName: brief.clientName,
      company: brief.company,
      projectTypes: parsedTypes,
      description: brief.description,
      budgetRange: brief.budgetRange,
      deadlineRange: brief.deadlineRange,
      additionalInfo: brief.referenceLinks,
    });

    await prisma.briefAnalysis.create({
      data: {
        briefId: brief.id,
        summary: aiResult.summary,
        clientRequirements: JSON.stringify(aiResult.clientRequirements),
        suggestedServices: JSON.stringify(aiResult.suggestedServices),
        estimatedComplexity: aiResult.estimatedComplexity,
        urgency: aiResult.urgency,
        potentialRisks: JSON.stringify(aiResult.potentialRisks),
        recommendedNextSteps: JSON.stringify(aiResult.recommendedNextSteps),
        questionsToAsk: JSON.stringify(aiResult.questionsToAsk),
        budgetInterpretation: aiResult.budgetInterpretation,
        timelineInterpretation: aiResult.timelineInterpretation,
      },
    });

    // Create system notification
    await prisma.notification.create({
      data: {
        title: "Yangi loyiha briefi",
        message: `${brief.clientName} yangi brief yubordi (${brief.budgetRange})`,
        type: "BRIEF",
        link: `/admin/briefs/${brief.id}`,
      },
    });

    // Track analytics event
    await trackEvent({
      eventType: "brief_submit",
      path: "/request",
      entityType: "brief",
      entityId: brief.id,
      metadata: { clientName: brief.clientName, budget: brief.budgetRange },
    });

    return NextResponse.json({ success: true, briefId: brief.id });
  } catch (error: any) {
    console.error("Brief submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
