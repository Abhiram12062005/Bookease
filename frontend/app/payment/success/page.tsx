'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useRef } from 'react'
import { CheckCircle, Download, LayoutDashboard, Sparkles } from 'lucide-react'
import jsPDF from 'jspdf'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const invoiceRef   = useRef<HTMLDivElement>(null)

  // Pull all data from URL params (set by Pricing after verify)
  const plan      = searchParams.get('plan')      ?? ''
  const price     = searchParams.get('price')     ?? ''
  const cycle     = searchParams.get('cycle')     ?? ''
  const startDate = searchParams.get('startDate') ?? ''
  const endDate   = searchParams.get('endDate')   ?? ''
  const paymentId = searchParams.get('paymentId') ?? ''
  const orderId   = searchParams.get('orderId')   ?? ''
  const name      = searchParams.get('name')      ?? ''
  const email     = searchParams.get('email')     ?? ''

  const formattedStart = startDate ? new Date(startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  const formattedEnd   = endDate   ? new Date(endDate).toLocaleDateString('en-IN',   { day: '2-digit', month: 'long', year: 'numeric' }) : ''
  const invoiceNumber  = `INV-${Date.now().toString().slice(-8)}`

  // ── Generate & download PDF invoice ──────────────────────────────────────────
  const handleDownloadInvoice = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const purple  = [124, 58, 237]  as [number, number, number]
    const dark    = [17, 17, 24]    as [number, number, number]
    const white   = [255, 255, 255] as [number, number, number]
    const gray    = [150, 150, 160] as [number, number, number]
    const light   = [240, 240, 245] as [number, number, number]
    const green   = [16, 185, 129]  as [number, number, number]

    const pageW = 210

    // ── Header background ─────────────────────────────────────────────────────
    doc.setFillColor(...dark)
    doc.rect(0, 0, pageW, 50, 'F')

    // ── Brand ─────────────────────────────────────────────────────────────────
    doc.setFillColor(...purple)
    doc.roundedRect(15, 12, 12, 12, 2, 2, 'F')
    doc.setTextColor(...white)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('B', 21, 21, { align: 'center' })

    doc.setFontSize(18)
    doc.text('BookEase', 32, 21)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text('bookease.in  |  support@bookease.in', 32, 27)

    // ── Invoice label ─────────────────────────────────────────────────────────
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...white)
    doc.text('INVOICE', pageW - 15, 21, { align: 'right' })

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text(`#${invoiceNumber}`, pageW - 15, 28, { align: 'right' })

    // ── Paid badge ────────────────────────────────────────────────────────────
    doc.setFillColor(...green)
    doc.roundedRect(pageW - 40, 34, 25, 8, 2, 2, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...white)
    doc.text('PAID', pageW - 27.5, 39.5, { align: 'center' })

    // ── Bill To / Invoice Details ─────────────────────────────────────────────
    doc.setFillColor(...light)
    doc.rect(0, 50, pageW, 45, 'F')

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...gray)
    doc.text('BILL TO', 15, 62)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(name, 15, 70)

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 90)
    doc.text(email, 15, 76)

    // Right column
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...gray)
    doc.text('INVOICE DATE', pageW - 80, 62)
    doc.text('VALID UNTIL', pageW - 80, 72)
    doc.text('PAYMENT ID', pageW - 80, 82)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...dark)
    doc.text(formattedStart, pageW - 15, 62, { align: 'right' })
    doc.text(formattedEnd,   pageW - 15, 72, { align: 'right' })
    doc.text(paymentId,      pageW - 15, 82, { align: 'right' })

    // ── Table header ──────────────────────────────────────────────────────────
    doc.setFillColor(...purple)
    doc.rect(15, 105, pageW - 30, 10, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...white)
    doc.text('DESCRIPTION',    20,  112)
    doc.text('BILLING CYCLE',  110, 112, { align: 'center' })
    doc.text('DURATION',       148, 112, { align: 'center' })
    doc.text('AMOUNT',         pageW - 20, 112, { align: 'right' })

    // ── Table row ─────────────────────────────────────────────────────────────
    doc.setFillColor(248, 248, 252)
    doc.rect(15, 115, pageW - 30, 14, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...dark)
    doc.text(`BookEase ${plan} Plan`, 20, 124)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(80, 80, 90)
    doc.text(cycle.charAt(0).toUpperCase() + cycle.slice(1), 110, 124, { align: 'center' })
    doc.text(cycle === 'yearly' ? '365 days' : '30 days',   148, 124, { align: 'center' })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...dark)
    doc.text(`₹${price}`, pageW - 20, 124, { align: 'right' })

    // ── Totals ────────────────────────────────────────────────────────────────
    doc.setDrawColor(...light)
    doc.line(15, 135, pageW - 15, 135)

    const totals: [string, string][] = [
      ['Subtotal',  `₹${price}`],
      ['GST (18%)', `₹${Math.round(Number(price) * 0.18)}`],
      ['Total',     `₹${Math.round(Number(price) * 1.18)}`],
    ]

    totals.forEach(([label, value], i) => {
      const y = 144 + i * 9
      const isTotal = label === 'Total'

      if (isTotal) {
        doc.setFillColor(...purple)
        doc.rect(pageW - 80, y - 6, 65, 10, 'F')
        doc.setTextColor(...white)
      } else {
        doc.setTextColor(80, 80, 90)
      }

      doc.setFontSize(isTotal ? 11 : 9)
      doc.setFont('helvetica', isTotal ? 'bold' : 'normal')
      doc.text(label, pageW - 75, y)
      doc.text(value,  pageW - 20, y, { align: 'right' })

      doc.setTextColor(...dark)
    })

    // ── Subscription period ───────────────────────────────────────────────────
    doc.setFillColor(230, 220, 255)
    doc.roundedRect(15, 180, pageW - 30, 16, 3, 3, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...purple)
    doc.text(
      `Subscription active from ${formattedStart} to ${formattedEnd}`,
      pageW / 2, 190, { align: 'center' },
    )

    // ── Footer ────────────────────────────────────────────────────────────────
    doc.setFillColor(...dark)
    doc.rect(0, 272, pageW, 25, 'F')
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text('Thank you for choosing BookEase!', pageW / 2, 281, { align: 'center' })
    doc.text('For support: support@bookease.in  |  bookease.in', pageW / 2, 287, { align: 'center' })

    doc.save(`BookEase_Invoice_${invoiceNumber}.pdf`)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4 py-16">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7C3AED]/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg">

        {/* ── Success Card ───────────────────────────────────────────────────── */}
        <div className="bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">

          {/* Top banner */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-white text-2xl font-jakarta font-bold">Payment Successful!</h1>
            <p className="text-white/80 font-dm text-sm mt-1">
              Your BookEase {plan} plan is now active
            </p>
          </div>

          {/* Details */}
          <div ref={invoiceRef} className="px-8 py-6 space-y-4">

            {/* Subscription badge */}
            <div className="flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-xl px-4 py-3">
              <Sparkles size={16} className="text-[#9B5CF6]" />
              <span className="text-white font-dm text-sm font-semibold">
                {plan} Plan · {cycle === 'yearly' ? 'Annual' : 'Monthly'} billing
              </span>
            </div>

            {/* Info rows */}
            {[
              ['Plan',           `${plan} (${cycle})`         ],
              ['Amount Paid',    `₹${price}`                  ],
              ['Valid From',     formattedStart               ],
              ['Valid Until',    formattedEnd                 ],
              ['Payment ID',     paymentId                    ],
              ['Order ID',       orderId                      ],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-white/50 font-dm text-sm">{label}</span>
                <span className="text-white font-dm text-sm font-medium truncate max-w-[200px] text-right">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex flex-col gap-3">
            <button
              onClick={handleDownloadInvoice}
              className="w-full flex items-center justify-center gap-2 border border-[#7C3AED]/50 text-[#9B5CF6] hover:bg-[#7C3AED]/10 font-dm font-semibold py-3 rounded-xl transition-colors"
            >
              <Download size={18} />
              Download Invoice (PDF)
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9B5CF6] text-white font-dm font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#7C3AED]/30"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </button>
          </div>
        </div>

        <p className="text-center text-white/30 font-dm text-xs mt-4">
          A confirmation has been noted on your account · {email}
        </p>
      </div>
    </div>
  )
}