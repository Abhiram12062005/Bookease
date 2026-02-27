'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { X, AlertTriangle, ArrowRight, Zap } from 'lucide-react'

export function RenewSubscriptionPopup() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setShow(true)
    }
  }, [searchParams])

  if (!show) return null

  const handleRenew = () => {
    setShow(false)
    // Scroll to pricing section
    const el = document.getElementById('pricing')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    // Clean up URL param
    router.replace('/', { scroll: false })
  }

  const handleClose = () => {
    setShow(false)
    router.replace('/', { scroll: false })
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="relative w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* Red top accent */}
        <div className="h-1 bg-gradient-to-r from-red-500 to-orange-400" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 flex flex-col items-center text-center gap-5">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-400" />
          </div>

          {/* Text */}
          <div>
            <h2 className="text-white text-2xl font-jakarta font-bold mb-2">
              Your Plan Has Expired
            </h2>
            <p className="text-white/50 font-dm text-sm leading-relaxed">
              Your subscription has ended. Renew your plan to regain
              full access to your dashboard and all features.
            </p>
          </div>

          {/* Features */}
          <div className="w-full flex flex-col gap-2">
            {[
              'Restore full dashboard access',
              'Keep all your event data',
              'Resume analytics & integrations',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-4 py-2.5">
                <Zap size={14} className="text-[#9B5CF6] shrink-0" />
                <span className="text-white/70 font-dm text-sm">{f}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleRenew}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white font-dm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/30"
          >
            Renew Subscription
            <ArrowRight size={16} />
          </button>

          <button
            onClick={handleClose}
            className="text-white/30 hover:text-white/60 font-dm text-xs transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}