'use client'

import { useRef, useEffect } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function CTA() {
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

  return (
    <section
      ref={containerRef}
      className="py-24 px-6 bg-[#0A0A0F] relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 70%),
          radial-gradient(900px circle at var(--mx) var(--my), rgba(124, 58, 237, 0.12) 0%, transparent 60%),
          #0A0A0F
        `,
      }}
    >
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Headline */}
        <h2
          className="font-jakarta text-white mb-6 fade-up"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}
        >
          Your Booking Website is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED]">10 Minutes Away</span>
        </h2>

        {/* Subtitle */}
        <p className="text-white/60 font-dm text-lg md:text-xl mb-12 fade-up leading-relaxed">
          Join thousands of event organizers and café owners creating their booking websites with BookEase today. Start free, grow smart, succeed faster.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 fade-up">
          <button className="btn-accent flex items-center justify-center gap-2 text-lg px-8 py-4">
            Start Free Today
            <ArrowRight size={20} />
          </button>
          <button className="btn-ghost text-lg px-8 py-4">
            Schedule a Demo
          </button>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-white/5 fade-up">
          {trustSignals.map((signal, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <CheckCircle size={20} className="text-[#10B981]" />
              <p className="text-white/70 font-dm text-sm">{signal}</p>
            </div>
          ))}
        </div>

        {/* Background Accents */}
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-r from-[#7C3AED]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-32 w-64 h-64 bg-gradient-to-l from-[#9B5CF6]/10 to-transparent rounded-full blur-3xl" />
      </div>
    </section>
  )
}
