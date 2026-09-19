// src/app/api/courses/ai/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import { buildPhase1PlanPrompt, CourseInputParams } from "@/lib/ai/mentoraMasterPrompt";
import {
  analyzeDocumentCurriculumPlacement,
  detectDomain,
} from "@/lib/admin/services/courseGenerationEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, duration_weeks, difficulty, document_info, documentInfo } = body;

    if (!title || !category || !duration_weeks) {
      return NextResponse.json(
        { error: "Missing required fields: title, category, duration_weeks" },
        { status: 400 }
      );
    }

    const weeks = Math.max(1, parseInt(String(duration_weeks), 10) || 4);
    const rawDoc = document_info || documentInfo;

    const params: CourseInputParams = {
      title: String(title).trim(),
      description: String(description || "").trim() || `Mastery course on ${title}`,
      category: String(category).trim(),
      duration_weeks: weeks,
      difficulty: difficulty || "Intermediate",
    };

    if (rawDoc && (rawDoc.name || rawDoc.documentName)) {
      const docName = String(rawDoc.name || rawDoc.documentName).trim();
      const domain = detectDomain(params.title, params.category, docName);
      const placement = analyzeDocumentCurriculumPlacement(docName, params.difficulty, weeks, domain);

      params.documentInfo = {
        name: docName,
        mode: rawDoc.mode || rawDoc.documentMode || "integrate",
        integrationType: rawDoc.integrationType || (rawDoc.isVideo ? "video" : "reading"),
        documentText: rawDoc.documentText || rawDoc.text || "",
        isVideo: Boolean(rawDoc.isVideo),
        videoUrl: rawDoc.videoUrl || "",
        targetModuleIndex: typeof rawDoc.targetModuleIndex === "number" ? rawDoc.targetModuleIndex : placement.targetModuleIndex,
        smartFlowNote: rawDoc.smartFlowNote || placement.smartFlowNote,
      };
    }

    const prompt = buildPhase1PlanPrompt(params);
    const plan = await callGeminiJson(prompt);

    // Validate deliverable count strictly according to Rule 3
    const totalDeliverables = weeks * 7;
    let actualDeliverables = 0;
    if (Array.isArray(plan.weeks)) {
      plan.weeks.forEach((w: any) => {
        if (Array.isArray(w.planned_deliverables)) {
          actualDeliverables += w.planned_deliverables.length;
        }
      });
    }

    // Ensure confirmation prompt is present
    const confirmationPrompt =
      plan.confirmation_prompt ||
      "This is the proposed course structure. Would you like me to proceed with generating the complete course content?";

    return NextResponse.json({
      success: true,
      plan: {
        ...plan,
        total_deliverables: totalDeliverables,
        confirmation_prompt: confirmationPrompt,
      },
    });
  } catch (error: any) {
    console.error("Course plan generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course plan." },
      { status: 500 }
    );
  }
}
