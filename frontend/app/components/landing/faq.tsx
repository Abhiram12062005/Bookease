'use client'

import { useState } from 'react'
import { ChevronDown, Mail, MessageCircle } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How long does it take to set up a booking website?',
      answer: 'You can have your entire website live in under 10 minutes. Simply choose a template, fill in your details, and you\'re ready to start receiving bookings.',
    },
    {
      question: 'What payment methods do you support?',
      answer: 'We support all major credit/debit cards (Visa, Mastercard, American Express), digital wallets (Apple Pay, Google Pay), UPI, and bank transfers for Indian customers.',
    },
    {
      question: 'Do you charge transaction fees?',
      answer: 'We don\'t take a cut of your bookings. You pay a monthly subscription fee based on your plan, and all your revenue goes directly to you. It\'s completely transparent.',
    },
    {
      question: 'Can I customize the look of my booking page?',
      answer: 'Our templates are highly customizable. You can change colors, fonts, add your logo, and customize the layout to match your brand identity.',
    },
    {
      question: 'How do refunds work?',
      answer: 'You can set your own cancellation and refund policy. BookEase handles the refund processing automatically based on your configured policies.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! The Starter plan comes with a 14-day free trial. No credit card required. Upgrade or downgrade at any time.',
    },
    {
      question: 'What about customer support?',
      answer: 'We offer email support for all plans, priority support for Growth and Scale plans, and dedicated support for Scale customers. Our team typically responds within 2-4 hours.',
    },
    {
      question: 'Can I integrate with other tools I use?',
      answer: 'Yes! BookEase integrates with WhatsApp, Instagram, Google Calendar, Slack, and many other popular tools. We also offer API access for custom integrations on our Scale plan.',
    },
  ]

  return (
    <section id="faq" className="py-24 px-6 bg-[#0A0A0F] relative">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-up">
          <h2 className="font-jakarta text-white mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-white/60 font-dm text-lg">
            Find answers to common questions about BookEase
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="card-base overflow-hidden transition-all duration-300 fade-up cursor-pointer hover:border-white/15"
              style={{ animationDelay: `${idx * 30}ms` }}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between hover:bg-white/2 transition-colors">
                <h3 className="text-white font-dm font-semibold text-lg flex-1 text-left">
                  {faq.question}
                </h3>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === idx
                    ? 'bg-[#7C3AED] rotate-180'
                    : 'bg-white/5'
                }`}>
                  <ChevronDown
                    size={18}
                    className={`transition-colors ${
                      openIndex === idx ? 'text-white' : 'text-white/60'
                    }`}
                  />
                </div>
              </div>

              {/* Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === idx ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0 border-t border-white/5">
                  <p className="text-white/60 font-dm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Active Border */}
              {openIndex === idx && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7C3AED]" />
              )}
            </div>
          ))}
        </div>

        {/* Support Card */}
        <div className="card-base p-8 border-l-2 border-l-[#7C3AED]">
          <h3 className="text-white font-jakarta text-xl font-bold mb-2">
            Still have questions?
          </h3>
          <p className="text-white/60 font-dm mb-6">
            Our support team is here to help. Reach out anytime, and we\'ll get back to you within 2-4 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all text-white font-dm text-sm">
              <Mail size={18} />
              support@bookease.com
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all text-white font-dm text-sm">
              <MessageCircle size={18} />
              Chat with us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
