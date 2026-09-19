// src/app/api/youtube/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCuratedYouTubeVideos, searchYouTubeCandidates } from "@/lib/ai/youtubeService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, search_query, required_concepts, difficulty, target_count, raw_search_only } = body;

    if (!search_query && !topic) {
      return NextResponse.json({ error: "Missing query or topic." }, { status: 400 });
    }

    if (raw_search_only) {
      const candidates = await searchYouTubeCandidates(search_query || topic, target_count || 10);
      return NextResponse.json({ success: true, videos: candidates });
    }

    const curated = await getCuratedYouTubeVideos({
      topic: topic || "Software Engineering",
      search_query: search_query || `${topic} tutorial`,
      required_concepts: required_concepts || [topic],
      difficulty: difficulty || "Intermediate",
      target_count: target_count || 8,
    });

    return NextResponse.json({ success: true, videos: curated });
  } catch (error: any) {
    console.error("YouTube search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve YouTube resources." },
      { status: 500 }
    );
  }
}
