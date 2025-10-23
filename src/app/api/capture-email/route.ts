import { NextRequest, NextResponse } from 'next/server'
import { captureEmailSchema, rateLimiter, RATE_LIMITS, getClientIp } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimit = rateLimiter.check(
      `capture-email:${clientIp}`,
      RATE_LIMITS.captureEmail.limit,
      RATE_LIMITS.captureEmail.window
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
            'X-RateLimit-Limit': RATE_LIMITS.captureEmail.limit.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': resetDate.toISOString()
          }
        }
      )
    }

    const body = await request.json()

    // Validate input with Zod
    const validation = captureEmailSchema.safeParse(body)
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
      email,
      reportId,
      websiteUrl,
      seoGap,
      aeoGap,
      totalGap
    } = validation.data

    // Send to GoHighLevel webhook
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL

    if (ghlWebhookUrl) {
      try {
        const ghlResponse = await fetch(ghlWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            reportId,
            websiteUrl,
            seoGap,
            aeoGap,
            totalGap,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/dashboard/${reportId}`,
            timestamp: new Date().toISOString()
          })
        })

        if (!ghlResponse.ok) {
          console.error('GHL webhook failed:', await ghlResponse.text())
        } else {
          console.log('Successfully sent to GHL')
        }
      } catch (ghlError) {
        console.error('Error sending to GHL:', ghlError)
        // Don't fail the whole request if GHL webhook fails
      }
    } else {
      console.warn('GHL_WEBHOOK_URL not configured')
    }

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully'
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
