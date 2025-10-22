'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

interface Report {
  website_url: string
  quiz_seo_score: number
  quiz_aeo_score: number
  actual_seo_score: number
  actual_aeo_score: number
  seo_gap: number
  aeo_gap: number
  total_gap: number
  gap_type: string
  profile_type: string
}

export default function PartialGapPage() {
  const params = useParams()
  const router = useRouter()
  const reportId = params.reportId as string

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReport()
  }, [reportId])

  async function fetchReport() {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('report_id', reportId)
      .single()

    if (error || !data) {
      console.error('Error fetching report:', error)
      router.push('/verify')
      return
    }

    setReport(data)
    setLoading(false)
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    // Navigate to dashboard with email
    router.push(`/dashboard/${reportId}?email=${encodeURIComponent(email)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading your analysis...</div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#2a4358] mb-4">
            Your SEO Reality Check
          </h1>
          <p className="text-xl text-[#345e7d]">
            Here's what we found for <span className="font-semibold text-[#2b4257]">{report.website_url}</span>
          </p>
        </div>

        {/* SEO Gap Revealed */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-[#2a4358] mb-8 flex items-center">
            <span className="text-4xl mr-3">📊</span>
            Traditional Search (SEO)
          </h2>

          {/* Side-by-side comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">

            {/* Your Prediction */}
            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-700 mb-3 uppercase tracking-wide">
                YOUR PREDICTION
              </div>
              <div className="text-6xl font-extrabold text-blue-600 mb-6">
                {report.quiz_seo_score}%
              </div>
              <div className="w-full bg-blue-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${report.quiz_seo_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-700 mt-3">What you thought</p>
            </div>

            {/* Reality */}
            <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
              <div className="text-sm font-bold text-red-700 mb-3 uppercase tracking-wide">
                REALITY
              </div>
              <div className="text-6xl font-extrabold text-red-600 mb-6">
                {report.actual_seo_score}%
              </div>
              <div className="w-full bg-red-200 rounded-full h-4">
                <div
                  className="bg-red-600 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${report.actual_seo_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-red-700 mt-3">What we measured</p>
            </div>
          </div>

          {/* The Gap */}
          <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-8">
            <div className="text-sm font-bold text-red-700 mb-3 uppercase tracking-wide">
              YOUR SEO BLIND SPOT
            </div>
            <div className="text-7xl font-extrabold text-red-600 mb-2">
              {report.seo_gap}
            </div>
            <div className="text-2xl font-bold text-red-700">
              points off
            </div>
          </div>
        </div>

        {/* AEO Gap - LOCKED */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-8 border border-gray-100 relative overflow-hidden">
          {/* Blur overlay */}
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center max-w-md px-6">
              <div className="text-7xl mb-6">🔒</div>
              <h3 className="text-3xl font-bold text-[#2a4358] mb-4">
                AI Search (AEO) Gap Locked
              </h3>
              <p className="text-lg text-[#345e7d] mb-8">
                See your complete analysis + exactly how to fix it
              </p>
              <button
                onClick={() => setShowEmailForm(true)}
                className="bg-gradient-to-r from-[#86c444] to-[#76b33d] text-white px-10 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                Unlock Full Analysis
              </button>
            </div>
          </div>

          {/* Blurred content (teaser) */}
          <h2 className="text-3xl font-bold text-[#2a4358] mb-8 flex items-center opacity-20">
            <span className="text-4xl mr-3">🤖</span>
            AI Search (AEO)
          </h2>
          <div className="grid md:grid-cols-2 gap-8 opacity-10">
            <div className="bg-blue-50 rounded-xl p-8 border-2 border-blue-200">
              <div className="text-sm font-bold text-blue-700 mb-3">
                YOUR PREDICTION
              </div>
              <div className="text-6xl font-extrabold text-blue-600 mb-6">
                {report.quiz_aeo_score}%
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
              <div className="text-sm font-bold text-red-700 mb-3">
                REALITY
              </div>
              <div className="text-6xl font-extrabold text-red-600 mb-6">
                ??%
              </div>
            </div>
          </div>
        </div>

        {/* Impact Warning */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-8 md:p-10 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold text-[#2a4358] mb-6 flex items-center">
            <span className="text-3xl mr-3">⚠️</span>
            What This Actually Means
          </h3>
          <p className="text-lg text-[#345e7d] mb-6 leading-relaxed">
            Most business owners with a <span className="font-bold text-red-600">{report.seo_gap}+ point SEO gap</span> are losing:
          </p>
          <ul className="space-y-4 text-lg text-[#345e7d]">
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
              <span><strong className="text-[#2a4358]">15-20 qualified prospects</strong> who never find you each month</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
              <span><strong className="text-[#2a4358]">$180K-$240K in annual revenue</strong> to competitors who DO show up</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
              <span><strong className="text-[#2a4358]">Deals you don't even know you're missing</strong></span>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t-2 border-amber-200">
            <p className="text-xl font-bold text-[#2a4358] text-center">
              And that's just SEO. Your AEO gap could be even worse. 🔒
            </p>
          </div>
        </div>

        {/* Email Form (conditionally shown) */}
        {showEmailForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border-2 border-[#86c444]">
            <h3 className="text-3xl font-bold text-[#2a4358] mb-6">
              Get Your Complete Analysis
            </h3>
            <p className="text-lg text-[#345e7d] mb-6">
              Enter your email to unlock:
            </p>
            <ul className="space-y-3 text-[#345e7d] mb-8">
              <li className="flex items-start">
                <Image src="/check.png" alt="Check" width={24} height={24} className="mr-3 mt-1" />
                <span className="text-lg">Your full SEO + AEO gap analysis with exact scores</span>
              </li>
              <li className="flex items-start">
                <Image src="/check.png" alt="Check" width={24} height={24} className="mr-3 mt-1" />
                <span className="text-lg">Specific pages to update (prioritized by impact)</span>
              </li>
              <li className="flex items-start">
                <Image src="/check.png" alt="Check" width={24} height={24} className="mr-3 mt-1" />
                <span className="text-lg">Schema markup templates you can copy-paste</span>
              </li>
              <li className="flex items-start">
                <Image src="/check.png" alt="Check" width={24} height={24} className="mr-3 mt-1" />
                <span className="text-lg">30-day roadmap to close your gap</span>
              </li>
            </ul>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-lg focus:border-[#86c444] focus:outline-none focus:ring-2 focus:ring-[#86c444]/20 transition-all"
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#86c444] to-[#76b33d] text-white px-8 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl disabled:opacity-50"
              >
                {submitting ? 'Unlocking...' : 'Unlock My Dashboard'}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-6 text-center">
              We respect your privacy. No spam, ever. 🔒
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
