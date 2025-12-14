import Link from 'next/link'
import { Bot, Facebook, Twitter, Youtube, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-card border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-primary" />
              <span className="text-xl font-display font-bold text-gradient">
                Tech-Wize
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered digital production and automation company helping creators and businesses succeed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/services/property-marketing" className="hover:text-primary transition-colors">
                  Property Marketing
                </Link>
              </li>
              <li>
                <Link href="/services/product-promo" className="hover:text-primary transition-colors">
                  Product Promo
                </Link>
              </li>
              <li>
                <Link href="/services/creator-branding" className="hover:text-primary transition-colors">
                  Creator Branding
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Youtube size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              WhatsApp: <a href="https://wa.me/" className="text-primary hover:underline">Chat with us</a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>© 2024 Tech-Wize. Built with AI for the digital economy.</p>
        </div>
      </div>
    </footer>
  )
}
