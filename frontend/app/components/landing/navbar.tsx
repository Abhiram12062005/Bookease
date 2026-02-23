'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how' },
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'Pricing', href: '#pricing' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#111118]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-jakarta text-xl font-bold text-white">
          <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] rounded-lg flex items-center justify-center text-white text-sm font-bold">
            B
          </div>
          BookEase
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/60 hover:text-white transition-colors text-sm font-dm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="border-1 border-[#9B5CF6] py-2 px-8 rounded-full hover:border-gray-200 hover:text-gray-200 text-sm text-[#9B5CF6]">Sign In</button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#111118]/95 backdrop-blur-xl border-b border-white/5 py-4">
          <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors text-sm font-dm py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t">
            <a className="bg-[#9B5CF6] text-sm text-white w-full border border-[#9B5CF6]">
              Sign In
            </a>
            <a className="btn-accent text-sm w-full text-white border border-[#9B5CF6]">
              Get Started
            </a>
          </div>
          </div>
        </div>
      )}
    </nav>
  )
}
