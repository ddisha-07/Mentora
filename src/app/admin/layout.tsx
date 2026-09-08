import { ReactNode } from "react";
import { ToastProvider } from "@/context/admin/ToastContext";
import { AdminDataProvider } from "@/context/admin/AdminDataContext";
import { AdminLayoutProvider } from "@/context/admin/AdminLayoutContext";
import AdminLayout from "@/components/admin/layout/AdminLayout";

export const metadata = {
  title: "Mentora Admin Panel",
  description: "Management portal for users, courses, skills, events, and community.",
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <AdminDataProvider>
        <AdminLayoutProvider>
          <AdminLayout>{children}</AdminLayout>
        </AdminLayoutProvider>
      </AdminDataProvider>
    </ToastProvider>
  );
}
