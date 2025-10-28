// Schema Validation Analyzer (FREE)
// Checks for structured data quality

import * as cheerio from 'cheerio'
import type { AEOAnalyzerResult, AnalysisInput } from './types'
import { generatePersonalizedSchema, type GeneratedSchema } from './schemaGenerator'

interface SchemaDetails {
  hasSchema: boolean
  schemaCount: number
  schemaTypes: string[]
  hasOrganization: boolean
  hasFAQ: boolean
  hasLocalBusiness: boolean
  hasArticle: boolean
  hasProduct: boolean
  hasReview: boolean
  completenessScore: number
  generatedSchemas?: GeneratedSchema
  [key: string]: unknown
}

export async function analyzeSchema(input: AnalysisInput): Promise<AEOAnalyzerResult> {
  try {
    const response = await fetch(input.websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AEO-Quiz-Bot/1.0; +https://aeo-quiz.com)'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract all JSON-LD schemas
    const schemas: Record<string, unknown>[] = []
    $('script[type="application/ld+json"]').each((i, elem) => {
      try {
        const content = $(elem).html()
        if (content) {
          const parsed = JSON.parse(content)
          // Handle both single objects and arrays
          if (Array.isArray(parsed)) {
            schemas.push(...parsed)
          } else {
            schemas.push(parsed)
          }
        }
      } catch (e) {
        // Invalid JSON, skip
      }
    })

    // Analyze schema types
    const schemaTypes = new Set<string>()
    schemas.forEach(schema => {
      if (schema['@type']) {
        const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]
        types.forEach((t: string) => schemaTypes.add(t))
      }
    })

    const details: SchemaDetails = {
      hasSchema: schemas.length > 0,
      schemaCount: schemas.length,
      schemaTypes: Array.from(schemaTypes),
      hasOrganization: schemaTypes.has('Organization'),
      hasFAQ: schemaTypes.has('FAQPage'),
      hasLocalBusiness: schemaTypes.has('LocalBusiness'),
      hasArticle: schemaTypes.has('Article') || schemaTypes.has('BlogPosting'),
      hasProduct: schemaTypes.has('Product'),
      hasReview: schemaTypes.has('Review') || schemas.some(s => s.aggregateRating),
      completenessScore: 0
    }

    // Calculate completeness score (check if schemas are complete)
    let completenessTotal = 0
    let completenessCount = 0
    schemas.forEach(schema => {
      const schemaType = schema['@type']
      if (typeof schemaType === 'string' || Array.isArray(schemaType)) {
        const requiredFields = getRequiredFields(schemaType)
        if (requiredFields.length > 0) {
          const filledFields = requiredFields.filter(field => schema[field])
          completenessTotal += (filledFields.length / requiredFields.length) * 100
          completenessCount++
        }
      }
    })
    details.completenessScore = completenessCount > 0
      ? Math.round(completenessTotal / completenessCount)
      : 0

    // Calculate final score
    const score = calculateSchemaScore(details)

    // Generate personalized schemas for missing types
    const generatedSchemas = await generatePersonalizedSchema(input, Array.from(schemaTypes))
    details.generatedSchemas = generatedSchemas

    return {
      type: 'aeo',
      score,
      details,
      enabled: true
    }
  } catch (error) {
    return {
      type: 'aeo',
      score: 0,
      details: { error: error instanceof Error ? error.message : 'Unknown error' },
      enabled: true,
      error: error instanceof Error ? error.message : 'Schema analysis failed'
    }
  }
}

function calculateSchemaScore(details: SchemaDetails): number {
  let score = 0

  // Has schema at all? +25 points
  if (details.hasSchema) score += 25

  // Organization schema (critical for AEO) +20 points
  if (details.hasOrganization) score += 20

  // FAQ schema (AIs love this) +20 points
  if (details.hasFAQ) score += 20

  // LocalBusiness schema +15 points
  if (details.hasLocalBusiness) score += 15

  // Article/Blog schema +10 points
  if (details.hasArticle) score += 10

  // Product schema +10 points
  if (details.hasProduct) score += 10

  // Review/Rating schema +10 points
  if (details.hasReview) score += 10

  // Multiple schema types (shows sophistication) +10 points
  if (details.schemaCount >= 3) score += 10

  // Completeness bonus (well-filled schemas) +15 points max
  score += (details.completenessScore / 100) * 15

  // Penalize if schema count is 0 but claim to have schema
  if (details.hasSchema && details.schemaCount === 0) score = 0

  return Math.min(Math.round(score), 100)
}

function getRequiredFields(schemaType: string | string[]): string[] {
  const type = Array.isArray(schemaType) ? schemaType[0] : schemaType

  const fieldMap: Record<string, string[]> = {
    'Organization': ['name', 'url', 'logo'],
    'LocalBusiness': ['name', 'address', 'telephone'],
    'FAQPage': ['mainEntity'],
    'Article': ['headline', 'author', 'datePublished'],
    'BlogPosting': ['headline', 'author', 'datePublished'],
    'Product': ['name', 'description', 'offers'],
    'Review': ['itemReviewed', 'reviewRating', 'author']
  }

  return fieldMap[type] || []
}
