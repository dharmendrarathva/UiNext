import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const metadata: Metadata = {
  title: "UiSnap",
  description: "Application",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen antialiased">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}