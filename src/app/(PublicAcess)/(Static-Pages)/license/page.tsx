import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License | UiSnap",
  description:
    "Learn about the licensing terms for using UiSnap components and resources.",
};

export default function LicensePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">

      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          License
        </h1>
        <p className="text-neutral-400">
          Last updated: March 2026
        </p>
      </section>

      <div className="space-y-12 text-neutral-400 leading-relaxed">

        {/* Overview */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Overview
          </h2>
          <p>
            UiSnap provides UI components and related resources for personal
            and commercial use under the terms described below. By using
            UiSnap components, you agree to comply with this License.
          </p>
        </section>

        {/* Permitted Use */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Permitted Use
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>You may use UiSnap components in personal and commercial projects.</li>
            <li>You may modify components to fit your project requirements.</li>
            <li>You may deploy projects containing UiSnap components to production.</li>
          </ul>
        </section>

        {/* Restrictions */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. Restrictions
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>You may not resell UiSnap components as standalone products.</li>
            <li>You may not redistribute the components in a competing UI library.</li>
            <li>You may not claim UiSnap components as your own original work.</li>
          </ul>
        </section>

        {/* Open Source */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Open Source Contributions
          </h2>
          <p>
            If UiSnap includes open-source components, those components may be
            governed by their respective licenses. In such cases, the open-source
            license terms will apply.
          </p>
        </section>

        {/* Attribution */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            5. Attribution
          </h2>
          <p>
            Attribution is appreciated but not required unless explicitly stated.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Termination
          </h2>
          <p>
            Violation of this License may result in termination of access to
            UiSnap resources and services.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            7. Disclaimer
          </h2>
          <p>
            UiSnap components are provided "as is" without warranties of any
            kind. We are not liable for damages arising from their use.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Contact
          </h2>
          <p>
            For licensing inquiries, contact us at{" "}
            <span className="text-white">support@uisnap.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
}