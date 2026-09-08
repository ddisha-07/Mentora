"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, MessagesSquare, UserPlus, UserMinus, Globe, Lock } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Badge from "@/components/admin/ui/Badge";
import Avatar from "@/components/admin/ui/Avatar";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";

const CATEGORIES = ["Business", "Software Engineering", "Arts & Hobbies", "Personal Growth", "Finance"];
const emptyDraft = { name: "", description: "", category: "Business", visibility: "Public" };

export default function CommunityPage() {
  const { communities, users, addCommunity, editCommunity, removeCommunity, addMember, removeMember } = useAdminData();

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [manageCommunity, setManageCommunity] = useState<any>(null);
  const [memberToAdd, setMemberToAdd] = useState("");
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () => communities.filter((c: any) => !query || c.name.toLowerCase().includes(query.toLowerCase())),
    [communities, query]
  );

  const liveManageCommunity = manageCommunity ? communities.find((c: any) => c.id === manageCommunity.id) : null;

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(c: any) {
    setEditingId(c.id);
    setDraft({ name: c.name, description: c.description, category: c.category, visibility: c.visibility });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editCommunity(editingId, draft);
      } else {
        await addCommunity(draft);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleAddMember() {
    if (!memberToAdd || !liveManageCommunity) return;
    const user = users.find((u: any) => u.id === memberToAdd);
    if (!user) return;
    await addMember(liveManageCommunity.id, { id: user.id, name: user.name, role: "Member" });
    setMemberToAdd("");
  }

  const availableUsers = liveManageCommunity
    ? users.filter((u: any) => !liveManageCommunity.members.some((m: any) => m.id === u.id))
    : [];

  return (
    <div>
      <Topbar
        title="Community"
        subtitle={`${communities.length} active communities`}
        actions={<Button icon={Plus} onClick={openAdd}>Create Community</Button>}
      />

      <div className="mt-6">
        <SearchInput value={query} onChange={setQuery} placeholder="Search communities..." />
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="mt-5">
          <EmptyState icon={MessagesSquare} title="No communities found" description="Create one to bring learners together." action={<Button icon={Plus} onClick={openAdd}>Create Community</Button>} />
        </GlassCard>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c: any) => (
            <GlassCard key={c.id} className="p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <Badge tone="ember">{c.category}</Badge>
                <div className="flex items-center gap-1 text-xs text-ink-500">
                  {c.visibility === "Public" ? <Globe size={12} /> : <Lock size={12} />} {c.visibility}
                </div>
              </div>
              <h3 className="text-ink-100 font-semibold mb-1.5">{c.name}</h3>
              <p className="text-sm text-ink-300 leading-relaxed flex-1 mb-4">{c.description}</p>
              <div className="flex items-center -space-x-2 mb-4">
                {c.members.slice(0, 5).map((m: any) => (
                  <Avatar key={m.id} name={m.name} size={28} className="ring-2 ring-base-900" />
                ))}
                {c.members.length > 5 && (
                  <div className="w-7 h-7 rounded-full bg-white/10 ring-2 ring-base-900 flex items-center justify-center text-[10px] text-ink-300">
                    +{c.members.length - 5}
                  </div>
                )}
                {c.members.length === 0 && <span className="text-xs text-ink-500">No members yet</span>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-line-soft">
                <Button size="sm" variant="secondary" onClick={() => setManageCommunity(c)}>Manage members</Button>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(c)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring" aria-label="Delete">
                    <Trash2 size={14} />
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
        title={editingId ? "Edit community" : "Create community"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Create community"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Community name">
            <Input value={draft.name} onChange={(e: any) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Design Critique Circle" />
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={draft.description} onChange={(e: any) => setDraft({ ...draft, description: e.target.value })} placeholder="What is this community for?" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={draft.category} onChange={(e: any) => setDraft({ ...draft, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Visibility">
              <Select value={draft.visibility} onChange={(e: any) => setDraft({ ...draft, visibility: e.target.value })}>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </Select>
            </Field>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!liveManageCommunity}
        onClose={() => setManageCommunity(null)}
        title={liveManageCommunity?.name}
        subtitle="Manage members"
        size="md"
      >
        {liveManageCommunity && (
          <div>
            <div className="flex gap-2 mb-5">
              <Select value={memberToAdd} onChange={(e: any) => setMemberToAdd(e.target.value)}>
                <option value="">Select a user to add...</option>
                {availableUsers.map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </Select>
              <Button icon={UserPlus} onClick={handleAddMember} className="shrink-0" disabled={!memberToAdd}>Add</Button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {liveManageCommunity.members.length === 0 && (
                <p className="text-sm text-ink-500 text-center py-6">No members yet.</p>
              )}
              {liveManageCommunity.members.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3 glass rounded-lg px-3 py-2.5">
                  <Avatar name={m.name} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-100 truncate">{m.name}</p>
                    <p className="text-xs text-ink-500">{m.role}</p>
                  </div>
                  <button
                    onClick={() => removeMember(liveManageCommunity.id, m.id)}
                    className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                    aria-label="Remove member"
                  >
                    <UserMinus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeCommunity(deleteTarget.id)}
        title="Delete community"
        description={`"${deleteTarget?.name}" and its member list will be permanently deleted.`}
      />
    </div>
  );
}
