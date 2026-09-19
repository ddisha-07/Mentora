// src/app/api/courses/ai/dialogue/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import { buildDialogueEvaluationPrompt } from "@/lib/ai/mentoraMasterPrompt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, scenario, question, expectedReasoning, userAnswer, hintCount } = body;

    if (action === "hint") {
      const hints = body.hints || [
        "Focus on the underlying core constraint or data flow.",
        "Consider how edge cases and boundary conditions are handled in this architecture.",
      ];
      const count = hintCount || 0;
      const hintText = count < hints.length ? hints[count] : hints[hints.length - 1];
      return NextResponse.json({
        success: true,
        action: "hint",
        hint: hintText,
        hintNumber: count + 1,
      });
    }

    if (action === "skip") {
      return NextResponse.json({
        success: true,
        action: "skip",
        message: "Question skipped. Moving to the next interaction.",
        xp_earned: 0,
      });
    }

    // Action "interactive_chat_turn": Interactive chatbot turn with dynamic follow-up back-questions
    if (action === "interactive_chat_turn") {
      const {
        expectedKeywords = [],
        conversationHistory = [],
        attemptCount = 0,
        courseTitle = "",
        moduleTitle = "",
      } = body;

      const prompt = `
You are an expert, encouraging Socratic AI tutor in Mentora (an elite technical learning platform).
Your task is to analyze the student's answer conversationally like a true pair-programming chatbot tutor.

CONTEXT:
Course/Topic: ${moduleTitle || courseTitle || "Programming & Problem Solving"}
Scenario Situation: ${scenario || "Everyday logic scenario"}
Root Question: ${question || "What is the very first step?"}
Desired Answer / Expected Reasoning: ${expectedReasoning || "Step-by-step sequential initialization"}
Key Concepts / Expected Keywords: ${JSON.stringify(expectedKeywords)}

RECENT CONVERSATION TURNS:
${conversationHistory
  .slice(-6)
  .map((m: any) => `${m.sender === "user" ? "STUDENT" : "TUTOR"}: ${m.text}`)
  .join("\n\n")}

STUDENT'S NEWEST ANSWER:
"${userAnswer}"

EVALUATION RULES:
1. DESIRED ANSWER CHECK:
   - Does the student's answer address the desired core concept or show clear correct reasoning?
   - If YES:
     - Set "is_desired_answer": true
     - Praise the student with specificity ("🎯 Spot on! That's exactly it...").
     - Explain why their reasoning is fundamentally sound and connect it to coding/computational thinking.
     - Set "bot_response" with this celebration and synthesis.
     - Set "follow_up_back_question": ""
     - Provide a rich "summary" object.
2. NOT YET DESIRED (INCOMPLETE, PARTIALLY CORRECT, OR INCORRECT):
   - Set "is_desired_answer": false
   - Acknowledge what was valid in what they said (positive reinforcement).
   - Gently highlight the gap or prerequisite step they skipped.
   - ASK A DIRECT, ENGAGING BACK-QUESTION (follow-up question) that prompts them to think about the missing concept.
   - Do NOT give away the exact answer; guide them toward it so they can discover it themselves.
   - "bot_response" MUST end with this targeted back-question.

Return JSON in this EXACT shape:
{
  "is_desired_answer": true,
  "bot_response": "Conversational response to student. If incomplete, ends with the back question.",
  "follow_up_back_question": "The specific back-question asked, or empty if desired answer reached",
  "what_was_understood": "One sentence on what the student understood",
  "missing_concept": "One sentence on what is still missing",
  "summary": {
    "concepts_mastered": ["Translating real-world steps into sequential logic", "Identifying prerequisite states before execution"],
    "takeaways": ["Programs require prerequisite setup before processing operations.", "Sequential order matters in algorithmic problem solving."],
    "score": 95
  }
}
`;

      const response = await callGeminiJson(prompt);
      return NextResponse.json({
        success: true,
        action: "interactive_chat_turn",
        ...response,
      });
    }

    // Action "answer" or "evaluate": Evaluate learner's answer
    const prompt = buildDialogueEvaluationPrompt({
      scenario: scenario || "Technical situation",
      question: question || "Core question",
      expectedReasoning: expectedReasoning || "Accurate domain reasoning",
      userAnswer: userAnswer || "",
      hintCount: hintCount || 0,
    });

    const evaluation = await callGeminiJson(prompt);

    return NextResponse.json({
      success: true,
      action: "evaluation",
      evaluation,
    });
  } catch (error: any) {
    console.error("Dialogue evaluation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to evaluate dialogue response." },
      { status: 500 }
    );
  }
}
