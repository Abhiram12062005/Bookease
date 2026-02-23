'use client'

import { useState } from 'react'
import { Users, BarChart3, Clock, Zap, CreditCard, Bell } from 'lucide-react'

type ModuleType = 'events' | 'cafes'

export function Modules() {
  const [activeModule, setActiveModule] = useState<ModuleType>('events')

  const modules = {
    events: {
      title: 'For Event Organizers',
      description: 'Create stunning booking sites for concerts, festivals, workshops, and more',
      capabilities: [
        {
          icon: Users,
          title: 'Attendee Management',
          description: 'Track registrations, QR codes, and attendee check-ins',
        },
        {
          icon: BarChart3,
          title: 'Sales Analytics',
          description: 'Real-time dashboard of ticket sales and revenue',
        },
        {
          icon: Clock,
          title: 'Scheduling',
          description: 'Manage multiple dates, time slots, and capacity limits',
        },
        {
          icon: CreditCard,
          title: 'Payment Processing',
          description: 'Accept card payments with automatic settlement',
        },
        {
          icon: Bell,
          title: 'Smart Reminders',
          description: 'Automated SMS/email to attendees before events',
        },
        {
          icon: Zap,
          title: 'Integrations',
          description: 'Connect with WhatsApp, Instagram, and more',
        },
      ],
    },
    cafes: {
      title: 'For Café & Restaurant Owners',
      description: 'Manage table reservations and catering bookings effortlessly',
      capabilities: [
        {
          icon: Clock,
          title: 'Table Management',
          description: 'Set table capacity, availability, and reservation duration',
        },
        {
          icon: Users,
          title: 'Guest Profiles',
          description: 'Track regular customers and their preferences',
        },
        {
          icon: CreditCard,
          title: 'Catering Orders',
          description: 'Handle event catering and group bookings',
        },
        {
          icon: BarChart3,
          title: 'Revenue Insights',
          description: 'Analyze peak hours and optimize pricing',
        },
        {
          icon: Bell,
          title: 'Reservation Alerts',
          description: 'Get notified for new bookings and cancellations',
        },
        {
          icon: Zap,
          title: 'Menu Integration',
          description: 'Showcase menu items and special offers',
        },
      ],
    },
  }

  const current = modules[activeModule]

  return (
    <section className="py-24 px-6 bg-[#0A0A0F] relative">
      <div className="max-w-6xl mx-auto">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex gap-2 p-1 rounded-xl bg-[#16161F] border border-white/7">
            {(['events', 'cafes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveModule(tab)}
                className={`px-6 py-3 rounded-lg font-dm font-semibold transition-all duration-300 text-sm ${
                  activeModule === tab
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab === 'events' ? '🎪 Event Organizers' : '☕ Café Owners'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Headline & Description */}
          <div className="fade-up flex flex-col justify-center">
            <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              {current.title}
            </h2>
            <p className="text-white/60 font-dm text-lg leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Right - Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {current.capabilities.map((capability, idx) => {
              const IconComponent = capability.icon
              return (
                <div
                  key={idx}
                  className="card-base p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-0.5 fade-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center mb-4">
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <h3 className="text-white font-dm font-semibold mb-2">{capability.title}</h3>
                  <p className="text-white/50 font-dm text-sm">{capability.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
