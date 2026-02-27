'use client'

import { useState } from 'react'
import {
  Users,
  BarChart3,
  Clock,
  Zap,
  CreditCard,
  Bell,
  Briefcase,
  Mic2,
  Trophy,
  LucideIcon,
} from 'lucide-react'

interface Capability {
  icon: LucideIcon
  title: string
  description: string
}

interface Module {
  id: string
  label: string
  emoji: string
  title: string
  description: string
  capabilities: Capability[]
}

const MODULES: Module[] = [
  {
    id: 'events',
    label: 'Event Organizers',
    emoji: '🎪',
    title: 'For Event Organizers',
    description:
      'Create stunning booking sites for concerts, festivals, workshops, and more',
    capabilities: [
      { icon: Users, title: 'Attendee Management', description: 'Track registrations, QR codes, and attendee check-ins' },
      { icon: BarChart3, title: 'Sales Analytics', description: 'Real-time dashboard of ticket sales and revenue' },
      { icon: Clock, title: 'Scheduling', description: 'Manage multiple dates, time slots, and capacity limits' },
      { icon: CreditCard, title: 'Payment Processing', description: 'Accept card payments with automatic settlement' },
      { icon: Bell, title: 'Smart Reminders', description: 'Automated SMS/email to attendees before events' },
      { icon: Zap, title: 'Integrations', description: 'Connect with WhatsApp, Instagram, and more' },
    ],
  },
  {
    id: 'cafes',
    label: 'Cafés & Restaurants',
    emoji: '☕',
    title: 'For Cafés & Restaurants',
    description:
      'Manage table reservations and catering bookings effortlessly',
    capabilities: [
      { icon: Clock, title: 'Table Management', description: 'Set table capacity, availability, and reservation duration' },
      { icon: Users, title: 'Guest Profiles', description: 'Track regular customers and their preferences' },
      { icon: CreditCard, title: 'Catering Orders', description: 'Handle event catering and group bookings' },
      { icon: BarChart3, title: 'Revenue Insights', description: 'Analyze peak hours and optimize pricing' },
      { icon: Bell, title: 'Reservation Alerts', description: 'Get notified for new bookings and cancellations' },
      { icon: Zap, title: 'Menu Integration', description: 'Showcase menu items and special offers' },
    ],
  },
  {
    id: 'corporate',
    label: 'Corporate Events',
    emoji: '🏢',
    title: 'For Conferences, Hackathons & Startup Events',
    description:
      'Run professional corporate events end-to-end — from registrations to post-event analytics',
    capabilities: [
      { icon: Briefcase, title: 'Delegate Registration', description: 'Custom forms with tiered ticket types (speaker, sponsor, attendee)' },
      { icon: Mic2, title: 'Speaker Management', description: 'Collect bios, manage schedules, and publish agendas seamlessly' },
      { icon: Trophy, title: 'Hackathon Tools', description: 'Team formation, submission tracking, and judging workflows' },
      { icon: Users, title: 'Sponsor Portals', description: 'Give sponsors branded profiles and lead-capture dashboards' },
      { icon: Bell, title: 'Automated Updates', description: 'Push schedule changes and announcements to all attendees instantly' },
      { icon: BarChart3, title: 'Event Analytics', description: 'Track check-ins, session attendance, and engagement in real time' },
    ],
  },
]

export function Modules() {
  const [activeId, setActiveId] = useState<string>(MODULES[0].id)
  const current = MODULES.find((m) => m.id === activeId) ?? MODULES[0]

  return (
    <section className="py-18 px-6 bg-[#9B5CF620] relative">
      <div className="max-w-6xl mx-auto">
        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1 rounded-xl bg-[#16161F] border border-white/7">
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveId(mod.id)}
                className={`px-5 py-2.5 rounded-lg font-dm font-semibold transition-all duration-300 text-sm whitespace-nowrap ${
                  activeId === mod.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white shadow-lg shadow-[#7C3AED]/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {mod.emoji} {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top Content */}
        <div className="mb-14 flex flex-col items-center justify-center text-center lg:text-left w-full">
          <h2
            className="font-jakarta text-[#9B5CF6] font-bold mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            {current.title}
          </h2>
          <p className="text-white/60 font-dm text-lg leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Capabilities Row */}
        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">

          {current.capabilities.map((capability, idx) => {
            const IconComponent = capability.icon

            return (
              <div
                key={`${current.id}-${idx}`}
                className="min-w-[260px] sm:min-w-[300px] lg:min-w-0 snap-start card-base p-6 hover:border-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-row items-center gap-2 py-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center">
                    <IconComponent size={20} className="text-white" />
                  </div>

                  <h3 className="text-white font-dm font-semibold mb-2">
                    {capability.title}
                  </h3>
                </div>

                <p className="text-white/50 font-dm text-sm">
                  {capability.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}