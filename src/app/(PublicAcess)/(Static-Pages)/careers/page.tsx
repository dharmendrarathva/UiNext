"use client";

import { useState } from "react";
import ApplyForm from "@/components/Overlays/ApplyForm";

const roles = [
  {
    title: "Frontend Developer",
    stack: "Next.js • React • TypeScript",
    description:
      "Build scalable, production-ready UI components with performance, accessibility, and clean architecture in mind.",
  },
  {
    title: "Backend Developer",
    stack: "Node.js • Express • TypeScript",
    description:
      "Design secure APIs, implement role-based systems, and optimize database performance for scalability.",
  },
  {
    title: "UI Component Team Mate",
    stack: "Design Systems • Tailwind ",
    description:
      "Collaborate on crafting beautiful, reusable UI components and evolving UiSnap’s design system.",
  },
];

export default function CareersPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">

      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Join the UiSnap Team
        </h1>

        <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
          We’re building next-generation UI components and developer tools.
          If you care about clean code, scalable systems, and pixel-perfect design —
          let’s build something awesome together.
        </p>
      </section>

      {/* Why Work With Us */}
      <section className="grid md:grid-cols-3 gap-8 mb-24">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Remote First</h3>
          <p className="text-sm text-neutral-400">
            Work from anywhere and collaborate asynchronously.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Ownership Culture</h3>
          <p className="text-sm text-neutral-400">
            Take ownership of features and shape the product direction.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">High Engineering Standards</h3>
          <p className="text-sm text-neutral-400">
            We prioritize performance, scalability, and system design.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section>
        <h2 className="text-2xl font-semibold mb-12 text-center">
          Open Positions
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group bg-neutral-900 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 "
            >
              <h3 className="text-xl font-semibold mb-3 group-hover:text-neutral-300 transition">
                {role.title}
              </h3>

              <p className="text-neutral-300 text-sm mb-4">
                {role.stack}
              </p>

              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                {role.description}
              </p>

              <button
                onClick={() => setSelectedRole(role.title)}
                className="w-full bg-blue-500/80 text-black py-2 rounded-lg font-medium hover:bg-blue-400/80 transition"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center mt-28">
        <h2 className="text-2xl font-semibold mb-6">
          Don’t see your role?
        </h2>

        <p className="text-neutral-400 mb-8">
          If you believe you can add value to UiSnap, we’d love to hear from you.
        </p>

        <button
          onClick={() => setSelectedRole("General Application")}
          className="bg-neutral-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-700 transition"
        >
          Send General Application
        </button>
      </section>

      {/* Apply Modal */}
      {selectedRole && (
        <ApplyForm
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
        />
      )}
    </div>
  );
}