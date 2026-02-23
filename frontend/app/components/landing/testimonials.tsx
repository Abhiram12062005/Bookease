'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  id: number
  quote: string
  rating: number
  metric: string
  author: string
  role: string
  company: string
  initials: string
}

export function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: 'BookEase transformed how we sell concert tickets. Within 2 weeks, we had our entire event calendar online and started receiving bookings automatically.',
      rating: 5,
      metric: '📈 12,400 tickets sold',
      author: 'Rajesh Kumar',
      role: 'Event Manager',
      company: 'Festival Productions',
      initials: 'RK',
    },
    {
      id: 2,
      quote: 'The best investment for our café. Our reservation system is now fully automated, reducing no-shows by 40% and freeing up our staff to focus on customers.',
      rating: 5,
      metric: '🔄 85% occupancy rate',
      author: 'Priya Sharma',
      role: 'Founder',
      company: 'The Brew House',
      initials: 'PS',
    },
    {
      id: 3,
      quote: 'Setting up was incredibly simple. I went from idea to live website in less than 10 minutes. The platform handles everything including payments.',
      rating: 5,
      metric: '💰 $45K revenue',
      author: 'Arun Patel',
      role: 'Workshop Instructor',
      company: 'Digital Skills Academy',
      initials: 'AP',
    },
    {
      id: 4,
      quote: 'Customer support is exceptional. The team resolved our integration question within hours. BookEase is genuinely built for Indian businesses.',
      rating: 5,
      metric: '🌟 98% satisfaction',
      author: 'Ananya Singh',
      role: 'Operations Lead',
      company: 'Elite Events Co',
      initials: 'AS',
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5500)

    return () => clearInterval(interval)
  }, [autoPlay, testimonials.length])

  const handleDotClick = (index: number) => {
    setActiveIndex(index)
    setAutoPlay(false)
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <section className="py-24 px-6 bg-[#0A0A0F] relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Loved by Creators
          </h2>
          <p className="text-white/60 font-dm text-lg">
            Hear from event organizers and café owners who transformed their business with BookEase
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="mb-12 fade-up">
          <div className="card-base p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#7C3AED]/10 to-transparent rounded-full -mr-32 -mt-32" />

            <div className="relative z-10">
              {/* Quote */}
              <p className="text-white/80 font-dm text-xl md:text-2xl leading-relaxed mb-8 font-medium">
                "{currentTestimonial.quote}"
              </p>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                  <Star key={i} size={20} className="fill-[#9B5CF6] text-[#9B5CF6]" />
                ))}
              </div>

              {/* Metric Badge */}
              <div className="inline-block px-4 py-2 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 mb-6">
                <span className="text-[#9B5CF6] font-dm text-sm font-medium">{currentTestimonial.metric}</span>
              </div>

              {/* Author */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center">
                  <span className="text-white font-jakarta font-bold text-lg">{currentTestimonial.initials}</span>
                </div>
                <div>
                  <p className="text-white font-dm font-semibold">{currentTestimonial.author}</p>
                  <p className="text-white/60 font-dm text-sm">
                    {currentTestimonial.role} at {currentTestimonial.company}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === activeIndex
                  ? 'w-8 h-2 bg-[#7C3AED]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Mini Author Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testimonials.map((testimonial) => (
            <button
              key={testimonial.id}
              onClick={() => handleDotClick(testimonial.id - 1)}
              className={`p-4 rounded-lg border transition-all duration-300 text-left cursor-pointer fade-up ${
                activeIndex === testimonial.id - 1
                  ? 'bg-[#16161F] border-[#7C3AED]'
                  : 'bg-[#16161F]/50 border-white/7 hover:border-white/12'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center mb-2">
                <span className="text-white font-jakarta font-bold text-xs">{testimonial.initials}</span>
              </div>
              <p className="text-white font-dm font-semibold text-sm">{testimonial.author}</p>
              <p className="text-white/50 font-dm text-xs">{testimonial.company}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
