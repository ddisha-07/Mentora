// src/app/api/courses/ai/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callGeminiJson } from "@/lib/ai/geminiClient";
import {
  buildPhase2GeneratePrompt,
  buildDocumentCoursePrompt,
  CourseInputParams,
} from "@/lib/ai/mentoraMasterPrompt";
import { getCuratedYouTubeVideos } from "@/lib/ai/youtubeService";
import {
  getRelevantYouTubeVideo,
  analyzeDocumentCurriculumPlacement,
  detectDomain,
} from "@/lib/admin/services/courseGenerationEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      category,
      duration_weeks,
      difficulty,
      approved_plan,
      document_info,
      documentInfo,
    } = body;

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
      description: String(description || "").trim() || `Complete course on ${title}`,
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

    // Step 1: Generate Master Course Skeleton & Content via Gemini
    const prompt = params.documentInfo
      ? buildDocumentCoursePrompt({
          ...params,
          documentName: params.documentInfo.name,
          documentMode: params.documentInfo.mode,
          integrationType: params.documentInfo.integrationType,
          documentSummaryOrText: params.documentInfo.documentText,
          isVideo: params.documentInfo.isVideo,
          videoUrl: params.documentInfo.videoUrl,
          targetModuleIndex: params.documentInfo.targetModuleIndex,
          smartFlowNote: params.documentInfo.smartFlowNote,
          approved_plan,
        })
      : buildPhase2GeneratePrompt(params, approved_plan);

    const rawCourse = await callGeminiJson(prompt);

    const modules = rawCourse.modules || [];

    // Step 2: Enrich video deliverables with real YouTube RapidAPI search and Gemini ranking
    for (let mIdx = 0; mIdx < modules.length; mIdx++) {
      const mod = modules[mIdx];
      const modWeeks = mod.weeks || [];

      for (let wIdx = 0; wIdx < modWeeks.length; wIdx++) {
        const week = modWeeks[wIdx];
        const deliverables = week.deliverables || [];

        for (let dIdx = 0; dIdx < deliverables.length; dIdx++) {
          const del = deliverables[dIdx];
          const isVideo =
            del.type?.toLowerCase().includes("youtube") ||
            del.type?.toLowerCase().includes("video") ||
            Boolean(del.video_search_spec);

          if (isVideo) {
            const spec = del.video_search_spec || {
              topic: del.title || mod.title,
              search_query: `${params.title} ${del.title || mod.title} tutorial`,
              required_concepts: [del.title || mod.title],
              difficulty: params.difficulty,
              target_count: 8,
            };

            const curatedVideos = await getCuratedYouTubeVideos({
              topic: spec.topic || del.title,
              search_query: spec.search_query || `${del.title} tutorial`,
              required_concepts: spec.required_concepts || [spec.topic],
              difficulty: params.difficulty,
              target_count: 8,
            });

            del.youtube_videos = curatedVideos;
            if (curatedVideos.length > 0) {
              del.primary_video = curatedVideos[0];
              del.xp = curatedVideos[0].xp; // Rule 14: XP = duration in minutes
            }
          }
        }
      }

      // Step 3: Ensure pass gate quiz has 10 questions and 80% passing grade
      if (!mod.quiz || !Array.isArray(mod.quiz.questions) || mod.quiz.questions.length < 10) {
        const existingQs = mod.quiz?.questions || [];
        const needed = 10 - existingQs.length;
        for (let q = 0; q < needed; q++) {
          existingQs.push({
            id: `q-${mIdx + 1}-${existingQs.length + 1}`,
            question: `In the context of ${mod.title}, what is the key best practice for concept ${q + 1}?`,
            options: [
              "Apply standard verified implementation pattern with boundary validation",
              "Execute without input validation or type constraints",
              "Bypass architectural safety checks for performance gains",
              "Ignore downstream component dependencies",
            ],
            correct_answer_index: 0,
            explanation: "Verified pattern ensures resilience and predictable behavior under load.",
            concept_tested: `${mod.title} Best Practice`,
            xp: 5,
          });
        }
        mod.quiz = {
          title: `${mod.title} Pass Gate Quiz`,
          total_questions: 10,
          passing_percentage: 80,
          passing_score: 8,
          questions: existingQs.slice(0, 10),
        };
      }
    }

    // Step 4: Map to Mentora's internal Course schema for compatibility with AiCourseStudio
    const mentoraModules = modules.map((m: any, mIdx: number) => {
      const allDeliverables: any[] = [];
      (m.weeks || []).forEach((w: any) => {
        (w.deliverables || []).forEach((d: any) => {
          allDeliverables.push(d);
        });
      });

      const subtopics = allDeliverables.length > 0
        ? allDeliverables.map((d: any, dIdx: number) => {
            const vid = d.primary_video || d.youtube_videos?.[0];
            const rawVids = Array.isArray(d.youtube_videos) ? d.youtube_videos : [];
            const dAlternates = rawVids.length > 1
              ? rawVids.slice(1).map((av: any) => ({
                  id: av.video_id,
                  youtubeId: av.video_id,
                  title: av.title,
                  channel: av.channel || "Mentora Academy",
                  duration: `${av.duration_minutes || 15} min`,
                  durationMinutes: av.duration_minutes || 15,
                  summary: av.relevance_reason || "",
                }))
              : [];
            const dCards = Array.isArray(d.flashcards)
              ? d.flashcards.map((fc: any, fcIdx: number) => ({
                  id: `fc-${mIdx + 1}-${dIdx + 1}-${fcIdx + 1}`,
                  question: fc.question,
                  answer: fc.answer,
                  tag: fc.difficulty ? `Day ${dIdx + 1} • ${fc.difficulty}` : `Day ${dIdx + 1}`,
                  explanation: fc.explanation,
                  example: fc.example,
                  xp: fc.xp || 2,
                }))
              : [];

            return {
              id: d.deliverable_id || `sub-${mIdx + 1}-${dIdx + 1}`,
              title: d.title || `Day ${dIdx + 1}: Core Deliverable`,
              type: d.type?.toLowerCase().includes("video")
                ? "video"
                : d.type?.toLowerCase().includes("exercise")
                ? "exercise"
                : d.type?.toLowerCase().includes("dialogue")
                ? "dialogue"
                : "reading",
              duration: `${d.estimated_time_minutes || 15} min`,
              summary: d.learning_purpose || d.lesson?.explanation || `In-depth exploration of ${d.title}`,
              youtubeId: vid?.video_id,
              videoTitle: vid?.title,
              channel: vid?.channel,
              videoSummary: vid?.relevance_reason || d.learning_purpose,
              alternates: dAlternates,
              flashcards: dCards,
              exercisePrompt: d.practical_example?.scenario || d.exercisePrompt,
              exerciseHint: d.dialogue?.hints?.[0] || d.exerciseHint,
              exerciseSolution: d.practical_example?.solution_breakdown || d.exerciseSolution,
              sections: [
                {
                  heading: "1. Core Architectural Breakdown",
                  body: d.lesson?.explanation || d.reading?.content || "In-depth theoretical explanation, mental model, and best practices.",
                },
                ...(d.practical_example?.code_or_instructions
                  ? [
                      {
                        heading: "2. Working Code & Implementation",
                        body: "Review the practical code pattern below:",
                        code: d.practical_example.code_or_instructions,
                      },
                    ]
                  : []),
              ],
              keyTakeaways: d.lesson?.key_takeaways || d.reading?.key_points || [`Master the core principles of ${d.title}`],
            };
          })
        : (m.subtopics || []).map((s: any, sIdx: number) => ({
            id: s.id || `sub-${mIdx + 1}-${sIdx + 1}`,
            title: s.title || `Day ${sIdx + 1}: Topic`,
            type: "reading",
            duration: "15 min",
            summary: s.summary || `Detailed guide to ${s.title}`,
            sections: [
              {
                heading: "Core Concepts",
                body: s.summary || "In-depth theoretical explanation and best practices.",
              },
            ],
            keyTakeaways: s.key_takeaways || [`Master ${s.title} fundamentals`],
          }));

      // Extract flashcards from deliverables or generate from concepts
      const moduleFlashcards: any[] = [];
      allDeliverables.forEach((d: any) => {
        if (Array.isArray(d.flashcards)) {
          d.flashcards.forEach((fc: any, fcIdx: number) => {
            moduleFlashcards.push({
              id: `fc-${mIdx + 1}-${moduleFlashcards.length + 1}`,
              question: fc.question,
              answer: fc.answer,
              tag: fc.difficulty || "Moderate",
              explanation: fc.explanation,
              example: fc.example,
              xp: fc.xp || (fc.difficulty === "Easy" ? 1 : 2),
            });
          });
        }
      });

      // Extract dialogues
      const dialogueScenarios: any[] = [];
      allDeliverables.forEach((d: any) => {
        if (d.dialogue) {
          dialogueScenarios.push({
            id: `diag-${mIdx + 1}-${dialogueScenarios.length + 1}`,
            situation: d.dialogue.scenario || d.title,
            question: d.dialogue.question,
            hint: d.dialogue.hints?.[0] || "Consider core architectural principles.",
            expectedKeywords: [params.title, d.title],
            correctExplanation: d.dialogue.expected_reasoning || "Thorough, structured explanation.",
            maxXP: d.dialogue.max_xp || 20,
          });
        }
      });

      // Primary video for this module
      const videoDeliverable = allDeliverables.find((d: any) => d.youtube_videos && d.youtube_videos.length > 0);
      const fallbackEngineVideo = getRelevantYouTubeVideo({
        courseTitle: params.title || "",
        category: params.category || "",
        moduleTitle: m.title,
        moduleIndex: mIdx,
        level: params.difficulty || "Intermediate",
        description: params.description || "",
      });

      const rawModuleVideos = videoDeliverable?.youtube_videos || [];
      const primaryVideo = rawModuleVideos[0] || {
        video_id: fallbackEngineVideo.youtubeId,
        title: fallbackEngineVideo.title,
        channel: fallbackEngineVideo.channel,
        duration_minutes: fallbackEngineVideo.durationMinutes || 15,
        relevance_reason: fallbackEngineVideo.summary,
      };

      const moduleAlternates = rawModuleVideos.length > 1
        ? rawModuleVideos.slice(1).map((av: any) => ({
            id: av.video_id,
            youtubeId: av.video_id,
            title: av.title,
            channel: av.channel || "Mentora Academy",
            duration: `${av.duration_minutes || 15} min`,
            durationMinutes: av.duration_minutes || 15,
            summary: av.relevance_reason || "",
          }))
        : fallbackEngineVideo.alternates;

      return {
        id: m.module_id || `mod-${mIdx + 1}`,
        title: m.title,
        tagline: m.purpose || `Mastery of ${m.title}`,
        subtopics: subtopics,
        lessons: subtopics,
        content: {
          title: m.title,
          readTime: "25 min",
          tagline: m.purpose || "Comprehensive instructional module",
          summary: m.introduction?.context || `Deep exploration of ${m.title}.`,
          funAnalogy: `Real-world model: Think of ${m.title} like an integrated ecosystem where every element reinforces the system.`,
          keyTakeaways: m.introduction?.learning_objectives || [`Master ${m.title}`],
        },
        video: {
          id: primaryVideo.video_id,
          youtubeId: primaryVideo.video_id,
          title: primaryVideo.title,
          channel: primaryVideo.channel,
          duration: `${primaryVideo.duration_minutes} min`,
          summary: primaryVideo.relevance_reason || `Curated tutorial on ${m.title}`,
          alternates: moduleAlternates,
          allVideos: videoDeliverable?.youtube_videos || [primaryVideo],
        },
        flashcards: moduleFlashcards,
        dialogueScenarios: dialogueScenarios,
        passGate: {
          type: "quiz",
          quiz: {
            title: m.quiz.title || `${m.title} Knowledge Pass Gate`,
            passingScore: 8,
            questions: m.quiz.questions.map((q: any, qIdx: number) => ({
              id: q.id || `q-${mIdx + 1}-${qIdx + 1}`,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer_index ?? 0,
              funFact: q.explanation || "Essential concept for production readiness.",
            })),
          },
          task: {
            missionTitle: `${m.title} Practical Implementation`,
            xpReward: 50,
            instructions: `Implement and verify the concepts learned in ${m.title}.`,
            checklist: [
              "Set up development environment",
              "Implement core logic with boundary checks",
              "Execute verification tests",
            ],
          },
        },
      };
    });

    // Step 5: Option 2 Golden Directive — Keep uploaded document/video 100% AS IT IS in right module
    if (params.documentInfo && params.documentInfo.mode === "integrate" && mentoraModules.length > 0) {
      const targetIdx = Math.min(
        Math.max(0, params.documentInfo.targetModuleIndex ?? 0),
        mentoraModules.length - 1
      );
      const targetMod = mentoraModules[targetIdx];
      if (targetMod) {
        const cleanDoc = params.documentInfo.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
        const formattedDoc = cleanDoc.charAt(0).toUpperCase() + cleanDoc.slice(1);
        const isVideoDoc = params.documentInfo.isVideo;
        const vidUrl = params.documentInfo.videoUrl;
        const docText = params.documentInfo.documentText;

        const anchorSubtopic: any = {
          id: `sub-anchor-${targetIdx + 1}`,
          title: isVideoDoc
            ? `Visual Masterclass Walkthrough: ${formattedDoc}`
            : params.documentInfo.integrationType === "reference"
            ? `Reference Guide & Cheat Sheet: ${formattedDoc}`
            : `Core Document Study: ${formattedDoc}`,
          type: isVideoDoc ? "video" : "reading",
          duration: isVideoDoc ? "15 min" : "20 min",
          summary: isVideoDoc
            ? `Direct uploaded masterclass lecture walkthrough for ${formattedDoc}.`
            : `Core technical study from uploaded document ${formattedDoc}.`,
          youtubeId: vidUrl || targetMod.video?.youtubeId,
          videoUrl: vidUrl || undefined,
          channel: isVideoDoc ? "Uploaded Video Masterclass" : (targetMod.video?.channel || "Mentora Academy"),
          videoTitle: formattedDoc,
          sections: [
            {
              heading: isVideoDoc ? "1. Video Masterclass Lecture" : `1. Verbatim Content: ${formattedDoc}`,
              body: docText && docText.trim()
                ? docText.trim()
                : `Comprehensive study distilled from uploaded source "${formattedDoc}". Contains full technical principles, implementation rules, and architectural guidelines.`,
            },
            ...(docText && docText.trim() ? [] : (targetMod.subtopics?.[0]?.sections || [])),
          ],
          keyTakeaways: [
            `Master all core principles of ${formattedDoc}.`,
            "Follow boundary validation and defensive engineering patterns.",
          ],
        };

        targetMod.subtopics = [anchorSubtopic, ...(targetMod.subtopics || []).slice(0, 6)];
        targetMod.lessons = targetMod.subtopics;
        if (isVideoDoc && vidUrl) {
          targetMod.video = {
            ...targetMod.video,
            id: vidUrl,
            youtubeId: vidUrl,
            title: formattedDoc,
            channel: "Uploaded Lecture",
            summary: `Uploaded video lecture for ${formattedDoc}`,
          };
        }
      }
    }

    return NextResponse.json({
      success: true,
      master_course: rawCourse,
      mentora_course: {
        title: params.title,
        description: params.description,
        category: params.category,
        level: params.difficulty,
        duration: `${params.duration_weeks} Weeks`,
        modules: mentoraModules,
        documentInfo: params.documentInfo,
      },
    });
  } catch (error: any) {
    console.error("Complete course generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate complete course content." },
      { status: 500 }
    );
  }
}
