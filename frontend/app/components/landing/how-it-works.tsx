'use client'

import { useEffect, useRef, useState } from 'react'
import { BookTemplate, Settings, Share2, TrendingUp } from 'lucide-react'

export function HowItWorks() {
  const [dotPosition, setDotPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPosition((prev) => (prev + 1) % 400)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      number: '01',
      icon: BookTemplate,
      title: 'Choose Template',
      description: 'Select from beautiful, pre-designed templates tailored for events or cafés',
      chip: '2 min',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Set Your Details',
      description: 'Add your business info, events, ticket tiers, venue, and time slots',
      chip: '5 min',
    },
    {
      number: '03',
      icon: Share2,
      title: 'Get Your Link',
      description: 'Instantly receive yourbusiness.bookease.com to start sharing',
      chip: '1 min',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Receive Bookings',
      description: 'Payments handled automatically. Focus on your event, not the tech',
      chip: 'Automated',
    },
  ]

  return (
    <section id="how" className="py-24 px-6 bg-[#0A0A0F] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20 fade-up">
          <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            How It Works
          </h2>
          <p className="text-white/60 font-dm text-lg max-w-2xl mx-auto">
            Four simple steps from zero to a fully functional booking website
          </p>
        </div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Vertical Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7C3AED] via-[#9B5CF6] to-transparent transform -translate-x-1/2">
            {/* Animated Dot */}
            <div
              className="absolute w-3 h-3 bg-[#9B5CF6] rounded-full left-1/2 transform -translate-x-1/2 shadow-lg shadow-violet-500/50"
              style={{ top: `${dotPosition}px` }}
            />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
            {steps.map((step, idx) => {
              const IconComponent = step.icon
              const isLeft = idx % 2 === 0
              const lgColStart = isLeft ? 'lg:col-start-1' : 'lg:col-start-2'

              return (
                <div key={idx} className={`${lgColStart} relative fade-up`} style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Card */}
                  <div className="card-base p-8 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5">
                    {/* Step Number */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center">
                          <IconComponent size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[#9B5CF6] text-sm font-jakarta font-bold">{step.number}</p>
                          <h3 className="text-white font-jakarta text-xl">{step.title}</h3>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40">
                        <span className="text-[#9B5CF6] text-xs font-dm font-medium">{step.chip}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 font-dm leading-relaxed">{step.description}</p>

                    {/* Connection Line (Desktop) */}
                    {idx < steps.length - 1 && (
                      <div className="hidden lg:block absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-[#9B5CF6] to-transparent transform -translate-x-1/2" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
