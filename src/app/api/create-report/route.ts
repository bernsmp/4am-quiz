import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { nanoid } from 'nanoid'
import { analyzeWebsite } from '@/services/analyzers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      websiteUrl,
      quizSeoScore,
      quizAeoScore,
      profileType
    } = body

    // Validate required fields
    if (!websiteUrl || !quizSeoScore || !quizAeoScore || !profileType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        timeout: 45000 // 45 second timeout
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
