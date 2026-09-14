import { ElementType, ReactNode } from "react";
import { classNames } from "@/lib/admin/utils";

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  strong?: boolean;
  as?: ElementType;
  [key: string]: any;
}

export default function GlassCard({ children, className, strong = false, as: Tag = "div", ...rest }: GlassCardProps) {
  return (
    <Tag
      className={classNames(
        strong ? "glass-strong" : "glass",
        "rounded-xl2 shadow-glass bg-[#0d0f15]/90 border border-white/10",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
