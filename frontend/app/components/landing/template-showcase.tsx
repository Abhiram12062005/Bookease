'use client'

import { useState } from 'react'
import { Music, Coffee, Briefcase, BookOpen } from 'lucide-react'

type TemplateType = 'music' | 'cafe' | 'corporate' | 'workshops'

interface Template {
  id: TemplateType
  label: string
  icon: React.ReactNode
  description: string
}

export function TemplateShowcase() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>('music')

  const templates: Template[] = [
    {
      id: 'music',
      label: 'Music Festival',
      icon: <Music size={20} />,
      description: 'Perfect for concerts, festivals, and live music events',
    },
    {
      id: 'cafe',
      label: 'Café & Dining',
      icon: <Coffee size={20} />,
      description: 'Ideal for reservations and catering bookings',
    },
    {
      id: 'corporate',
      label: 'Corporate Events',
      icon: <Briefcase size={20} />,
      description: 'For conferences, seminars, and team events',
    },
    {
      id: 'workshops',
      label: 'Workshops',
      icon: <BookOpen size={20} />,
      description: 'Great for classes, training, and educational events',
    },
  ]

  const previewContent = {
    music: {
      title: 'Summer Music Festival 2024',
      subtitle: 'Experience 3 days of live performances',
      colors: ['from-purple-600', 'to-pink-600'],
      features: ['Day Pass', 'VIP Access', 'Group Packages'],
    },
    cafe: {
      title: 'Artisan Café Reservations',
      subtitle: 'Book your perfect table',
      colors: ['from-amber-700', 'to-orange-600'],
      features: ['Dine-in', 'Private Events', 'Catering'],
    },
    corporate: {
      title: 'Tech Summit 2024',
      subtitle: 'Join industry leaders for three days',
      colors: ['from-blue-600', 'to-cyan-600'],
      features: ['Single Pass', 'Corporate Package', 'Networking'],
    },
    workshops: {
      title: 'Web Design Masterclass',
      subtitle: 'Learn from industry experts',
      colors: ['from-teal-600', 'to-green-600'],
      features: ['Beginner', 'Advanced', 'Group Classes'],
    },
  }

  const current = previewContent[activeTemplate]

  return (
    <section id="templates" className="py-24 px-6 bg-[#0A0A0F] relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Templates Built for Your Business
          </h2>
          <p className="text-white/60 font-dm text-lg max-w-2xl mx-auto">
            Choose from purpose-built templates designed specifically for different business types
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Template Selector */}
          <div className="flex flex-col gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => setActiveTemplate(template.id)}
                className={`fade-up text-left p-6 rounded-xl border transition-all duration-300 ${
                  activeTemplate === template.id
                    ? 'bg-[#16161F] border-[#7C3AED] shadow-lg shadow-violet-500/20'
                    : 'bg-[#16161F] border-white/7 hover:border-white/12'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${
                    activeTemplate === template.id
                      ? 'bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] text-white'
                      : 'bg-white/5 text-white/60'
                  }`}>
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-dm font-semibold text-lg">{template.label}</h3>
                    <p className="text-white/50 font-dm text-sm">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right - Preview */}
          <div className="fade-up">
            <div className="bg-gradient-to-b from-[#111118] to-[#0A0A0F] rounded-2xl border border-white/10 p-2 shadow-2xl">
              {/* Browser Frame */}
              <div className="rounded-xl overflow-hidden bg-[#16161F]">
                {/* Browser Chrome */}
                <div className="bg-[#111118] border-b border-white/5 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-white/40 text-xs font-dm">yourbusiness.bookease.com</span>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-[#0A0A0F] aspect-square lg:aspect-[4/5] flex items-center justify-center p-8 relative overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${current.colors[0]} ${current.colors[1]} opacity-5`} />

                  {/* Content */}
                  <div className="relative z-10 w-full text-center">
                    <div className="mb-6 inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10">
                      <span className="text-white/50 text-xs font-dm">POWERED BY BOOKEASE</span>
                    </div>

                    <h3 className="text-2xl font-jakarta text-white mb-2">{current.title}</h3>
                    <p className="text-white/60 font-dm text-sm mb-8">{current.subtitle}</p>

                    {/* Feature Tags */}
                    <div className="flex flex-wrap gap-2 justify-center mb-8">
                      {current.features.map((feature) => (
                        <div
                          key={feature}
                          className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                        >
                          <span className="text-white/70 text-xs font-dm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <button className="btn-accent text-sm">View Template</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
