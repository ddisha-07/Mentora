import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { blogs } from "@/db/schema";
import { desc, asc, eq } from "drizzle-orm";
import { mockBlogs, BlogArticle } from "@/lib/admin/data/mockBlogs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status");

    let results: any[] = [];

    try {
      results = await db.select().from(blogs).orderBy(asc(blogs.num), asc(blogs.createdAt));
    } catch (dbErr) {
      console.warn("Database query failed in /api/blogs GET, using fallback:", dbErr);
      results = [...mockBlogs];
    }

    if (!results || results.length === 0) {
      results = [...mockBlogs];
    }

    // Format createdAt / updatedAt strings if needed
    let formatted: BlogArticle[] = results.map((r) => ({
      id: r.id,
      num: r.num,
      category: r.category,
      tabLabel: r.tabLabel,
      subTabLabel: r.subTabLabel,
      tabPosition: r.tabPosition,
      theme: r.theme,
      primaryTabColor: r.primaryTabColor,
      date: r.date,
      readTime: r.readTime,
      title: r.title,
      kicker: r.kicker,
      synopsis: r.synopsis,
      tags: Array.isArray(r.tags) ? r.tags : [],
      takeaways: Array.isArray(r.takeaways) ? r.takeaways : [],
      fullBody: Array.isArray(r.fullBody) ? r.fullBody : [],
      imageUrl: r.imageUrl || "",
      status: r.status || "Published",
      author: r.author || "Mentora Editorial",
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : undefined,
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString().slice(0, 10) : undefined,
    }));

    if (category && category !== "All") {
      formatted = formatted.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }

    if (status && status !== "All") {
      formatted = formatted.filter((b) => b.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      formatted = formatted.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.synopsis.toLowerCase().includes(search) ||
          b.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    // Strictly sort by num ascending (01, 02, 03, 04, 05...)
    formatted.sort((a, b) => {
      const numA = parseInt(String(a.num || '').replace(/\D/g, ''), 10) || 999;
      const numB = parseInt(String(b.num || '').replace(/\D/g, ''), 10) || 999;
      return numA - numB;
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    // Get current count to determine next num
    let currentCount = 5;
    try {
      const existing = await db.select().from(blogs);
      currentCount = existing.length;
    } catch {
      // ignore
    }

    const nextNum = String(currentCount + 1).padStart(2, "0");
    const fullBodyArr = Array.isArray(body.fullBody)
      ? body.fullBody
      : body.content
      ? body.content.split("\n\n").filter(Boolean)
      : [];

    const wordCount = (fullBodyArr.join(" ") || body.synopsis || "").split(/\s+/).length;
    const computedReadTime = `${Math.max(1, Math.ceil(wordCount / 180))} MIN READ`;

    const blogId = body.id || `blg-${Date.now()}`;
    const newBlogRecord = {
      id: blogId,
      num: body.num || nextNum,
      category: body.category || "General",
      tabLabel: body.tabLabel || `ARTICLE ${nextNum}`,
      subTabLabel: body.subTabLabel || (body.category || "GENERAL").toUpperCase(),
      tabPosition: (body.tabPosition || (currentCount % 2 === 0 ? "left" : "right")) as "left" | "right",
      theme: (body.theme || "dark-charcoal") as "dark-charcoal" | "warm-amber" | "deep-espresso" | "warm-parchment",
      primaryTabColor: body.primaryTabColor || "#EA580C",
      date: body.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      readTime: body.readTime || computedReadTime,
      title: body.title.trim(),
      kicker: body.kicker || (body.category || "INSIGHTS").toUpperCase(),
      synopsis: body.synopsis || "",
      tags: Array.isArray(body.tags) ? body.tags : [],
      takeaways: Array.isArray(body.takeaways) ? body.takeaways : [],
      fullBody: fullBodyArr,
      imageUrl: body.imageUrl || "",
      status: body.status || "Published",
      author: body.author || "Mentora Editorial",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.insert(blogs).values(newBlogRecord).onConflictDoUpdate({
        target: blogs.id,
        set: {
          title: newBlogRecord.title,
          category: newBlogRecord.category,
          kicker: newBlogRecord.kicker,
          synopsis: newBlogRecord.synopsis,
          tags: newBlogRecord.tags,
          takeaways: newBlogRecord.takeaways,
          fullBody: newBlogRecord.fullBody,
          imageUrl: newBlogRecord.imageUrl,
          status: newBlogRecord.status,
          updatedAt: new Date(),
        }
      });
    } catch (insertErr) {
      console.error("Failed to insert blog into database:", insertErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...newBlogRecord,
        createdAt: newBlogRecord.createdAt.toISOString().slice(0, 10),
        updatedAt: newBlogRecord.updatedAt.toISOString().slice(0, 10),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create blog" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...patch } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is required" }, { status: 400 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (patch.title !== undefined) updateData.title = patch.title;
    if (patch.category !== undefined) updateData.category = patch.category;
    if (patch.kicker !== undefined) updateData.kicker = patch.kicker;
    if (patch.synopsis !== undefined) updateData.synopsis = patch.synopsis;
    if (patch.tags !== undefined) updateData.tags = patch.tags;
    if (patch.takeaways !== undefined) updateData.takeaways = patch.takeaways;
    if (patch.fullBody !== undefined) updateData.fullBody = patch.fullBody;
    if (patch.imageUrl !== undefined) updateData.imageUrl = patch.imageUrl;
    if (patch.status !== undefined) updateData.status = patch.status;
    if (patch.readTime !== undefined) updateData.readTime = patch.readTime;

    await db.update(blogs).set(updateData).where(eq(blogs.id, id));

    return NextResponse.json({ success: true, message: "Blog updated in database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is required" }, { status: 400 });
    }

    await db.delete(blogs).where(eq(blogs.id, id));
    return NextResponse.json({ success: true, message: "Blog deleted from database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
