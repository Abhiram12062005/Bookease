'use client'

import { useState } from 'react'
import { Zap, Users, Shield, BarChart3, Clock, Lock, DollarSign, Smartphone, Globe } from 'lucide-react'
import { ChevronDown, Plus, X } from 'lucide-react'

export function Features() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const featuresList = [
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'No coding required. Build your entire booking site in under 10 minutes with our intuitive template builder.',
    },
    {
      icon: Users,
      title: 'Multi-User Management',
      description: 'Manage multiple events, teams, and staff schedules in one unified dashboard.',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'PCI-compliant payment processing with automatic settlement to your bank account.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track bookings, revenue, and customer insights with real-time analytics.',
    },
    {
      icon: Clock,
      title: 'Automated Reminders',
      description: 'Send automatic SMS and email reminders to customers before their bookings.',
    },
    {
      icon: Lock,
      title: 'Data Security',
      description: 'Enterprise-grade encryption and compliance with GDPR and local data regulations.',
    },
    {
      icon: DollarSign,
      title: 'Flexible Pricing',
      description: 'Set your own pricing, offer early-bird discounts, and run promotional campaigns.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that looks perfect on phones, tablets, and desktops.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Support for multiple currencies, languages, and payment methods worldwide.',
    },
  ]

  return (
    <section id="features" className="py-24 px-6 bg-[#0A0A0F] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Sticky Prose */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="fade-up">
              <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                Everything You Need
              </h2>
              <p className="text-white/60 font-dm text-lg leading-relaxed mb-8">
                A complete platform built specifically for event organizers and café owners. Handle everything from booking to payment without the tech headache.
              </p>

              {/* Stat Card */}
              <div className="card-base p-6 mb-8 border-l-2 border-l-[#7C3AED]">
                <div className="text-3xl font-jakarta font-bold text-white mb-2">12,400+</div>
                <p className="text-white/60 font-dm text-sm">Bookings processed daily across our platform</p>
              </div>

              <p className="text-white/50 font-dm text-sm">
                Plus integrations with WhatsApp, Instagram, and your favorite business tools.
              </p>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="space-y-3">
            {featuresList.map((feature, idx) => {
              const IconComponent = feature.icon
              const isOpen = activeIndex === idx

              return (
                <div
                  key={idx}
                  className="card-base overflow-hidden transition-all duration-300 fade-up cursor-pointer"
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                >
                  {/* Header */}
                  <div className="p-6 flex items-start justify-between hover:bg-white/2 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6]'
                          : 'bg-white/5 border border-white/10'
                      }`}>
                        <IconComponent
                          size={20}
                          className={isOpen ? 'text-white' : 'text-white/60'}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-dm font-semibold text-lg">{feature.title}</h3>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-[#7C3AED]' : 'bg-white/5'
                    }`}>
                      {isOpen ? (
                        <X size={16} className="text-white" />
                      ) : (
                        <Plus size={16} className="text-white/60" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}>
                    <div className="px-6 pb-6 pt-0 border-t border-white/5">
                      <p className="text-white/60 font-dm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>

                  {/* Active Border */}
                  {isOpen && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C3AED]" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
