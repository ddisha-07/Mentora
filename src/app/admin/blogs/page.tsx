"use client";

import { useState, useMemo, ChangeEvent } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  Search,
  Eye,
  Image as ImageIcon,
  Link as LinkIcon,
  Upload,
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  FileText,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  BookOpen
} from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import StatCard from "@/components/admin/ui/StatCard";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { BlogArticle } from "@/lib/admin/data/mockBlogs";

const CATEGORIES = [
  "Pedagogy",
  "Algorithms",
  "Credentials",
  "AI Systems",
  "Engineering",
  "Career",
  "General",
];

const PRESET_IMAGES = [
  { label: "Code & Systems", url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" },
  { label: "Analytics & Vectors", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" },
  { label: "Security & Proof", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop" },
  { label: "AI & Neural", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop" },
];

const emptyBlogDraft = {
  title: "",
  category: "Pedagogy",
  kicker: "",
  readTime: "",
  synopsis: "",
  content: "",
  imageUrl: "",
  imageMode: "url" as "url" | "upload",
  tags: "",
  takeaways: ["", "", ""],
  status: "Published" as "Published" | "Draft",
  author: "Mentora Editorial",
};

export default function AdminBlogsPage() {
  const { blogs = [], addBlog, editBlog, removeBlog, setBlogStatus } = useAdminData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusTab, setStatusTab] = useState<"All" | "Published" | "Draft">("All");

  const [formOpen, setFormOpen] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<BlogArticle | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyBlogDraft);
  const [deleteTarget, setDeleteTarget] = useState<BlogArticle | null>(null);
  const [saving, setSaving] = useState(false);

  // Filter and sort blogs numerically
  const filtered = useMemo(() => {
    const sorted = [...blogs].sort((a: BlogArticle, b: BlogArticle) => {
      const numA = parseInt(String(a.num || '').replace(/\D/g, ''), 10) || 999;
      const numB = parseInt(String(b.num || '').replace(/\D/g, ''), 10) || 999;
      return numA - numB;
    });

    return sorted.filter((b: BlogArticle) => {
      const matchesStatus = statusTab === "All" || b.status === statusTab;
      const matchesCategory = selectedCategory === "All" || b.category.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.synopsis.toLowerCase().includes(q) ||
        (b.tags && b.tags.some((t) => t.toLowerCase().includes(q)));
      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [blogs, statusTab, selectedCategory, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const published = blogs.filter((b: BlogArticle) => b.status === "Published").length;
    const drafts = blogs.filter((b: BlogArticle) => b.status === "Draft").length;
    const categoriesSet = new Set(blogs.map((b: BlogArticle) => b.category));
    return {
      total: blogs.length,
      published,
      drafts,
      categories: categoriesSet.size,
    };
  }, [blogs]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyBlogDraft);
    setFormOpen(true);
  }

  function openEdit(b: BlogArticle) {
    setEditingId(b.id);
    setDraft({
      title: b.title,
      category: b.category,
      kicker: b.kicker || "",
      readTime: b.readTime,
      synopsis: b.synopsis,
      content: Array.isArray(b.fullBody) ? b.fullBody.join("\n\n") : "",
      imageUrl: b.imageUrl || "",
      imageMode: "url",
      tags: Array.isArray(b.tags) ? b.tags.join(", ") : "",
      takeaways: b.takeaways && b.takeaways.length > 0 ? [...b.takeaways] : ["", ""],
      status: b.status || "Published",
      author: b.author || "Mentora Editorial",
    });
    setFormOpen(true);
  }

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleTakeawayChange(index: number, value: string) {
    setDraft((prev) => {
      const next = [...prev.takeaways];
      next[index] = value;
      return { ...prev, takeaways: next };
    });
  }

  function addTakeawayField() {
    setDraft((prev) => ({ ...prev, takeaways: [...prev.takeaways, ""] }));
  }

  function removeTakeawayField(index: number) {
    setDraft((prev) => ({
      ...prev,
      takeaways: prev.takeaways.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      const parsedTags = draft.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => (t.startsWith("#") ? t : `#${t}`));

      const parsedBody = draft.content
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter(Boolean);

      const cleanedTakeaways = draft.takeaways.map((t) => t.trim()).filter(Boolean);

      const wordCount = (draft.content || draft.synopsis || "").split(/\s+/).length;
      const computedReadTime = draft.readTime.trim() || `${Math.max(1, Math.ceil(wordCount / 180))} MIN READ`;

      const payload = {
        title: draft.title.trim(),
        category: draft.category,
        kicker: draft.kicker.trim() || draft.category.toUpperCase(),
        readTime: computedReadTime,
        synopsis: draft.synopsis.trim(),
        fullBody: parsedBody,
        tags: parsedTags,
        takeaways: cleanedTakeaways,
        imageUrl: draft.imageUrl.trim(),
        status: draft.status,
        author: draft.author.trim() || "Mentora Editorial",
      };

      if (editingId) {
        await editBlog(editingId, payload);
      } else {
        await addBlog(payload);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await removeBlog(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6">
      {/* Topbar */}
      <Topbar
        title="Blogs & Articles"
        subtitle="Author, publish, and manage educational articles and news across the Mentora ecosystem"
        actions={
          <Button icon={Plus} onClick={openAdd}>
            Create Blog
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Total Articles" value={stats.total} icon={BookOpen} tone="ember" />
        <StatCard label="Published" value={stats.published} icon={CheckCircle2} tone="green" />
        <StatCard label="Drafts" value={stats.drafts} icon={FileText} tone="ember" />
        <StatCard label="Categories" value={stats.categories} icon={Layers} tone="blue" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-1">
          <div className="w-full sm:w-80">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search blogs by title, tags..."
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-base-850 border border-line-soft rounded-lg px-3.5 py-2 text-xs font-mono text-ink-100 outline-none focus:border-ember-500/50"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1 glass p-1 rounded-lg shrink-0 self-start md:self-auto">
          {(["All", "Published", "Draft"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all ${
                statusTab === tab
                  ? "bg-ember-500 text-black font-bold shadow-xs"
                  : "text-ink-500 hover:text-ink-100 hover:bg-white/[0.04]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filtered.length === 0 ? (
        <GlassCard className="p-8">
          <EmptyState
            icon={Newspaper}
            title="No blogs found"
            description={
              searchQuery || selectedCategory !== "All" || statusTab !== "All"
                ? "Try adjusting your search query or filters."
                : "Author your first blog post to publish on the Mentora platform."
            }
            action={
              <Button icon={Plus} onClick={openAdd}>
                Create Blog
              </Button>
            }
          />
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((article: BlogArticle) => {
            const isPublished = article.status === "Published";

            return (
              <GlassCard
                key={article.id}
                className="group relative flex flex-col overflow-hidden transition-all duration-200 hover:border-ember-500/40 hover:shadow-ember"
              >
                {/* Cover Image Container */}
                <div className="relative h-44 w-full bg-base-900 border-b border-line-soft overflow-hidden">
                  {article.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c120c] via-[#0f0a07] to-[#1a100a] p-4 text-center">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-2">
                        <ImageIcon size={20} />
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                        {article.category}
                      </span>
                    </div>
                  )}

                  {/* Status & Category Overlay Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                      {article.category}
                    </span>
                    <Badge tone={isPublished ? "green" : "yellow"}>
                      {article.status}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 backdrop-blur-sm text-zinc-300">
                    {article.readTime}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {article.kicker && (
                      <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-ember-500">
                        {article.kicker}
                      </p>
                    )}

                    <h3 className="text-base sm:text-lg font-bold text-ink-100 tracking-tight leading-snug line-clamp-2 group-hover:text-ember-400 transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs text-ink-500 line-clamp-3 leading-relaxed">
                      {article.synopsis}
                    </p>

                    {/* Tag Pills */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-[10px] font-mono text-zinc-500">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="pt-3 border-t border-line-soft flex items-center justify-between">
                    <span className="text-[11px] font-mono text-ink-700">
                      {article.date}
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Preview Button */}
                      <button
                        type="button"
                        onClick={() => setPreviewArticle(article)}
                        title="Preview Blog Reader"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/[0.06] transition-colors"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEdit(article)}
                        title="Edit Blog"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ember-400 hover:bg-white/[0.06] transition-colors"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(article)}
                        title="Delete Blog"
                        className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-white/[0.06] transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Create / Edit Blog Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit Blog Post" : "Create New Blog Post"}
        subtitle="Add a comprehensive learning article or case study with cover image and key takeaways"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {editingId ? "Save Changes" : "Publish Blog"}
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Title */}
          <Field label="Blog Title *">
            <Input
              value={draft.title}
              onChange={(e: any) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Distributed Consensus & Raft in Production"
              required
            />
          </Field>

          {/* 2-Column: Category & Kicker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Category">
              <Select
                value={draft.category}
                onChange={(e: any) => setDraft({ ...draft, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Kicker / Eyebrow Subtitle">
              <Input
                value={draft.kicker}
                onChange={(e: any) => setDraft({ ...draft, kicker: e.target.value })}
                placeholder="e.g. DISTRIBUTED ARCHITECTURE & PEDAGOGY"
              />
            </Field>
          </div>

          {/* 2-Column: Author & Read Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Author / Byline">
              <Input
                value={draft.author}
                onChange={(e: any) => setDraft({ ...draft, author: e.target.value })}
                placeholder="e.g. Mentora Engineering Team"
              />
            </Field>

            <Field label="Read Time (Leave blank to auto-calculate)">
              <Input
                value={draft.readTime}
                onChange={(e: any) => setDraft({ ...draft, readTime: e.target.value })}
                placeholder="e.g. 6 MIN READ"
              />
            </Field>
          </div>

          {/* Image Options Section */}
          <div className="p-4 rounded-xl border border-white/10 bg-[#14161f] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-ember-500" />
                <span className="text-xs font-bold text-ink-100 font-mono uppercase tracking-wider">
                  Cover Image (Optional)
                </span>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1 bg-[#1a1d27] border border-white/10 p-0.5 rounded-md text-[11px] font-mono">
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, imageMode: "url" })}
                  className={`px-2 py-0.5 rounded ${
                    draft.imageMode === "url"
                      ? "bg-ember-500 text-black font-bold"
                      : "text-ink-400 hover:text-ink-100"
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, imageMode: "upload" })}
                  className={`px-2 py-0.5 rounded ${
                    draft.imageMode === "upload"
                      ? "bg-ember-500 text-black font-bold"
                      : "text-ink-400 hover:text-ink-100"
                  }`}
                >
                  File Upload
                </button>
              </div>
            </div>

            {/* Input based on mode */}
            {draft.imageMode === "url" ? (
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    value={draft.imageUrl}
                    onChange={(e: any) => setDraft({ ...draft, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="pl-9"
                  />
                  <LinkIcon size={14} className="absolute left-3 top-3 text-ink-500" />
                </div>

                {/* Preset Suggestions */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <span className="text-[10px] font-mono text-ink-500">Sample presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setDraft({ ...draft, imageUrl: preset.url })}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1d202b] hover:bg-[#252937] text-zinc-300 border border-white/10 transition-colors"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/15 hover:border-ember-500/50 rounded-xl p-5 cursor-pointer bg-[#101218] hover:bg-[#161822] transition-colors">
                  <Upload size={22} className="text-ink-400 mb-1.5" />
                  <span className="text-xs font-semibold text-ink-200">
                    Click to select or drag image file
                  </span>
                  <span className="text-[10px] text-ink-500 mt-0.5">
                    Supports PNG, JPG, WEBP (auto-embedded)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Live Preview of image if present */}
            {draft.imageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-line-soft h-32 w-full bg-base-900 group/img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={draft.imageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, imageUrl: "" })}
                  className="absolute top-2 right-2 p-1 rounded bg-black/80 text-white hover:text-red-400 transition-colors"
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Synopsis */}
          <Field label="Synopsis / Excerpt">
            <Textarea
              rows={2}
              value={draft.synopsis}
              onChange={(e: any) => setDraft({ ...draft, synopsis: e.target.value })}
              placeholder="Brief summary or problem statement displayed on blog cards..."
            />
          </Field>

          {/* Content / Full Body */}
          <Field label="Full Article Content *">
            <Textarea
              rows={7}
              value={draft.content}
              onChange={(e: any) => setDraft({ ...draft, content: e.target.value })}
              placeholder="Write the full body paragraphs. Separate paragraphs with a blank line..."
              required
            />
          </Field>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-ink-500">
                Key Takeaways / Action Items
              </label>
              <button
                type="button"
                onClick={addTakeawayField}
                className="text-[11px] font-mono text-ember-500 hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Takeaway
              </button>
            </div>

            <div className="space-y-2">
              {draft.takeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={takeaway}
                    onChange={(e: any) => handleTakeawayChange(idx, e.target.value)}
                    placeholder={`Takeaway #${idx + 1}`}
                  />
                  {draft.takeaways.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTakeawayField(idx)}
                      className="p-2 text-ink-600 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Field label="Tags (comma-separated)">
              <Input
                value={draft.tags}
                onChange={(e: any) => setDraft({ ...draft, tags: e.target.value })}
                placeholder="Pedagogy, Architecture, Concurrency"
              />
            </Field>

            <Field label="Publish Status">
              <Select
                value={draft.status}
                onChange={(e: any) => setDraft({ ...draft, status: e.target.value })}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>

      {/* Blog Full Reader Preview Modal */}
      {previewArticle && (
        <Modal
          open={Boolean(previewArticle)}
          onClose={() => setPreviewArticle(null)}
          title={previewArticle.title}
          subtitle={`${previewArticle.category} • ${previewArticle.date} • ${previewArticle.readTime}`}
          size="lg"
          footer={
            <Button variant="ghost" onClick={() => setPreviewArticle(null)}>
              Close Reader
            </Button>
          }
        >
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 text-ink-100">
            {/* Header Cover Banner */}
            {previewArticle.imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-line-soft h-60 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewArticle.imageUrl}
                  alt={previewArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Sub-header kicker */}
            {previewArticle.kicker && (
              <p className="text-xs font-mono font-bold uppercase tracking-widest text-ember-500">
                {previewArticle.kicker}
              </p>
            )}

            {/* Synopsis Callout Box */}
            <div className="p-4 rounded-xl border border-orange-500/30 bg-[#1e130a] text-sm leading-relaxed text-zinc-200">
              <span className="font-bold text-orange-400 block mb-1">Overview:</span>
              {previewArticle.synopsis}
            </div>

            {/* Key Takeaways */}
            {previewArticle.takeaways && previewArticle.takeaways.length > 0 && (
              <div className="p-4 rounded-xl border border-white/10 bg-[#14161f] space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-300">
                  Key Takeaways
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {previewArticle.takeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-ember-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Body Paragraphs */}
            <div className="space-y-3.5 text-sm text-zinc-300 leading-relaxed">
              {previewArticle.fullBody.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Tags Footer */}
            {previewArticle.tags && previewArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-line-soft">
                {previewArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Blog"
      />
    </div>
  );
}
