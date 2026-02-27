'use client'

import { X, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubscriptionPopupProps {
  onClose: () => void
}

export function SubscriptionPopup({ onClose }: SubscriptionPopupProps) {
  const router = useRouter()

  const handleViewPlans = () => {
    onClose()
    router.push('/#pricing')
  }

  return (
    // ── Backdrop ────────────────────────────────────────────────────────────────
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Card ────────────────────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Purple glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#7C3AED]/30 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="relative p-8 flex flex-col items-center text-center gap-5">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center shadow-lg shadow-[#7C3AED]/40">
            <Sparkles size={28} className="text-white" />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-white text-2xl font-jakarta font-bold mb-2">
              Unlock Your Dashboard
            </h2>
            <p className="text-white/50 font-dm text-sm leading-relaxed">
              You need an active plan to access the dashboard.
              Choose a plan that fits your needs and get started instantly.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="w-full flex flex-col gap-2">
            {[
              'Unlimited booking pages',
              'Real-time analytics & reports',
              'WhatsApp & email integrations',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-4 py-2.5"
              >
                <Zap size={14} className="text-[#9B5CF6] shrink-0" />
                <span className="text-white/70 font-dm text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleViewPlans}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white font-dm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/30"
          >
            View Plans & Pricing
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 font-dm text-xs transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}