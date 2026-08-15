import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { analyzeProjectBrief } from "@/lib/ai-analyzer";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await prisma.brief.findUnique({
      where: { id: params.id },
    });

    if (!brief) {
      return NextResponse.json({ error: "Brief topilmadi" }, { status: 404 });
    }

    let parsedTypes: string[] = [];
    try {
      parsedTypes = Array.isArray(brief.projectTypes)
        ? brief.projectTypes
        : JSON.parse(brief.projectTypes);
    } catch {
      parsedTypes = [brief.projectTypes || "Creative Direction"];
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

    const analysis = await prisma.briefAnalysis.upsert({
      where: { briefId: brief.id },
      update: {
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
      create: {
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

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
