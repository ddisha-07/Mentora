// src/app/api/youtube/player/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDaleroPlayerHtml } from "@/lib/ai/youtubeService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoId = searchParams.get("id") || searchParams.get("v") || "SqcY0GlETPk";
  const format = (searchParams.get("format") as "mp4" | "mp3") || "mp4";
  const mode = searchParams.get("mode") || "json";

  const { html, embedUrl } = await getDaleroPlayerHtml(videoId, format);

  if (mode === "embed") {
    if (html && html.trim().length > 0) {
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
    // Fallback: Embed YouTube player
    const fallbackIframe = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>body,html{margin:0;padding:0;width:100%;height:100%;background:#000;overflow:hidden;}iframe{width:100%;height:100%;border:0;}</style>
</head>
<body>
  <iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</body>
</html>`;
    return new NextResponse(fallbackIframe, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return NextResponse.json({
    videoId,
    format,
    hasDaleroHtml: Boolean(html && html.trim().length > 0),
    daleroHtml: html,
    embedUrl,
  });
}
