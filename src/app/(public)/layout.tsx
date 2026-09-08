'use client';

import React from 'react';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { useTheme } from '@/context/ThemeContext';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isBright } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-orange-500 selection:text-white ${
        isBright ? 'bg-[#FAF4EE] text-[#1C1917]' : 'bg-[#080604] text-slate-100'
      }`}
    >
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
