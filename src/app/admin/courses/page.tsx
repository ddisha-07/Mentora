"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, BookOpen, ChevronDown, ChevronRight,
  FolderPlus, FilePlus2, Users2, Eye,
} from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";

const CATEGORIES = ["Software Engineering", "Business", "Personal Growth", "Design", "Finance"];
const emptyCourseDraft = { title: "", category: "Software Engineering", instructor: "", coverColor: "#ff7a1a" };

export default function CoursesPage() {
  const { courses, addCourse, editCourse, removeCourse, setCourseStatus, addModule, deleteModule, addLesson, deleteLesson } = useAdminData();

  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyCourseDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [manageCourse, setManageCourse] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return courses.filter((c: any) => {
      const matchesTab = statusTab === "All" || c.status === statusTab;
      const matchesQuery = !query || c.title.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [courses, statusTab, query]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyCourseDraft);
    setFormOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setDraft({ title: c.title, category: c.category, instructor: c.instructor, coverColor: c.coverColor });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editCourse(editingId, draft);
      } else {
        await addCourse(draft);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const liveManageCourse = manageCourse ? courses.find((c: any) => c.id === manageCourse.id) : null;

  return (
    <div>
      <Topbar
        title="Courses"
        subtitle={`${courses.length} courses across the catalog`}
        actions={<Button icon={Plus} onClick={openAdd}>Create Course</Button>}
      />

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 glass rounded-lg p-1 w-fit">
          {["All", "Published", "Draft"].map((t) => (
            <button
              key={t}
              onClick={() => setStatusTab(t)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusTab === t ? "bg-ember-500 text-base-950" : "text-ink-500 hover:text-ink-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <SearchInput value={query} onChange={setQuery} placeholder="Search courses..." />
        </div>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="mt-5">
          <EmptyState icon={BookOpen} title="No courses found" description="Adjust your filters or create a new course." action={<Button icon={Plus} onClick={openAdd}>Create Course</Button>} />
        </GlassCard>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <GlassCard key={c.id} className="flex flex-col overflow-hidden">
              <div className="h-24 relative" style={{ background: `linear-gradient(135deg, ${c.coverColor}33, transparent)` }}>
                <div className="absolute top-3 right-3">
                  <Badge tone={c.status === "Published" ? "green" : "neutral"}>{c.status}</Badge>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <p className="text-xs text-ink-500">{c.category}</p>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-ink-100 font-semibold mb-1 leading-snug">{c.title}</h3>
                <p className="text-xs text-ink-500 mb-4">by {c.instructor || "Unassigned"} · {c.modules.length} modules</p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-line-soft">
                  <span className="text-xs text-ink-500 flex items-center gap-1">
                    <Users2 size={12} /> {c.enrolled} enrolled
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setManageCourse(c)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="Manage">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring" aria-label="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={c.status === "Published" ? "secondary" : "primary"}
                  className="mt-3 w-full"
                  onClick={() => setCourseStatus(c.id, c.status === "Published" ? "Draft" : "Published")}
                >
                  {c.status === "Published" ? "Move to Draft" : "Publish Course"}
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create / edit course modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit course" : "Create course"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Create course"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Course title">
            <Input value={draft.title} onChange={(e: any) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Intro to UX Research" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={draft.category} onChange={(e: any) => setDraft({ ...draft, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Instructor">
              <Input value={draft.instructor} onChange={(e: any) => setDraft({ ...draft, instructor: e.target.value })} placeholder="e.g. Amara Okafor" />
            </Field>
          </div>
          <Field label="Accent color">
            <div className="flex gap-2">
              {["#ff7a1a", "#5c8bff", "#34d399", "#c084fc", "#f87171", "#ffb74d"].map((color) => (
                <button
                  key={color}
                  onClick={() => setDraft({ ...draft, coverColor: color })}
                  className="w-8 h-8 rounded-lg transition-transform"
                  style={{ background: color, transform: draft.coverColor === color ? "scale(1.1)" : "scale(1)", boxShadow: draft.coverColor === color ? `0 0 0 2px #08090a, 0 0 0 4px ${color}` : "none" }}
                  aria-label={color}
                />
              ))}
            </div>
          </Field>
        </div>
      </Modal>

      {/* Manage modules & lessons modal */}
      <Modal
        open={!!liveManageCourse}
        onClose={() => setManageCourse(null)}
        title={liveManageCourse?.title}
        subtitle="Manage modules and lessons"
        size="lg"
      >
        {liveManageCourse && (
          <CourseCurriculum
            course={liveManageCourse}
            onAddModule={addModule}
            onDeleteModule={deleteModule}
            onAddLesson={addLesson}
            onDeleteLesson={deleteLesson}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeCourse(deleteTarget.id)}
        title="Delete course"
        description={`"${deleteTarget?.title}" and all of its modules will be permanently deleted.`}
      />
    </div>
  );
}

function CourseCurriculum({ course, onAddModule, onDeleteModule, onAddLesson, onDeleteLesson }: any) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [lessonDrafts, setLessonDrafts] = useState<Record<string, string>>({});

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function handleAddModule() {
    if (!newModuleTitle.trim()) return;
    await onAddModule(course.id, { title: newModuleTitle });
    setNewModuleTitle("");
  }

  async function handleAddLesson(moduleId: string) {
    const title = lessonDrafts[moduleId];
    if (!title?.trim()) return;
    await onAddLesson(course.id, moduleId, { title });
    setLessonDrafts((prev) => ({ ...prev, [moduleId]: "" }));
  }

  return (
    <div>
      <div className="flex gap-2 mb-5">
        <Input
          value={newModuleTitle}
          onChange={(e: any) => setNewModuleTitle(e.target.value)}
          placeholder="New module title..."
          onKeyDown={(e: any) => e.key === "Enter" && handleAddModule()}
        />
        <Button icon={FolderPlus} onClick={handleAddModule} className="shrink-0">Add Module</Button>
      </div>

      {course.modules.length === 0 ? (
        <EmptyState icon={FolderPlus} title="No modules yet" description="Add your first module to start building the curriculum." />
      ) : (
        <div className="space-y-3">
          {course.modules.map((m: any, idx: number) => (
            <GlassCard key={m.id} className="p-0 overflow-hidden">
              <button
                onClick={() => toggle(m.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {expanded[m.id] ? <ChevronDown size={15} className="text-ink-500" /> : <ChevronRight size={15} className="text-ink-500" />}
                  <span className="text-sm font-medium text-ink-100">Module {idx + 1}: {m.title}</span>
                  <Badge tone="neutral">{m.lessons.length} lessons</Badge>
                </div>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); onDeleteModule(course.id, m.id); }}
                  className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </span>
              </button>
              <AnimatePresence>
                {expanded[m.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-line-soft"
                  >
                    <div className="p-4 space-y-2">
                      {m.lessons.map((l: any) => (
                        <div key={l.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03]">
                          <span className="text-sm text-ink-300">{l.title}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-ink-500">{l.duration}</span>
                            <button onClick={() => onDeleteLesson(course.id, m.id, l.id)} className="text-ink-500 hover:text-red-400 transition-colors">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <Input
                          value={lessonDrafts[m.id] || ""}
                          onChange={(e: any) => setLessonDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))}
                          placeholder="New lesson title..."
                          onKeyDown={(e: any) => e.key === "Enter" && handleAddLesson(m.id)}
                        />
                        <Button size="sm" variant="secondary" icon={FilePlus2} onClick={() => handleAddLesson(m.id)} className="shrink-0">Add</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
