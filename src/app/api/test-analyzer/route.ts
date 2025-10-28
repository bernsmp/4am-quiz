import { NextRequest, NextResponse } from 'next/server'
import { analyzeWebsite } from '@/services/analyzers'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    console.log('🧪 Test Analyzer: Starting analysis for', url)

    const result = await analyzeWebsite(
      {
        websiteUrl: url,
        businessName: extractBusinessName(url),
        industry: 'services'
      },
      {
        enableOpenAI: false, // Skip OpenAI to keep test fast
        enablePageSpeed: true,
        enablePremium: false,
        timeout: 75000
      }
    )

    console.log('✅ Test Analyzer: Complete')

    return NextResponse.json(result.rawResults)
  } catch (error) {
    console.error('❌ Test Analyzer: Error', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

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
