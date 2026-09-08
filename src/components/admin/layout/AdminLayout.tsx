"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { useAdminLayout } from "@/context/admin/AdminLayoutContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { mobileOpen, setMobileOpen } = useAdminLayout();
  const pathname = usePathname();

  return (
    <div
      className="flex min-h-screen text-ink-100 font-sans"
      style={{
        background: `
          radial-gradient(1200px 600px at 85% -10%, rgba(255, 122, 26, 0.10), transparent 60%),
          radial-gradient(900px 500px at -10% 20%, rgba(255, 122, 26, 0.05), transparent 55%),
          #08090a
        `,
      }}
    >
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 px-5 lg:px-8 py-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
