"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Clock, MapPin, CalendarDays } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import Badge from "@/components/admin/ui/Badge";
import EmptyState from "@/components/admin/ui/EmptyState";
import { Field, Input, Select } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { classNames } from "@/lib/admin/utils";

const TYPES = ["Webinar", "Office Hours", "In Person", "Milestone"];
const typeTone: Record<string, string> = { Webinar: "ember", "Office Hours": "blue", "In Person": "green", Milestone: "yellow" };

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

const emptyDraft = { title: "", date: "", time: "10:00", type: "Webinar", host: "", location: "Online" };

export default function SchedulePage() {
  const { events, addEvent, editEvent, removeEvent } = useAdminData();

  const [cursor, setCursor] = useState(() => new Date(2026, 8, 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    events.forEach((e: any) => {
      map[e.date] = map[e.date] || [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  function openAdd(dateKey: string | null) {
    setEditingId(null);
    setDraft({ ...emptyDraft, date: dateKey || toDateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 1)) });
    setFormOpen(true);
  }

  function openEdit(ev: any) {
    setEditingId(ev.id);
    setDraft({ title: ev.title, date: ev.date, time: ev.time, type: ev.type, host: ev.host, location: ev.location });
    setFormOpen(true);
  }

  async function handleSave() {
    if (!draft.title.trim() || !draft.date) return;
    setSaving(true);
    try {
      if (editingId) {
        await editEvent(editingId, draft);
      } else {
        await addEvent(draft);
      }
      setFormOpen(false);
    } finally {
      setSaving(false);
    }
  }

  const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];
  const upcomingSorted = [...events].sort((a: any, b: any) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime());

  return (
    <div>
      <Topbar
        title="Schedule"
        subtitle="Webinars, office hours, and community events"
        actions={<Button icon={Plus} onClick={() => openAdd(null)}>Add Event</Button>}
      />

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-ink-100">{monthLabel}</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="p-1.5 rounded-lg glass hover:bg-white/5 transition-colors focus-ring">
                <ChevronLeft size={15} className="text-ink-300" />
              </button>
              <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="p-1.5 rounded-lg glass hover:bg-white/5 transition-colors focus-ring">
                <ChevronRight size={15} className="text-ink-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center text-[11px] text-ink-500 font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              if (!d) return <div key={i} />;
              const key = toDateKey(d);
              const dayEvents = eventsByDate[key] || [];
              const isSelected = selectedDate === key;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(key)}
                  className={classNames(
                    "aspect-square rounded-lg p-1.5 flex flex-col items-center justify-start transition-colors text-left relative",
                    isSelected ? "bg-ember-500/15 border border-ember-500/40" : "border border-transparent hover:bg-white/[0.04]"
                  )}
                >
                  <span className={classNames("text-xs", isSelected ? "text-ember-400 font-semibold" : "text-ink-300")}>{d.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev: any) => (
                        <span key={ev.id} className="w-1.5 h-1.5 rounded-full bg-ember-500" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">
              {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "All upcoming"}
            </h3>
            {selectedDate && (
              <button onClick={() => setSelectedDate(null)} className="text-xs text-ink-500 hover:text-ink-100">Clear</button>
            )}
          </div>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {(selectedDate ? selectedEvents : upcomingSorted).length === 0 && (
              <EmptyState icon={CalendarDays} title="Nothing scheduled" description="Pick a date or add a new event." />
            )}
            {(selectedDate ? selectedEvents : upcomingSorted).map((ev: any) => (
              <div key={ev.id} className="glass rounded-lg p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-ink-100 font-medium truncate">{ev.title}</p>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-ink-500">
                      <Clock size={11} /> {ev.time}
                      <MapPin size={11} className="ml-1.5" /> {ev.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => openEdit(ev)} className="p-1 rounded text-ink-500 hover:text-ink-100 transition-colors focus-ring">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => setDeleteTarget(ev)} className="p-1 rounded text-ink-500 hover:text-red-400 transition-colors focus-ring">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <Badge tone={typeTone[ev.type]}>{ev.type}</Badge>
                  <span className="text-xs text-ink-500">{ev.host}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId ? "Edit event" : "Add event"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Add event"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Event title">
            <Input value={draft.title} onChange={(e: any) => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Live Q&A with mentors" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <Input type="date" value={draft.date} onChange={(e: any) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <Input type="time" value={draft.time} onChange={(e: any) => setDraft({ ...draft, time: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Type">
              <Select value={draft.type} onChange={(e: any) => setDraft({ ...draft, type: e.target.value })}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Host">
              <Input value={draft.host} onChange={(e: any) => setDraft({ ...draft, host: e.target.value })} placeholder="e.g. Diego Fernandez" />
            </Field>
          </div>
          <Field label="Location">
            <Input value={draft.location} onChange={(e: any) => setDraft({ ...draft, location: e.target.value })} placeholder="Online or address" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && removeEvent(deleteTarget.id)}
        title="Delete event"
        description={`"${deleteTarget?.title}" will be removed from the schedule.`}
      />
    </div>
  );
}
