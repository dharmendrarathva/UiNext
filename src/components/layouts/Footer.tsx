import Link from "next/link";
import FooterText from "./FooterText";

const PRODUCT_LINKS = [
  { href: "/blocks", label: "All Blocks" },
  { href: "/categories", label: "Categories" },
  { href: "/pricing", label: "Pricing" },
  { href: "/new", label: "New Releases" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
];

const LEGAL_LINKS = [
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/license", label: "License" },
];

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-[#060608] text-zinc-400">


      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-12 md:px-12">
        <div className="md:col-span-4">
          <h2 className="font-mono text-2xl font-semibold text-white">
            <span className="text-orange-500">{"<"}</span>
            UiSnap
            <span className="text-orange-500">{" />"}</span>
          </h2>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500">
            Ready-to-use modern UI blocks for developers. Build faster.
            Design smarter.
          </p>

          <form className="mt-6 flex max-w-xs items-center gap-2">
            <input
              type="email"
              placeholder="you@domain.com"
              className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition focus:border-orange-500/50 focus:bg-white/[0.05]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-md bg-orange-500 px-3 py-2 text-sm font-medium text-black transition hover:bg-orange-400"
            >
              Join
            </button>
          </form>
        </div>

        <div className="grid grid-cols-3 gap-8 md:col-span-8 md:grid-cols-3">
          <FooterColumn title="Product" links={PRODUCT_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>
      </div>

      <div className="border-t border-white/10">
          <FooterText />
       
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-600">
        // {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-zinc-400 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}