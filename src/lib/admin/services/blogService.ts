import { mockBlogs, BlogArticle } from "../data/mockBlogs";
import { uid } from "../utils";

const STORAGE_KEY = "mentora_admin_blogs";

function loadStoredBlogs(): BlogArticle[] {
  if (typeof window === "undefined") return [...mockBlogs];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load blogs from localStorage:", e);
  }
  return [...mockBlogs];
}

function saveStoredBlogs(blogs: BlogArticle[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    } catch (e) {
      console.error("Failed to persist blogs to localStorage:", e);
    }
  }
}

let _blogs: BlogArticle[] = loadStoredBlogs();

export function sortBlogsNumerically(blogs: BlogArticle[]): BlogArticle[] {
  return [...blogs].sort((a, b) => {
    const numA = parseInt(String(a.num || '').replace(/\D/g, ''), 10) || 999;
    const numB = parseInt(String(b.num || '').replace(/\D/g, ''), 10) || 999;
    return numA - numB;
  });
}

export async function getBlogs(): Promise<BlogArticle[]> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/blogs", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          _blogs = sortBlogsNumerically(json.data);
          saveStoredBlogs(_blogs);
          return [..._blogs];
        }
      }
    }
  } catch (e) {
    console.warn("Failed to fetch blogs from /api/blogs, falling back to cache:", e);
  }

  if (typeof window !== "undefined") {
    _blogs = loadStoredBlogs();
  }
  return sortBlogsNumerically(_blogs);
}

export async function addBlog(draft: Partial<BlogArticle>): Promise<BlogArticle> {
  let createdBlog: BlogArticle | null = null;

  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          createdBlog = json.data;
        }
      }
    }
  } catch (e) {
    console.error("Failed to persist blog to /api/blogs:", e);
  }

  if (!createdBlog) {
    const nextNum = String(_blogs.length + 1).padStart(2, "0");
    const wordCount = (draft.fullBody?.join(" ") || draft.synopsis || "").split(/\s+/).length;
    const computedReadTime = `${Math.max(1, Math.ceil(wordCount / 180))} MIN READ`;

    createdBlog = {
      id: uid("blg"),
      num: nextNum,
      category: draft.category || "General",
      tabLabel: `ARTICLE ${nextNum}`,
      subTabLabel: (draft.category || "GENERAL").toUpperCase(),
      tabPosition: _blogs.length % 2 === 0 ? "left" : "right",
      theme: draft.theme || "dark-charcoal",
      primaryTabColor: draft.primaryTabColor || "#EA580C",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      readTime: draft.readTime || computedReadTime,
      title: draft.title || "Untitled Blog Post",
      kicker: draft.kicker || (draft.category || "INSIGHTS").toUpperCase(),
      synopsis: draft.synopsis || "",
      tags: Array.isArray(draft.tags) ? draft.tags : [],
      takeaways: Array.isArray(draft.takeaways) ? draft.takeaways : [],
      fullBody: Array.isArray(draft.fullBody) ? draft.fullBody : draft.fullBody ? [draft.fullBody as any] : [],
      imageUrl: draft.imageUrl || "",
      status: draft.status || "Published",
      author: draft.author || "Mentora Editorial",
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      ...draft,
    };
  }

  _blogs = [createdBlog, ..._blogs.filter((b) => b.id !== createdBlog?.id)];
  saveStoredBlogs(_blogs);
  return createdBlog;
}

export async function updateBlog(id: string, patch: Partial<BlogArticle>): Promise<BlogArticle | undefined> {
  try {
    if (typeof window !== "undefined") {
      await fetch("/api/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
    }
  } catch (e) {
    console.error("Failed to update blog via /api/blogs:", e);
  }

  _blogs = _blogs.map((b) =>
    b.id === id
      ? {
          ...b,
          ...patch,
          updatedAt: new Date().toISOString().slice(0, 10),
        }
      : b
  );
  saveStoredBlogs(_blogs);
  return _blogs.find((b) => b.id === id);
}

export async function deleteBlog(id: string): Promise<{ id: string }> {
  try {
    if (typeof window !== "undefined") {
      await fetch(`/api/blogs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    }
  } catch (e) {
    console.error("Failed to delete blog via /api/blogs:", e);
  }

  _blogs = _blogs.filter((b) => b.id !== id);
  saveStoredBlogs(_blogs);
  return { id };
}

export async function setBlogStatus(id: string, status: "Published" | "Draft"): Promise<BlogArticle | undefined> {
  return updateBlog(id, { status });
}
