// Main Analyzer Orchestrator
// Runs all enabled analyzers and combines results

import type { AnalysisInput, FinalScore, AnalyzerResult } from './types'
import { analyzeSchema } from './schemaAnalyzer'
import { analyzeContent } from './contentAnalyzer'
import { analyzePageSpeed } from './pageSpeedAnalyzer'
import { analyzeWithOpenAI } from './openaiAnalyzer'
import {
  analyzeSearchConsole,
  analyzeAhrefs,
  analyzeSEMrush,
  analyzePerplexity,
  analyzeClaude,
  analyzeMoz
} from './futureAnalyzers'

export interface AnalysisOptions {
  enableOpenAI?: boolean
  enablePageSpeed?: boolean
  enablePremium?: boolean // Enable all premium analyzers that have API keys
  timeout?: number // Overall timeout in ms
}

/**
 * Run comprehensive SEO + AEO analysis
 * This is the main entry point for website analysis
 */
export async function analyzeWebsite(
  input: AnalysisInput,
  options: AnalysisOptions = {}
): Promise<FinalScore> {
  const {
    enableOpenAI = true,
    enablePageSpeed = true,
    enablePremium = false,
    timeout = 60000 // 60 second default timeout
  } = options

  // Store all analyzer results
  const results: { [key: string]: AnalyzerResult } = {}

  // Run all analyzers in parallel (but with timeout)
  const analysisPromise = Promise.all([
    // FREE AEO Analyzers (always run)
    analyzeSchema(input).then(r => { results.schema = r; return r }),
    analyzeContent(input).then(r => { results.content = r; return r }),

    // OpenAI AEO Analyzer (cheap, opt-in)
    enableOpenAI
      ? analyzeWithOpenAI(input).then(r => { results.openai = r; return r })
      : Promise.resolve(null),

    // FREE SEO Analyzers
    enablePageSpeed
      ? analyzePageSpeed(input).then(r => { results.pageSpeed = r; return r })
      : Promise.resolve(null),

    // Premium analyzers (only if enabled and API keys present)
    ...(enablePremium ? [
      analyzeSearchConsole(input).then(r => { results.searchConsole = r; return r }),
      analyzeAhrefs(input).then(r => { results.ahrefs = r; return r }),
      analyzeSEMrush(input).then(r => { results.semrush = r; return r }),
      analyzePerplexity(input).then(r => { results.perplexity = r; return r }),
      analyzeClaude(input).then(r => { results.claude = r; return r }),
      analyzeMoz(input).then(r => { results.moz = r; return r }),
    ] : [])
  ])

  // Apply timeout
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Analysis timeout')), timeout)
  )

  try {
    await Promise.race([analysisPromise, timeoutPromise])
  } catch (error) {
    console.error('Analysis error or timeout:', error)
    // Continue with whatever results we have
  }

  // Calculate final scores
  const finalScore = calculateFinalScores(results)

  return finalScore
}

/**
 * Calculate weighted final SEO and AEO scores
 */
function calculateFinalScores(results: { [key: string]: AnalyzerResult }): FinalScore {
  const seoResults: AnalyzerResult[] = []
  const aeoResults: AnalyzerResult[] = []

  // Separate SEO and AEO results
  Object.values(results).forEach(result => {
    if (!result || !result.enabled) return

    // Type narrowing with type guard
    if ('type' in result) {
      if (result.type === 'seo') {
        seoResults.push(result)
      } else if (result.type === 'aeo') {
        aeoResults.push(result)
      }
    }
  })

  // Calculate SEO score with weighted average
  const seoScore = calculateWeightedScore(seoResults, {
    pageSpeed: 0.60,      // PageSpeed is critical for SEO
    searchConsole: 0.25,  // Real ranking data (when available)
    ahrefs: 0.10,         // Backlink profile
    semrush: 0.05,        // Additional SEO metrics
    moz: 0.05             // Domain authority
  })

  // Calculate AEO score with weighted average
  const aeoScore = calculateWeightedScore(aeoResults, {
    schema: 0.30,         // Schema markup is foundational
    content: 0.25,        // Content quality matters
    openai: 0.25,         // ChatGPT mentions (real AEO test!)
    perplexity: 0.10,     // AI search visibility
    claude: 0.10          // Additional AI testing
  })

  // Build detailed breakdown
  const breakdown = {
    seo: {
      pageSpeed: results.pageSpeed?.score,
      searchConsole: results.searchConsole?.score,
      technicalSEO: results.pageSpeed?.score, // Alias for clarity
      ahrefs: results.ahrefs?.score,
      semrush: results.semrush?.score,
      moz: results.moz?.score
    },
    aeo: {
      schemaQuality: results.schema?.score,
      contentQuality: results.content?.score,
      aiMentions: results.openai?.score,
      perplexity: results.perplexity?.score,
      claude: results.claude?.score
    }
  }

  return {
    seoScore: Math.round(seoScore),
    aeoScore: Math.round(aeoScore),
    breakdown,
    rawResults: results
  }
}

/**
 * Calculate weighted score from multiple analyzers
 */
function calculateWeightedScore(
  results: AnalyzerResult[],
  weights: { [key: string]: number }
): number {
  if (results.length === 0) return 0

  let totalScore = 0
  let totalWeight = 0

  results.forEach(result => {
    // Find the weight for this analyzer (match by key name in results)
    const analyzerName = Object.keys(weights).find(key =>
      result.details && typeof result.details === 'object'
    )

    // Use default equal weighting if specific weight not found
    const weight = analyzerName && weights[analyzerName] ? weights[analyzerName] : (1 / results.length)

    if (result.score !== undefined && !result.error) {
      totalScore += result.score * weight
      totalWeight += weight
    }
  })

  return totalWeight > 0 ? totalScore / totalWeight : 0
}

/**
 * Helper to run just the free analyzers (for testing/demo)
 */
export async function analyzeFreeOnly(input: AnalysisInput): Promise<FinalScore> {
  return analyzeWebsite(input, {
    enableOpenAI: false,    // Skip OpenAI to avoid costs during testing
    enablePageSpeed: true,
    enablePremium: false
  })
}

/**
 * Helper to run everything that has API keys configured
 */
export async function analyzeComplete(input: AnalysisInput): Promise<FinalScore> {
  return analyzeWebsite(input, {
    enableOpenAI: true,
    enablePageSpeed: true,
    enablePremium: true
  })
}

// Re-export types for convenience
export type { AnalysisInput, FinalScore, AnalyzerResult } from './types'
