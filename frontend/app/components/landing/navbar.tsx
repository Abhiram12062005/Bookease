'use client'

import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, LayoutDashboard, User, Settings, LogOut, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAuthUser, useIsAuthenticated, useSession } from '@/app/api/hooks'
import { signOut } from '@/app/api/auth/authThunks'
import { SubscriptionPopup } from '../ui/Subscriptionpopup'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export function Navbar() {
  const [isScrolled, setIsScrolled]             = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen]       = useState(false)
  const [checkingSubscription, setCheckingSubscription] = useState(false)
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false)

  const dispatch        = useAppDispatch()
  const user            = useAuthUser()
  const session         = useSession()
  const isAuthenticated = useIsAuthenticated()
  const router          = useRouter()
  const profileRef      = useRef<HTMLDivElement>(null)

  // ── Scroll effect ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Close dropdown on outside click ──────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Check subscription then navigate ─────────────────────────────────────────
  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session?.token) return

    setCheckingSubscription(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/subscription`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`,
        },
      })

      const data = await res.json()

      if (data.ok && data.subscribed) {
        router.push('/dashboard')
      } else {
        setShowSubscriptionPopup(true)
      }
    } catch {
      // On network error, show popup as fallback
      setShowSubscriptionPopup(true)
    } finally {
      setCheckingSubscription(false)
      setIsProfileOpen(false)
      setIsMobileMenuOpen(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setIsProfileOpen(false)
    setIsMobileMenuOpen(false)
    await dispatch(signOut())
    router.push('/')
  }

  const navLinks = [
    { label: 'How It Works', href: '#how'       },
    { label: 'Features',     href: '#features'  },
    { label: 'Templates',    href: '#templates' },
    { label: 'Pricing',      href: '#pricing'   },
  ]

  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#111118]/90 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ── Logo ──────────────────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 font-jakarta text-xl font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] rounded-lg flex items-center justify-center text-white text-sm font-bold">
              B
            </div>
            BookEase
          </Link>

          {/* ── Desktop Nav Links ──────────────────────────────────────────────── */}
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

          {/* ── Desktop Right ──────────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Dashboard Button — checks subscription */}
                <button
                  onClick={handleDashboardClick}
                  disabled={checkingSubscription}
                  className="flex items-center gap-2 bg-[#9B5CF6] py-2 px-5 rounded-full text-sm text-white hover:bg-[#8B4CF5] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {checkingSubscription
                    ? <Loader2 size={15} className="animate-spin" />
                    : <LayoutDashboard size={15} />
                  }
                  {checkingSubscription ? 'Checking...' : 'Go to Dashboard'}
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                    aria-label="Profile menu"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center text-white font-semibold text-sm">
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-dm">{user.name}</span>
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-[#1a1a24] border border-white/10 rounded-xl shadow-xl py-2 z-50">
                      {/* User info */}
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-white/40 text-xs truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User size={15} /> My Profile
                      </Link>

                      {/* Dashboard link in dropdown also checks subscription */}
                      <button
                        onClick={handleDashboardClick}
                        disabled={checkingSubscription}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                      >
                        {checkingSubscription
                          ? <Loader2 size={15} className="animate-spin" />
                          : <LayoutDashboard size={15} />
                        }
                        Dashboard
                      </button>

                      <Link
                        href="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings size={15} /> Settings
                      </Link>

                      <div className="my-1 border-t border-white/5" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="border border-[#9B5CF6] py-2 px-6 rounded-full text-sm text-[#9B5CF6] hover:text-white hover:border-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#9B5CF6] py-2 px-6 rounded-full text-sm text-white hover:bg-[#8B4CF5] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Button ─────────────────────────────────────────────── */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111118]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/60 hover:text-white transition-colors text-sm font-dm py-1"
              >
                {link.label}
              </a>
            ))}

            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#9B5CF6] flex items-center justify-center text-white font-semibold text-sm">
                      {avatarLetter}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDashboardClick}
                    disabled={checkingSubscription}
                    className="flex items-center gap-2 text-white/70 hover:text-white text-sm py-1 transition-colors disabled:opacity-50"
                  >
                    {checkingSubscription
                      ? <Loader2 size={15} className="animate-spin" />
                      : <LayoutDashboard size={15} />
                    }
                    {checkingSubscription ? 'Checking...' : 'Dashboard'}
                  </button>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-white/70 hover:text-white text-sm py-1 transition-colors"
                  >
                    <User size={15} /> My Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-white/70 hover:text-white text-sm py-1 transition-colors"
                  >
                    <Settings size={15} /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-1 transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="border border-[#9B5CF6] py-2 px-6 rounded-full text-sm text-[#9B5CF6] text-center hover:text-white hover:border-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-[#9B5CF6] py-2 px-6 rounded-full text-sm text-white text-center hover:bg-[#8B4CF5] transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ── Subscription Popup — rendered outside nav to avoid z-index issues ─── */}
      {showSubscriptionPopup && (
        <SubscriptionPopup onClose={() => setShowSubscriptionPopup(false)} />
      )}
    </>
  )
}