import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog | UiSnap",
  description:
    "Insights, tutorials, and updates from the UiSnap team on building modern user interfaces.",
};

// Static placeholder posts (SSR)
const posts = [
  {
    slug: "design-systems-explained",
    title: "Design Systems Explained",
    excerpt:
      "A practical guide to building scalable design systems for modern web applications.",
    date: "March 2026",
  },
  {
    slug: "performance-first-ui",
    title: "Performance-First UI Components",
    excerpt:
      "Why performance should be the foundation of every component library.",
    date: "February 2026",
  },
  {
    slug: "modern-accessibility",
    title: "Modern Accessibility Practices",
    excerpt:
      "How to build inclusive interfaces without sacrificing visual design.",
    date: "January 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">

      {/* Hero Section */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          UiSnap Blog
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Insights, tutorials, and product updates to help you build better
          user interfaces.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog`}
            className="group bg-neutral-900 border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
          >
            <p className="text-xs text-neutral-500 mb-4">
              {post.date}
            </p>

            <h2 className="text-lg font-semibold mb-4 group-hover:text-amber-400 transition">
              {post.title}
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed">
              {post.excerpt}
            </p>

            <div className="mt-6 text-sm text-amber-500 font-medium">
              Read more →
            </div>
          </Link>
        ))}

      </section>

      {/* CTA Section */}
      <section className="text-center mt-28">
        <h2 className="text-2xl font-semibold mb-6">
          Want more insights?
        </h2>
        <p className="text-neutral-400 mb-8">
          Stay updated with the latest UI patterns and design trends.
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-amber-400 transition"
        >
          Explore Components
        </Link>
      </section>

    </div>
  );
}