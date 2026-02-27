'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
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

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-32 pb-20 px-6 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 70%),
          radial-gradient(900px circle at var(--mx) var(--my), rgba(124, 58, 237, 0.12) 0%, transparent 60%),
          #0A0A0F
        `,
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16 fade-up">
          <h1 className="font-jakarta text-white mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.1 }}>
            Your Booking Website in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED]">10 Minutes</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-dm leading-relaxed">
            Select a template, fill in your details, and get a hosted booking site instantly. No coding. No hassle. Just bookings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center">
            <Link
              href="/"
              className="bg-[#9B5CF6] text-sm w-full sm:w-auto sm:min-w-[180px] rounded-full text-white py-3 px-6 text-center hover:bg-[#8B4CF5] transition-colors"
            >
              Get Started
            </Link>

            <Link
              href="/"
              className="text-sm w-full sm:w-auto sm:min-w-[180px] py-3 px-6 rounded-full text-white border border-[#9B5CF6] text-center hover:bg-[#8B4CF5] transition-colors"
            >
              See How it Works
            </Link>
          </div>
        </div>

        {/* Laptop Mockup */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-b from-[#111118] to-[#0A0A0F] rounded-2xl border border-white/10 p-2 shadow-2xl">
            {/* Laptop Frame */}
            <div className="rounded-xl overflow-hidden bg-[#16161F] border border-white/5">
              {/* Browser Chrome */}
              <div className="bg-[#111118] border-b border-white/5 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-white/40 text-xs font-dm">yourbusiness.bookease.com</span>
                </div>
              </div>

              {/* Browser Content */}
              <div className="bg-[#0A0A0F] aspect-video flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-transparent to-transparent" />

                {/* Layout: Left content + Right booking card */}
                <div className="w-full h-full flex relative z-10">
                  {/* Left Side - Event Info */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    {/* Event Title */}
                    <div className="mb-6">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 mb-4">
                        <span className="text-[#9B5CF6] text-xs font-dm font-medium">FEATURED EVENT</span>
                      </div>
                      <h2 className="text-2xl font-jakarta text-white mb-2">Summer Music Festival</h2>
                      <p className="text-white/60 text-sm font-dm">Experience 3 days of music, art, and culture</p>
                    </div>

                    {/* Image Gallery (Placeholder Grid) */}
                    <div className="grid grid-cols-3 gap-2 mb-6">
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] opacity-40" />
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-[#EC4899] to-[#F97316] opacity-40" />
                      <div className="aspect-square rounded-lg bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] opacity-40" />
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-white/80 font-dm font-semibold text-sm mb-2">What to Expect</h3>
                      <p className="text-white/50 text-xs font-dm leading-relaxed">
                        Join thousands for three days of live performances, interactive art installations, food vendors, and unforgettable memories.
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Booking Card */}
                  <div className="w-64 p-6 bg-gradient-to-b from-[#16161F] to-[#111118] border-l border-white/5 flex flex-col justify-between">
                    <div>
                      <div className="space-y-4 mb-6">
                        <div>
                          <p className="text-white/40 text-xs font-dm mb-1">Date</p>
                          <p className="text-white text-sm font-dm">Jun 15-17, 2024</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs font-dm mb-1">Time</p>
                          <p className="text-white text-sm font-dm">10:00 AM - 11:00 PM</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-xs font-dm mb-1">Location</p>
                          <p className="text-white text-sm font-dm">Central Park, NYC</p>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-white/40 text-xs font-dm mb-1">From</p>
                          <p className="text-[#9B5CF6] text-xl font-jakarta font-bold">$49</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full btn-accent text-sm">Book Now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bezel decoration */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#7C3AED]/5 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#9B5CF6]/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
