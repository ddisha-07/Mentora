"use client";

import { ReactNode, ComponentType } from "react";
import { motion } from "framer-motion";
import { classNames } from "@/lib/admin/utils";

const variants: Record<string, string> = {
  primary:
    "bg-ember-500 text-base-950 font-semibold hover:bg-ember-400 shadow-ember",
  secondary:
    "glass text-ink-100 hover:bg-white/[0.06]",
  ghost:
    "text-ink-300 hover:text-ink-100 hover:bg-white/[0.05]",
  danger:
    "bg-red-500/15 text-red-300 border border-red-500/30 hover:bg-red-500/25",
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
