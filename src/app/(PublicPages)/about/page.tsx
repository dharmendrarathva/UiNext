import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | UiSnap",
  description:
    "Learn about UiSnap — a modern UI component platform crafted for developers who care about design and performance.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen  text-neutral-200 px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            About <span className="text-white">UiSnap</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            UiSnap is a modern UI component ecosystem crafted for developers
            who value clean design, scalability, and performance-first
            architecture.
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-neutral-400 leading-relaxed">
              We aim to simplify frontend development by providing
              production-ready UI components that are accessible,
              customizable, and visually refined. Our goal is to eliminate
              repetitive UI building so developers can focus on solving real
              problems.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Our Philosophy</h2>
            <p className="text-neutral-400 leading-relaxed">
              Design is not decoration — it is structure. Every component in
              UiSnap is built with performance optimization, responsive
              layouts, and scalable architecture in mind.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">
            Core Principles
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[
              {
                title: "Performance First",
                desc: "Optimized components built with minimal runtime overhead.",
              },
              {
                title: "Developer Experience",
                desc: "Clean APIs, composable architecture, and easy integration.",
              },
              {
                title: "Design Precision",
                desc: "Pixel-perfect spacing, typography, and alignment.",
              },
              {
                title: "Accessibility",
                desc: "Built with inclusive design and semantic structure.",
              },
              {
                title: "Scalability",
                desc: "Engineered for both small projects and enterprise systems.",
              },
              {
                title: "Modern Stack",
                desc: "Powered by Next.js, React, and Tailwind CSS.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-neutral-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Looking Ahead</h2>
          <p className="text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            UiSnap is continuously evolving. We are expanding our component
            library, improving performance, and building tools that empower
            developers to create exceptional user interfaces faster than ever.
          </p>
        </section>

      </div>
    </main>
  );
}