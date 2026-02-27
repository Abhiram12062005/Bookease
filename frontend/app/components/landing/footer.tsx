'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      container.style.setProperty('--mx', `${x}%`)
      container.style.setProperty('--my', `${y}%`)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const trustSignals = [
    'No credit card required',
    'Free 14-day trial',
    'Cancel anytime',
    '24/7 support',
  ]

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
    <footer
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/5"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 70%),
          radial-gradient(900px circle at var(--mx) var(--my), rgba(124, 58, 237, 0.12) 0%, transparent 60%),
          #0A0A0F
        `,
      }}
    >
      <div className="relative z-10">

        {/* ================= CTA SECTION ================= */}
        <div className="max-w-4xl mx-auto text-center px-6 py-24">
          <h2
            className="font-jakarta text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}
          >
            Your Booking Website is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED]">
              10 Minutes Away
            </span>
          </h2>

          <p className="text-white/60 font-dm text-lg md:text-xl mb-12 leading-relaxed">
            Join thousands of event organizers and café owners creating their
            booking websites with BookEase today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-4 rounded-full font-dm font-semibold bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all">
              Start Free Today
            </button>
            <button className="px-8 py-4 rounded-full font-dm font-semibold bg-white/5 border border-white/10 text-white hover:border-white/20 transition-all">
              Schedule a Demo
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/5">
            {trustSignals.map((signal, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <CheckCircle size={20} className="text-[#10B981]" />
                <p className="text-white/70 font-dm text-sm">{signal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= FOOTER SECTION ================= */}
        <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 font-jakarta text-xl font-bold text-white mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
                BookEase
              </div>
              <p className="text-white/50 font-dm text-sm leading-relaxed">
                The simplest way to create booking websites. Built for India.
              </p>
            </div>

            {Object.entries(columns).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-white font-dm font-semibold mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/60 hover:text-white font-dm text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 font-dm text-sm">
              © 2024 BookEase. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-white/50 font-dm text-sm">
                System Status: All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}