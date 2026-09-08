import { ReactNode } from "react";
import { classNames } from "@/lib/admin/utils";

const tones: Record<string, string> = {
  neutral: "bg-white/[0.06] text-ink-300 border-line-soft",
  ember: "bg-ember-500/12 text-ember-400 border-ember-500/25",
  green: "bg-emerald-500/12 text-emerald-400 border-emerald-500/25",
  red: "bg-red-500/12 text-red-400 border-red-500/25",
  blue: "bg-sky-500/12 text-sky-400 border-sky-500/25",
  yellow: "bg-amber-500/12 text-amber-400 border-amber-500/25",
};

interface BadgeProps {
  children: ReactNode;
  tone?: "neutral" | "ember" | "green" | "red" | "blue" | "yellow" | string;
  className?: string;
}

export default function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border",
        tones[tone] || tones.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
