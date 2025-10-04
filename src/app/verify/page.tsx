"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
    <div className="min-h-screen bg-[#e3ebf2] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Show their predictions big and bold at the top */}
        <div className="mb-6">
          <div className="flex justify-center gap-12 mb-8">
            <div>
              <p className="text-lg text-[#345e7d] mb-2">SEO Score:</p>
              <p className="text-6xl font-bold text-[#6da7cc]">{quizSeoScore}%</p>
            </div>
            <div>
              <p className="text-lg text-[#345e7d] mb-2">AEO Score:</p>
              <p className="text-6xl font-bold text-[#86c444]">{quizAeoScore}%</p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-[#2b4257]">
          But How Accurate Are You?
        </h1>

        {/* Warning box */}
        <div className="bg-[#86c444]/10 border-l-4 border-[#86c444] p-6 mb-8 text-left">
          <p className="font-bold text-lg mb-2 text-[#2b4257]">Most companies are WRONG by 30+ points.</p>
          <p className="text-[#345e7d]">
            Real example: A CEO predicted 80% SEO.<br />
            Reality was 42%. That&apos;s a 38-point blind spot.<br />
            They lost 20 deals per month without knowing.
          </p>
        </div>

        <p className="text-2xl font-semibold mb-6 text-[#2b4257]">
          Want to see YOUR gap?
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://yourwebsite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="text-lg p-6 border-[#88a9c3]/50"
          />

          <Button
            type="submit"
            size="lg"
            className="w-full text-lg h-auto py-4"
          >
            Show Me My Gap
          </Button>
        </form>

        <p className="text-sm text-[#88a9c3] mt-4">
          30-second analysis • No credit card • Free
        </p>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#e3ebf2] flex items-center justify-center"><p>Loading...</p></div>}>
      <VerifyPageContent />
    </Suspense>
  )
}
