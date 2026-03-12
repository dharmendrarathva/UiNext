import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

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
      <body className="bg-neutral-950 text-white">
        <Providers session={session}>
                    <Header session={session} />

          {children}
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}