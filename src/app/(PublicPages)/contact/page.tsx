import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | UiSnap",
  description:
    "Get in touch with the UiSnap team for support, partnerships, or general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">

      {/* Hero */}
      <section className="text-center mb-24">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6">
          Get in Touch
        </h1>
        <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
          Have a question, suggestion, or partnership idea?  
          We’d love to hear from you.
        </p>
      </section>

      {/* Content Grid */}
      <section className="grid md:grid-cols-2 gap-16">

        {/* Contact Info */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">
            Contact Information
          </h2>

          <div className="space-y-6 text-neutral-400">

            <div>
              <p className="text-white font-medium mb-1">Email</p>
              <p>support@uisnap.com</p>
            </div>

            <div>
              <p className="text-white font-medium mb-1">Location</p>
              <p>Remote-first, Worldwide</p>
            </div>

            <div>
              <p className="text-white font-medium mb-1">Response Time</p>
              <p>We typically reply within 24–48 hours.</p>
            </div>

          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-neutral-900 border border-white/10 p-8 rounded-2xl">

          <h2 className="text-2xl font-semibold mb-6">
            Send a Message
          </h2>

          <form className="space-y-6">

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Message
              </label>
              <textarea
                rows={4}
                placeholder="How can we help?"
                className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-black font-medium py-3 rounded-lg hover:bg-amber-400 transition"
            >
              Send Message
            </button>

          </form>

        </div>

      </section>

    </div>
  );
}