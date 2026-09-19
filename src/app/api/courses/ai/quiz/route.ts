// src/app/api/courses/ai/quiz/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import { buildQuizEvaluationAndAnalysisPrompt } from "@/lib/ai/mentoraMasterPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, moduleTitle, questions, userAnswers } = body;

    // Action "retry": Shuffle questions and options, keeping equivalent difficulty (Rule 22)
    if (action === "retry") {
      const shuffled = (questions || []).map((q: any) => {
        const originalCorrect = q.options[q.correctAnswer ?? 0];
        // Shuffle options
        const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
        const newCorrectIdx = shuffledOpts.indexOf(originalCorrect);
        return {
          ...q,
          options: shuffledOpts,
          correctAnswer: newCorrectIdx,
        };
      }).sort(() => Math.random() - 0.5);

      return NextResponse.json({
        success: true,
        action: "retry",
        questions: shuffled,
      });
    }

    // Action "evaluate": Check score against 80% passing rule and generate analysis (Rules 21 & 23)
    const prompt = buildQuizEvaluationAndAnalysisPrompt({
      moduleTitle: moduleTitle || "Course Module",
      questions: questions || [],
      userAnswers: userAnswers || {},
    });

    const analysis = await callGeminiJson(prompt);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("Quiz evaluation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process quiz." },
      { status: 500 }
    );
  }
}
