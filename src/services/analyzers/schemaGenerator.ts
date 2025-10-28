// Schema Generator - Creates personalized schema markup for websites
// Generates Organization, LocalBusiness, FAQPage, and other schema types

import * as cheerio from 'cheerio'
import type { AnalysisInput } from './types'

export interface GeneratedSchema {
  organization?: Record<string, unknown>
  localBusiness?: Record<string, unknown>
  faqPage?: Record<string, unknown>
  breadcrumbList?: Record<string, unknown>
  recommendations: string[]
  implementationCode: string
}

export async function generatePersonalizedSchema(
  input: AnalysisInput,
  existingSchemas: string[] = []
): Promise<GeneratedSchema> {
  try {
    // Fetch the website to extract information
    const response = await fetch(input.websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AEO-Quiz-Bot/1.0; +https://aeo-quiz.com)'
      },
      signal: AbortSignal.timeout(10000)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract information from the website
    const pageTitle = $('title').text().trim()
    const metaDescription = $('meta[name="description"]').attr('content') || ''
    const h1Tags = $('h1').map((i, el) => $(el).text().trim()).get()
    const h2Tags = $('h2').map((i, el) => $(el).text().trim()).get()

    // Extract contact information
    const emails = extractEmails(html)
    const phones = extractPhones(html)
    const addresses = extractAddresses($)

    // Parse URL for business name
    const urlObj = new URL(input.websiteUrl)
    const domain = urlObj.hostname.replace(/^www\./, '')
    const businessName = input.businessName || capitalizeWords(domain.split('.')[0])

    const result: GeneratedSchema = {
      recommendations: [],
      implementationCode: ''
    }

    // Generate Organization Schema (if not exists)
    if (!existingSchemas.includes('Organization')) {
      result.organization = generateOrganizationSchema({
        name: businessName,
        url: input.websiteUrl,
        description: metaDescription || pageTitle,
        email: emails[0],
        telephone: phones[0]
      })
      result.recommendations.push('Add Organization schema to establish your brand identity for AI engines')
    }

    // Generate LocalBusiness Schema (if business appears local)
    if (!existingSchemas.includes('LocalBusiness') && (phones.length > 0 || addresses.length > 0)) {
      result.localBusiness = generateLocalBusinessSchema({
        name: businessName,
        url: input.websiteUrl,
        description: metaDescription || pageTitle,
        telephone: phones[0],
        address: addresses[0],
        email: emails[0]
      })
      result.recommendations.push('Add LocalBusiness schema to improve local search visibility')
    }

    // Generate FAQ Schema (if H2s look like questions)
    const potentialQuestions = h2Tags.filter(h2 =>
      h2.includes('?') ||
      h2.toLowerCase().startsWith('what') ||
      h2.toLowerCase().startsWith('how') ||
      h2.toLowerCase().startsWith('why') ||
      h2.toLowerCase().startsWith('when') ||
      h2.toLowerCase().startsWith('where')
    )

    if (!existingSchemas.includes('FAQPage') && potentialQuestions.length >= 2) {
      result.faqPage = generateFAQSchema(potentialQuestions, $)
      result.recommendations.push('Add FAQ schema - AI engines love direct question-answer formats')
    }

    // Generate Breadcrumb Schema
    if (!existingSchemas.includes('BreadcrumbList')) {
      result.breadcrumbList = generateBreadcrumbSchema(input.websiteUrl)
      result.recommendations.push('Add Breadcrumb schema to help AI understand your site structure')
    }

    // Generate implementation code
    result.implementationCode = generateImplementationCode(result)

    return result

  } catch (error) {
    console.error('Schema generation error:', error)
    return {
      recommendations: ['Unable to generate schema automatically. Manual implementation recommended.'],
      implementationCode: ''
    }
  }
}

function generateOrganizationSchema(data: {
  name: string
  url: string
  description: string
  email?: string
  telephone?: string
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    description: data.description
  }

  if (data.email) {
    schema.email = data.email
  }

  if (data.telephone) {
    schema.telephone = data.telephone
  }

  // Add logo placeholder
  const logoUrl = `${data.url}/logo.png`
  schema.logo = {
    '@type': 'ImageObject',
    url: logoUrl
  }

  // Add social media placeholders
  schema.sameAs = [
    // User should customize these
    `https://www.linkedin.com/company/${data.name.toLowerCase().replace(/\s+/g, '-')}`,
    `https://twitter.com/${data.name.toLowerCase().replace(/\s+/g, '')}`,
    `https://www.facebook.com/${data.name.toLowerCase().replace(/\s+/g, '')}`
  ]

  return schema
}

function generateLocalBusinessSchema(data: {
  name: string
  url: string
  description: string
  telephone?: string
  address?: string
  email?: string
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: data.name,
    url: data.url,
    description: data.description
  }

  if (data.telephone) {
    schema.telephone = data.telephone
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address,
      // User should add: addressLocality, addressRegion, postalCode, addressCountry
    }
  }

  if (data.email) {
    schema.email = data.email
  }

  // Add opening hours placeholder
  schema.openingHours = 'Mo-Fr 09:00-17:00'

  return schema
}

function generateFAQSchema(questions: string[], $: cheerio.CheerioAPI): Record<string, unknown> {
  const mainEntity: Record<string, unknown>[] = []

  questions.slice(0, 5).forEach(question => {
    // Try to find the answer (next paragraph or sibling)
    const questionElement = $(`h2:contains("${question}")`).first()
    let answer = questionElement.next('p').text().trim()

    if (!answer) {
      answer = questionElement.parent().find('p').first().text().trim()
    }

    if (!answer) {
      answer = 'Please update this answer with your actual content.'
    }

    mainEntity.push({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer.substring(0, 500) // Limit length
      }
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  }
}

function generateBreadcrumbSchema(url: string): Record<string, unknown> {
  const urlObj = new URL(url)
  const pathParts = urlObj.pathname.split('/').filter(Boolean)

  const itemListElement: Record<string, unknown>[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${urlObj.protocol}//${urlObj.host}`
    }
  ]

  pathParts.forEach((part, index) => {
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: capitalizeWords(part.replace(/-/g, ' ')),
      item: `${urlObj.protocol}//${urlObj.host}/${pathParts.slice(0, index + 1).join('/')}`
    })
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement
  }
}

function generateImplementationCode(schemas: GeneratedSchema): string {
  const schemaObjects: Record<string, unknown>[] = []

  if (schemas.organization) schemaObjects.push(schemas.organization)
  if (schemas.localBusiness) schemaObjects.push(schemas.localBusiness)
  if (schemas.faqPage) schemaObjects.push(schemas.faqPage)
  if (schemas.breadcrumbList) schemaObjects.push(schemas.breadcrumbList)

  if (schemaObjects.length === 0) return ''

  const code = `<!-- Add this script tag to the <head> section of your website -->
<script type="application/ld+json">
${JSON.stringify(schemaObjects, null, 2)}
</script>

<!--
IMPORTANT: Customize the following before publishing:
1. Replace placeholder social media URLs with your actual profiles
2. Update logo URL with your actual logo path
3. Fill in complete address details for LocalBusiness
4. Verify all phone numbers and email addresses
5. Update FAQ answers with your actual content
6. Add opening hours for LocalBusiness if applicable

Need help? Book a strategy session: https://sociallysquare.com
-->`

  return code
}

// Helper functions
function extractEmails(html: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = html.match(emailRegex) || []
  // Filter out common non-business emails
  return matches.filter(email =>
    !email.includes('example.com') &&
    !email.includes('sentry') &&
    !email.includes('google') &&
    !email.includes('facebook')
  ).slice(0, 1) // Return first valid email
}

function extractPhones(html: string): string[] {
  const phoneRegex = /(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/g
  const matches = html.match(phoneRegex) || []
  return [...new Set(matches)].slice(0, 1) // Return first unique phone
}

function extractAddresses($: cheerio.CheerioAPI): string[] {
  const addresses: string[] = []

  // Look for common address patterns in the HTML
  $('[itemtype*="PostalAddress"], .address, #address').each((i, el) => {
    const text = $(el).text().trim()
    if (text.length > 10 && text.length < 200) {
      addresses.push(text)
    }
  })

  return addresses.slice(0, 1)
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}
