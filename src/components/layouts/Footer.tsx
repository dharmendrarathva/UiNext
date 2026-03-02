import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        
        <div>
          <h2 className="text-2xl font-se mibold text-white mb-3">UiSnap</h2>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Ready-to-use modern UI blocks for developers. Build faster. Design smarter.
          </p>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blocks" className="hover:text-white transition">All Blocks</Link></li>
            <li><Link href="/categories" className="hover:text-white transition">Categories</Link></li>
            <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
            <li><Link href="/new" className="hover:text-white transition">New Releases</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-medium mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/license" className="hover:text-white transition">License</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          
          <p>© {new Date().getFullYear()} UiSnap. All rights reserved.</p>

          {/* Social Icons */}
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.8a8.5 8.5 0 0 1-2.4.7 4.2 4.2 0 0 0 1.8-2.3 8.4 8.4 0 0 1-2.7 1A4.2 4.2 0 0 0 11 8.7a12 12 0 0 1-8.7-4.4 4.2 4.2 0 0 0 1.3 5.6 4 4 0 0 1-1.9-.5v.1a4.2 4.2 0 0 0 3.4 4.1 4.3 4.3 0 0 1-1.9.1 4.2 4.2 0 0 0 3.9 2.9A8.5 8.5 0 0 1 2 19.5a12 12 0 0 0 6.5 1.9c7.8 0 12.1-6.5 12.1-12.1v-.6A8.6 8.6 0 0 0 22 5.8z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h7v-9H9v-3h3V9.5C12 6.4 13.9 5 16.6 5c1.3 0 2.4.1 2.7.1v3h-1.9c-1.5 0-1.8.7-1.8 1.7V12h3.6l-.5 3H15v9h4c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-white transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 2.2 3.4 1.6.1-.7.4-1.2.7-1.5-2.7-.3-5.6-1.3-5.6-6A4.7 4.7 0 0 1 5 7.2c-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.3a11.5 11.5 0 0 1 6.2 0C17 3.5 18 3.8 18 3.8c.6 1.8.2 3.1.1 3.4a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.9 5.7-5.6 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 24 12c0-6.6-5.4-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
