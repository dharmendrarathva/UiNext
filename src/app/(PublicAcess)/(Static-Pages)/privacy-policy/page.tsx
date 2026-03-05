import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | UiSnap",
  description:
    "Learn how UiSnap collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">

      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Privacy Policy
        </h1>
        <p className="text-neutral-400">
          Last updated: March 2026
        </p>
      </section>

      <div className="space-y-12 text-neutral-400 leading-relaxed">

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Introduction
          </h2>
          <p>
            UiSnap ("we", "our", or "us") respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, and safeguard your data when
            you use our platform.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              Account information such as name, email address, and profile
              image (via Google authentication).
            </li>
            <li>
              Usage data including pages visited, interactions, and browser
              information.
            </li>
            <li>
              Technical information such as IP address and device type.
            </li>
          </ul>
        </section>

        {/* How We Use Information */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>To provide and improve our platform.</li>
            <li>To authenticate and manage user accounts.</li>
            <li>To respond to support inquiries.</li>
            <li>To enhance security and prevent fraud.</li>
          </ul>
        </section>

        {/* Authentication */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Third-Party Authentication
          </h2>
          <p>
            UiSnap uses Google OAuth for secure authentication. We only access
            the basic profile information required to create and manage your
            account. We do not access your Google password.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            5. Cookies and Tracking
          </h2>
          <p>
            We may use cookies and similar technologies to enhance user
            experience, analyze traffic, and maintain secure sessions.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Data Security
          </h2>
          <p>
            We implement reasonable technical and organizational measures to
            protect your data from unauthorized access, misuse, or disclosure.
          </p>
        </section>

        {/* Data Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            7. Data Sharing
          </h2>
          <p>
            We do not sell or rent your personal data. We may share limited
            information with trusted service providers required to operate the
            platform.
          </p>
        </section>

        {/* User Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Your Rights
          </h2>
          <p>
            You may request access, correction, or deletion of your personal
            data by contacting us.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of UiSnap after changes indicates your acceptance of the revised
            policy.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            10. Contact Us
          </h2>
          <p>
            If you have questions regarding this Privacy Policy, please contact
            us at <span className="text-white">support@uisnap.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
}