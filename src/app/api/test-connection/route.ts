import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  }

  // 1. Check environment variables
  results.checks.envVars = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    GOOGLE_PAGESPEED_API_KEY: !!process.env.GOOGLE_PAGESPEED_API_KEY
  }

  // 2. Check if supabaseAdmin was created
  results.checks.supabaseAdmin = {
    exists: !!supabaseAdmin,
    type: typeof supabaseAdmin
  }

  // 3. Try to connect to Supabase
  try {
    const { data, error } = await supabaseAdmin
      .from('reports')
      .select('report_id')
      .limit(1)

    results.checks.supabaseConnection = {
      success: !error,
      error: error ? error.message : null,
      hasData: !!data
    }
  } catch (err) {
    results.checks.supabaseConnection = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      exception: true
    }
  }

  // 4. Test nanoid
  try {
    const { nanoid } = await import('nanoid')
    const testId = nanoid(8)
    results.checks.nanoid = {
      success: true,
      sampleId: testId
    }
  } catch (err) {
    results.checks.nanoid = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // 5. Test analyzer import
  try {
    const { analyzeWebsite } = await import('@/services/analyzers')
    results.checks.analyzers = {
      success: true,
      functionExists: typeof analyzeWebsite === 'function'
    }
  } catch (err) {
    results.checks.analyzers = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  // 6. Test security utilities
  try {
    const { createReportSchema, rateLimiter } = await import('@/lib/security')
    results.checks.security = {
      success: true,
      schemaExists: !!createReportSchema,
      rateLimiterExists: !!rateLimiter
    }
  } catch (err) {
    results.checks.security = {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    }
  }

  return NextResponse.json(results, { status: 200 })
}
