// OpenAI AEO Tester - Tests if ChatGPT mentions the business
// Cost: ~$0.0015-0.03 per test depending on model

import OpenAI from 'openai'
import type { AEOAnalyzerResult, AnalysisInput } from './types'

interface OpenAIDetails {
  tested: boolean
  mentionedInGeneral: boolean
  mentionedInLocal: boolean
  mentionedInComparison: boolean
  positiveContext: boolean
  queries: {
    query: string
    mentioned: boolean
    snippet?: string
  }[]
  totalMentions: number
  [key: string]: unknown
}

export async function analyzeWithOpenAI(input: AnalysisInput): Promise<AEOAnalyzerResult> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      type: 'aeo',
      score: 0,
      details: {
        error: 'OPENAI_API_KEY not configured',
        note: 'Add your OpenAI API key to .env.local to enable AI mention testing'
      },
      enabled: false
    }
  }

  try {
    const openai = new OpenAI({ apiKey })

    const businessName = input.businessName || extractBusinessName(input.websiteUrl)
    const industry = input.industry || 'services'
    const location = input.location || ''

    // Generate test queries
    const queries = generateTestQueries(businessName, industry, location)

    const results: OpenAIDetails = {
      tested: true,
      mentionedInGeneral: false,
      mentionedInLocal: false,
      mentionedInComparison: false,
      positiveContext: false,
      queries: [],
      totalMentions: 0
    }

    // Test each query
    for (const query of queries) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo', // Cheapest model, good enough for testing
          messages: [
            {
              role: 'user',
              content: query.text
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })

        const response = completion.choices[0]?.message?.content || ''

        // Check if business name is mentioned
        const mentioned = response.toLowerCase().includes(businessName.toLowerCase())

        if (mentioned) {
          results.totalMentions++

          // Extract snippet where business is mentioned
          const snippet = extractMentionSnippet(response, businessName)

          // Determine context
          if (query.type === 'general') results.mentionedInGeneral = true
          if (query.type === 'local') results.mentionedInLocal = true
          if (query.type === 'comparison') results.mentionedInComparison = true

          // Check if context is positive
          if (isPositiveContext(snippet)) {
            results.positiveContext = true
          }

          results.queries.push({
            query: query.text,
            mentioned: true,
            snippet
          })
        } else {
          results.queries.push({
            query: query.text,
            mentioned: false
          })
        }
      } catch (queryError) {
        // If one query fails, continue with others
        results.queries.push({
          query: query.text,
          mentioned: false,
          snippet: `Error: ${queryError instanceof Error ? queryError.message : 'Unknown'}`
        })
      }
    }

    // Calculate score based on results
    const score = calculateOpenAIScore(results)

    return {
      type: 'aeo',
      score,
      details: results,
      enabled: true
    }
  } catch (error) {
    return {
      type: 'aeo',
      score: 0,
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        tested: false
      },
      enabled: true,
      error: error instanceof Error ? error.message : 'OpenAI analysis failed'
    }
  }
}

function generateTestQueries(businessName: string, industry: string, location: string): Array<{ text: string; type: string }> {
  const queries = []

  // General industry query
  queries.push({
    text: `What are the top companies for ${industry}? List 5 recommendations.`,
    type: 'general'
  })

  // Local query (if location provided)
  if (location) {
    queries.push({
      text: `What are the best ${industry} companies in ${location}? Give me 5 options.`,
      type: 'local'
    })
  }

  // Comparison query
  queries.push({
    text: `Compare the leading ${industry} providers. Who would you recommend?`,
    type: 'comparison'
  })

  // Specific service query
  queries.push({
    text: `I need help with ${industry}. Which company should I choose?`,
    type: 'general'
  })

  return queries
}

function extractMentionSnippet(text: string, businessName: string, contextLength: number = 100): string {
  const lowerText = text.toLowerCase()
  const lowerName = businessName.toLowerCase()
  const index = lowerText.indexOf(lowerName)

  if (index === -1) return ''

  const start = Math.max(0, index - contextLength)
  const end = Math.min(text.length, index + businessName.length + contextLength)

  let snippet = text.substring(start, end).trim()

  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet
  if (end < text.length) snippet = snippet + '...'

  return snippet
}

function isPositiveContext(snippet: string): boolean {
  const positiveWords = [
    'recommend', 'best', 'top', 'leading', 'excellent', 'great',
    'trusted', 'reliable', 'professional', 'quality', 'expert'
  ]

  const negativeWords = [
    'avoid', 'poor', 'bad', 'worst', 'unreliable', 'unprofessional'
  ]

  const lower = snippet.toLowerCase()

  const positiveCount = positiveWords.filter(word => lower.includes(word)).length
  const negativeCount = negativeWords.filter(word => lower.includes(word)).length

  return positiveCount > negativeCount
}

function calculateOpenAIScore(details: OpenAIDetails): number {
  let score = 0

  // Base score for being tested at all
  if (details.tested) score += 10

  // Mentioned in general queries? +30 points
  if (details.mentionedInGeneral) score += 30

  // Mentioned in local queries? +25 points
  if (details.mentionedInLocal) score += 25

  // Mentioned in comparison queries? +20 points
  if (details.mentionedInComparison) score += 20

  // Positive context? +15 points
  if (details.positiveContext) score += 15

  // Bonus for multiple mentions
  if (details.totalMentions >= 3) score += 20
  else if (details.totalMentions >= 2) score += 10
  else if (details.totalMentions >= 1) score += 5

  return Math.min(Math.round(score), 100)
}

function extractBusinessName(url: string): string {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace(/^www\./, '')
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return 'the business'
  }
}
