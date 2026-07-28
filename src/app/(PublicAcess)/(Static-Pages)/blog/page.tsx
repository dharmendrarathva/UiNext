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
    slug: "why-ready-made-components",
    title: "Why Ready-Made Components Are the Future of Web Development",
    excerpt:
      "Discover how pre-built UI libraries like UiSnap accelerate development without compromising on quality or customization.",
    date: "March 2026",
  },
  {
    slug: "getting-started-uisnap",
    title: "Getting Started with UiSnap: Build Faster, Ship Smarter",
    excerpt:
      "A step-by-step guide to integrating UiSnap's component library into your Next.js or React project in under 5 minutes.",
    date: "February 2026",
  },
  {
    slug: "customizing-uisnap",
    title: "How to Customize UiSnap Components to Match Your Brand",
    excerpt:
      "Learn how to tailor UiSnap's ready-made components with Tailwind CSS, CSS variables, and theming for a unique look.",
    date: "January 2026",
  },
  {
    slug: "design-systems-vs-component-libraries",
    title: "Design Systems vs. Component Libraries: What UiSnap Gets Right",
    excerpt:
      "Understanding the difference and why UiSnap strikes the perfect balance for teams of all sizes.",
    date: "December 2025",
  },
  {
    slug: "accessibility-built-in",
    title: "Accessibility by Default: How UiSnap Saves You Compliance Headaches",
    excerpt:
      "Every UiSnap component ships with WCAG 2.1 compliance built-in. Here's what that means for your next project.",
    date: "November 2025",
  },
  {
    slug: "from-scratch-to-snap",
    title: "From Scratch to Snap: One Developer's Journey to Faster UI Development",
    excerpt:
      "How switching from custom-built components to UiSnap reduced our development time by 60% and improved consistency.",
    date: "October 2025",
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
          Tips, tutorials, and updates to help you build faster with our ready-made component library.
        </p>
      </section>

      {/* Blog Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
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
          Ready to build faster?
        </h2>
        <p className="text-neutral-400 mb-8">
          Explore 200+ ready-made components and start shipping in minutes.
        </p>
        <Link
          href="/components"
          className="inline-block bg-amber-500 text-black px-6 py-3 rounded-lg font-medium hover:bg-amber-400 transition"
        >
          Browse Component Library
        </Link>
      </section>

    </div>
  );
}