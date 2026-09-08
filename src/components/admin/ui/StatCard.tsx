import { ComponentType } from "react";
import GlassCard from "./GlassCard";
import { classNames } from "@/lib/admin/utils";

const toneColor: Record<string, string> = {
  ember: "text-ember-500 bg-ember-500/10 border-ember-500/25",
  green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  blue: "text-sky-400 bg-sky-500/10 border-sky-500/25",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/25",
};

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ComponentType<{ size?: number; className?: string }>;
  delta?: string;
  tone?: "ember" | "green" | "blue" | "purple" | string;
}

export default function StatCard({ label, value, icon: Icon, delta, tone = "ember" }: StatCardProps) {
  return (
    <GlassCard className="p-5 flex items-start justify-between">
      <div>
        <p className="text-xs text-ink-500 mb-2">{label}</p>
        <p className="text-2xl font-semibold text-ink-100 tracking-tight">{value}</p>
        {delta && (
          <p className={classNames("text-xs mt-2 font-medium", delta.startsWith("-") ? "text-red-400" : "text-emerald-400")}>
            {delta}
          </p>
        )}
      </div>
      {Icon && (
        <div className={classNames("w-10 h-10 rounded-lg border flex items-center justify-center", toneColor[tone] || toneColor.ember)}>
          <Icon size={18} />
        </div>
      )}
    </GlassCard>
  );
}
