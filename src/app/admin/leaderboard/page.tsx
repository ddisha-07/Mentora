"use client";

import { useState } from "react";
import { Plus, Minus, Pencil, Medal } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import GlassCard from "@/components/admin/ui/GlassCard";
import Button from "@/components/admin/ui/Button";
import Modal from "@/components/admin/ui/Modal";
import Avatar from "@/components/admin/ui/Avatar";
import { Field, Input } from "@/components/admin/ui/Field";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { classNames } from "@/lib/admin/utils";

const rankColor = ["#ffd166", "#c8c8cc", "#ff9548"];

export default function LeaderboardPage() {
  const { leaderboard, addPoints, removePoints, setPoints } = useAdminData();

  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [editTarget, setEditTarget] = useState<any>(null);
  const [editValue, setEditValue] = useState("");

  function getAmount(id: string) {
    return amounts[id] ?? 10;
  }

  function openEdit(entry: any) {
    setEditTarget(entry);
    setEditValue(String(entry.points));
  }

  async function handleSaveEdit() {
    if (!editTarget) return;
    await setPoints(editTarget.id, Number(editValue) || 0);
    setEditTarget(null);
  }

  return (
    <div>
      <Topbar title="Leaderboard" subtitle="Track and adjust learner rankings" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboard.slice(0, 3).map((entry: any, i: number) => (
          <GlassCard key={entry.id} strong className={classNames("p-5 flex flex-col items-center text-center", i === 0 && "sm:order-2 sm:-translate-y-2", i === 1 && "sm:order-1", i === 2 && "sm:order-3")}>
            <div className="relative mb-3">
              <Avatar name={entry.name} color={entry.avatarColor} size={56} />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-base-950"
                style={{ background: rankColor[i] }}
              >
                {i + 1}
              </div>
            </div>
            <p className="text-sm font-semibold text-ink-100">{entry.name}</p>
            <p className="text-lg font-bold text-ember-500 mt-1">{entry.points.toLocaleString()}</p>
            <p className="text-xs text-ink-500">points</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ink-500 border-b border-line-soft">
                <th className="font-medium px-5 py-3">Rank</th>
                <th className="font-medium px-5 py-3">Learner</th>
                <th className="font-medium px-5 py-3">Points</th>
                <th className="font-medium px-5 py-3 text-right">Adjust</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry: any, i: number) => (
                <tr key={entry.id} className="border-b border-line-soft last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 text-ink-300">
                      {i < 3 ? <Medal size={14} style={{ color: rankColor[i] }} /> : <span className="text-ink-500 w-3.5 text-center">{i + 1}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={entry.name} color={entry.avatarColor} size={32} />
                      <span className="text-ink-100 font-medium">{entry.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-ember-500">{entry.points.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        type="number"
                        value={getAmount(entry.id)}
                        onChange={(e) => setAmounts((prev) => ({ ...prev, [entry.id]: Number(e.target.value) }))}
                        className="w-16 bg-white/[0.04] border border-line-soft rounded-lg px-2 py-1.5 text-xs text-ink-100 outline-none focus:border-ember-500/50 text-center"
                      />
                      <button
                        onClick={() => removePoints(entry.id, getAmount(entry.id))}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors focus-ring"
                        aria-label="Remove points"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => addPoints(entry.id, getAmount(entry.id))}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors focus-ring"
                        aria-label="Add points"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => openEdit(entry)}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-white/5 transition-colors focus-ring"
                        aria-label="Edit points"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit points"
        subtitle={editTarget?.name}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </>
        }
      >
        <Field label="Total points">
          <Input type="number" value={editValue} onChange={(e: any) => setEditValue(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
