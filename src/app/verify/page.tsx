"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

function VerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizSeoScore = searchParams.get('quizSeo') // Get SEO score
  const quizAeoScore = searchParams.get('quizAeo') // Get AEO score

  const [url, setUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to analyzing page with all data
    router.push(`/analyzing?url=${encodeURIComponent(url)}&quizSeo=${quizSeoScore}&quizAeo=${quizAeoScore}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white flex items-center justify-center p-6 py-20">
      <div className="max-w-3xl w-full">
        <Card className="p-10 md:p-12 rounded-2xl bg-white shadow-xl shadow-blue-900/10 border border-blue-100/50 ring-1 ring-gray-900/5">
          {/* Show their predictions big and bold at the top */}
          <div className="mb-10 text-center">
            <div className="flex justify-center gap-12 md:gap-16 mb-10">
              <div>
                <p className="text-xl text-[#345e7d] mb-3 font-semibold">SEO Score:</p>
                <p className="text-6xl md:text-7xl font-extrabold text-[#6da7cc]">{quizSeoScore}%</p>
              </div>
              <div>
                <p className="text-xl text-[#345e7d] mb-3 font-semibold">AEO Score:</p>
                <p className="text-6xl md:text-7xl font-extrabold text-[#86c444]">{quizAeoScore}%</p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-[#2b4257] text-center tracking-tight">
            But How Accurate Are You?
          </h1>

          {/* Warning box */}
          <Card className="bg-gradient-to-br from-amber-50/80 to-orange-50/50 border-l-4 border-amber-500 p-8 mb-10 text-left shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="font-bold text-xl mb-3 text-[#2b4257]">Most companies are WRONG by 30+ points.</p>
            <p className="text-lg text-[#345e7d] leading-relaxed">
              Real example: A CEO predicted 80% SEO.<br />
              Reality was 42%. That&apos;s a 38-point blind spot.<br />
              They lost 20 deals per month without knowing.
            </p>
          </Card>

          <p className="text-2xl md:text-3xl font-bold mb-8 text-[#2b4257] text-center">
            Want to see YOUR gap?
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="text-lg p-6 border-2 border-[#88a9c3]/50 rounded-xl focus:border-[#6da7cc] transition-colors"
            />

            <div className="flex justify-center">
              <ShimmerButton
                type="submit"
                className="w-full md:w-auto px-12 py-6 text-xl font-bold shadow-xl hover:shadow-green-500/30"
                shimmerColor="#ffffff"
                background="linear-gradient(to right, #86c444, #76b33d)"
                borderRadius="10px"
              >
                <span className="text-white">
                  Show Me My Gap
                </span>
              </ShimmerButton>
            </div>
          </form>

          <p className="text-sm text-[#88a9c3] mt-6 text-center">
            30-second analysis • No credit card • Free
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-white flex items-center justify-center"><p className="text-[#2b4257] text-xl">Loading...</p></div>}>
      <VerifyPageContent />
    </Suspense>
  )
}
