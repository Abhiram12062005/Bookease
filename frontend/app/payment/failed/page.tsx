'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft, MessageCircle } from 'lucide-react'

export default function PaymentFailed() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const reason      = searchParams.get('reason')      ?? 'Payment was not completed'
  const code        = searchParams.get('code')        ?? ''
  const description = searchParams.get('description') ?? ''
  const plan        = searchParams.get('plan')        ?? ''
  const cycle       = searchParams.get('cycle')       ?? ''

  const handleRetry = () => {
    // Go back to pricing with the plan pre-highlighted
    router.push('/#pricing')
  }

  const ERROR_TIPS: Record<string, string> = {
    BAD_REQUEST_ERROR:    'There was an issue with the payment request. Please try again.',
    GATEWAY_ERROR:        'Payment gateway encountered an error. Please retry in a moment.',
    SERVER_ERROR:         'Our server had trouble processing this. Please try again shortly.',
    PAYMENT_CANCELLED:    'You cancelled the payment. Come back whenever you\'re ready.',
    BAD_AUTHENTICATION:   'Card authentication failed. Please check your card details.',
    INSUFFICIENT_FUNDS:   'Insufficient funds. Please try a different payment method.',
  }

  const tip = ERROR_TIPS[code] ?? 'Something went wrong during payment. Your card has not been charged.'

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-16">

      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">
        <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* Top red banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircle size={32} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-jakarta font-bold">Payment Failed</h1>
            <p className="text-white/80 font-dm text-sm mt-1">
              {plan ? `${plan} plan · ${cycle} billing` : 'Your payment could not be processed'}
            </p>
          </div>

          <div className="px-8 py-6 space-y-4">

            {/* Reassurance banner */}
            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 shrink-0" />
              <p className="text-green-300 font-dm text-sm">
                Don't worry — <span className="font-semibold">your card has not been charged.</span>
              </p>
            </div>

            {/* Reason */}
            <div className="bg-red-500/5 border border-red-500/15 rounded-xl px-4 py-4 space-y-2">
              <p className="text-white/50 font-dm text-xs uppercase tracking-wider">Reason</p>
              <p className="text-white font-dm text-sm font-medium">{reason}</p>
              {description && description !== reason && (
                <p className="text-white/40 font-dm text-xs">{description}</p>
              )}
              {code && (
                <p className="text-white/25 font-dm text-xs font-mono">Code: {code}</p>
              )}
            </div>

            {/* Tip */}
            <div className="bg-white/5 rounded-xl px-4 py-3">
              <p className="text-white/60 font-dm text-sm">{tip}</p>
            </div>

            {/* Common fixes */}
            <div className="space-y-2">
              <p className="text-white/40 font-dm text-xs uppercase tracking-wider">Common fixes</p>
              {[
                'Check your card number and expiry date',
                'Ensure sufficient balance or credit limit',
                'Try a different card or UPI / net banking',
                'Disable VPN if you\'re using one',
              ].map((fix) => (
                <div key={fix} className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />
                  <span className="text-white/50 font-dm text-sm">{fix}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex flex-col gap-3">
            <button
              onClick={handleRetry}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white font-dm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/30"
            >
              <RefreshCw size={17} />
              Try Again
            </button>

            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 border border-white/10 text-white/60 hover:text-white hover:border-white/20 font-dm font-semibold py-3 rounded-xl transition-colors"
            >
              <ArrowLeft size={17} />
              Back to Home
            </button>

            <a
              href="mailto:support@bookease.in"
              className="w-full flex items-center justify-center gap-2 text-white/30 hover:text-white/60 font-dm text-sm transition-colors pt-1"
            >
              <MessageCircle size={15} />
              Contact support if the problem persists
            </a>
          </div>
        </div>

        <p className="text-center text-white/20 font-dm text-xs mt-4">
          Error reference: {code || 'UNKNOWN'} · {new Date().toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  )
}