'use client'

import { Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const columns = {
    Product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how' },
      { label: 'Templates', href: '#templates' },
      { label: 'Pricing', href: '#pricing' },
    ],
    Business: [
      { label: 'Event Organizers', href: '#' },
      { label: 'Café Owners', href: '#' },
      { label: 'Case Studies', href: '#' },
      { label: 'API Docs', href: '#' },
    ],
    Company: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    Legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  }

  return (
    <footer className="bg-[#0A0A0F] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Left - Logo & Newsletter */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-jakarta text-xl font-bold text-white mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                B
              </div>
              BookEase
            </div>
            <p className="text-white/50 font-dm text-sm mb-6 leading-relaxed">
              The simplest way to create booking websites. Built for India.
            </p>
            {/* Social Icons placeholder */}
            <div className="flex gap-3">
              {['twitter', 'instagram', 'linkedin'].map((social) => (
                <button
                  key={social}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center text-white/60 hover:text-white"
                  aria-label={social}
                >
                  <div className="w-4 h-4 rounded-full bg-white/20" />
                </button>
              ))}
            </div>
          </div>

          {/* Columns */}
          {Object.entries(columns).map(([title, links]) => (
            <div key={title} className="md:col-span-1">
              <h3 className="text-white font-dm font-semibold mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-white font-dm text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="card-base p-6 md:p-8 mb-12 border-l-2 border-l-[#7C3AED]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-dm font-semibold mb-2">Stay Updated</h3>
              <p className="text-white/60 font-dm text-sm">
                Get tips, updates, and special offers delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:flex-none px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/40 font-dm text-sm focus:outline-none focus:border-[#7C3AED] transition-colors"
              />
              <button className="px-4 py-3 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] text-white hover:shadow-lg hover:shadow-violet-500/20 transition-all flex items-center gap-2">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 font-dm text-sm">
            © 2024 BookEase. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-white/50 font-dm text-sm">System Status: All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
