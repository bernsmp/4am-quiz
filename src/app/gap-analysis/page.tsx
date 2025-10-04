"use client"

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

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
    <div className="min-h-screen bg-[#e3ebf2] py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#2b4257]">
            {getHeadline()}
          </h1>
          <p className="text-xl text-[#345e7d] max-w-3xl mx-auto">
            {getSubheading()}
          </p>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Card - Prediction */}
          <div className="bg-white border-2 border-[#88a9c3]/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#2b4257]">
              Your Prediction
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#345e7d]">SEO Score</span>
                  <span className="text-2xl font-bold text-[#6da7cc]">{quizSeoScore}%</span>
                </div>
                <Progress value={quizSeoScore} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#345e7d]">AEO Score</span>
                  <span className="text-2xl font-bold text-[#86c444]">{quizAeoScore}%</span>
                </div>
                <Progress value={quizAeoScore} className="h-3" />
              </div>
            </div>

            <p className="text-sm text-[#88a9c3] mt-6 text-center italic">
              What you think your visibility is
            </p>
          </div>

          {/* Right Card - Reality */}
          <div className="bg-[#2b4257] border-2 border-[#345e7d] rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Reality
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#e3ebf2]">SEO Score</span>
                  <span className="text-2xl font-bold text-[#6da7cc]">{actualSeoScore}%</span>
                </div>
                <Progress value={actualSeoScore} className="h-3 bg-[#345e7d]" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-[#e3ebf2]">AEO Score</span>
                  <span className="text-2xl font-bold text-[#86c444]">{actualAeoScore}%</span>
                </div>
                <Progress value={actualAeoScore} className="h-3 bg-[#345e7d]" />
              </div>
            </div>

            <p className="text-sm text-[#88a9c3] mt-6 text-center italic">
              What your actual visibility is
            </p>
          </div>
        </div>

        {/* The Gap - Big and Dramatic */}
        <div className="bg-white border-4 border-[#86c444] rounded-lg p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#2b4257]">THE GAP</h2>

          <div className="space-y-4 mb-6">
            <div>
              <span className="text-[#345e7d] text-lg">SEO Gap: </span>
              <span className="text-5xl font-bold text-[#6da7cc]">{seoGap}</span>
              <span className="text-[#345e7d] text-lg"> points</span>
            </div>

            <div>
              <span className="text-[#345e7d] text-lg">AEO Gap: </span>
              <span className="text-5xl font-bold text-[#86c444]">{aeoGap}</span>
              <span className="text-[#345e7d] text-lg"> points</span>
            </div>
          </div>

          <div className="border-t-4 border-[#86c444] pt-6">
            <p className="text-[#345e7d] text-xl mb-2">Total Blind Spot</p>
            <p className="text-6xl font-bold text-[#2b4257]">{totalGap}</p>
            <p className="text-[#345e7d] text-xl">points</p>
          </div>
        </div>

        {/* What This Means Section */}
        <div className="bg-[#86c444]/10 border-l-4 border-[#86c444] rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-[#2b4257]">
            ⚠️ What This Actually Means:
          </h3>

          <div className="space-y-4 text-[#345e7d]">
            <div className="flex items-start">
              <span className="text-2xl mr-3 text-[#86c444]">•</span>
              <p className="text-lg">
                <strong className="text-[#2b4257]">SEO Gap of {seoGap} points</strong> = You&apos;re invisible in searches you think you&apos;re showing up in
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-3 text-[#86c444]">•</span>
              <p className="text-lg">
                <strong className="text-[#2b4257]">AEO Gap of {aeoGap} points</strong> = AI tools aren&apos;t recommending you when asked
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-3 text-[#86c444]">•</span>
              <p className="text-lg">
                <strong className="text-[#2b4257]">Total Blind Spot: {totalGap} points</strong> of missed opportunity
              </p>
            </div>

            <div className="flex items-start">
              <span className="text-2xl mr-3 text-[#86c444]">•</span>
              <p className="text-lg">
                <strong className="text-[#2b4257]">Estimated impact:</strong> 15-20 missed deals per month
              </p>
            </div>
          </div>
        </div>

        {/* Email Capture */}
        <div className="text-center">
          {!showEmailForm ? (
            <Button
              onClick={() => setShowEmailForm(true)}
              size="lg"
              className="text-xl px-12 py-6 h-auto"
            >
              Get the Detailed Breakdown
            </Button>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-lg p-8 shadow-lg border-2 border-[#88a9c3]/30">
              <h3 className="text-2xl font-bold mb-4 text-[#2b4257]">Get Your Full Report</h3>
              <p className="text-[#345e7d] mb-6">
                We&apos;ll send you a detailed breakdown of your gaps and specific action steps to close them.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-lg p-6 border-[#88a9c3]/50"
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg h-auto py-4"
                >
                  Send Me the Report
                </Button>
              </form>

              <p className="text-sm text-[#88a9c3] mt-4">
                No spam. Just your report and actionable insights.
              </p>
            </div>
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
    <Suspense fallback={<div className="min-h-screen bg-[#e3ebf2] flex items-center justify-center"><p>Loading...</p></div>}>
      <GapAnalysisContent />
    </Suspense>
  )
}
