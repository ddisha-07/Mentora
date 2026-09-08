"use client";

import { ReactNode } from "react";
import { Menu, Bell } from "lucide-react";
import { useAdminLayout } from "@/context/admin/AdminLayoutContext";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  actions?: ReactNode;
}

export default function Topbar({ title, subtitle, onMenuClick, actions }: TopbarProps) {
  const layout = useAdminLayout();
  const handleMenuClick = onMenuClick || layout.openMobileMenu;

  return (
    <header className="sticky top-0 z-30 glass-strong border-x-0 border-t-0 rounded-none px-5 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={handleMenuClick}
          className="lg:hidden text-ink-300 hover:text-ink-100 p-1.5 -ml-1.5 focus-ring rounded"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-ink-100 tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-xs text-ink-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <button
          className="w-9 h-9 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-colors focus-ring"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </button>
      </div>
    </header>
  );
}
