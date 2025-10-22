"use client"

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Input } from '@/components/ui/input'
import { EnhancedProgress } from '@/components/ui/enhanced-progress'
import { Card } from '@/components/ui/card'

function GapAnalysisContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')

  // Get quiz scores with validation (clamp between 0-100)
  const quizSeoScore = Math.max(0, Math.min(100, parseInt(searchParams.get('quizSeo') || '0')))
  const quizAeoScore = Math.max(0, Math.min(100, parseInt(searchParams.get('quizAeo') || '0')))

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')

  // Get actual scores from URL params (with fallback to random generation)
  const actualSeoParam = searchParams.get('actualSeo')
  const actualAeoParam = searchParams.get('actualAeo')

  const actualSeoScore = actualSeoParam
    ? Math.max(0, Math.min(100, parseInt(actualSeoParam)))
    : Math.max(0, quizSeoScore - Math.floor(Math.random() * 30 + 10))

  const actualAeoScore = actualAeoParam
    ? Math.max(0, Math.min(100, parseInt(actualAeoParam)))
    : Math.max(0, quizAeoScore + Math.floor(Math.random() * 20 - 10))

  // Calculate gaps (absolute difference)
  const seoGap = Math.abs(quizSeoScore - actualSeoScore)
  const aeoGap = Math.abs(quizAeoScore - actualAeoScore)
  const totalGap = seoGap + aeoGap

  // Determine gap type
  const getGapType = () => {
    // Check if overconfident (predicted higher by 15+ points)
    if ((quizSeoScore - actualSeoScore >= 15) || (quizAeoScore - actualAeoScore >= 15)) {
      return "overconfident"
    }
    // Check if imposter syndrome (actual is higher by 15+ points)
    if ((actualSeoScore - quizSeoScore >= 15) || (actualAeoScore - quizAeoScore >= 15)) {
      return "imposter"
    }
    // Otherwise accurate
    return "accurate"
  }

  const gapType = getGapType()

  const getHeadline = () => {
    switch (gapType) {
      case "overconfident":
        return "You're Overconfident (And Losing Deals Because of It)"
      case "imposter":
        return "You Have Imposter Syndrome (But You're Actually Winning)"
      case "accurate":
        return "You Know Exactly Where You Stand"
      default:
        return "Here's Your Gap"
    }
  }

  const getSubheading = () => {
    switch (gapType) {
      case "overconfident":
        return "You think you're showing up in searches and AI tools, but you're not. This gap between perception and reality is costing you deals every single day."
      case "imposter":
        return "You're doing better than you think. Your actual visibility is stronger than you believe. But you're still leaving opportunities on the table."
      case "accurate":
        return "You have a realistic sense of your visibility. The gap is small, which means you understand where you stand. Now it's time to improve that position."
      default:
        return "Here's how your prediction compares to reality."
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    // TODO: Send email to backend
    alert('Report will be sent to: ' + email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-[#2b4257] tracking-tight leading-tight">
            {getHeadline()}
          </h1>
          <p className="text-xl md:text-2xl text-[#345e7d] max-w-3xl mx-auto leading-relaxed">
            {getSubheading()}
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Left Card - Prediction */}
          <Card className="p-10 rounded-2xl bg-white shadow-xl shadow-blue-900/10 border border-blue-100/50 ring-1 ring-gray-900/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-[#2b4257]">
              Your Prediction
            </h2>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-lg text-[#345e7d]">SEO Score</span>
                  <span className="text-3xl font-extrabold text-[#6da7cc]">{quizSeoScore}%</span>
                </div>
                <EnhancedProgress value={quizSeoScore} variant="seo" size="lg" showLabel={false} />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-lg text-[#345e7d]">AEO Score</span>
                  <span className="text-3xl font-extrabold text-[#86c444]">{quizAeoScore}%</span>
                </div>
                <EnhancedProgress value={quizAeoScore} variant="aeo" size="lg" showLabel={false} />
              </div>
            </div>

            <p className="text-base text-[#88a9c3] mt-8 text-center italic font-medium">
              What you think your visibility is
            </p>
          </Card>

          {/* Right Card - Reality */}
          <Card className="p-10 rounded-2xl bg-gradient-to-br from-[#2b4257] via-[#345e7d] to-[#2b4257] shadow-xl shadow-blue-900/30 border-2 border-[#345e7d] ring-1 ring-blue-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-white">
              Reality
            </h2>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-lg text-[#e3ebf2]">SEO Score</span>
                  <span className="text-3xl font-extrabold text-[#6da7cc]">{actualSeoScore}%</span>
                </div>
                <EnhancedProgress value={actualSeoScore} variant="seo" size="lg" showLabel={false} className="bg-[#345e7d]" />
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="font-bold text-lg text-[#e3ebf2]">AEO Score</span>
                  <span className="text-3xl font-extrabold text-[#86c444]">{actualAeoScore}%</span>
                </div>
                <EnhancedProgress value={actualAeoScore} variant="aeo" size="lg" showLabel={false} className="bg-[#345e7d]" />
              </div>
            </div>

            <p className="text-base text-[#88a9c3] mt-8 text-center italic font-medium">
              What your actual visibility is
            </p>
          </Card>
        </div>

        {/* The Gap - Big and Dramatic */}
        <Card className="p-12 rounded-2xl bg-gradient-to-br from-green-50 to-white border-4 border-[#86c444] shadow-2xl shadow-green-900/20 mb-16 text-center hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-[#2b4257] tracking-tight">THE GAP</h2>

          <div className="space-y-8 mb-10">
            <div>
              <span className="text-[#345e7d] text-xl font-semibold">SEO Gap: </span>
              <span className="text-6xl md:text-7xl font-extrabold text-[#6da7cc]">{seoGap}</span>
              <span className="text-[#345e7d] text-xl font-semibold"> points</span>
            </div>

            <div>
              <span className="text-[#345e7d] text-xl font-semibold">AEO Gap: </span>
              <span className="text-6xl md:text-7xl font-extrabold text-[#86c444]">{aeoGap}</span>
              <span className="text-[#345e7d] text-xl font-semibold"> points</span>
            </div>
          </div>

          <div className="border-t-4 border-[#86c444] pt-10">
            <p className="text-[#345e7d] text-2xl mb-4 font-bold">Total Blind Spot</p>
            <p className="text-7xl md:text-8xl font-extrabold text-[#2b4257] mb-2">{totalGap}</p>
            <p className="text-[#345e7d] text-2xl font-bold">points</p>
          </div>
        </Card>

        {/* What This Means Section */}
        <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-l-4 border-amber-500 rounded-2xl p-10 mb-16 shadow-xl hover:shadow-2xl transition-all duration-300">
          <h3 className="text-3xl font-extrabold mb-8 text-[#2b4257]">
            ⚠️ What This Actually Means:
          </h3>

          <div className="space-y-6 text-[#345e7d]">
            <div className="flex items-start">
              <span className="text-3xl mr-4 text-[#86c444]">•</span>
              <p className="text-xl leading-relaxed">
                <strong className="text-[#2b4257] font-bold">SEO Gap of {seoGap} points</strong> = You&apos;re invisible in searches you think you&apos;re showing up in
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4 text-[#86c444]">•</span>
              <p className="text-xl leading-relaxed">
                <strong className="text-[#2b4257] font-bold">AEO Gap of {aeoGap} points</strong> = AI tools aren&apos;t recommending you when asked
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4 text-[#86c444]">•</span>
              <p className="text-xl leading-relaxed">
                <strong className="text-[#2b4257] font-bold">Total Blind Spot: {totalGap} points</strong> of missed opportunity
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-3xl mr-4 text-[#86c444]">•</span>
              <p className="text-xl leading-relaxed">
                <strong className="text-[#2b4257] font-bold">Estimated impact:</strong> 15-20 missed deals per month
              </p>
            </div>
          </div>
        </Card>

        {/* Email Capture */}
        <div className="text-center">
          {!showEmailForm ? (
            <div className="flex justify-center">
              <ShimmerButton
                onClick={() => setShowEmailForm(true)}
                className="px-12 py-6 text-xl font-bold shadow-xl hover:shadow-green-500/30"
                shimmerColor="#ffffff"
                background="linear-gradient(to right, #86c444, #76b33d)"
                borderRadius="10px"
              >
                <span className="text-white">
                  Get the Detailed Breakdown
                </span>
              </ShimmerButton>
            </div>
          ) : (
            <Card className="max-w-md mx-auto p-10 rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-100/50 ring-1 ring-gray-900/5">
              <h3 className="text-3xl font-bold mb-4 text-[#2b4257]">Get Your Full Report</h3>
              <p className="text-lg text-[#345e7d] mb-8 leading-relaxed">
                We&apos;ll send you a detailed breakdown of your gaps and specific action steps to close them.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg p-6 border-2 border-[#88a9c3]/50 rounded-xl focus:border-[#6da7cc] transition-colors"
                />

                <ShimmerButton
                  type="submit"
                  className="w-full px-10 py-5 text-lg font-bold shadow-xl hover:shadow-green-500/30"
                  shimmerColor="#ffffff"
                  background="linear-gradient(to right, #86c444, #76b33d)"
                  borderRadius="10px"
                >
                  <span className="text-white">
                    Send Me the Report
                  </span>
                </ShimmerButton>
              </form>

              <p className="text-base text-[#88a9c3] mt-6">
                No spam. Just your report and actionable insights.
              </p>
            </Card>
          )}
        </div>

        {/* Analyzed URL */}
        <p className="text-center text-[#88a9c3] mt-8">
          Analysis for: <span className="font-mono text-sm bg-white px-3 py-1 rounded">{url}</span>
        </p>
      </div>
    </div>
  )
}

export default function GapAnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white flex items-center justify-center"><p className="text-[#2b4257] text-xl">Loading...</p></div>}>
      <GapAnalysisContent />
    </Suspense>
  )
}
