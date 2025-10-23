// Content Quality Analyzer (FREE)
// Checks for AEO-friendly content patterns

import * as cheerio from 'cheerio'
import type { AEOAnalyzerResult, AnalysisInput } from './types'
import { validatePublicUrl } from '@/lib/security'

interface ContentDetails {
  hasFAQSection: boolean
  faqCount: number
  hasHeadings: boolean
  headingStructure: string[]
  hasAuthorInfo: boolean
  hasClearAnswers: boolean
  wordCount: number
  hasContactInfo: boolean
  readabilityScore: number
  structureScore: number
  [key: string]: unknown
}

export async function analyzeContent(input: AnalysisInput): Promise<AEOAnalyzerResult> {
  try {
    // SSRF Protection - validate URL before fetching
    const urlValidation = validatePublicUrl(input.websiteUrl)
    if (!urlValidation.valid) {
      return {
        type: 'aeo',
        score: 0,
        details: { error: urlValidation.error || 'Invalid URL' },
        enabled: true,
        error: urlValidation.error || 'Invalid URL'
      }
    }

    const response = await fetch(input.websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AEO-Quiz-Bot/1.0)'
      },
      signal: AbortSignal.timeout(10000),
      redirect: 'follow',
      // Security: limit redirect following
      follow: 5
    } as RequestInit)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove script, style, and other non-content elements
    $('script, style, nav, footer, header').remove()

    const details: ContentDetails = {
      hasFAQSection: false,
      faqCount: 0,
      hasHeadings: false,
      headingStructure: [],
      hasAuthorInfo: false,
      hasClearAnswers: false,
      wordCount: 0,
      hasContactInfo: false,
      readabilityScore: 0,
      structureScore: 0
    }

    // Check for FAQ section
    const bodyText = $('body').text().toLowerCase()
    const faqKeywords = ['faq', 'frequently asked questions', 'common questions', 'questions and answers']
    details.hasFAQSection = faqKeywords.some(keyword => bodyText.includes(keyword))

    // Count FAQ-like elements
    const faqElements = $('h2, h3, h4, dt, .faq-question, [class*="faq"], [id*="faq"]')
    details.faqCount = faqElements.length

    // Analyze heading structure
    const headings = $('h1, h2, h3, h4, h5, h6')
    details.hasHeadings = headings.length > 0
    details.headingStructure = headings.map((i, el) => $(el).prop('tagName')).get()

    // Check for author information (E-A-T signal)
    const authorKeywords = ['author', 'written by', 'by ', 'about the author']
    details.hasAuthorInfo = authorKeywords.some(keyword => bodyText.includes(keyword))

    // Also check for author meta tags or schema
    if ($('meta[name="author"]').length > 0 || $('[rel="author"]').length > 0) {
      details.hasAuthorInfo = true
    }

    // Check for clear, direct answers (short paragraphs following questions)
    const paragraphs = $('p')
    let shortAnswerCount = 0
    paragraphs.each((i, el) => {
      const text = $(el).text().trim()
      if (text.length > 20 && text.length < 300) {
        shortAnswerCount++
      }
    })
    details.hasClearAnswers = shortAnswerCount >= 3

    // Word count
    const mainContent = $('main, article, .content, [role="main"]').text() || $('body').text()
    const words = mainContent.trim().split(/\s+/).filter(w => w.length > 0)
    details.wordCount = words.length

    // Check for contact information
    const contactKeywords = ['contact', 'email', 'phone', 'address', 'reach us']
    details.hasContactInfo = contactKeywords.some(keyword => bodyText.includes(keyword)) ||
      $('a[href^="mailto:"]').length > 0 ||
      $('a[href^="tel:"]').length > 0

    // Calculate readability score (simplified Flesch-Kincaid)
    details.readabilityScore = calculateReadability(mainContent)

    // Calculate structure score
    details.structureScore = calculateStructureScore(details)

    // Calculate final content quality score
    const score = calculateContentScore(details)

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
      error: error instanceof Error ? error.message : 'Content analysis failed'
    }
  }
}

function calculateContentScore(details: ContentDetails): number {
  let score = 0

  // Has FAQ section or FAQ-like content? +25 points
  if (details.hasFAQSection) score += 25
  else if (details.faqCount >= 5) score += 15

  // Good heading structure? +20 points
  if (details.hasHeadings) {
    const hasH1 = details.headingStructure.includes('H1')
    const hasH2 = details.headingStructure.includes('H2')
    const headingCount = details.headingStructure.length

    if (hasH1 && hasH2 && headingCount >= 5) score += 20
    else if (hasH1 && hasH2) score += 15
    else if (headingCount >= 3) score += 10
  }

  // Has author info (E-A-T)? +15 points
  if (details.hasAuthorInfo) score += 15

  // Has clear, concise answers? +15 points
  if (details.hasClearAnswers) score += 15

  // Sufficient content length? +10 points
  if (details.wordCount >= 500) score += 10
  else if (details.wordCount >= 300) score += 5

  // Has contact info? +10 points
  if (details.hasContactInfo) score += 10

  // Good readability? +10 points
  if (details.readabilityScore >= 70) score += 10
  else if (details.readabilityScore >= 50) score += 5

  // Good structure? +10 points
  if (details.structureScore >= 80) score += 10
  else if (details.structureScore >= 60) score += 5

  return Math.min(Math.round(score), 100)
}

function calculateStructureScore(details: ContentDetails): number {
  let score = 0

  // Proper heading hierarchy
  const h1Count = details.headingStructure.filter(h => h === 'H1').length
  if (h1Count === 1) score += 30 // Exactly one H1 is ideal
  else if (h1Count > 0) score += 15

  // Has multiple heading levels
  const uniqueLevels = new Set(details.headingStructure).size
  if (uniqueLevels >= 3) score += 30
  else if (uniqueLevels >= 2) score += 20

  // Total headings
  const totalHeadings = details.headingStructure.length
  if (totalHeadings >= 10) score += 20
  else if (totalHeadings >= 5) score += 15
  else if (totalHeadings >= 3) score += 10

  // Content organization indicators
  if (details.hasFAQSection) score += 20

  return Math.min(score, 100)
}

function calculateReadability(text: string): number {
  // Simplified readability calculation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const syllables = words.reduce((count, word) => count + estimateSyllables(word), 0)

  if (sentences.length === 0 || words.length === 0) return 0

  const avgWordsPerSentence = words.length / sentences.length
  const avgSyllablesPerWord = syllables / words.length

  // Flesch Reading Ease formula (simplified)
  // Higher score = easier to read
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)

  // Normalize to 0-100
  return Math.max(0, Math.min(100, Math.round(score)))
}

function estimateSyllables(word: string): number {
  // Simple syllable estimation
  word = word.toLowerCase().replace(/[^a-z]/g, '')
  if (word.length <= 3) return 1

  const vowels = 'aeiouy'
  let count = 0
  let previousWasVowel = false

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i])
    if (isVowel && !previousWasVowel) {
      count++
    }
    previousWasVowel = isVowel
  }

  // Adjust for silent e
  if (word.endsWith('e')) count--

  return Math.max(1, count)
}
