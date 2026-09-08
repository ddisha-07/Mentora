"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ListChecks, Flame, Minus } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { formatDate, classNames } from "@/lib/admin/utils";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const difficultyTone: Record<string, string> = { Easy: "green", Medium: "yellow", Hard: "red" };
const emptyDraft = { title: "", description: "", points: 10, difficulty: "Easy", date: new Date().toISOString().slice(0, 10) };

export default function DailyTasksPage() {
  const { tasks, addTask, editTask, removeTask } = useAdminData();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(() => [...tasks].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()), [tasks]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(t: any) {
    setEditingId(t.id);
    setDraft({ title: t.title, description: t.description, points: t.points, difficulty: t.difficulty, date: t.date });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.title.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editTask(editingId, draft);
      } else {
        await addTask(draft);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  function bumpPoints(task: any, delta: number) {
    editTask(task.id, { points: Math.max(0, task.points + delta) });
  }

  return (
    <div>
      <Topbar
        title="Daily Tasks"
        subtitle="Set the tasks learners see each day"
        actions={<Button icon={Plus} onClick={openAdd}>Add Task</Button>}
      />

      {sorted.length === 0 ? (
        <GlassCard className="mt-6">
          <EmptyState icon={ListChecks} title="No tasks yet" description="Add your first daily task for learners." action={<Button icon={Plus} onClick={openAdd}>Add Task</Button>} />
        </GlassCard>
      ) : (
        <div className="mt-6 space-y-3">
          {sorted.map((t: any) => (
            <GlassCard key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <h3 className="text-ink-100 font-medium">{t.title}</h3>
                  <Badge tone={difficultyTone[t.difficulty]}>{t.difficulty}</Badge>
                  {!t.active && <Badge tone="neutral">Inactive</Badge>}
                </div>
                <p className="text-sm text-ink-500">{t.description}</p>
                <p className="text-xs text-ink-700 mt-1.5">Scheduled {formatDate(t.date)}</p>
              </div>

              <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                <div className="flex items-center gap-1.5 glass rounded-lg px-2 py-1.5">
                  <button onClick={() => bumpPoints(t, -5)} className="p-1 text-ink-500 hover:text-red-400 transition-colors focus-ring rounded">
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-semibold text-ember-500 flex items-center gap-1 w-14 justify-center">
                    <Flame size={12} /> {t.points}
                  </span>
                  <button onClick={() => bumpPoints(t, 5)} className="p-1 text-ink-500 hover:text-emerald-400 transition-colors focus-ring rounded">
                    <Plus size={13} />
                  </button>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <span className="text-xs text-ink-500">Active</span>
                  <button
                    type="button"
                    onClick={() => editTask(t.id, { active: !t.active })}
                    className={classNames(
                      "w-9 h-5 rounded-full transition-colors relative",
                      t.active ? "bg-ember-500" : "bg-white/10"
                    )}
                  >
                    <span
                      className={classNames(
                        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                        t.active ? "translate-x-4" : "translate-x-0.5"
                      )}
                    />
                  </button>
                </label>

                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit task" : "Add daily task"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add task"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Task title">
            <Input value={draft.title} onChange={(e: any) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Complete one lesson" />
          </Field>
          <Field label="Description">
            <Textarea rows={2} value={draft.description} onChange={(e: any) => setDraft({ ...draft, description: e.target.value })} placeholder="What does the learner need to do?" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Points">
              <Input type="number" min={0} value={draft.points} onChange={(e: any) => setDraft({ ...draft, points: Number(e.target.value) })} />
            </Field>
            <Field label="Difficulty">
              <Select value={draft.difficulty} onChange={(e: any) => setDraft({ ...draft, difficulty: e.target.value })}>
                {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Date">
              <Input type="date" value={draft.date} onChange={(e: any) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeTask(deleteTarget.id)}
        title="Delete task"
        description={`"${deleteTarget?.title}" will no longer appear for learners.`}
      />
    </div>
  );
}
