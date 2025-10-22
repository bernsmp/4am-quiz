import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { nanoid } from 'nanoid'

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

    // Generate mock "actual" scores (30-70 range, different from quiz)
    const actualSeoScore = Math.floor(Math.random() * 41) + 30 // 30-70
    const actualAeoScore = Math.floor(Math.random() * 41) + 30 // 30-70

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
    const { data, error } = await supabaseAdmin
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
        profile_type: profileType
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
