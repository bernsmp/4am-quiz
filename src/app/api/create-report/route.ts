import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import { analyzeWebsite } from '@/services/analyzers'
import { createReportSchema, rateLimiter, RATE_LIMITS, getClientIp, validatePublicUrl } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimit = rateLimiter.check(
      `create-report:${clientIp}`,
      RATE_LIMITS.createReport.limit,
      RATE_LIMITS.createReport.window
    )

    if (!rateLimit.success) {
      const resetDate = new Date(rateLimit.reset)
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetAt: resetDate.toISOString()
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.createReport.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString()
          }
        }
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validation = createReportSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details: validation.error.issues.map(e => ({ field: e.path.join('.'), message: e.message }))
        },
        { status: 400 }
      )
    }

    const {
      websiteUrl,
      quizSeoScore,
      quizAeoScore,
      profileType
    } = validation.data

    // SSRF Protection - validate URL is public
    const urlValidation = validatePublicUrl(websiteUrl)
    if (!urlValidation.valid) {
      return NextResponse.json(
        { error: urlValidation.error || 'Invalid URL' },
        { status: 400 }
      )
    }

    // Run REAL analysis using our analyzer system!
    console.log('Starting real analysis for:', websiteUrl)

    const analysisResult = await analyzeWebsite(
      {
        websiteUrl,
        businessName: extractBusinessName(websiteUrl),
        industry: 'services', // Could be passed from quiz if we add that question
      },
      {
        enableOpenAI: !!process.env.OPENAI_API_KEY, // Only if API key is set
        enablePageSpeed: true,
        enablePremium: false, // Keep premium analyzers off for now
        timeout: 75000 // 75 second timeout (PageSpeed needs ~60s)
      }
    )

    console.log('Analysis complete:', {
      seoScore: analysisResult.seoScore,
      aeoScore: analysisResult.aeoScore
    })

    // Use the real analyzed scores
    const actualSeoScore = analysisResult.seoScore
    const actualAeoScore = analysisResult.aeoScore

    // Calculate gaps
    const seoGap = Math.abs(quizSeoScore - actualSeoScore)
    const aeoGap = Math.abs(quizAeoScore - actualAeoScore)
    const totalGap = seoGap + aeoGap

    // Determine gap type
    let gapType = 'accurate'
    if (totalGap > 30) {
      gapType = quizSeoScore > actualSeoScore ? 'overconfident' : 'underconfident'
    }

    // Generate short report ID (8 characters)
    const reportId = nanoid(8)

    // Save to database
    const { data, error} = await supabaseAdmin
      .from('reports')
      .insert({
        report_id: reportId,
        website_url: websiteUrl,
        quiz_seo_score: quizSeoScore,
        quiz_aeo_score: quizAeoScore,
        actual_seo_score: actualSeoScore,
        actual_aeo_score: actualAeoScore,
        seo_gap: seoGap,
        aeo_gap: aeoGap,
        total_gap: totalGap,
        gap_type: gapType,
        profile_type: profileType,
        analysis_details: analysisResult.rawResults // Store detailed analysis data
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      )
    }

    // Return report ID for redirect
    return NextResponse.json({
      success: true,
      reportId: reportId,
      partialGapUrl: `/partial-gap/${reportId}`
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to extract business name from URL
function extractBusinessName(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace(/^www\./, '')
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return 'Business'
  }
}
