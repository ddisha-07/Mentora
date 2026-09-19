// src/components/courses/MentoraVideoPlayer.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  RotateCw,
  Search,
  Check,
  ChevronRight,
} from "lucide-react";

export interface VideoAlternateItem {
  id?: string;
  title: string;
  youtubeId?: string;
  video_id?: string;
  channel?: string;
  duration?: string;
  duration_minutes?: number;
  durationMinutes?: number;
  summary?: string;
  relevance_reason?: string;
  xp?: number;
  thumbnailUrl?: string;
}

export interface VideoResource {
  title: string;
  video_id: string;
  url?: string;
  channel?: string;
  duration_minutes?: number;
  relevance_reason?: string;
  xp?: number;
  thumbnailUrl?: string;
  alternates?: VideoAlternateItem[];
}

interface Props {
  video: VideoResource;
  allVideos?: VideoResource[];
  onSelectVideo?: (v: VideoResource) => void;
  onComplete?: () => void;
  onFetchMoreAlternates?: () => void;
  isFetchingMore?: boolean;
}

// Clean helper to extract pure YouTube video ID
function sanitizeYouTubeId(rawIdOrUrl: string): string {
  if (!rawIdOrUrl) return "SqcY0GlETPk";
  const clean = rawIdOrUrl.trim();
  if (clean.includes("v=")) {
    const match = clean.match(/v=([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  if (clean.includes("youtu.be/")) {
    const match = clean.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  if (clean.includes("embed/")) {
    const match = clean.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  // Strip any trailing query params or slashes
  const idOnly = clean.split("?")[0].split("&")[0].split("/").pop();
  return idOnly && idOnly.length >= 8 ? idOnly : clean;
}

export default function MentoraVideoPlayer({
  video,
  allVideos = [],
  onSelectVideo,
  onComplete,
  onFetchMoreAlternates,
  isFetchingMore = false,
}: Props) {
  const [completed, setCompleted] = useState(false);
  const [activeVideo, setActiveVideo] = useState<VideoResource>(video);

  // Sync internal state when parent switches video prop
  useEffect(() => {
    setActiveVideo(video);
  }, [video.video_id, video.title]);

  const rawVideoId = activeVideo.video_id || "SqcY0GlETPk";
  const cleanVideoId = sanitizeYouTubeId(rawVideoId);
  const durationMin = activeVideo.duration_minutes || 12;
  const xpReward = activeVideo.xp || durationMin;

  // Build unified list of alternates
  const consolidatedAlternates = useMemo(() => {
    const list: VideoResource[] = [];
    const seenIds = new Set<string>();

    // 1. First add current active video
    const currentCleanId = sanitizeYouTubeId(activeVideo.video_id);
    seenIds.add(currentCleanId);
    list.push(activeVideo);

    // 2. Add video.alternates if available
    const rawAlternates = activeVideo.alternates || video.alternates || [];
    for (const alt of rawAlternates) {
      const vidId = sanitizeYouTubeId(alt.youtubeId || alt.video_id || alt.id || "");
      if (vidId && !seenIds.has(vidId)) {
        seenIds.add(vidId);
        const altMin = alt.duration_minutes || alt.durationMinutes || parseInt(alt.duration || "10") || 10;
        list.push({
          title: alt.title,
          video_id: vidId,
          channel: alt.channel || "Mentora Academy",
          duration_minutes: altMin,
          relevance_reason: alt.summary || alt.relevance_reason,
          xp: alt.xp || altMin,
          thumbnailUrl: alt.thumbnailUrl || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`,
        });
      }
    }

    // 3. Add allVideos from props
    for (const vid of allVideos) {
      const vidId = sanitizeYouTubeId(vid.video_id);
      if (vidId && !seenIds.has(vidId)) {
        seenIds.add(vidId);
        list.push(vid);
      }
    }

    return list;
  }, [activeVideo, video.alternates, allVideos]);

  // Alternate selection
  function handleSelectAlternate(selected: VideoResource) {
    setActiveVideo(selected);
    if (onSelectVideo) {
      onSelectVideo(selected);
    }
  }

  // One-click cycle to next alternate if video doesn't play
  function handleNextAlternate() {
    if (consolidatedAlternates.length <= 1) return;
    const currentIndex = consolidatedAlternates.findIndex(
      (v) => sanitizeYouTubeId(v.video_id) === cleanVideoId
    );
    const nextIndex = (currentIndex + 1) % consolidatedAlternates.length;
    const nextVideo = consolidatedAlternates[nextIndex];
    handleSelectAlternate(nextVideo);
  }

  function handleMarkComplete() {
    setCompleted(true);
    if (onComplete) onComplete();
  }

  const isDirectVideo = Boolean(
    activeVideo.url ||
    rawVideoId.startsWith("blob:") ||
    rawVideoId.startsWith("data:video/") ||
    /\.(mp4|webm|mov|m4v|ogg|avi|mkv)$/i.test(rawVideoId) ||
    (/\.(mp4|webm|mov|m4v|ogg|avi|mkv)/i.test(activeVideo.url || ""))
  );
  const directVideoSrc = activeVideo.url || rawVideoId;

  return (
    <div className="rounded-2xl border border-white/15 bg-[#0e121b]/90 backdrop-blur-xl overflow-hidden p-4 sm:p-5 shadow-2xl space-y-4 text-white">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="space-y-1 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500/25 to-amber-500/25 border border-orange-500/40 px-2.5 py-0.5 text-xs font-semibold text-orange-300">
              <Sparkles className="w-3 h-3 text-orange-400" />
              +{xpReward} XP
            </span>
            <span className="text-white/40 text-xs">•</span>
            <span className="text-white/60 text-xs font-medium">
              {durationMin} min masterclass
            </span>
            {activeVideo.channel && (
              <>
                <span className="text-white/40 text-xs">•</span>
                <span className="text-white/60 text-xs font-medium truncate max-w-[200px]">
                  {activeVideo.channel}
                </span>
              </>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-2">
            {activeVideo.title}
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Alternate Cycle Trigger */}
          {consolidatedAlternates.length > 1 && (
            <button
              onClick={handleNextAlternate}
              title="If the current video is blocked or unavailable, switch to the next verified alternate immediately"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition-all shadow-xs cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Try Next Alternate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Video View */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl">
        {isDirectVideo ? (
          <video
            key={directVideoSrc}
            src={directVideoSrc}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <iframe
            key={cleanVideoId}
            src={`https://www.youtube-nocookie.com/embed/${cleanVideoId}?autoplay=0&rel=0&modestbranding=1`}
            title={activeVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Footer Controls & Relevance Note */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-xs text-white/70 max-w-xl">
          {activeVideo.relevance_reason ? (
            <p>
              💡 <span className="text-amber-300 font-semibold">Why this video:</span>{" "}
              {activeVideo.relevance_reason}
            </p>
          ) : (
            <p>Curated learning video directly aligned with current lesson concepts.</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isDirectVideo ? (
            <a
              href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors"
            >
              Open on YouTube <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Uploaded Masterclass Video
            </span>
          )}
          <button
            onClick={handleMarkComplete}
            disabled={completed}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              completed
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white shadow-md shadow-orange-500/20"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completed ? `Completed (+${xpReward} XP)` : `Mark Watched (+${xpReward} XP)`}
          </button>
        </div>
      </div>

      {/* Video Alternates Stack (5-6 verified alternates minimum, expandable) */}
      {consolidatedAlternates.length > 1 && (
        <div className="pt-3 border-t border-white/10 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white/90">
                Curated Video Explanations & Alternates ({consolidatedAlternates.length}):
              </span>
              <span className="text-white/40 hidden sm:inline">• Click any to switch player</span>
            </div>

            {/* Optional Fetch More Alternates Button */}
            {onFetchMoreAlternates && (
              <button
                onClick={onFetchMoreAlternates}
                disabled={isFetchingMore}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs transition-all"
              >
                <Search className="w-3 h-3 text-orange-400" />
                <span>{isFetchingMore ? "Finding more..." : "Load 10+ Alternates"}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {consolidatedAlternates.map((v, idx) => {
              const vCleanId = sanitizeYouTubeId(v.video_id);
              const isCurrent = vCleanId === cleanVideoId;
              const thumbUrl =
                v.thumbnailUrl || `https://img.youtube.com/vi/${vCleanId}/hqdefault.jpg`;

              return (
                <button
                  key={`${vCleanId}-${idx}`}
                  onClick={() => handleSelectAlternate(v)}
                  className={`text-left rounded-xl border transition-all overflow-hidden flex flex-col justify-between group relative ${
                    isCurrent
                      ? "border-orange-500/80 bg-orange-500/15 ring-1 ring-orange-500/50 shadow-lg shadow-orange-500/10"
                      : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-white/80"
                  }`}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-video w-full bg-black/40 overflow-hidden">
                    <img
                      src={thumbUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to placeholder if thumbnail 404s
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {isCurrent && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                        <Check className="w-3 h-3" /> Now Playing
                      </span>
                    )}

                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 backdrop-blur-xs px-1.5 py-0.5 text-[10px] font-mono text-white/90">
                      {v.duration_minutes || 12}m
                    </span>
                  </div>

                  {/* Content snippet */}
                  <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                    <p className="font-semibold text-xs text-white line-clamp-2 leading-snug group-hover:text-orange-300 transition-colors">
                      {v.title}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-white/50 pt-1 border-t border-white/5">
                      <span className="truncate max-w-[120px] text-white/60">
                        {v.channel || "Mentora Academy"}
                      </span>
                      <span className="text-orange-400 font-semibold">
                        +{v.xp || v.duration_minutes || 10} XP
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
