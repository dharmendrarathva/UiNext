import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const session = await getServerSession(authOptions);

  // Keep your authentication logic exactly the same
  if (!session?.user?.id) {
    redirect("/login");
  }

  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPERADMIN"
  ) {
    redirect("/");
  }

  return (
    <>
      <Header session={session} />

      <div className="min-h-screen bg-neutral-950">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}