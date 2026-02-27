'use client'

import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated, useSession } from '@/app/api/hooks'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

// Extend window for Razorpay script
declare global {
  interface Window {
    Razorpay: any
  }
}

export function Pricing() {
  const [isYearly, setIsYearly]   = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const router          = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const session         = useSession()

  const plans = [
    {
      name:         'Starter' as const,
      monthlyPrice: 299,
      yearlyPrice:  2990,
      description:  'Perfect for small events and businesses',
      features: [
        { name: 'Up to 3 events',      included: true  },
        { name: 'Basic analytics',     included: true  },
        { name: 'Email support',       included: true  },
        { name: 'Payment processing',  included: true  },
        { name: 'Custom domain',       included: false },
        { name: 'Priority support',    included: false },
        { name: 'API access',          included: false },
      ],
      cta:         'Get Started',
      highlighted: false,
    },
    {
      name:         'Growth' as const,
      monthlyPrice: 799,
      yearlyPrice:  7990,
      description:  'Most popular choice for growing businesses',
      features: [
        { name: 'Unlimited events',    included: true  },
        { name: 'Advanced analytics',  included: true  },
        { name: 'Priority support',    included: true  },
        { name: 'Payment processing',  included: true  },
        { name: 'Custom domain',       included: true  },
        { name: 'Team management',     included: true  },
        { name: 'API access',          included: false },
      ],
      cta:         'Start Free Trial',
      highlighted: true,
    },
    {
      name:         'Scale' as const,
      monthlyPrice: 1999,
      yearlyPrice:  19990,
      description:  'For enterprise-level operations',
      features: [
        { name: 'Unlimited events',        included: true },
        { name: 'Custom analytics',        included: true },
        { name: '24/7 dedicated support',  included: true },
        { name: 'Payment processing',      included: true },
        { name: 'Custom domain',           included: true },
        { name: 'Team management',         included: true },
        { name: 'API access',              included: true },
      ],
      cta:         'Contact Sales',
      highlighted: false,
    },
  ]

  const discount = 20

  // ── Load Razorpay script dynamically ──────────────────────────────────────────
  const loadRazorpayScript = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return }
      const script   = document.createElement('script')
      script.src     = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload  = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })

  // ── Handle plan selection ─────────────────────────────────────────────────────
  const handleSelectPlan = async (planName: 'Starter' | 'Growth' | 'Scale') => {
    // Not logged in → redirect to signin
    if (!isAuthenticated || !session?.token) {
      router.push('/auth/signin')
      return
    }

    const billingCycle = isYearly ? 'yearly' : 'monthly'
    setLoadingPlan(planName)

    try {
      // 1. Load Razorpay SDK
      const loaded = await loadRazorpayScript()
      if (!loaded) {
        alert('Failed to load payment gateway. Please try again.')
        return
      }

      // 2. Create order on backend
      const orderRes = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
        body: JSON.stringify({ packageType: planName, billingCycle }),
      })
      const orderData = await orderRes.json()

      if (!orderData.ok) {
        alert(orderData.error || 'Failed to create order')
        return
      }

      // 3. Open Razorpay checkout
      const options = {
        key:          orderData.keyId,
        amount:       orderData.amount,
        currency:     orderData.currency,
        name:         'BookEase',
        description:  `${planName} Plan — ${billingCycle}`,
        order_id:     orderData.orderId,
        prefill: {
          name:  session.user.name,
          email: session.user.email,
        },
        theme: { color: '#7C3AED' },

        // ── SUCCESS ────────────────────────────────────────────────────────────
        handler: async (response: {
          razorpay_order_id:   string
          razorpay_payment_id: string
          razorpay_signature:  string
        }) => {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/api/payment/verify`, {
              method:  'POST',
              headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${session.token}`,
              },
              body: JSON.stringify({
                ...response,
                packageType:  planName,
                billingCycle,
              }),
            })
            const verifyData = await verifyRes.json()

            if (verifyData.ok) {
              const params = new URLSearchParams({
                plan:      verifyData.subscription.packageType,
                price:     verifyData.subscription.packagePrice.toString(),
                cycle:     verifyData.subscription.billingCycle,
                startDate: verifyData.subscription.startDate,
                endDate:   verifyData.subscription.endDate,
                paymentId: verifyData.subscription.razorpayPaymentId,
                orderId:   verifyData.subscription.razorpayOrderId,
                name:      verifyData.user.name,
                email:     verifyData.user.email,
              })
              router.push(`/payment/success?${params.toString()}`)
            } else {
              // Verify call returned ok:false
              const params = new URLSearchParams({
                reason:      verifyData.error ?? 'Payment verification failed',
                code:        'VERIFICATION_FAILED',
                description: 'Payment was received but could not be verified. Contact support.',
                plan:        planName,
                cycle:       billingCycle,
              })
              router.push(`/payment/failed?${params.toString()}`)
            }
          } catch {
            // Network error during verify
            const params = new URLSearchParams({
              reason:      'Verification request failed',
              code:        'NETWORK_ERROR',
              description: 'Could not reach the server to verify your payment.',
              plan:        planName,
              cycle:       billingCycle,
            })
            router.push(`/payment/failed?${params.toString()}`)
          }
        },

        // ── PAYMENT FAILURE (card declined, bank error, etc.) ──────────────────
        // Razorpay calls this when the user's payment attempt fails inside the modal
        // NOTE: This is different from modal dismiss — this fires on actual failure
        prefill_error: (error: { code: string; description: string; reason: string }) => {
          const params = new URLSearchParams({
            reason:      error.reason      ?? 'Payment failed',
            code:        error.code        ?? 'PAYMENT_FAILED',
            description: error.description ?? '',
            plan:        planName,
            cycle:       billingCycle,
          })
          router.push(`/payment/failed?${params.toString()}`)
        },

        modal: {
          // ── USER DISMISSED (closed modal without paying) ─────────────────────
          ondismiss: () => {
            setLoadingPlan(null)
            // Don't redirect — user just closed. Stay on pricing page.
          },

          // ── ESCAPE key or backdrop click ─────────────────────────────────────
          escape:           true,
          backdropclose:    false,  // prevent accidental close
          handleback:       true,   // handle Android back button
          confirm_close:    true,   // show "Are you sure?" on close attempt
        },
      }

      const rzp = new window.Razorpay(options)

      // ── Handle payment failure event (most reliable way to catch errors) ────
      rzp.on('payment.failed', (response: {
        error: {
          code:        string
          description: string
          reason:      string
          source:      string
          step:        string
          metadata:    { order_id: string; payment_id: string }
        }
      }) => {
        setLoadingPlan(null)
        const params = new URLSearchParams({
          reason:      response.error.reason      ?? 'Payment failed',
          code:        response.error.code        ?? 'PAYMENT_FAILED',
          description: response.error.description ?? '',
          plan:        planName,
          cycle:       billingCycle,
        })
        router.push(`/payment/failed?${params.toString()}`)
      })

      rzp.open()
    } catch (err) {
      console.error('[handleSelectPlan]', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-24 px-6 bg-[#9B5CF620] relative">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Transparent Pricing
          </h2>
          <p className="text-white/60 font-dm text-lg mb-8">
            No hidden fees. Pay for what you use. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex gap-2 p-1 rounded-xl bg-[#16161F] border border-white/7">
              {['monthly', 'yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => setIsYearly(period === 'yearly')}
                  className={`px-6 py-3 rounded-lg font-dm font-semibold transition-all duration-300 text-sm ${
                    (period === 'yearly' && isYearly) || (period === 'monthly' && !isYearly)
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {period === 'monthly' ? 'Monthly' : 'Yearly'}
                  {period === 'yearly' && (
                    <span className="ml-2 text-xs bg-[#10B981] text-white px-2 py-1 rounded">
                      Save {discount}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`fade-up relative rounded-2xl border transition-all duration-300 ${
                plan.highlighted
                  ? 'md:scale-105 bg-gradient-to-br from-[#7C3AED]/20 to-[#9B5CF6]/10 border-[#7C3AED]/50'
                  : 'bg-[#16161F] border-white/7 hover:border-white/12'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Most Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white text-xs font-dm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-xl font-jakarta font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 font-dm text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-jakarta font-bold text-white">
                    ₹{isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </div>
                  <p className="text-white/50 font-dm text-sm mt-1">
                    per month{isYearly && ', billed yearly'}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={loadingPlan === plan.name}
                  className="w-full py-3 rounded-full font-dm font-semibold transition-all duration-300 mb-8 flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white hover:opacity-90 hover:scale-[1.02] active:scale-100 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loadingPlan === plan.name
                    ? <><Loader2 size={16} className="animate-spin" /> Processing...</>
                    : plan.cta
                  }
                </button>

                {/* Not logged in hint */}
                {!isAuthenticated && (
                  <p className="text-white/30 font-dm text-xs text-center -mt-5 mb-4">
                    Sign in required to subscribe
                  </p>
                )}

                {/* Features */}
                <div className="space-y-4 border-t border-white/5 pt-8">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${feature.included ? 'bg-[#10B981]' : 'bg-white/5'}`}>
                        {feature.included
                          ? <Check size={16} className="text-white" />
                          : <X     size={16} className="text-white/30" />}
                      </div>
                      <span className={`font-dm text-sm ${feature.included ? 'text-white' : 'text-white/40'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-16">
          <p className="text-white/60 font-dm">
            Questions about our plans?{' '}
            <a href="#faq" className="text-[#9B5CF6] hover:text-[#7C3AED] transition-colors">
              Check our FAQ
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}