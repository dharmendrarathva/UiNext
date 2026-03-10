import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Category } from "@/models/Category";
import Link from "next/link";

async function getCategories() {
  await connectDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return categories.map((c: any) => ({
    _id: c._id.toString(),
    name: c.name,
    slug: c.slug,
  }));
}

export default async function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);
  const categories = await getCategories();

  return (
    <>
      <Header session={session} />

      <main className="max-w-full mx-auto   min-h-screen">

        <div className="flex gap-10 mt-6">

          {/* Sidebar */}
          <aside className="w-[260px] shrink-0">

            <div className="sticky top-24 bg-neutral-900 border border-neutral-800 rounded-xl p-5">

              <h2 className="text-lg font-semibold mb-4">
                Categories
              </h2>

              <div className="flex flex-col gap-1">

                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/${cat.slug}`}
                    className="px-3 py-2 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                  >
                    {cat.name}
                  </Link>
                ))}

              </div>

            </div>

          </aside>

          {/* Page Content */}
          <section className="flex-1">
            {children}
          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}