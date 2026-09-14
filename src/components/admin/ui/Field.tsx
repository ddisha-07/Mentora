import { ReactNode } from "react";
import { classNames } from "@/lib/admin/utils";

export function Label({ children }: { children: ReactNode }) {
  return <label className="block text-xs font-medium text-ink-500 mb-1.5">{children}</label>;
}

export function Input({ className, ...rest }: any) {
  return (
    <input
      className={classNames(
        "w-full bg-[#161820] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 outline-none transition-colors",
        "focus:border-ember-500/60 focus:bg-[#1b1e27] focus:ring-1 focus:ring-ember-500/30",
        className
      )}
      {...rest}
    />
  );
}

export function Textarea({ className, ...rest }: any) {
  return (
    <textarea
      className={classNames(
        "w-full bg-[#161820] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 outline-none transition-colors resize-none",
        "focus:border-ember-500/60 focus:bg-[#1b1e27] focus:ring-1 focus:ring-ember-500/30",
        className
      )}
      {...rest}
    />
  );
}

export function Select({ className, children, ...rest }: any) {
  return (
    <select
      className={classNames(
        "w-full bg-[#161820] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-ink-100 outline-none transition-colors appearance-none",
        "focus:border-ember-500/60 focus:bg-[#1b1e27] focus:ring-1 focus:ring-ember-500/30",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
