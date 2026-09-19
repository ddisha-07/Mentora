"use client";

import { ReactNode, ComponentType } from "react";
import { motion } from "framer-motion";
import { classNames } from "@/lib/admin/utils";

const variants: Record<string, string> = {
  primary:
    "bg-ember-500 text-white font-semibold hover:bg-ember-600 shadow-ember",
  secondary:
    "border border-slate-200 dark:border-white/10 text-slate-700 dark:text-ink-100 bg-white dark:bg-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.08]",
  ghost:
    "text-slate-600 dark:text-ink-300 hover:text-slate-900 dark:hover:text-ink-100 hover:bg-slate-100 dark:hover:bg-white/[0.05]",
  danger:
    "bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm",
};

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-sm gap-2",
};

interface ButtonProps {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  [key: string]: any;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled}
      className={classNames(
        "inline-flex items-center justify-center rounded-lg transition-colors duration-150 focus-ring disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </motion.button>
  );
}
