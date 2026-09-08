"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Briefcase, Palette, Users2 } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const emptyDraft = { name: "", field: "", level: "Beginner", description: "" };

export default function SkillsPage() {
  const { skills, addSkill, editSkill, removeSkill } = useAdminData();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formCategory, setFormCategory] = useState("Professional");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return skills.filter((s: any) => {
      const matchesTab = tab === "All" || s.category === tab;
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase());
      return matchesTab && matchesQuery;
    });
  }, [skills, tab, query]);

  function openAdd(category: string) {
    setFormCategory(category);
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(s: any) {
    setFormCategory(s.category);
    setEditingId(s.id);
    setDraft({ name: s.name, field: s.field, level: s.level, description: s.description });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editSkill(editingId, draft);
      } else {
        await addSkill({ ...draft, category: formCategory });
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Topbar
        title="Skills"
        subtitle="Manage professional and non-professional skill tracks"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={Briefcase} onClick={() => openAdd("Professional")}>Professional</Button>
            <Button icon={Palette} onClick={() => openAdd("Non-Professional")}>Non-Professional</Button>
          </div>
        }
      />

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1.5 glass rounded-lg p-1 w-fit">
          {["All", "Professional", "Non-Professional"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t ? "bg-ember-500 text-base-950" : "text-ink-500 hover:text-ink-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1">
          <SearchInput value={query} onChange={setQuery} placeholder="Search skills..." />
        </div>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="mt-5">
          <EmptyState icon={Palette} title="No skills found" description="Try a different filter or add a new skill." />
        </GlassCard>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((s: any) => (
            <GlassCard key={s.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <Badge tone={s.category === "Professional" ? "ember" : "blue"}>{s.category}</Badge>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring" aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-ink-100 font-semibold mb-1">{s.name}</h3>
              <p className="text-xs text-ink-500 mb-3">{s.field}</p>
              <p className="text-sm text-ink-300 leading-relaxed flex-1">{s.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-line-soft">
                <span className="text-xs text-ink-500">{s.level}</span>
                <span className="text-xs text-ink-500 flex items-center gap-1">
                  <Users2 size={12} /> {s.learners.toLocaleString()} learners
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit skill" : `Add ${formCategory.toLowerCase()} skill`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add skill"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Skill name">
            <Input value={draft.name} onChange={(e: any) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Negotiation Tactics" />
          </Field>
          <Field label="Field / category">
            <Input value={draft.field} onChange={(e: any) => setDraft({ ...draft, field: e.target.value })} placeholder="e.g. Business" />
          </Field>
          <Field label="Level">
            <Select value={draft.level} onChange={(e: any) => setDraft({ ...draft, level: e.target.value })}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </Select>
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={draft.description} onChange={(e: any) => setDraft({ ...draft, description: e.target.value })} placeholder="Short summary shown to learners" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeSkill(deleteTarget.id)}
        title="Delete skill"
        description={`"${deleteTarget?.name}" will be removed from the skill catalog.`}
      />
    </div>
  );
}
