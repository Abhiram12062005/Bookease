import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard /dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  // Read session from cookie (set it on login — see note below)
  const token = req.cookies.get('bookease_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/payment/subscription`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()

    if (!data.ok || !data.subscribed) {
      // Not subscribed or expired — redirect to pricing with reason
      const url = new URL('/#pricing', req.url)
      url.searchParams.set('expired', 'true')
      return NextResponse.redirect(url)
    }
  } catch {
    // If server is unreachable, let through (fail open)
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}