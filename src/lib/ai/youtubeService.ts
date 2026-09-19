// src/lib/ai/youtubeService.ts
// YouTube RapidAPI integration (Search, Duration, Dalero Player, Evaluation)

import { callGeminiJson } from "./geminiClient";
import { buildVideoRankingPrompt } from "./mentoraMasterPrompt";
import { getRelevantYouTubeVideo } from "@/lib/admin/services/courseGenerationEngine";

const SEARCH_API_KEY =
  process.env.RAPIDAPI_YOUTUBE_SEARCH_KEY || "";
const SEARCH_HOST =
  process.env.RAPIDAPI_YOUTUBE_SEARCH_HOST || "youtube-v311.p.rapidapi.com";

const PLAYER_API_KEY =
  process.env.RAPIDAPI_YOUTUBE_IFRAME_KEY || "";
const PLAYER_HOST =
  process.env.RAPIDAPI_YOUTUBE_IFRAME_HOST ||
  "dalero-youtube-mp3-iframe-v1.p.rapidapi.com";

export interface CandidateVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  description: string;
  durationMinutes: number;
  rawDuration: string;
  thumbnailUrl?: string;
}

export interface RankedVideo {
  title: string;
  video_id: string;
  url: string;
  channel: string;
  duration_minutes: number;
  relevance_reason: string;
  xp: number;
  thumbnailUrl?: string;
}

/**
 * Parse ISO 8601 duration (e.g. PT14M22S, PT1H2M3S) into rounded minutes
 */
export function parseIsoDurationToMinutes(isoStr: string): number {
  if (!isoStr) return 10;
  const match = isoStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 10;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  const totalMin = hours * 60 + minutes + (seconds >= 30 ? 1 : 0);
  return Math.max(1, totalMin);
}

/**
 * Search YouTube using RapidAPI youtube-v311.p.rapidapi.com
 */
export async function searchYouTubeCandidates(
  query: string,
  maxResults = 10
): Promise<CandidateVideo[]> {
  try {
    const searchUrl = `https://${SEARCH_HOST}/search/?part=snippet&q=${encodeURIComponent(
      query
    )}&maxResults=${maxResults}&type=video`;

    const res = await fetch(searchUrl, {
      headers: {
        "x-rapidapi-key": SEARCH_API_KEY,
        "x-rapidapi-host": SEARCH_HOST,
      },
    });

    if (!res.ok) {
      console.warn(`YouTube search returned status ${res.status}: ${await res.text()}`);
      return [];
    }

    const data = await res.json();
    const items = data.items || [];
    const videoIds = items
      .map((item: any) => item.id?.videoId)
      .filter(Boolean);

    if (videoIds.length === 0) return [];

    // Fetch video duration details
    const detailsUrl = `https://${SEARCH_HOST}/videos/?part=snippet,contentDetails,statistics&id=${videoIds.join(
      ","
    )}`;

    const detailsRes = await fetch(detailsUrl, {
      headers: {
        "x-rapidapi-key": SEARCH_API_KEY,
        "x-rapidapi-host": SEARCH_HOST,
      },
    });

    const durationMap: Record<string, { durationMinutes: number; rawDuration: string }> = {};

    if (detailsRes.ok) {
      const detailsData = await detailsRes.json();
      (detailsData.items || []).forEach((v: any) => {
        const rawDuration = v.contentDetails?.duration || "PT10M";
        durationMap[v.id] = {
          rawDuration,
          durationMinutes: parseIsoDurationToMinutes(rawDuration),
        };
      });
    }

    return items
      .map((item: any) => {
        const id = item.id?.videoId;
        if (!id) return null;
        const dur = durationMap[id] || { durationMinutes: 10, rawDuration: "PT10M" };
        return {
          videoId: id,
          title: item.snippet?.title || "Educational Video",
          channelTitle: item.snippet?.channelTitle || "YouTube Channel",
          description: item.snippet?.description || "",
          durationMinutes: dur.durationMinutes,
          rawDuration: dur.rawDuration,
          thumbnailUrl:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        };
      })
      .filter((v: any): v is CandidateVideo => Boolean(v));
  } catch (err: any) {
    console.error("Failed to search YouTube candidates:", err.message);
    return [];
  }
}

/**
 * Perform full YouTube retrieval & Gemini ranking flow per Rules 12, 13, 14
 */
export async function getCuratedYouTubeVideos(spec: {
  topic: string;
  search_query: string;
  required_concepts: string[];
  difficulty: string;
  target_count?: number;
}): Promise<RankedVideo[]> {
  const targetCount = spec.target_count || 8;
  const candidates = await searchYouTubeCandidates(spec.search_query, Math.max(10, targetCount + 4));

  if (candidates.length === 0) {
    // Graceful fallback using 100% verified playable micro-topic videos with 6 alternates
    const matched = getRelevantYouTubeVideo({
      courseTitle: spec.topic,
      moduleTitle: spec.topic,
      level: spec.difficulty,
    });
    return [
      {
        title: matched.title,
        video_id: matched.youtubeId,
        url: `https://www.youtube.com/watch?v=${matched.youtubeId}`,
        channel: matched.channel,
        duration_minutes: matched.durationMinutes || 15,
        relevance_reason: matched.summary,
        xp: matched.durationMinutes || 15,
        thumbnailUrl: `https://img.youtube.com/vi/${matched.youtubeId}/hqdefault.jpg`,
      },
      ...matched.alternates.map((alt) => ({
        title: alt.title,
        video_id: alt.youtubeId,
        url: `https://www.youtube.com/watch?v=${alt.youtubeId}`,
        channel: alt.channel,
        duration_minutes: alt.durationMinutes || 15,
        relevance_reason: alt.summary,
        xp: alt.durationMinutes || 15,
        thumbnailUrl: `https://img.youtube.com/vi/${alt.youtubeId}/hqdefault.jpg`,
      })),
    ];
  }

  try {
    const prompt = buildVideoRankingPrompt(
      {
        topic: spec.topic,
        required_concepts: spec.required_concepts,
        difficulty: spec.difficulty,
        target_count: targetCount,
      },
      candidates
    );

    const rankingResult = await callGeminiJson<{ youtube_videos: RankedVideo[] }>(prompt);
    const ranked = rankingResult.youtube_videos || [];

    // Ensure thumbnail URLs and durations match real candidates
    return ranked.slice(0, targetCount).map((v) => {
      const match = candidates.find((c) => c.videoId === v.video_id);
      const dur = match ? match.durationMinutes : v.duration_minutes || 10;
      return {
        ...v,
        duration_minutes: dur,
        xp: dur, // Rule 14: XP = actual video duration in minutes
        thumbnailUrl: match?.thumbnailUrl || `https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`,
      };
    });
  } catch (err: any) {
    console.warn("Gemini video ranking failed, falling back to candidate ranking:", err.message);
    return candidates.slice(0, targetCount).map((c) => ({
      title: c.title,
      video_id: c.videoId,
      url: `https://www.youtube.com/watch?v=${c.videoId}`,
      channel: c.channelTitle,
      duration_minutes: c.durationMinutes,
      relevance_reason: `High relevance to ${spec.topic}`,
      xp: c.durationMinutes,
      thumbnailUrl: c.thumbnailUrl,
    }));
  }
}

/**
 * Fetch Dalero RapidAPI Player / Button HTML widget
 * Endpoint: /@api/button/{format}/{videoId}
 */
export async function getDaleroPlayerHtml(
  videoId: string,
  format: "mp4" | "mp3" = "mp4"
): Promise<{ html: string; embedUrl: string }> {
  const fallbackEmbed = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
  try {
    const url = `https://${PLAYER_HOST}/@api/button/${format}/${videoId}`;
    const res = await fetch(url, {
      headers: {
        "x-rapidapi-key": PLAYER_API_KEY,
        "x-rapidapi-host": PLAYER_HOST,
      },
    });

    if (res.ok) {
      const html = await res.text();
      return { html, embedUrl: fallbackEmbed };
    }
    return { html: "", embedUrl: fallbackEmbed };
  } catch (e: any) {
    console.warn("Dalero player fetch failed:", e.message);
    return { html: "", embedUrl: fallbackEmbed };
  }
}
