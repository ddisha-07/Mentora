// src/app/api/courses/ai/exit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import { buildEndCourseAnalysisPrompt } from "@/lib/ai/mentoraMasterPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseTitle, completedActivities, xpBreakdown } = body;

    const prompt = buildEndCourseAnalysisPrompt({
      courseTitle: courseTitle || "Course",
      completedActivities: completedActivities || {
        flashcardsCount: 0,
        videosWatchedCount: 0,
        lessonsReadCount: 0,
        dialoguesCompletedCount: 0,
        quizzesTaken: [],
      },
      xpBreakdown: xpBreakdown || {
        flashcardXP: 0,
        videoXP: 0,
        dialogueXP: 0,
        readingXP: 0,
        quizXP: 0,
        totalXP: 0,
      },
    });

    const analysis = await callGeminiJson(prompt);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("Course exit analysis error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate course exit analysis." },
      { status: 500 }
    );
  }
}
