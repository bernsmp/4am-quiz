// PageSpeed Insights Analyzer (FREE - Google API)
// Analyzes technical SEO performance

import type { SEOAnalyzerResult, AnalysisInput } from './types'

interface PageSpeedDetails {
  performanceScore: number
  seoScore: number
  accessibilityScore: number
  bestPracticesScore: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  speedIndex: number
  totalBlockingTime: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

export async function analyzePageSpeed(input: AnalysisInput): Promise<SEOAnalyzerResult> {
  try {
    // PageSpeed Insights API v5
    // Note: API key not required for basic usage, but recommended for production
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || ''
    const strategy = 'mobile' // or 'desktop'

    const url = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
    url.searchParams.append('url', input.websiteUrl)
    url.searchParams.append('strategy', strategy)
    url.searchParams.append('category', 'performance')
    url.searchParams.append('category', 'seo')
    url.searchParams.append('category', 'accessibility')
    url.searchParams.append('category', 'best-practices')

    if (apiKey) {
      url.searchParams.append('key', apiKey)
    }

    const response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(30000) // 30 second timeout (PageSpeed can be slow)
    })

    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}`)
    }

    const data = await response.json()

    // Extract scores (0-1 scale, convert to 0-100)
    const lighthouseResult = data.lighthouseResult
    const categories = lighthouseResult?.categories || {}

    const details: PageSpeedDetails = {
      performanceScore: Math.round((categories.performance?.score || 0) * 100),
      seoScore: Math.round((categories.seo?.score || 0) * 100),
      accessibilityScore: Math.round((categories.accessibility?.score || 0) * 100),
      bestPracticesScore: Math.round((categories['best-practices']?.score || 0) * 100),

      // Core Web Vitals
      firstContentfulPaint: lighthouseResult?.audits?.['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: lighthouseResult?.audits?.['largest-contentful-paint']?.numericValue || 0,
      speedIndex: lighthouseResult?.audits?.['speed-index']?.numericValue || 0,
      totalBlockingTime: lighthouseResult?.audits?.['total-blocking-time']?.numericValue || 0,
      cumulativeLayoutShift: lighthouseResult?.audits?.['cumulative-layout-shift']?.numericValue || 0,
      timeToInteractive: lighthouseResult?.audits?.['interactive']?.numericValue || 0,
    }

    // Calculate overall SEO score based on PageSpeed metrics
    const score = calculatePageSpeedScore(details)

    return {
      type: 'seo',
      score,
      details,
      enabled: true
    }
  } catch (error) {
    // If PageSpeed API fails, return with error but don't crash the whole analysis
    return {
      type: 'seo',
      score: 0,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        note: 'PageSpeed Insights may be rate-limited or slow. Consider adding GOOGLE_PAGESPEED_API_KEY to .env'
      },
      enabled: true,
      error: error instanceof Error ? error.message : 'PageSpeed analysis failed'
    }
  }
}

function calculatePageSpeedScore(details: PageSpeedDetails): number {
  // Weight the different scores
  const weights = {
    performance: 0.35,  // 35% - Critical for SEO
    seo: 0.40,          // 40% - Direct SEO impact
    accessibility: 0.15, // 15% - Moderate SEO impact
    bestPractices: 0.10  // 10% - Indirect SEO impact
  }

  const weightedScore =
    (details.performanceScore * weights.performance) +
    (details.seoScore * weights.seo) +
    (details.accessibilityScore * weights.accessibility) +
    (details.bestPracticesScore * weights.bestPractices)

  // Bonus/penalty for Core Web Vitals
  let vitalBonus = 0

  // LCP (Largest Contentful Paint) - Good < 2.5s, Poor > 4s
  if (details.largestContentfulPaint < 2500) vitalBonus += 5
  else if (details.largestContentfulPaint > 4000) vitalBonus -= 5

  // FCP (First Contentful Paint) - Good < 1.8s, Poor > 3s
  if (details.firstContentfulPaint < 1800) vitalBonus += 3
  else if (details.firstContentfulPaint > 3000) vitalBonus -= 3

  // CLS (Cumulative Layout Shift) - Good < 0.1, Poor > 0.25
  if (details.cumulativeLayoutShift < 0.1) vitalBonus += 5
  else if (details.cumulativeLayoutShift > 0.25) vitalBonus -= 5

  // TBT (Total Blocking Time) - Good < 200ms, Poor > 600ms
  if (details.totalBlockingTime < 200) vitalBonus += 3
  else if (details.totalBlockingTime > 600) vitalBonus -= 3

  const finalScore = weightedScore + vitalBonus

  return Math.max(0, Math.min(100, Math.round(finalScore)))
}
