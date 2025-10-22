import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      email,
      reportId,
      websiteUrl,
      seoGap,
      aeoGap,
      totalGap
    } = body

    // Validate required fields
    if (!email || !reportId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

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
