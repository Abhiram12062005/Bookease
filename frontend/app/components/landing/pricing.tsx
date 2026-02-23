'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: 'Starter',
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: 'Perfect for small events and businesses',
      features: [
        { name: 'Up to 3 events', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Custom domain', included: false },
        { name: 'Priority support', included: false },
        { name: 'API access', included: false },
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Growth',
      monthlyPrice: 799,
      yearlyPrice: 7990,
      description: 'Most popular choice for growing businesses',
      features: [
        { name: 'Unlimited events', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Custom domain', included: true },
        { name: 'Team management', included: true },
        { name: 'API access', included: false },
      ],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Scale',
      monthlyPrice: 1999,
      yearlyPrice: 19990,
      description: 'For enterprise-level operations',
      features: [
        { name: 'Unlimited events', included: true },
        { name: 'Custom analytics', included: true },
        { name: '24/7 dedicated support', included: true },
        { name: 'Payment processing', included: true },
        { name: 'Custom domain', included: true },
        { name: 'Team management', included: true },
        { name: 'API access', included: true },
      ],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ]

  const discount = 20

  return (
    <section id="pricing" className="py-24 px-6 bg-[#0A0A0F] relative">
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
                {/* Plan Name */}
                <h3 className="text-xl font-jakarta font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 font-dm text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-jakarta font-bold text-white">
                    ₹{isYearly ? Math.floor(plan.yearlyPrice / 12) : plan.monthlyPrice}
                  </div>
                  <p className="text-white/50 font-dm text-sm mt-1">per month{isYearly && ', billed yearly'}</p>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-3 rounded-xl font-dm font-semibold transition-all duration-300 mb-8 ${
                    plan.highlighted
                      ? 'btn-accent'
                      : 'btn-ghost'
                  }`}
                >
                  {plan.cta}
                </button>

                {/* Features List */}
                <div className="space-y-4 border-t border-white/5 pt-8">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${
                          feature.included
                            ? 'bg-[#10B981]'
                            : 'bg-white/5'
                        }`}
                      >
                        {feature.included ? (
                          <Check size={16} className="text-white" />
                        ) : (
                          <X size={16} className="text-white/30" />
                        )}
                      </div>
                      <span
                        className={`font-dm text-sm ${
                          feature.included
                            ? 'text-white'
                            : 'text-white/40'
                        }`}
                      >
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
