import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | GNG Global",
  description: "Admin dashboard for managing news posts.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-ivory-50">{children}</div>;
}
