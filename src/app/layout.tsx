import type { Metadata } from "next";

import Providers from "@/components/Providers";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
 

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import "./globals.css";

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
      <body className="bg-neutral-950 text-white min-h-screen flex flex-col">

        <Providers session={session}>

          <Header session={session} />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

        </Providers>

      </body>
    </html>
  );
}