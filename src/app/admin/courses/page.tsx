"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, Search, BookOpen, ChevronDown, ChevronRight,
  FolderPlus, FilePlus2, Users2, Eye, Sparkles, UploadCloud,
  FileText, CheckCircle2, X, Image as ImageIcon, Globe, Bookmark,
  Target, Award, Play, Video,
  Clock, Rocket, Film, Zap, Brain, Library,
} from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import AiCourseStudio from "@/components/admin/courses/AiCourseStudio";
import AiCourseGeneratorModal from "@/components/admin/courses/AiCourseGeneratorModal";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { useTheme } from "@/context/ThemeContext";
import { uid } from "@/lib/admin/utils";
import {
  generateCurriculumFromDocument,
  analyzeDocumentCurriculumPlacement,
  parseDurationWeeks,
  detectDomain,
  generateCuratedCurriculum,
  generateFlashcardsForCourse,
  generateCheatSheetForCourse,
  generateDialogueForCourse,
  getTopicTileTemplate,
  generateCuratedVideosForCourse,
  isTemplateThumbnail,
} from "@/lib/admin/services/courseGenerationEngine";

const DURATION_OPTIONS = [
  "1 Week",
  "2 Weeks",
  "3 Weeks",
  "4 Weeks",
  "5 Weeks",
  "6 Weeks",
  "7 Weeks",
  "8 Weeks",
  "10 Weeks",
  "12 Weeks",
  "16 Weeks",
  "Self-paced",
];

const CATEGORIES = [
  "AI & Machine Learning",
  "Web Development",
  "Computer Science",
  "Software Engineering",
  "Business",
  "Personal Growth",
  "Design",
  "Finance",
];
const emptyCourseDraft = {
  title: "",
  category: "AI & Machine Learning",
  description: "",
  level: "",
  duration: "",
  thumbnail: "",
  coverColor: "#ff7a1a",
};

export default function CoursesPage() {
  const { courses, addCourse, editCourse, removeCourse, setCourseStatus, addModule, deleteModule, addLesson, deleteLesson } = useAdminData();
  const { isBright } = useTheme();

  const [query, setQuery] = useState("");
  const [statusTab, setStatusTab] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyCourseDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [manageCourse, setManageCourse] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [aiGenModalOpen, setAiGenModalOpen] = useState(false);

  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("mentora_custom_categories_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return Array.from(new Set([...CATEGORIES, ...parsed]));
          }
        }
      } catch {}
    }
    return CATEGORIES;
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");

  function handleSaveCustomCategory() {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    const updated = Array.from(new Set([...categories, trimmed]));
    setCategories(updated);
    setDraft((prev) => ({ ...prev, category: trimmed }));
    setIsAddingCategory(false);
    setCustomCategoryInput("");
    try {
      localStorage.setItem("mentora_custom_categories_v2", JSON.stringify(updated));
    } catch {}
  }

  const [studioCourse, setStudioCourse] = useState<any>(null);

  const [creationMethod, setCreationMethod] = useState<"scratch" | "document">("scratch");
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    isVideo?: boolean;
    videoUrl?: string;
  } | null>(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [docMode, setDocMode] = useState<"full" | "integrate">("full");
  const [docIntegrationType, setDocIntegrationType] = useState<"reading" | "video" | "reference">("reading");

  const filtered = useMemo(() => {
    return courses.filter((c: any) => {
      const matchesTab = statusTab === "All" || c.status === statusTab;
      const matchesQuery = !query || c.title.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [courses, statusTab, query]);

  const searchedCourses = useMemo(() => {
    if (!courseSearchQuery.trim()) return courses;
    const q = courseSearchQuery.toLowerCase();
    return courses.filter((c: any) =>
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.level?.toLowerCase().includes(q)
    );
  }, [courses, courseSearchQuery]);

  const isFormValid = Boolean(
    draft.title.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    draft.level.trim().length > 0
  );

  async function handleStartScratchStudio() {
    if (!isFormValid) return;
    let finalCategory = draft.category;
    if (isAddingCategory && customCategoryInput.trim()) {
      finalCategory = customCategoryInput.trim();
      handleSaveCustomCategory();
    }
    setSaving(true);
    try {
      const generatedModules = generateCuratedCurriculum(
        draft.title.trim(),
        finalCategory,
        draft.level,
        draft.duration || "6 Weeks",
        undefined,
        draft.description.trim()
      );
      const resources = {
        flashcards: generateFlashcardsForCourse(draft.title, finalCategory, draft.level, generatedModules),
        cheatSheet: generateCheatSheetForCourse(draft.title, finalCategory, draft.level, generatedModules),
        videos: generateCuratedVideosForCourse(draft.title, finalCategory, draft.level, generatedModules, draft.description.trim()),
        dialogueQuestions: generateDialogueForCourse(generatedModules[0]?.title || draft.title, finalCategory, draft.level),
      };
      const synchronizedModules = generatedModules.map((m: any) => {
        const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
        return {
          ...m,
          lessons: subs,
          subtopics: subs,
        };
      });
      const newCourseData = {
        ...draft,
        category: finalCategory,
        id: uid("crs"),
        status: "Draft",
        modules: synchronizedModules,
        resources,
      };
      await addCourse(newCourseData);
      setFormOpen(false);
      setStudioCourse(newCourseData);
    } finally {
      setSaving(false);
    }
  }

  function handleStartDocumentStudio() {
    if (!uploadedFile) return;

    const finalTitle =
      draft.title.trim() ||
      uploadedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
    const formattedTitle = finalTitle.charAt(0).toUpperCase() + finalTitle.slice(1);
    const finalLevel = draft.level.trim() || "Beginner";
    const finalDescription =
      draft.description.trim() ||
      `In-depth curriculum and practical masterclass synthesized from ${uploadedFile.name}.`;

    let finalCategory = draft.category;
    if (isAddingCategory && customCategoryInput.trim()) {
      finalCategory = customCategoryInput.trim();
      handleSaveCustomCategory();
    }
    if (!finalCategory || finalCategory === "Others") {
      const domain = detectDomain(formattedTitle, finalCategory || "", uploadedFile.name);
      finalCategory =
        domain === "ai_ml" ? "Artificial Intelligence" :
        domain === "web_react" ? "Web Development" :
        domain === "data_science" ? "Data Science" :
        domain === "python_backend" ? "Backend Development" :
        "General Tech";
    }

    setSaving(true);
    try {
      const generatedModules = generateCurriculumFromDocument({
        title: formattedTitle,
        category: finalCategory,
        level: finalLevel,
        duration: draft.duration || "4 Weeks",
        documentName: uploadedFile.name,
        documentMode: docMode,
        integrationType: uploadedFile.isVideo ? (docIntegrationType || "video") : docIntegrationType,
        description: finalDescription,
        isVideo: uploadedFile.isVideo,
        videoUrl: uploadedFile.videoUrl,
      });

      const videoResources = uploadedFile.isVideo && uploadedFile.videoUrl
        ? [
            {
              id: uid("vid"),
              title: formattedTitle,
              youtubeId: uploadedFile.videoUrl,
              video_id: uploadedFile.videoUrl,
              url: uploadedFile.videoUrl,
              channel: "Uploaded Lecture",
              duration: "15 min",
              summary: `Direct uploaded masterclass lecture for ${formattedTitle}.`,
              alternates: generateCuratedVideosForCourse(formattedTitle, finalCategory, finalLevel, generatedModules, finalDescription),
            },
            ...generateCuratedVideosForCourse(formattedTitle, finalCategory, finalLevel, generatedModules, finalDescription),
          ]
        : generateCuratedVideosForCourse(formattedTitle, finalCategory, finalLevel, generatedModules, finalDescription);

      const synchronizedModules = generatedModules.map((m: any) => {
        const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
        return {
          ...m,
          lessons: subs,
          subtopics: subs,
        };
      });

      setFormOpen(false);
      setStudioCourse({
        ...draft,
        title: formattedTitle,
        level: finalLevel,
        description: finalDescription,
        category: finalCategory,
        id: uid("crs"),
        status: "Draft",
        modules: synchronizedModules,
        resources: {
          flashcards: generateFlashcardsForCourse(formattedTitle, finalCategory, finalLevel, synchronizedModules),
          cheatSheet: generateCheatSheetForCourse(formattedTitle, finalCategory, finalLevel, synchronizedModules),
          videos: videoResources,
          dialogueQuestions: generateDialogueForCourse(synchronizedModules[0]?.title || formattedTitle, finalCategory, finalLevel),
        },
        documentInfo: {
          name: uploadedFile.name,
          mode: docMode,
          integrationType: uploadedFile.isVideo ? "video" : docIntegrationType,
        },
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleProceedToEditStudio() {
    if (!editingId || !isFormValid) return;
    let finalCategory = draft.category;
    if (isAddingCategory && customCategoryInput.trim()) {
      finalCategory = customCategoryInput.trim();
      handleSaveCustomCategory();
    }

    const targetCourse = courses.find((c: any) => c.id === editingId);
    if (!targetCourse) return;

    const isNewSubjectOrLevel =
      targetCourse.title.trim().toLowerCase() !== draft.title.trim().toLowerCase() ||
      targetCourse.level !== draft.level ||
      targetCourse.category !== finalCategory;

    let updatedModules = targetCourse.modules || [];
    let updatedResources = targetCourse.resources || null;

    // If title, level, or category was modified, re-calibrate content to reflect changes!
    if (isNewSubjectOrLevel || !updatedModules || updatedModules.length === 0) {
      const generated = generateCuratedCurriculum(
        draft.title,
        finalCategory,
        draft.level,
        draft.duration || "4 Weeks",
        undefined,
        draft.description
      );
      updatedModules = generated;
      updatedResources = {
        flashcards: generateFlashcardsForCourse(draft.title, finalCategory, draft.level, generated),
        cheatSheet: generateCheatSheetForCourse(draft.title, finalCategory, draft.level, generated),
        videos: (targetCourse.resources?.videos && targetCourse.resources.videos.length > 0 && !targetCourse.resources.videos.some((v: any) => v.youtubeId === "aircAruvnKk"))
          ? targetCourse.resources.videos
          : generateCuratedVideosForCourse(draft.title, finalCategory, draft.level, generated, draft.description),
        dialogueQuestions: generateDialogueForCourse(generated[0]?.title || draft.title, finalCategory, draft.level),
      };
    }

    // Always keep subtopics and lessons synchronized
    const synchronizedModules = updatedModules.map((m: any) => {
      const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
      return {
        ...m,
        lessons: subs,
        subtopics: subs,
      };
    });

    const customThumb = draft.thumbnail.trim();
    const hasCustomThumbnail = Boolean(customThumb && !isTemplateThumbnail(customThumb));

    const updated = {
      ...targetCourse,
      ...draft,
      thumbnail: hasCustomThumbnail ? customThumb : (targetCourse?.hasCustomThumbnail && !isTemplateThumbnail(targetCourse.thumbnail) ? targetCourse.thumbnail : ""),
      hasCustomThumbnail,
      category: finalCategory,
      modules: synchronizedModules,
      resources: updatedResources,
    };

    setSaving(true);
    try {
      await editCourse(editingId, updated);
      setFormOpen(false);
      setStudioCourse(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleStudioSaveDraft(courseData: any) {
    const exists = courses.some((c: any) => c.id === courseData.id);
    const synchronizedModules = (courseData.modules || []).map((m: any) => {
      const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
      return {
        ...m,
        lessons: subs,
        subtopics: subs,
      };
    });

    const fullCourseData = {
      ...courseData,
      modules: synchronizedModules,
      status: "Draft",
    };

    if (exists) {
      await editCourse(courseData.id, fullCourseData);
    } else {
      await addCourse(fullCourseData);
    }
    setStudioCourse(null);
    setStatusTab("Draft");
  }

  async function handleStudioPublish(courseData: any) {
    const exists = courses.some((c: any) => c.id === courseData.id);
    const synchronizedModules = (courseData.modules || []).map((m: any) => {
      const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
      return {
        ...m,
        lessons: subs,
        subtopics: subs,
      };
    });

    const fullCourseData = {
      ...courseData,
      modules: synchronizedModules,
      status: "Published",
    };

    if (exists) {
      await editCourse(courseData.id, fullCourseData);
    } else {
      await addCourse(fullCourseData);
    }
    setStudioCourse(null);
    setStatusTab("Published");
  }

  function openAdd() {
    setEditingId(null);
    setDraft(emptyCourseDraft);
    setIsAddingCategory(false);
    setCustomCategoryInput("");
    setCreationMethod("scratch");
    setUploadedFile(null);
    setIsParsingDoc(false);
    setDocMode("full");
    setDocIntegrationType("reading");
    setFormOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setIsAddingCategory(false);
    setCustomCategoryInput("");
    setCourseSearchQuery("");
    if (c.category && !categories.includes(c.category)) {
      setCategories((prev) => Array.from(new Set([...prev, c.category])));
    }
    const hasCustom = Boolean(c.hasCustomThumbnail && c.thumbnail?.trim() && !isTemplateThumbnail(c.thumbnail));
    setDraft({
      title: c.title,
      category: c.category,
      description: c.description || "",
      level: c.level || "",
      duration: c.duration || "",
      thumbnail: hasCustom ? (c.thumbnail || "") : "",
      coverColor: c.coverColor || "#ff7a1a",
    });
    setFormOpen(true);
  }

  function openTopEdit() {
    if (courses.length === 0) return;
    openEdit(courses[0]);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsParsingDoc(true);
    const sizeStr =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(file.name);

    // Auto-fill course title, level, description, and category if still empty
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
    const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    const domain = detectDomain(cleanName, draft.category || "", file.name);
    const suggestedCategory =
      domain === "ai_ml" ? "Artificial Intelligence" :
      domain === "web_react" ? "Web Development" :
      domain === "data_science" ? "Data Science" :
      domain === "python_backend" ? "Backend Development" :
      domain === "database_sql" ? "Database" :
      domain === "devops_cloud" ? "DevOps & Cloud" :
      domain === "cybersecurity" ? "Cybersecurity" :
      domain === "mobile_app" ? "Mobile Development" :
      draft.category || "General Tech";

    const inferredLevel =
      /\b(advanced|expert|hard|master)\b/i.test(file.name) ? "Advanced" :
      /\b(intermediate|mid)\b/i.test(file.name) ? "Intermediate" :
      "Beginner";

    setDraft((prev) => ({
      ...prev,
      title: prev.title.trim() || formattedTitle,
      level: prev.level.trim() || inferredLevel,
      description:
        prev.description.trim() ||
        `In-depth curriculum and practical masterclass synthesized from ${file.name}. Covers foundational mental models, guided exercises, and capstone implementations.`,
      category: prev.category && prev.category !== "Others" && prev.category !== "Web Development" ? prev.category : suggestedCategory,
    }));

    if (isVideo) {
      setDocIntegrationType("video");
    }

    let vidUrl: string | undefined;
    if (isVideo && typeof window !== "undefined" && window.URL) {
      try {
        vidUrl = URL.createObjectURL(file);
      } catch {}
    }

    setTimeout(() => {
      setUploadedFile({
        name: file.name,
        size: sizeStr,
        isVideo,
        videoUrl: vidUrl,
      });
      setIsParsingDoc(false);
    }, 350);
  }

  async function handleSave(methodOverride?: "scratch" | "document") {
    if (!isFormValid) return;
    let finalCategory = draft.category;
    if (isAddingCategory && customCategoryInput.trim()) {
      finalCategory = customCategoryInput.trim();
      handleSaveCustomCategory();
    }
    const currentDraft = { ...draft, category: finalCategory };
    const method = methodOverride || creationMethod;
    setSaving(true);
    try {
      if (editingId) {
        const targetCourse = courses.find((c: any) => c.id === editingId);
        const isNewSubjectOrLevel =
          targetCourse &&
          (targetCourse.title.trim().toLowerCase() !== currentDraft.title.trim().toLowerCase() ||
            targetCourse.level !== currentDraft.level ||
            targetCourse.category !== currentDraft.category ||
            targetCourse.description?.trim().toLowerCase() !== currentDraft.description?.trim().toLowerCase());

        let updatedModules = targetCourse?.modules || [];
        let updatedResources = targetCourse?.resources || null;

        // If title, level, category, or description was modified, re-calibrate content to reflect changes!
        if (isNewSubjectOrLevel) {
          const generated = generateCuratedCurriculum(
            currentDraft.title,
            currentDraft.category,
            currentDraft.level,
            currentDraft.duration || "4 Weeks",
            undefined,
            currentDraft.description
          );
          updatedModules = generated;
          updatedResources = {
            flashcards: generateFlashcardsForCourse(currentDraft.title, currentDraft.category, currentDraft.level, generated),
            cheatSheet: generateCheatSheetForCourse(currentDraft.title, currentDraft.category, currentDraft.level, generated),
            videos: (targetCourse?.resources?.videos && targetCourse.resources.videos.length > 0 && !targetCourse.resources.videos.some((v: any) => v.youtubeId === "aircAruvnKk"))
              ? targetCourse.resources.videos
              : generateCuratedVideosForCourse(currentDraft.title, currentDraft.category, currentDraft.level, generated, currentDraft.description),
            dialogueQuestions: generateDialogueForCourse(generated[0]?.title || currentDraft.title, currentDraft.category, currentDraft.level),
          };
        }

        const synchronizedModules = updatedModules.map((m: any) => {
          const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
          return {
            ...m,
            lessons: subs,
            subtopics: subs,
          };
        });

        const customThumb = currentDraft.thumbnail.trim();
        const hasCustomThumbnail = Boolean(customThumb && !isTemplateThumbnail(customThumb));

        const fullUpdated = {
          ...targetCourse,
          ...currentDraft,
          thumbnail: hasCustomThumbnail ? customThumb : (targetCourse?.hasCustomThumbnail && !isTemplateThumbnail(targetCourse.thumbnail) ? targetCourse.thumbnail : ""),
          hasCustomThumbnail,
          modules: synchronizedModules,
          resources: updatedResources,
        };

        await editCourse(editingId, fullUpdated);
        setFormOpen(false);
      } else {
        let initialModules: any[] = [];
        let initialResources: any = null;
        if (method === "document" && uploadedFile) {
          initialModules = generateCurriculumFromDocument({
            title: draft.title.trim(),
            category: finalCategory,
            level: draft.level,
            duration: draft.duration || "4 Weeks",
            documentName: uploadedFile.name,
            documentMode: docMode,
            integrationType: uploadedFile.isVideo ? (docIntegrationType || "video") : docIntegrationType,
            description: draft.description,
            isVideo: uploadedFile.isVideo,
            videoUrl: uploadedFile.videoUrl,
          });
          const curatedVids = generateCuratedVideosForCourse(draft.title, finalCategory, draft.level, initialModules, draft.description);
          initialResources = {
            flashcards: generateFlashcardsForCourse(draft.title, finalCategory, draft.level, initialModules),
            cheatSheet: generateCheatSheetForCourse(draft.title, finalCategory, draft.level, initialModules),
            videos: uploadedFile.isVideo && uploadedFile.videoUrl
              ? [
                  {
                    id: uid("vid"),
                    title: draft.title.trim() || uploadedFile.name,
                    youtubeId: uploadedFile.videoUrl,
                    video_id: uploadedFile.videoUrl,
                    url: uploadedFile.videoUrl,
                    channel: "Uploaded Lecture",
                    duration: "15 min",
                    summary: `Uploaded video masterclass lecture for ${draft.title}.`,
                    alternates: curatedVids,
                  },
                  ...curatedVids,
                ]
              : curatedVids,
            dialogueQuestions: generateDialogueForCourse(initialModules[0]?.title || draft.title, finalCategory, draft.level),
          };
        } else {
          // Generate curated 4-phase pedagogical curriculum for scratch course
          initialModules = generateCuratedCurriculum(
            draft.title.trim(),
            finalCategory,
            draft.level,
            draft.duration || "4 Weeks",
            undefined,
            draft.description.trim()
          );
          initialResources = {
            flashcards: generateFlashcardsForCourse(draft.title, finalCategory, draft.level, initialModules),
            cheatSheet: generateCheatSheetForCourse(draft.title, finalCategory, draft.level, initialModules),
            videos: generateCuratedVideosForCourse(draft.title, finalCategory, draft.level, initialModules, draft.description.trim()),
            dialogueQuestions: generateDialogueForCourse(initialModules[0]?.title || draft.title, finalCategory, draft.level),
          };
        }

        const synchronizedModules = initialModules.map((m: any) => {
          const subs = m.subtopics && m.subtopics.length > 0 ? m.subtopics : (m.lessons || []);
          return {
            ...m,
            lessons: subs,
            subtopics: subs,
          };
        });

        const newCourse = await addCourse({
          ...draft,
          category: finalCategory,
          modules: synchronizedModules,
          resources: initialResources,
          status: "Draft",
        });
        setFormOpen(false);
        setManageCourse(newCourse);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAiCourseCreated(courseData: any) {
    const newCourse = await addCourse({
      ...courseData,
      status: "Draft",
    });
    if (newCourse) {
      setManageCourse(newCourse);
    }
  }

  const liveManageCourse = manageCourse ? courses.find((c: any) => c.id === manageCourse.id) : null;

  return (
    <div>
      <Topbar
        title="Courses"
        subtitle={`${courses.length} courses across the catalog`}
        actions={
          <div className="flex items-center gap-2.5">
            <Button icon={Plus} onClick={openAdd}>Create Course</Button>
            <Button icon={Pencil} onClick={openTopEdit} disabled={courses.length === 0}>Edit Course</Button>
          </div>
        }
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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((c: any) => {
            const totalLessons = (c.modules || []).reduce(
              (acc: number, m: any) => acc + (m.lessons?.length || 0),
              0
            );
            const tileTemplate = getTopicTileTemplate(c);
            const hasCustom = Boolean(c.hasCustomThumbnail && c.thumbnail?.trim() && !isTemplateThumbnail(c.thumbnail));
            const tileThumbnail = hasCustom ? c.thumbnail.trim() : tileTemplate.thumbnail;
            const tileDescription = c.description?.trim() || tileTemplate.description;
            const tileCoverColor = c.coverColor?.trim() || tileTemplate.accentColor;

            return (
              <div
                key={c.id}
                className={`rounded-2xl overflow-hidden transition-all duration-200 flex flex-col group ${
                  isBright
                    ? "bg-white border border-slate-200/80 shadow-sm hover:shadow-lg text-slate-900"
                    : "glass rounded-2xl border border-white/[0.08] shadow-glass hover:border-white/[0.16] text-ink-100"
                }`}
              >
                {/* Top Image Banner */}
                <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950">
                  <img
                    src={tileThumbnail}
                    alt={c.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = tileTemplate.thumbnail;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Topic-specific gradient ambient tint */}
                  <div
                    className={`absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay ${tileTemplate.gradientClass}`}
                  />
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      isBright
                        ? "bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        : "bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                    }`}
                  />

                  {/* Category Pill in top-left */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm tracking-tight shadow-md ${
                        isBright
                          ? "bg-white/95 text-slate-900"
                          : "bg-base-950/85 text-ink-100 border border-white/10"
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: tileCoverColor }}
                      />
                      {c.category || tileTemplate.badgeLabel}
                    </span>
                  </div>

                  {/* Admin controls in top-right */}
                  <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
                    <button
                      onClick={() => setCourseStatus(c.id, c.status === "Published" ? "Draft" : "Published")}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md transition-all shadow-sm cursor-pointer ${
                        c.status === "Published"
                          ? isBright
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : isBright
                          ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-emerald-500 hover:text-white"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-emerald-500/30 hover:text-emerald-200"
                      }`}
                      title={c.status === "Draft" ? "Click to Publish course" : "Click to move to Drafts"}
                    >
                      {c.status}
                    </button>
                    <button
                      onClick={() => openEdit(c)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isBright
                          ? "bg-black/50 hover:bg-black/80 text-white"
                          : "bg-base-950/70 hover:bg-white/15 text-ink-300 hover:text-ink-100 border border-white/10"
                      }`}
                      aria-label="Edit course"
                      title="Edit course"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isBright
                          ? "bg-black/50 hover:bg-red-600 text-white"
                          : "bg-base-950/70 hover:bg-red-500/30 text-ink-300 hover:text-red-400 border border-white/10"
                      }`}
                      aria-label="Delete course"
                      title="Delete course"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className={`p-5 flex flex-col flex-1 transition-colors ${
                    isBright ? "bg-white text-slate-900" : "bg-transparent text-ink-100"
                  }`}
                >
                  {/* Title */}
                  <h3
                    className={`font-bold text-lg leading-snug tracking-tight line-clamp-1 transition-colors ${
                      isBright
                        ? "text-slate-900 group-hover:text-ember-600"
                        : "text-ink-100 group-hover:text-ember-400"
                    }`}
                  >
                    {c.title}
                  </h3>

                  {/* Description (2 lines clamp) */}
                  <p
                    className={`text-xs sm:text-sm line-clamp-2 mt-2 leading-relaxed min-h-[2.5rem] ${
                      isBright ? "text-slate-500" : "text-ink-500"
                    }`}
                  >
                    {tileDescription}
                  </p>

                  {/* Metadata Row: Level Dot, Duration, Modules, Lessons */}
                  <div
                    className={`mt-4 text-xs font-normal flex flex-wrap items-center gap-x-2 gap-y-1 ${
                      isBright ? "text-slate-500" : "text-ink-500"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          c.level === "Beginner"
                            ? "bg-emerald-500"
                            : c.level === "Advanced"
                            ? "bg-purple-500"
                            : "bg-amber-500"
                        }`}
                      />
                      <span className={isBright ? "text-slate-700 font-medium" : "text-ink-300 font-medium"}>
                        {c.level || "Beginner"}
                      </span>
                    </span>
                    {c.duration && (
                      <>
                        <span>·</span>
                        <span>{c.duration}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{c.modules?.length || 0} Modules</span>
                    <span>·</span>
                    <span>{totalLessons} Lessons</span>
                  </div>

                  {/* Divider & Footer */}
                  <div
                    className={`mt-5 pt-3.5 border-t flex items-center justify-between ${
                      isBright ? "border-slate-100" : "border-line-soft"
                    }`}
                  >
                    <span
                      className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${
                        isBright ? "text-slate-500" : "text-ink-500"
                      }`}
                    >
                      <Users2 size={15} className={isBright ? "text-slate-400" : "text-ink-500"} />
                      <span>{(c.enrolled || 0).toLocaleString()} students</span>
                    </span>

                    <button
                      onClick={() => setManageCourse(c)}
                      className={`inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                        isBright
                          ? "bg-ember-500 hover:bg-ember-600 text-white shadow-sm"
                          : "bg-ember-500 hover:bg-ember-400 text-base-950 shadow-ember font-semibold"
                      }`}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / edit course modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit Course" : "Create New Course"}
        subtitle={
          editingId
            ? "Update course information and settings"
            : "Fill in the required information to create this course"
        }
        size="lg"
        footer={
          editingId ? (
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                {!isFormValid && (
                  <span className={`text-[11px] font-medium ${isBright ? "text-amber-700" : "text-amber-400"} hidden sm:inline`}>
                    {!draft.title.trim()
                      ? "• Title required"
                      : !draft.description.trim()
                      ? "• Description required to generate content"
                      : "• Difficulty level required"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  icon={Sparkles}
                  onClick={handleProceedToEditStudio}
                  disabled={saving || !isFormValid}
                  className="font-bold bg-gradient-to-r from-amber-500 to-ember-500 text-white shadow-ember/20 cursor-pointer"
                >
                  Proceed to Edit Studio
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setFormOpen(false)}>
                  Cancel
                </Button>
                {creationMethod === "scratch" && !isFormValid && (
                  <span className={`text-[11px] font-medium ${isBright ? "text-amber-700" : "text-amber-400"} hidden sm:inline`}>
                    {!draft.title.trim()
                      ? "• Title required"
                      : !draft.description.trim()
                      ? "• Description required to generate content"
                      : "• Difficulty level required"}
                  </span>
                )}
                {creationMethod === "document" && !uploadedFile && (
                  <span className={`text-[11px] font-medium ${isBright ? "text-amber-700" : "text-amber-400"} hidden sm:inline`}>
                    • Please choose a document or video file above to proceed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {creationMethod === "scratch" ? (
                  <Button
                    icon={Sparkles}
                    onClick={handleStartScratchStudio}
                    disabled={saving || !isFormValid}
                    className="font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    {saving ? "Generating Course with Mentora AI..." : "Generate Course with Mentora AI"}
                  </Button>
                ) : (
                  <Button
                    icon={Sparkles}
                    onClick={handleStartDocumentStudio}
                    disabled={saving || !uploadedFile}
                    className="font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Calibrating Studio..."
                      : !uploadedFile
                      ? "Upload Document First"
                      : "Generate & Open in AI Studio"}
                  </Button>
                )}
              </div>
            </div>
          )
        }
      >
        <div className="space-y-4">
          {editingId && (
            <div
              className={`p-4 rounded-2xl border space-y-3 ${
                isBright ? "bg-amber-500/5 border-amber-300/60" : "bg-white/[0.03] border-white/10"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold uppercase tracking-wider ${isBright ? "text-slate-800" : "text-ink-100"} flex items-center gap-1.5`}>
                  <Search size={14} className="text-amber-500" /> Search & Select Course to Edit:
                </label>
                <span className={`text-[11px] ${isBright ? "text-slate-500" : "text-ink-400"}`}>
                  {courses.length} courses in catalog
                </span>
              </div>

              {/* Search input with icon */}
              <div className="relative">
                <Input
                  value={courseSearchQuery}
                  onChange={(e: any) => setCourseSearchQuery(e.target.value)}
                  placeholder="Type to search by title, category, or level..."
                  className="w-full pl-9 text-xs sm:text-sm"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                {courseSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setCourseSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-ink-200 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Scrollable Course Selection Cards */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
                {searchedCourses.length === 0 ? (
                  <div className={`p-4 text-center text-xs ${isBright ? "text-slate-400" : "text-ink-500"}`}>
                    No courses found matching "{courseSearchQuery}".
                  </div>
                ) : (
                  searchedCourses.map((c: any) => {
                    const isSelected = c.id === editingId;
                    return (
                      <div
                        key={c.id}
                        onClick={() => {
                          setEditingId(c.id);
                          const hasCustom = Boolean(c.hasCustomThumbnail && c.thumbnail?.trim() && !isTemplateThumbnail(c.thumbnail));
                          setDraft({
                            title: c.title,
                            category: c.category,
                            description: c.description || "",
                            level: c.level || "",
                            duration: c.duration || "",
                            thumbnail: hasCustom ? (c.thumbnail || "") : "",
                            coverColor: c.coverColor || "#ff7a1a",
                          });
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? isBright
                              ? "bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                              : "bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/30"
                            : isBright
                            ? "bg-white hover:bg-slate-100 border-slate-200"
                            : "bg-base-950/60 hover:bg-white/5 border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={(c.hasCustomThumbnail && c.thumbnail?.trim() && !isTemplateThumbnail(c.thumbnail)) ? c.thumbnail.trim() : getTopicTileTemplate(c).thumbnail}
                            alt={c.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = getTopicTileTemplate(c).thumbnail;
                            }}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-xs sm:text-sm truncate">{c.title}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  c.status === "Published"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                }`}
                              >
                                {c.status}
                              </span>
                            </div>
                            <div className={`text-[11px] ${isBright ? "text-slate-500" : "text-ink-400"} flex items-center gap-1.5 mt-0.5`}>
                              <span>{c.category}</span>
                              <span>•</span>
                              <span>{c.level || "Beginner"}</span>
                              <span>•</span>
                              <span>{c.modules?.length || 0} Modules</span>
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="shrink-0 text-xs font-bold text-amber-500 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Selected
                          </span>
                        ) : (
                          <span className="shrink-0 text-xs text-slate-400 group-hover:text-amber-500">
                            Select →
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <Field label="Course title *">
            <Input
              value={draft.title}
              onChange={(e: any) => setDraft({ ...draft, title: e.target.value })}
              placeholder="e.g. Machine Learning Fundamentals"
            />
          </Field>

          <Field label="Course description *">
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(e: any) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Course description is necessary (curriculum & lessons will be generated based on this description)..."
            />
            <p className={`text-[11px] mt-1 ${isBright ? "text-slate-500" : "text-ink-500"}`}>
              <span className="text-amber-500 font-semibold">* Required:</span> Mentora AI uses your description to tailor topics, syllabus depth, and practical lessons.
            </p>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Category *">
              <Select
                value={isAddingCategory ? "Others" : draft.category}
                onChange={(e: any) => {
                  const val = e.target.value;
                  if (val === "Others") {
                    setIsAddingCategory(true);
                    setDraft({ ...draft, category: customCategoryInput || "Other" });
                  } else {
                    setIsAddingCategory(false);
                    setDraft({ ...draft, category: val });
                  }
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Others">Others / Add Custom Category...</option>
              </Select>
            </Field>

            <Field label="Difficulty level *">
              <Select
                value={draft.level}
                onChange={(e: any) => setDraft({ ...draft, level: e.target.value })}
              >
                <option value="">Select difficulty...</option>
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Duration">
              <Select
                value={draft.duration}
                onChange={(e: any) => setDraft({ ...draft, duration: e.target.value })}
              >
                <option value="">Select duration...</option>
                {draft.duration && !DURATION_OPTIONS.includes(draft.duration) && (
                  <option value={draft.duration}>{draft.duration}</option>
                )}
                {DURATION_OPTIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Add Custom Category Field (Triggered when user selects 'Others') */}
          {isAddingCategory && (
            <div
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 ${
                isBright
                  ? "bg-amber-500/10 border-amber-300 text-slate-900"
                  : "bg-amber-500/10 border-amber-500/30 text-ink-100"
              }`}
            >
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1 flex items-center gap-1.5">
                  <Sparkles size={13} /> Enter Custom Category Name:
                </span>
                <Input
                  value={customCategoryInput}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    setCustomCategoryInput(val);
                    setDraft({ ...draft, category: val || "Other" });
                  }}
                  placeholder="e.g. Data Analytics, Cloud Security, DevOps, Mobile..."
                  autoFocus
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSaveCustomCategory();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  onClick={handleSaveCustomCategory}
                  disabled={!customCategoryInput.trim()}
                  className="font-bold cursor-pointer bg-amber-500 hover:bg-amber-600 text-white"
                >
                  + Add Category
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setDraft({ ...draft, category: categories[0] });
                  }}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <Field label="Cover thumbnail URL">
            <div className="relative">
              <Input
                value={draft.thumbnail}
                onChange={(e: any) => setDraft({ ...draft, thumbnail: e.target.value })}
                placeholder="Leave empty to auto-generate topic template, or enter image URL..."
              />
              {draft.thumbnail && (
                <button
                  type="button"
                  onClick={() => setDraft({ ...draft, thumbnail: "" })}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-ink-200 text-xs px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                  title="Clear URL and keep empty"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <p className={`text-[11px] mt-1.5 flex items-center gap-1 ${isBright ? "text-slate-400" : "text-ink-500"}`}>
              <Sparkles size={12} className="text-amber-500 shrink-0" />
              <span>Leave empty to automatically generate a distinct, topic-matched visual template & cover.</span>
            </p>
          </Field>


          {/* Curriculum Creation Options when creating course */}
          {!editingId && (
            <div className={`pt-4 border-t ${isBright ? "border-slate-200" : "border-line-soft"}`}>
              <div className="mb-2.5">
                <h4 className={`text-sm font-semibold ${isBright ? "text-slate-900" : "text-ink-100"}`}>
                  Curriculum Setup
                </h4>
                <p className={`text-xs ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                  Choose how you want to build the modules and lessons for this course:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1: Create from Scratch */}
                <button
                  type="button"
                  onClick={() => setCreationMethod("scratch")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    creationMethod === "scratch"
                      ? isBright
                        ? "bg-amber-500/10 border-ember-500 ring-2 ring-ember-500/30"
                        : "bg-ember-500/15 border-ember-500 ring-2 ring-ember-500/30 shadow-ember/20"
                      : isBright
                      ? "bg-slate-50 border-slate-200 hover:border-slate-300"
                      : "bg-[#161a24] border-white/12 hover:border-white/20 hover:bg-[#1a1f2c]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-ember-500/15 text-ember-500 flex items-center justify-center">
                        <Sparkles size={16} />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          creationMethod === "scratch"
                            ? "bg-ember-500 text-base-950 font-bold"
                            : isBright
                            ? "bg-slate-200 text-slate-600"
                            : "bg-white/10 text-ink-400"
                        }`}
                      >
                        Option 1
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${isBright ? "text-slate-900" : "text-ink-100"}`}>
                      Generate Course with Mentora AI
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                      Mentora AI crafts 7 daily lessons per week (videos, flashcards, readings & quizzes) tailored directly to your description.
                    </p>
                  </div>
                </button>

                {/* Option 2: Upload Document or Video */}
                <button
                  type="button"
                  onClick={() => setCreationMethod("document")}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    creationMethod === "document"
                      ? isBright
                        ? "bg-amber-500/10 border-ember-500 ring-2 ring-ember-500/30"
                        : "bg-ember-500/15 border-ember-500 ring-2 ring-ember-500/30 shadow-ember/20"
                      : isBright
                      ? "bg-slate-50 border-slate-200 hover:border-slate-300"
                      : "bg-[#161a24] border-white/12 hover:border-white/20 hover:bg-[#1a1f2c]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-ember-500/15 text-ember-500 flex items-center justify-center">
                        <UploadCloud size={16} />
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          creationMethod === "document"
                            ? "bg-ember-500 text-base-950 font-bold"
                            : isBright
                            ? "bg-slate-200 text-slate-600"
                            : "bg-white/10 text-ink-400"
                        }`}
                      >
                        Option 2
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${isBright ? "text-slate-900" : "text-ink-100"}`}>
                      Upload Document or Video
                    </p>
                    <p className={`text-xs mt-1 leading-relaxed ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                      Upload a course syllabus, PDF, lecture video (MP4, WebM, MOV), presentation, or DOCX to auto-generate curriculum modules.
                    </p>
                  </div>
                </button>
              </div>

              {/* Upload Document / Video Dropzone */}
              {creationMethod === "document" && (
                <div className="mt-3.5">
                  <input
                    type="file"
                    id="course-doc-upload"
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt,.md,.pptx,.mp4,.webm,.mov,.avi,.mkv,.m4v,video/*"
                    onChange={handleFileSelect}
                  />

                  {!uploadedFile ? (
                    <label
                      htmlFor="course-doc-upload"
                      className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        isBright
                          ? "border-amber-300/80 hover:border-amber-500 bg-amber-500/5 hover:bg-amber-500/10"
                          : "border-white/20 hover:border-amber-500/80 bg-[#161a24] hover:bg-[#1a1f2c]"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mb-2">
                        <UploadCloud size={20} />
                      </div>
                      <p className={`text-xs sm:text-sm font-semibold ${isBright ? "text-slate-800" : "text-ink-100"}`}>
                        Click to upload syllabus, document, or video or drag & drop
                      </p>
                      <p className={`text-[11px] mt-0.5 ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                        Supported: PDF, DOCX, TXT, PPTX, MP4, WebM, MOV (up to 100MB)
                      </p>
                    </label>
                  ) : (
                    <div
                      className={`p-3.5 rounded-xl border flex flex-col gap-2.5 ${
                        isBright
                          ? "bg-amber-500/5 border-amber-300/70 text-slate-900"
                          : "bg-[#161a24] border-amber-500/30 text-ink-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                            {uploadedFile.isVideo ? <Video size={16} /> : <FileText size={16} />}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-semibold truncate">{uploadedFile.name}</p>
                              {uploadedFile.isVideo && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 shrink-0 flex items-center gap-1">
                                  <Film size={11} /> Video
                                </span>
                              )}
                            </div>
                            <p className={`text-[11px] ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                              {uploadedFile.size} · {uploadedFile.isVideo ? "Video ready to synthesize & master" : "Ready to parse"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFile(null)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            isBright
                              ? "text-slate-400 hover:text-red-500 hover:bg-red-50"
                              : "text-ink-500 hover:text-red-400 hover:bg-red-500/10"
                          }`}
                          aria-label="Remove uploaded file"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {/* Video Player Preview if it's an uploaded video */}
                      {uploadedFile.isVideo && uploadedFile.videoUrl && (
                        <div className="mt-1 relative rounded-xl overflow-hidden aspect-video max-h-48 bg-black border border-amber-500/30 shadow-md">
                          <video
                            src={uploadedFile.videoUrl}
                            controls
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                      {/* Ask user how to use the uploaded document or video */}
                      <div className={`mt-2 pt-3 border-t ${isBright ? "border-amber-200/70" : "border-white/10"} space-y-3`}>
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-wider ${isBright ? "text-slate-800" : "text-ink-100"}`}>
                            {uploadedFile.isVideo ? "How should Mentora AI use this video?" : "How should Mentora AI use this document?"}
                          </p>
                          <p className={`text-[11px] mt-0.5 ${isBright ? "text-slate-500" : "text-ink-400"}`}>
                            {uploadedFile.isVideo
                              ? "Select how you want your uploaded video transformed into the course curriculum:"
                              : "Select how you want your document transformed into the course curriculum:"}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {/* Choice 1: Auto-generate all formats */}
                          <div
                            onClick={() => setDocMode("full")}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              docMode === "full"
                                ? isBright
                                  ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                                  : "bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/30"
                                : isBright
                                ? "bg-white border-slate-200 hover:border-slate-300"
                                : "bg-base-950/60 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <Zap size={16} className="text-amber-500" />
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    docMode === "full"
                                      ? "bg-amber-500 text-base-950 font-bold"
                                      : isBright
                                      ? "bg-slate-200 text-slate-600"
                                      : "bg-white/10 text-ink-400"
                                  }`}
                                >
                                  Full AI Synthesis
                                </span>
                              </div>
                              <p className={`text-xs font-bold ${isBright ? "text-slate-900" : "text-ink-100"}`}>
                                Auto-Generate All Formats
                              </p>
                              <p className={`text-[11px] mt-1 leading-snug ${isBright ? "text-slate-600" : "text-ink-400"}`}>
                                {uploadedFile.isVideo
                                  ? "Synthesizes complete 5-step curriculum from video: lecture topics, 3D flashcards, cheat sheet, dialogue scenarios, & daily tasks."
                                  : "Synthesizes complete 5-step curriculum from document: modules, subtopics, 3D flashcards, cheat sheet, videos, dialogue scenarios, & daily tasks."}
                              </p>
                            </div>
                          </div>

                          {/* Choice 2: Anchor as lesson and build around it */}
                          <div
                            onClick={() => setDocMode("integrate")}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                              docMode === "integrate"
                                ? isBright
                                  ? "bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-sm"
                                  : "bg-amber-500/15 border-amber-500/80 ring-2 ring-amber-500/30"
                                : isBright
                                ? "bg-white border-slate-200 hover:border-slate-300"
                                : "bg-base-950/60 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                {uploadedFile.isVideo ? <Film size={16} className="text-amber-500" /> : <BookOpen size={16} className="text-amber-500" />}
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    docMode === "integrate"
                                      ? "bg-amber-500 text-base-950 font-bold"
                                      : isBright
                                      ? "bg-slate-200 text-slate-600"
                                      : "bg-white/10 text-ink-400"
                                  }`}
                                >
                                  {uploadedFile.isVideo ? "Anchor Masterclass" : "Anchor as Lesson"}
                                </span>
                              </div>
                              <p className={`text-xs font-bold ${isBright ? "text-slate-900" : "text-ink-100"}`}>
                                {uploadedFile.isVideo ? "Anchor as Masterclass Video" : "Anchor as Lesson & Build Around It"}
                              </p>
                              <p className={`text-[11px] mt-1 leading-snug ${isBright ? "text-slate-600" : "text-ink-400"}`}>
                                {uploadedFile.isVideo
                                  ? "Embeds this video directly as the primary lecture video, then generates companion reading, flashcards, dialogue coaching, & daily tasks around it."
                                  : "Embeds the document directly as a primary lesson, then generates companion video, flashcards, Socratic coaching, & daily tasks around it."}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Format selection when anchor mode is active */}
                        {docMode === "integrate" && (
                          <div
                            className={`p-3 rounded-xl border space-y-2.5 ${
                              isBright ? "bg-white border-amber-200/80 shadow-sm" : "bg-base-950/80 border-amber-500/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <label className={`text-xs font-semibold ${isBright ? "text-slate-800" : "text-ink-100"}`}>
                                {uploadedFile.isVideo ? "Integrate uploaded video as:" : "Integrate uploaded document as:"}
                              </label>
                              <span className={`text-[10px] text-amber-500 font-semibold`}>
                                Primary Lesson Format
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setDocIntegrationType("video")}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  docIntegrationType === "video"
                                    ? "bg-amber-500 text-base-950 font-bold border-amber-500 shadow-sm"
                                    : isBright
                                    ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                    : "bg-white/5 text-ink-300 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <Video size={13} /> Video {uploadedFile.isVideo && "(Recommended)"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDocIntegrationType("reading")}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  docIntegrationType === "reading"
                                    ? "bg-amber-500 text-base-950 font-bold border-amber-500 shadow-sm"
                                    : isBright
                                    ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                    : "bg-white/5 text-ink-300 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <BookOpen size={13} /> Reading
                              </button>
                              <button
                                type="button"
                                onClick={() => setDocIntegrationType("reference")}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                  docIntegrationType === "reference"
                                    ? "bg-amber-500 text-base-950 font-bold border-amber-500 shadow-sm"
                                    : isBright
                                    ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                    : "bg-white/5 text-ink-300 border-white/10 hover:bg-white/10"
                                }`}
                              >
                                <FileText size={13} /> Reference
                              </button>
                            </div>

                            <p className={`text-[11px] leading-relaxed ${isBright ? "text-slate-500" : "text-ink-400"}`}>
                              {docIntegrationType === "video" &&
                                (uploadedFile.isVideo
                                  ? "Uploaded video will be embedded directly as the Module 1 masterclass walkthrough with full playback controls."
                                  : "Document will be placed as a visual masterclass lesson with breakdown roadmap, lecture companion, and notes.")}
                              {docIntegrationType === "reading" &&
                                "Will generate an in-depth reading lesson with comprehensive theory, practical code, and key takeaways."}
                              {docIntegrationType === "reference" &&
                                "Will generate an essential reference manual and syntax cheat sheet lesson."}
                            </p>
                          </div>
                        )}

                        {/* Live Ready Confirmation with Smart Pedagogical Flow Analysis */}
                        {(() => {
                          const placementAnalysis = uploadedFile
                            ? analyzeDocumentCurriculumPlacement(
                                uploadedFile.name,
                                draft.level,
                                parseDurationWeeks(draft.duration),
                                detectDomain(draft.title, draft.category, uploadedFile.name)
                              )
                            : null;

                          return (
                            <div
                              className={`text-xs p-3 rounded-xl flex items-start gap-2.5 transition-all ${
                                isBright
                                  ? "bg-amber-500/10 border border-amber-300/80 text-amber-950 font-medium"
                                  : "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                              }`}
                            >
                              <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                              <div className="flex-1 space-y-1">
                                {docMode === "full" ? (
                                  <p className="leading-relaxed">
                                    <strong className="font-bold inline-flex items-center gap-1 mr-1">
                                      <Zap size={13} className="text-amber-500" /> Full AI Synthesis:
                                    </strong>
                                    Mentora AI will synthesize a complete, topic-accurate {parseDurationWeeks(draft.duration)}-week curriculum derived strictly from &ldquo;{uploadedFile.name}&rdquo; with zero hallucinations.
                                  </p>
                                ) : (
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-amber-500 flex items-center gap-1.5">
                                      <Brain size={14} className="text-amber-500" />
                                      <span>Smart Flow Placement:</span>
                                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                                        Module {placementAnalysis?.targetModuleNumber || 1}
                                      </span>
                                    </p>
                                    <p className="text-[11px] leading-relaxed opacity-95">
                                      {placementAnalysis?.smartFlowNote}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Manage modules & lessons modal - New Clean Design */}
      <Modal
        open={!!liveManageCourse}
        onClose={() => setManageCourse(null)}
        size="lg"
        hideHeader={true}
        noBodyPadding={true}
      >
        {liveManageCourse && (
          <CourseCurriculum
            course={liveManageCourse}
            onClose={() => setManageCourse(null)}
            onPublish={async () => {
              await setCourseStatus(liveManageCourse.id, "Published");
              setManageCourse(null);
              setStatusTab("Published");
            }}
            onOpenStudio={(modIdx?: number) => {
              const c = liveManageCourse;
              setManageCourse(null);
              setStudioCourse(c);
            }}
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

      {/* AI Course Creator Studio */}
      {studioCourse && (
        <AiCourseStudio
          initialCourse={studioCourse}
          onSaveDraft={handleStudioSaveDraft}
          onPublish={handleStudioPublish}
          onClose={() => setStudioCourse(null)}
          onDelete={(courseId) => {
            if (courseId) removeCourse(courseId);
            setStudioCourse(null);
          }}
        />
      )}

      <AiCourseGeneratorModal
        open={aiGenModalOpen}
        onClose={() => setAiGenModalOpen(false)}
        onCourseCreated={handleAiCourseCreated}
        categories={categories}
      />
    </div>
  );
}

function CourseCurriculum({
  course,
  onClose,
  onPublish,
  onOpenStudio,
}: {
  course: any;
  onClose: () => void;
  onPublish?: () => void;
  onOpenStudio?: (moduleIndex?: number) => void;
}) {
  const { isBright } = useTheme();
  const modules = course.modules || [];

  // Track expanded modules: closed by default, expands on click
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const tileTemplate = getTopicTileTemplate(course);
  const bannerImg = (course.hasCustomThumbnail && course.thumbnail?.trim() && !isTemplateThumbnail(course.thumbnail))
    ? course.thumbnail.trim()
    : tileTemplate.thumbnail;

  // Helper to extract lectures for a specific module
  const getModuleLectures = (m: any, mIdx: number) => {
    const subs = (m.subtopics && m.subtopics.length > 0) ? m.subtopics : (m.lessons || []);
    if (subs.length > 0) {
      return subs.map((s: any, sIdx: number) => ({
        id: s.id || `lsn_${mIdx}_${sIdx}`,
        title: s.title,
        duration: s.duration || "45 min",
        type: s.type || "reading",
        moduleIdx: mIdx,
      }));
    }
    const cleanModTitle = (m.title || "").replace(/^Module\s*\d+:\s*/i, "").trim();
    return [
      { id: `lsn_${mIdx}_0`, title: `Introduction to ${cleanModTitle}`, duration: "45 min", type: "video", moduleIdx: mIdx },
      { id: `lsn_${mIdx}_1`, title: `${cleanModTitle} Core Principles & Syntax`, duration: "60 min", type: "reading", moduleIdx: mIdx },
      { id: `lsn_${mIdx}_2`, title: `Building Workflows with ${cleanModTitle}`, duration: "90 min", type: "exercise", moduleIdx: mIdx }
    ];
  };

  // Grouped quizzes across all modules
  const quizzesToDisplay = useMemo(() => {
    const list: Array<{ id: string; title: string; countStr: string; moduleIdx: number }> = [];
    modules.forEach((m: any, mIdx: number) => {
      const cleanModTitle = (m.title || "").replace(/^Module\s*\d+:\s*/i, "").trim();
      if (m.passGate?.quiz) {
        const qCount = m.passGate.quiz.questions?.length || 20;
        list.push({
          id: `quiz_${m.id || mIdx}`,
          title: m.passGate.quiz.title || `${cleanModTitle} Quiz`,
          countStr: `${qCount} questions`,
          moduleIdx: mIdx,
        });
      } else if (m.passGate?.task) {
        list.push({
          id: `task_${m.id || mIdx}`,
          title: m.passGate.task.missionTitle || `${cleanModTitle} Hands-on Mission`,
          countStr: "Capstone Task",
          moduleIdx: mIdx,
        });
      } else {
        list.push({
          id: `quiz_def_${mIdx}`,
          title: `${cleanModTitle} Quiz`,
          countStr: "20 questions",
          moduleIdx: mIdx,
        });
      }
    });
    return list;
  }, [modules]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. TOP BANNER IMAGE */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-950 shrink-0">
        <img
          src={bannerImg}
          alt={course.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = tileTemplate.thumbnail;
          }}
          className="w-full h-full object-cover"
        />
        {/* Ambient brand gradient tint */}
        <div className={`absolute inset-0 pointer-events-none opacity-35 mix-blend-overlay ${tileTemplate.gradientClass}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />

        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer"
          aria-label="Close"
        >
          <X size={17} />
        </button>

        {/* Category & Status Badges Floating Left */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-black/60 text-white border border-white/20 shadow-sm">
            {course.category}
          </span>
          {course.status === "Draft" ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-amber-500/90 text-white shadow-sm">
              Draft
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-emerald-500/90 text-white shadow-sm">
              Published
            </span>
          )}
        </div>
      </div>

      {/* 2. BODY CONTENT (STRICTLY FOLLOWING EMBER / AMBER COLOUR THEME) */}
      <div className={`p-6 sm:p-7 space-y-6 ${isBright ? "bg-white text-slate-900" : "bg-[#11141b] text-ink-100"}`}>
        {/* Title & Description Header */}
        <div className="space-y-2">
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isBright ? "text-slate-900" : "text-white"}`}>
            {course.title}
          </h2>
          <p className={`text-sm leading-relaxed ${isBright ? "text-slate-600" : "text-ink-400"}`}>
            {course.description || "This course covers the fundamentals for building modern real-world skills."}
          </p>

          {/* Quick Action bar & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line-soft">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isBright ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-[#161a24] border-white/10 text-ink-300"}`}>
                <Clock size={13} /> {course.duration || "4 Weeks"}
              </span>
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isBright ? "bg-amber-50 border-amber-200 text-amber-700 font-semibold" : "bg-amber-500/10 border-amber-500/30 text-amber-400 font-semibold"}`}>
                <Target size={13} /> {course.level || "Beginner"}
              </span>
              <span className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isBright ? "bg-slate-50 border-slate-200 text-slate-700" : "bg-[#161a24] border-white/10 text-ink-300"}`}>
                <Library size={13} /> {modules.length} Modules
              </span>
            </div>

            {course.status === "Draft" && onPublish && (
              <div className="flex items-center gap-2.5">
                <Button
                  size="sm"
                  icon={Globe}
                  onClick={onPublish}
                  className="cursor-pointer font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 !text-white shadow-sm shadow-orange-500/25 border border-orange-400/40"
                >
                  <span className="font-bold">Publish Course</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: MODULES (WITH DROPDOWN LECTURES) */}
        <div className="space-y-3">
          <h3 className={`text-sm sm:text-base font-bold ${isBright ? "text-slate-900" : "text-white"}`}>
            Modules
          </h3>

          <div className="space-y-2.5">
            {modules.map((m: any, idx: number) => {
              const modKey = m.id || `mod_${idx}`;
              const cleanTitle = (m.title || "").replace(/^Module\s*\d+:\s*/i, "").trim();
              const isExpanded = !!expandedModules[modKey];
              const modLectures = getModuleLectures(m, idx);

              return (
                <div key={modKey} className="flex flex-col">
                  {/* Module Header Card (Dropdown Trigger) */}
                  <div
                    onClick={() => toggleModule(modKey)}
                    className={`group w-full p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer select-none ${
                      isExpanded
                        ? isBright
                          ? "bg-amber-50/60 border-ember-500 ring-1 ring-ember-500/30 shadow-sm"
                          : "bg-[#161a24] border-ember-500/70 ring-1 ring-ember-500/30 text-white shadow-md"
                        : isBright
                        ? "bg-white hover:bg-slate-50 hover:border-amber-400 border-slate-200 text-slate-800 shadow-sm"
                        : "bg-[#161a24] hover:bg-[#1f2432] hover:border-ember-500/50 border-white/10 text-ink-100"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen
                        size={18}
                        className={`shrink-0 transition-colors ${
                          isExpanded
                            ? "text-ember-500"
                            : isBright
                            ? "text-slate-500 group-hover:text-ember-500"
                            : "text-ink-400 group-hover:text-ember-400"
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-semibold truncate">
                        Module {idx + 1}: {cleanTitle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                        isExpanded
                          ? isBright
                            ? "bg-amber-100/70 border-amber-300 text-amber-800"
                            : "bg-ember-500/20 border-ember-500/40 text-amber-300"
                          : isBright
                          ? "bg-slate-100 border-slate-200 text-slate-600"
                          : "bg-white/5 border-white/10 text-ink-400"
                      }`}>
                        {modLectures.length} lessons
                      </span>
                      <ChevronDown
                        size={17}
                        className={`transition-transform duration-200 shrink-0 ${
                          isExpanded
                            ? "rotate-180 text-ember-500"
                            : isBright
                            ? "text-slate-400 group-hover:text-ember-500"
                            : "text-ink-500 group-hover:text-ember-400"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Dropdown Contents (Lectures directly inside the module) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-2 ml-3 sm:ml-4 pl-3 sm:pl-4 border-l-2 space-y-2 py-1 ${
                          isBright ? "border-amber-300/80" : "border-ember-500/40"
                        }`}>
                          {modLectures.map((l: any, lIdx: number) => (
                            <div
                              key={l.id || lIdx}
                              onClick={() => onOpenStudio?.(idx)}
                              className={`group w-full p-3 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                                isBright
                                  ? "bg-white hover:bg-amber-50/40 hover:border-amber-400 border-slate-200 text-slate-800 shadow-xs"
                                  : "bg-[#131720] hover:bg-[#1c2230] hover:border-ember-500/50 border-white/10 text-ink-100"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <Play
                                  size={15}
                                  className={`shrink-0 fill-current transition-colors ${
                                    isBright
                                      ? "text-slate-400 group-hover:text-ember-500"
                                      : "text-ink-400 group-hover:text-ember-400"
                                  }`}
                                />
                                <span className="text-xs sm:text-sm font-medium truncate">
                                  {l.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-medium ${isBright ? "text-slate-400 group-hover:text-slate-600" : "text-ink-400 group-hover:text-ink-200"}`}>
                                  {l.duration}
                                </span>
                                <ChevronRight
                                  size={15}
                                  className={`shrink-0 transition-transform ${
                                    isBright
                                      ? "text-slate-400 group-hover:text-ember-500 group-hover:translate-x-0.5"
                                      : "text-ink-500 group-hover:text-ember-400 group-hover:translate-x-0.5"
                                  }`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: QUIZZES */}
        {quizzesToDisplay.length > 0 && (
          <div className="space-y-2.5 pt-1">
            <h3 className={`text-sm sm:text-base font-bold ${isBright ? "text-slate-900" : "text-white"}`}>
              Quizzes
            </h3>
            <div className="space-y-2">
              {quizzesToDisplay.map((q: any, idx: number) => (
                <div
                  key={q.id || idx}
                  onClick={() => onOpenStudio?.(q.moduleIdx)}
                  className={`group w-full p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isBright
                      ? "bg-white hover:bg-slate-50 hover:border-amber-400 border-slate-200 text-slate-800 shadow-sm"
                      : "bg-[#161a24] hover:bg-[#1f2432] hover:border-ember-500/50 border-white/10 text-ink-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText
                      size={16}
                      className={`shrink-0 transition-colors ${
                        isBright
                          ? "text-slate-400 group-hover:text-ember-500"
                          : "text-ink-400 group-hover:text-ember-400"
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {q.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium ${isBright ? "text-slate-400 group-hover:text-slate-600" : "text-ink-400 group-hover:text-ink-200"}`}>
                      {q.countStr}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${
                        isBright
                          ? "text-slate-400 group-hover:text-ember-500 group-hover:translate-x-0.5"
                          : "text-ink-500 group-hover:text-ember-400 group-hover:translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

