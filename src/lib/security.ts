// Security utilities for API routes
import { z } from 'zod'

// =============================================================================
// INPUT VALIDATION SCHEMAS
// =============================================================================

export const createReportSchema = z.object({
  websiteUrl: z.string().url('Invalid URL format'),
  quizSeoScore: z.number().min(0).max(100),
  quizAeoScore: z.number().min(0).max(100),
  profileType: z.enum(['Google Winner', 'AI Darling', 'Balanced Operator', 'Invisible Expert'])
})

export const captureEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  reportId: z.string().min(8).max(20),
  websiteUrl: z.string().url().optional(),
  seoGap: z.number().min(0).optional(),
  aeoGap: z.number().min(0).optional(),
  totalGap: z.number().min(0).optional()
})

// =============================================================================
// SSRF PROTECTION - Block private IPs and localhost
// =============================================================================

const PRIVATE_IP_RANGES = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,           // 127.0.0.0/8
  /^10\.\d+\.\d+\.\d+$/,             // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+$/, // 172.16.0.0/12
  /^192\.168\.\d+\.\d+$/,            // 192.168.0.0/16
  /^169\.254\.\d+\.\d+$/,            // 169.254.0.0/16 (link-local)
  /^0\.0\.0\.0$/,
  /^\[?::1\]?$/,                     // IPv6 localhost
  /^\[?fe80:/i,                      // IPv6 link-local
  /^\[?fc00:/i,                      // IPv6 unique local
  /^\[?fd00:/i,                      // IPv6 unique local
]

export function isPrivateOrLocalUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString)

    // Only allow http and https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return true
    }

    const hostname = url.hostname.toLowerCase()

    // Check against known private IP ranges
    for (const pattern of PRIVATE_IP_RANGES) {
      if (pattern.test(hostname)) {
        return true
      }
    }

    return false
  } catch {
    return true // Invalid URL, treat as unsafe
  }
}

export function validatePublicUrl(urlString: string): { valid: boolean; error?: string } {
  // Check URL format
  try {
    new URL(urlString)
  } catch {
    return { valid: false, error: 'Invalid URL format' }
  }

  // Check for SSRF
  if (isPrivateOrLocalUrl(urlString)) {
    return { valid: false, error: 'Private or local URLs are not allowed' }
  }

  return { valid: true }
}

// =============================================================================
// RATE LIMITING - Simple in-memory implementation
// =============================================================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

class SimpleRateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, entry] of this.store.entries()) {
        if (entry.resetTime < now) {
          this.store.delete(key)
        }
      }
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request should be rate limited
   * @param identifier - Usually IP address
   * @param limit - Max requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns { success: boolean, remaining: number, reset: number }
   */
  check(identifier: string, limit: number, windowMs: number) {
    const now = Date.now()
    const entry = this.store.get(identifier)

    // No previous entry or window expired
    if (!entry || entry.resetTime < now) {
      this.store.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      })
      return {
        success: true,
        remaining: limit - 1,
        reset: now + windowMs
      }
    }

    // Within window
    if (entry.count < limit) {
      entry.count++
      return {
        success: true,
        remaining: limit - entry.count,
        reset: entry.resetTime
      }
    }

    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime
    }
  }

  cleanup() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

// Create singleton instance
export const rateLimiter = new SimpleRateLimiter()

// Rate limit configurations
export const RATE_LIMITS = {
  createReport: {
    limit: 5,          // 5 requests
    window: 60 * 60 * 1000  // per hour
  },
  captureEmail: {
    limit: 10,         // 10 requests
    window: 60 * 60 * 1000  // per hour
  }
}

// Helper to get client IP from request
export function getClientIp(request: Request): string {
  // Check common headers for real IP (when behind proxy/CDN)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback (not ideal but works for development)
  return 'unknown'
}
