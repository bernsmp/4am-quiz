'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
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
  email: string | null
}

export default function DashboardPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const reportId = params.reportId as string
  const emailParam = searchParams.get('email')

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

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

    // NOTE: Email capture is now handled by GHL page redirect flow
    // The old direct email capture code is commented out below
    /*
    // If email is provided but not saved, save it
    if (emailParam && !data.email) {
      saveEmail(emailParam)
    }
    */

    // Track dashboard view
    await supabase
      .from('reports')
      .update({
        dashboard_views: (data.dashboard_views || 0) + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq('report_id', reportId)
  }

  // NOTE: This function is preserved for future use if needed
  // Currently, email capture is handled by GHL page redirect flow
  /*
  async function saveEmail(email: string) {
    setSavingEmail(true)

    try {
      // Update report with email
      const { error: updateError } = await supabase
        .from('reports')
        .update({
          email: email,
          email_captured_at: new Date().toISOString()
        })
        .eq('report_id', reportId)

      if (updateError) {
        console.error('Error saving email:', updateError)
        return
      }

      // Send to GHL webhook (will create this API next)
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          reportId,
          websiteUrl: report?.website_url,
          seoGap: report?.seo_gap,
          aeoGap: report?.aeo_gap,
          totalGap: report?.total_gap
        })
      })

      // Update local state
      if (report) {
        setReport({ ...report, email })
      }
    } catch (error) {
      console.error('Error in saveEmail:', error)
    } finally {
      setSavingEmail(false)
    }
  }
  */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#2a4358] mb-4">
            Your Complete Gap Analysis
          </h1>
          <p className="text-xl text-[#345e7d] mb-2">
            Analysis for: <span className="font-semibold text-[#2b4257]">{report.website_url}</span>
          </p>
          <p className="text-lg text-[#86c444] font-semibold">
            ✓ Full access unlocked
          </p>
        </div>

        {/* Full Comparison - Side by Side */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* SEO Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-[#2a4358] mb-6 flex items-center">
              <span className="text-4xl mr-3">📊</span>
              Traditional Search (SEO)
            </h2>

            <div className="space-y-6">
              {/* Prediction */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-xs font-bold text-blue-700 mb-2 uppercase">Your Prediction</div>
                <div className="text-5xl font-extrabold text-blue-600 mb-3">
                  {report.quiz_seo_score}%
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${report.quiz_seo_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Reality */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="text-xs font-bold text-red-700 mb-2 uppercase">Reality</div>
                <div className="text-5xl font-extrabold text-red-600 mb-3">
                  {report.actual_seo_score}%
                </div>
                <div className="w-full bg-red-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${report.actual_seo_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Gap */}
              <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
                <div className="text-xs font-bold text-red-700 mb-2 uppercase">SEO Gap</div>
                <div className="text-6xl font-extrabold text-red-600">
                  {report.seo_gap}
                </div>
                <div className="text-lg font-bold text-red-700 mt-1">points</div>
              </div>
            </div>
          </div>

          {/* AEO Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-[#2a4358] mb-6 flex items-center">
              <span className="text-4xl mr-3">🤖</span>
              AI Search (AEO)
            </h2>

            <div className="space-y-6">
              {/* Prediction */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-xs font-bold text-blue-700 mb-2 uppercase">Your Prediction</div>
                <div className="text-5xl font-extrabold text-blue-600 mb-3">
                  {report.quiz_aeo_score}%
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${report.quiz_aeo_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Reality */}
              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <div className="text-xs font-bold text-red-700 mb-2 uppercase">Reality</div>
                <div className="text-5xl font-extrabold text-red-600 mb-3">
                  {report.actual_aeo_score}%
                </div>
                <div className="w-full bg-red-200 rounded-full h-3">
                  <div
                    className="bg-red-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${report.actual_aeo_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Gap */}
              <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
                <div className="text-xs font-bold text-red-700 mb-2 uppercase">AEO Gap</div>
                <div className="text-6xl font-extrabold text-red-600">
                  {report.aeo_gap}
                </div>
                <div className="text-lg font-bold text-red-700 mt-1">points</div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Gap & Impact */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-10 mb-12 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-[#2a4358] mb-4">
              THE TOTAL GAP
            </h2>
            <div className="text-8xl font-extrabold text-red-600 mb-2">
              {report.total_gap}
            </div>
            <div className="text-2xl font-bold text-red-700">
              points of missed opportunity
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-[#2a4358] mb-6 flex items-center">
              <span className="text-3xl mr-3">⚠️</span>
              What This Costs You
            </h3>
            <ul className="space-y-4 text-lg text-[#345e7d]">
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
                <span><strong className="text-[#2a4358]">SEO Gap of {report.seo_gap} points</strong> = You&apos;re invisible in searches you think you&apos;re showing up in</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
                <span><strong className="text-[#2a4358]">AEO Gap of {report.aeo_gap} points</strong> = AI tools aren&apos;t recommending you when asked</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
                <span><strong className="text-[#2a4358]">Total Blind Spot: {report.total_gap} points</strong> of lost visibility</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 font-bold mr-3 text-2xl">•</span>
                <span><strong className="text-[#2a4358]">Estimated impact:</strong> 15-20 missed deals per month</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 border border-gray-100">
          <h2 className="text-4xl font-bold text-[#2a4358] mb-8 flex items-center">
            <span className="text-4xl mr-3">🎯</span>
            Your 30-Day Roadmap
          </h2>

          <div className="space-y-6">
            {/* Week 1 */}
            <div className="border-l-4 border-[#86c444] pl-6 py-4">
              <h3 className="text-2xl font-bold text-[#2a4358] mb-3">Week 1: Foundation</h3>
              <ul className="space-y-2 text-lg text-[#345e7d]">
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Audit top 10 pages for schema markup gaps</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Add FAQ schema to product/service pages</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Create author profiles with E-A-T signals</span>
                </li>
              </ul>
            </div>

            {/* Week 2 */}
            <div className="border-l-4 border-[#76b33d] pl-6 py-4">
              <h3 className="text-2xl font-bold text-[#2a4358] mb-3">Week 2: Content Optimization</h3>
              <ul className="space-y-2 text-lg text-[#345e7d]">
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Rewrite 5 key pages with AI-friendly structure</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Add clear, direct answers to common questions</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Create comparison tables (you vs competitors)</span>
                </li>
              </ul>
            </div>

            {/* Week 3 */}
            <div className="border-l-4 border-[#6da7cc] pl-6 py-4">
              <h3 className="text-2xl font-bold text-[#2a4358] mb-3">Week 3: Authority Building</h3>
              <ul className="space-y-2 text-lg text-[#345e7d]">
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Get cited in 3 industry publications</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Create data-driven case studies with results</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Update LinkedIn profiles with credentials</span>
                </li>
              </ul>
            </div>

            {/* Week 4 */}
            <div className="border-l-4 border-[#345e7d] pl-6 py-4">
              <h3 className="text-2xl font-bold text-[#2a4358] mb-3">Week 4: Measurement & Iteration</h3>
              <ul className="space-y-2 text-lg text-[#345e7d]">
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Test your site in ChatGPT, Perplexity, Claude</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Track which queries now surface your brand</span>
                </li>
                <li className="flex items-start">
                  <Image src="/check.png" alt="Check" width={20} height={20} className="mr-3 mt-1" />
                  <span>Double down on what&apos;s working</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#4a6f8f] rounded-2xl p-10 text-center shadow-2xl">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Close Your Gap?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We can help you implement this roadmap and start capturing those 15-20 missed deals per month.
          </p>
          <a
            href="https://sociallysquare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-[#86c444] to-[#76b33d] text-white px-12 py-5 rounded-xl font-bold text-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl"
          >
            Let&apos;s Talk Strategy
          </a>
        </div>

      </div>
    </div>
  )
}
