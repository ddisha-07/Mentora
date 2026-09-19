"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, ReactNode } from "react";
import { classNames } from "@/lib/admin/utils";
import { useTheme } from "@/context/ThemeContext";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  hideHeader?: boolean;
  noBodyPadding?: boolean;
}

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  hideHeader = false,
  noBodyPadding = false,
}: ModalProps) {
  const { isBright } = useTheme();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const widths: Record<string, string> = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={classNames(
              "relative w-full rounded-2xl shadow-2xl max-h-[88vh] flex flex-col transition-colors overflow-hidden z-10",
              isBright
                ? "bg-white border border-slate-200 text-slate-900 shadow-slate-900/20"
                : "bg-[#11141b] border border-white/15 text-ink-100 shadow-black",
              widths[size] || widths.md
            )}
            role="dialog"
            aria-modal="true"
          >
            {!hideHeader && (
              <div
                className={`flex items-start justify-between px-6 py-5 border-b shrink-0 rounded-t-2xl ${
                  isBright ? "border-slate-100 bg-slate-50/70" : "border-white/10 bg-[#151922]"
                }`}
              >
                <div>
                  <h2
                    className={`text-lg font-bold tracking-tight ${
                      isBright ? "text-slate-900" : "text-ink-100"
                    }`}
                  >
                    {title}
                  </h2>
                  {subtitle && (
                    <p className={`text-sm mt-0.5 ${isBright ? "text-slate-500" : "text-ink-500"}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className={`transition-colors p-1.5 rounded-lg focus-ring cursor-pointer ${
                    isBright
                      ? "text-slate-400 hover:text-slate-700 hover:bg-slate-200/70"
                      : "text-ink-500 hover:text-ink-100 hover:bg-white/10"
                  }`}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className={`overflow-y-auto flex-1 ${noBodyPadding ? "" : "px-6 py-5"}`}>{children}</div>
            {footer && (
              <div
                className={`px-6 py-4 border-t flex items-center justify-end gap-2 shrink-0 rounded-b-2xl ${
                  isBright ? "border-slate-100 bg-slate-50/70" : "border-white/10 bg-[#151922]"
                }`}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
