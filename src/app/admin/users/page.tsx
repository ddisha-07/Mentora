"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Eye, Mail, Calendar, Award, BookMarked } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import SearchInput from "@/components/admin/ui/SearchInput";
import Avatar from "@/components/admin/ui/Avatar";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { formatDate } from "@/lib/admin/utils";

const ROLES = ["Learner", "Mentor", "Admin"];
const STATUSES = ["Active", "Invited", "Suspended"];
const PLANS = ["Free", "Pro", "Mentor", "Internal"];

const emptyDraft = { name: "", email: "", role: "Learner", status: "Active", plan: "Free" };

function statusTone(status: string) {
  if (status === "Active") return "green";
  if (status === "Suspended") return "red";
  return "neutral";
}

export default function UsersPage() {
  const { users, addUser, editUser, removeUser } = useAdminData();

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  const [viewUser, setViewUser] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return users.filter((u: any) => {
      const matchesQuery =
        !query ||
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [users, query, roleFilter, statusFilter]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormOpen(true);
  }

  function openEdit(u: any) {
    setEditingId(u.id);
    setDraft({ name: u.name, email: u.email, role: u.role, status: u.status, plan: u.plan });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.name.trim() || !draft.email.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await editUser(editingId, draft);
      } else {
        await addUser(draft);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Topbar
        title="Users"
        subtitle={`${users.length} total learners, mentors & admins`}
        actions={<Button icon={Plus} onClick={openAdd}>Add User</Button>}
      />

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by name or email..." />
        </div>
        <Select value={roleFilter} onChange={(e: any) => setRoleFilter(e.target.value)} className="sm:w-40">
          <option value="All">All roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </Select>
        <Select value={statusFilter} onChange={(e: any) => setStatusFilter(e.target.value)} className="sm:w-40">
          <option value="All">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <GlassCard className="mt-5 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No users match"
            description="Try adjusting your search or filters, or add a new user."
            action={<Button icon={Plus} onClick={openAdd}>Add User</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-500 border-b border-line-soft">
                  <th className="font-medium px-5 py-3">User</th>
                  <th className="font-medium px-5 py-3">Role</th>
                  <th className="font-medium px-5 py-3">Status</th>
                  <th className="font-medium px-5 py-3">Plan</th>
                  <th className="font-medium px-5 py-3">Joined</th>
                  <th className="font-medium px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: any) => (
                  <tr key={u.id} className="border-b border-line-soft last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} size={34} />
                        <div className="min-w-0">
                          <p className="text-ink-100 font-medium truncate">{u.name}</p>
                          <p className="text-xs text-ink-500 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-300">{u.role}</td>
                    <td className="px-5 py-3"><Badge tone={statusTone(u.status)}>{u.status}</Badge></td>
                    <td className="px-5 py-3 text-ink-300">{u.plan}</td>
                    <td className="px-5 py-3 text-ink-500">{formatDate(u.joinedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewUser(u)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring" aria-label="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => setDeleteTarget(u)} className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring" aria-label="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Add / Edit modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit user" : "Add user"}
        subtitle={editingId ? "Update this person's account details" : "Create a new account on Mentora"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add user"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Full name">
            <Input value={draft.name} onChange={(e: any) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Sam Rivera" />
          </Field>
          <Field label="Email">
            <Input type="email" value={draft.email} onChange={(e: any) => setDraft({ ...draft, email: e.target.value })} placeholder="sam@mentora.io" />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Role">
              <Select value={draft.role} onChange={(e: any) => setDraft({ ...draft, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={draft.status} onChange={(e: any) => setDraft({ ...draft, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Plan">
              <Select value={draft.plan} onChange={(e: any) => setDraft({ ...draft, plan: e.target.value })}>
                {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
              </Select>
            </Field>
          </div>
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="User profile" size="sm">
        {viewUser && (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={viewUser.name} color={viewUser.avatarColor} size={52} />
              <div>
                <p className="text-ink-100 font-semibold">{viewUser.name}</p>
                <p className="text-sm text-ink-500">{viewUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <InfoRow icon={Award} label="Role" value={viewUser.role} />
              <InfoRow icon={Calendar} label="Joined" value={formatDate(viewUser.joinedAt)} />
              <InfoRow icon={BookMarked} label="Courses" value={viewUser.coursesEnrolled} />
              <InfoRow icon={Award} label="Points" value={viewUser.points?.toLocaleString()} />
            </div>
            <div className="flex items-center gap-2 mt-5">
              <Badge tone={statusTone(viewUser.status)}>{viewUser.status}</Badge>
              <Badge tone="ember">{viewUser.plan} plan</Badge>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeUser(deleteTarget.id)}
        title="Delete user"
        description={`This will permanently remove ${deleteTarget?.name} from Mentora. This action can't be undone.`}
      />
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="glass rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-ink-500 text-[11px] mb-1">
        <Icon size={12} /> {label}
      </div>
      <p className="text-sm text-ink-100 font-medium">{value}</p>
    </div>
  );
}
