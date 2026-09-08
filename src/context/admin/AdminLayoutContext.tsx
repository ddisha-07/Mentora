"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AdminLayoutContextType {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminLayoutContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        openMobileMenu: () => setMobileOpen(true),
        closeMobileMenu: () => setMobileOpen(false),
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const ctx = useContext(AdminLayoutContext);
  if (!ctx) {
    // Return safe fallback if used outside provider
    return {
      mobileOpen: false,
      setMobileOpen: () => {},
      openMobileMenu: () => {},
      closeMobileMenu: () => {},
    };
  }
  return ctx;
}
