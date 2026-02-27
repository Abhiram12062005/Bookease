'use client'

import { useEffect, useState } from 'react'
import { BookTemplate, Settings, Share2, TrendingUp } from 'lucide-react'

export function HowItWorks() {
  const [dotPosition, setDotPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotPosition((prev) => (prev + 1) % 600)
    }, 30)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      number: '01',
      icon: BookTemplate,
      title: 'Choose Template',
      description:
        'Select from beautiful, pre-designed templates tailored for events or cafés',
      chip: '2 min',
    },
    {
      number: '02',
      icon: Settings,
      title: 'Set Your Details',
      description:
        'Add your business info, events, ticket tiers, venue, and time slots',
      chip: '5 min',
    },
    {
      number: '03',
      icon: Share2,
      title: 'Get Your Link',
      description:
        'Instantly receive yourbusiness.bookease.com to start sharing',
      chip: '1 min',
    },
    {
      number: '04',
      icon: TrendingUp,
      title: 'Receive Bookings',
      description:
        'Payments handled automatically. Focus on your event, not the tech',
      chip: 'Automated',
    },
  ]

  return (
    <section id="how" className="py-20 px-6 bg-[#0A0A0F] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-white font-jakarta mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            How It Works
          </h2>
          <p className="text-white/60 font-dm text-lg max-w-2xl mx-auto">
            Four simple steps from zero to a fully functional booking website
          </p>
        </div>

        {/* Timeline Wrapper */}
        <div className="relative">

          {/* Vertical Center Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#7C3AED] via-[#9B5CF6] to-transparent -translate-x-1/2">
            <div
              className="absolute w-3 h-3 bg-[#9B5CF6] rounded-full left-1/2 -translate-x-1/2 shadow-lg shadow-violet-500/50"
              style={{ top: `${dotPosition}px` }}
            />
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isLeft = index % 2 === 0

              return (
                <div
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isLeft ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`relative w-full lg:w-[45%] rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 overflow-hidden
                    bg-gradient-to-br from-[#7C3AED20] to-[#9B5CF640]
                    backdrop-blur-xl
                    border border-white/10
                    shadow-lg shadow-black/30
                    ${
                      isLeft ? 'lg:mr-auto' : 'lg:ml-auto'
                    }`}
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center">
                          <IconComponent size={22} className="text-white" />
                        </div>
                        <div>
                          <p className="text-[#9B5CF6] text-sm font-jakarta font-bold">
                            {step.number}
                          </p>
                          <h3 className="text-white font-jakarta text-xl">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <div className="px-2 py-1 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40">
                        <span className="text-[#9B5CF6] text-xs font-dm font-medium">
                          {step.chip}
                        </span>
                      </div>
                    </div>

                    <p className="text-white/60 font-dm leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Dot (Desktop) */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0A0A0F] border-2 border-[#9B5CF6] rounded-full z-10" />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}