"use client"

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

function AnalyzingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const quizSeoScore = searchParams.get('quizSeo')
  const quizAeoScore = searchParams.get('quizAeo')

  const [countdown, setCountdown] = useState(30)
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "Analyzing your website structure...",
    "Checking 47 SEO ranking factors...",
    "Scanning schema markup and metadata...",
    "Evaluating content depth and authority...",
    "Testing AI search visibility...",
    "Comparing to industry benchmarks...",
    "Calculating your actual scores...",
    "Preparing your gap analysis...",
  ]

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Generate mock actual scores (30-70 range)
      const actualSeo = Math.floor(Math.random() * 41) + 30
      const actualAeo = Math.floor(Math.random() * 41) + 30

      // Navigate to gap-analysis page with all params including actual scores
      router.push(
        `/gap-analysis?url=${encodeURIComponent(url || '')}&quizSeo=${quizSeoScore}&quizAeo=${quizAeoScore}&actualSeo=${actualSeo}&actualAeo=${actualAeo}`
      )
    }
  }, [countdown, router, url, quizSeoScore, quizAeoScore])

  // Rotate messages every 3.5 seconds
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 3500)
    return () => clearInterval(messageTimer)
  }, [])

  // Calculate progress (30 seconds total)
  const progress = ((30 - countdown) / 30) * 100

  // Format countdown message
  const getCountdownMessage = () => {
    if (countdown <= 5) {
      return "Preparing your results..."
    } else if (countdown <= 10) {
      return "Almost done..."
    } else {
      return `${countdown} seconds remaining`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#2b4257] to-[#345e7d]">
      <div className="max-w-2xl w-full text-center">
        {/* Spinning loader */}
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Current analysis message */}
        <h2 className="text-2xl font-semibold mb-6 text-white transition-opacity duration-500">
          {messages[currentMessage]}
        </h2>

        {/* Countdown timer */}
        <div className="mb-8">
          <div className="text-4xl font-bold text-white mb-2 transition-all duration-300">
            ⏱️ {getCountdownMessage()}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-3 bg-white/20" />
          <p className="text-sm text-[#e3ebf2] mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Analyzing URL */}
        <p className="text-[#e3ebf2] mt-8">
          Analyzing: <span className="font-mono text-sm bg-white/20 px-3 py-1 rounded text-white">{url}</span>
        </p>
      </div>
    </div>
  )
}

export default function AnalyzingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#2b4257] to-[#345e7d] flex items-center justify-center"><p className="text-white">Loading...</p></div>}>
      <AnalyzingPageContent />
    </Suspense>
  )
}
