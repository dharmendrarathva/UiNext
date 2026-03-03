import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | UiSnap",
  description:
    "Read the Terms and Conditions governing the use of the UiSnap platform.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">

      {/* Header */}
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Terms & Conditions
        </h1>
        <p className="text-neutral-400">
          Last updated: March 2026
        </p>
      </section>

      <div className="space-y-12 text-neutral-400 leading-relaxed">

        {/* Acceptance */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using UiSnap, you agree to comply with these Terms
            and Conditions. If you do not agree, you may not use the platform.
          </p>
        </section>

        {/* Use of Platform */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            2. Use of the Platform
          </h2>
          <p>
            UiSnap provides UI components and related resources. You agree to
            use the platform only for lawful purposes and in a way that does
            not infringe the rights of others.
          </p>
        </section>

        {/* User Accounts */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            3. User Accounts
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>You must authenticate via Google to create an account.</li>
            <li>You are responsible for maintaining account security.</li>
            <li>You agree not to impersonate another individual.</li>
          </ul>
        </section>

        {/* Content Ownership */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            4. Content Ownership
          </h2>
          <p>
            All content provided by UiSnap, including UI components, branding,
            and platform design, is protected by intellectual property laws.
            You may not reproduce or redistribute content without permission.
          </p>
        </section>

        {/* User Submissions */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            5. User Submissions
          </h2>
          <p>
            If you submit components, code, or other content, you grant UiSnap
            a non-exclusive, worldwide license to display and distribute that
            content on the platform.
          </p>
        </section>

        {/* Prohibited Activities */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            6. Prohibited Activities
          </h2>
          <ul className="list-disc pl-6 space-y-3">
            <li>Uploading malicious or harmful code.</li>
            <li>Attempting to breach platform security.</li>
            <li>Scraping or copying content at scale.</li>
            <li>Using the platform for illegal purposes.</li>
          </ul>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            7. Account Suspension or Termination
          </h2>
          <p>
            UiSnap reserves the right to suspend or terminate accounts that
            violate these Terms or pose security risks.
          </p>
        </section>

        {/* Disclaimer */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            8. Disclaimer of Warranties
          </h2>
          <p>
            UiSnap is provided "as is" without warranties of any kind.
            We do not guarantee uninterrupted or error-free service.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            9. Limitation of Liability
          </h2>
          <p>
            UiSnap shall not be liable for any indirect, incidental, or
            consequential damages resulting from the use of the platform.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            10. Changes to Terms
          </h2>
          <p>
            We may update these Terms at any time. Continued use of the
            platform after updates constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            11. Governing Law
          </h2>
          <p>
            These Terms shall be governed by and interpreted in accordance with
            applicable laws in your jurisdiction.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-4">
            12. Contact Information
          </h2>
          <p>
            For questions regarding these Terms, contact us at{" "}
            <span className="text-white">support@uisnap.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
}