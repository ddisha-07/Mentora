import { NextRequest, NextResponse } from "next/server";
import { adminDb, FieldValue } from '@/utils/firebase/admin';

import { mockBlogs, BlogArticle } from "@/lib/admin/data/mockBlogs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status");

    let results: any[] = [];

    try {
      const blogsSnap = await adminDb.collection('blogs').orderBy('num', 'asc').get();
      if (!blogsSnap.empty) {
        results = blogsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (dbErr) {
      console.warn("Database query failed in /api/blogs GET, using fallback:", dbErr);
    }

    if (!results || results.length === 0) {
      results = [...mockBlogs];
    }

    // Format createdAt / updatedAt strings if needed
    let formatted: BlogArticle[] = results.map((r) => {
      let createdAt = r.createdAt;
      let updatedAt = r.updatedAt;
      
      if (createdAt && createdAt.toDate) createdAt = createdAt.toDate().toISOString().slice(0, 10);
      else if (createdAt) createdAt = new Date(createdAt).toISOString().slice(0, 10);
      
      if (updatedAt && updatedAt.toDate) updatedAt = updatedAt.toDate().toISOString().slice(0, 10);
      else if (updatedAt) updatedAt = new Date(updatedAt).toISOString().slice(0, 10);

      return {
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
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
    });

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
      const existing = await adminDb.collection('blogs').get();
      currentCount = existing.size;
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    try {
      await adminDb.collection('blogs').doc(blogId).set(newBlogRecord, { merge: true });
    } catch (insertErr) {
      console.error("Failed to insert blog into database:", insertErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: blogId,
        ...newBlogRecord,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
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
      updatedAt: FieldValue.serverTimestamp(),
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

    await adminDb.collection('blogs').doc(id).update(updateData);

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

    await adminDb.collection('blogs').doc(id).delete();
    return NextResponse.json({ success: true, message: "Blog deleted from database" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
