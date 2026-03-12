import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <main>{children}</main>
    </>
  );
}