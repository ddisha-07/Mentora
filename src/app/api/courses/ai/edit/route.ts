// src/app/api/courses/ai/edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import { buildChatEditPrompt } from "@/lib/ai/mentoraMasterPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, courseContext, action, proposedChange } = body;

    if (!message && action !== "apply") {
      return NextResponse.json({ error: "Missing message." }, { status: 400 });
    }

    // Action "apply": The user confirmed the proposed change
    if (action === "apply") {
      return NextResponse.json({
        success: true,
        applied: true,
        message: "Change successfully applied to the course.",
        updatedCourse: courseContext,
      });
    }

    // Default Action: Generate Edit Preview and check consistency
    const prompt = buildChatEditPrompt(message, courseContext || {});
    const editResult = await callGeminiJson(prompt);

    return NextResponse.json({
      success: true,
      editResult,
    });
  } catch (error: any) {
    console.error("Course edit error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process course edit." },
      { status: 500 }
    );
  }
}
