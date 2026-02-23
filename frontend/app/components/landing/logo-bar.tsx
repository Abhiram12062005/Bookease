'use client'

export function LogoBar() {
  const brands = [
    'The Jazz Lounge',
    'Urban Café Co',
    'Festival Hub',
    'Event Masters',
    'Brew & Beans',
    'Concert Central',
    'Dining Delights',
    'Artisan Events',
    'Music Venue Pro',
    'Café Culture',
  ]

  // Duplicate for seamless loop
  const displayBrands = [...brands, ...brands]

  return (
    <section className="w-full py-16 bg-[#0A0A0F] border-y border-white/5 overflow-hidden">
      <div className="relative">
        {/* Fade effect edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0F] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0F] to-transparent z-10" />

        {/* Marquee */}
        <div className="flex gap-12 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {displayBrands.map((brand, idx) => (
              <div key={idx} className="flex items-center gap-3 min-w-max">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7C3AED]/30 to-[#9B5CF6]/30" />
                <span className="text-white/50 font-dm text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-white/40 text-xs font-dm">
        Trusted by event organizers and café owners across India
      </div>
    </section>
  )
}
