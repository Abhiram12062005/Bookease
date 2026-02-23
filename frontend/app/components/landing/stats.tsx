'use client'

import { useEffect, useRef, useState } from 'react'

interface Stat {
  value: number
  suffix: string
  label: string
}

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [hasStarted, setHasStarted] = useState(false)

  const stats: Stat[] = [
    { value: 12400, suffix: '+', label: 'Bookings Processed Daily' },
    { value: 95, suffix: '%', label: 'Customer Satisfaction' },
    { value: 50, suffix: '+', label: 'Million in Revenue Processed' },
    { value: 24, suffix: '/7', label: 'Support Available' },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const intervals: NodeJS.Timeout[] = []

    stats.forEach((stat, idx) => {
      const duration = 2000
      const startTime = Date.now()

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Easing function for smooth animation
        const easeOutQuad = 1 - Math.pow(1 - progress, 2)
        const currentCount = Math.floor(stat.value * easeOutQuad)

        setCounts((prev) => ({
          ...prev,
          [idx]: currentCount,
        }))

        if (progress === 1) {
          clearInterval(interval)
        }
      }, 16)

      intervals.push(interval)
    })

    return () => intervals.forEach(clearInterval)
  }, [hasStarted])

  return (
    <section ref={containerRef} className="py-20 px-6 bg-[#0A0A0F] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7C3AED]/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="text-4xl md:text-5xl font-jakarta font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9B5CF6] to-[#7C3AED] mb-2">
                {counts[idx] || 0}
                <span className="text-2xl md:text-3xl">{stat.suffix}</span>
              </div>
              <p className="text-white/60 font-dm text-sm md:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
