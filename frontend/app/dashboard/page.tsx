'use client'

import Link from 'next/link'
import { Construction } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0e0e14] text-white flex items-center justify-center px-6">
      
      <div className="text-center max-w-xl">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#9B5CF6]/20 flex items-center justify-center">
            <Construction size={40} className="text-[#9B5CF6]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Dashboard is Under Construction 🚧
        </h1>

        {/* Description */}
        <p className="text-white/60 mb-8 text-sm md:text-base">
          We're building something powerful for you.  
          Soon you'll be able to manage bookings, view analytics,
          customize templates, and track payments — all in one place.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-[#9B5CF6] px-6 py-3 rounded-full text-sm hover:bg-[#8B4CF5] transition-colors"
          >
            Back to Home
          </Link>

          <Link
            href="/pricing"
            className="border border-[#9B5CF6] px-6 py-3 rounded-full text-sm text-[#9B5CF6] hover:text-white hover:border-white transition-colors"
          >
            View Pricing
          </Link>
        </div>

      </div>
    </div>
  )
}