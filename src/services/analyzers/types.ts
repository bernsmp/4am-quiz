// Shared types for all analyzers

export interface AnalyzerResult {
  score: number // 0-100
  details: Record<string, unknown>
  enabled: boolean
  error?: string
}

export interface SEOAnalyzerResult extends AnalyzerResult {
  type: 'seo'
}

export interface AEOAnalyzerResult extends AnalyzerResult {
  type: 'aeo'
}

export interface AnalysisInput {
  websiteUrl: string
  businessName?: string
  industry?: string
  location?: string
}

export interface FinalScore {
  seoScore: number
  aeoScore: number
  breakdown: {
    seo: {
      pageSpeed?: number
      searchConsole?: number
      technicalSEO?: number
    }
    aeo: {
      schemaQuality?: number
      contentQuality?: number
      aiMentions?: number
    }
  }
  rawResults: {
    [key: string]: AnalyzerResult
  }
}
