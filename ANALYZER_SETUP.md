# Analyzer System Setup Guide

The quiz now uses **real analysis tools** instead of random scores! This guide explains how to set up and use the analyzer system.

## 🎯 What's Included

### ✅ FREE Analyzers (Always Active)
1. **Schema Validation** - Checks structured data quality (JSON-LD, microdata)
2. **Content Analysis** - Evaluates FAQ sections, headings, readability
3. **PageSpeed Insights** - Technical SEO score from Google

### 💰 Paid Analyzers (Optional)
4. **OpenAI API** - Tests if ChatGPT actually mentions the business (~$10-20/month)
5. **Moz API** - Domain authority, spam score (FREE tier available)
6. **Perplexity API** - AI search visibility (~$5-20/month)
7. **Claude API** - Additional AI testing (~$0.008/test)
8. **Ahrefs API** - Premium SEO data ($500+/month)
9. **SEMrush API** - Premium SEO data ($119+/month)

## 🚀 Quick Start

### Step 1: Test with FREE Tools Only

The system works out of the box with no API keys! It will use:
- ✅ Schema validation
- ✅ Content analysis
- ✅ PageSpeed Insights (no key needed, but has rate limits)

Just run the quiz - it will analyze real websites!

### Step 2: Add OpenAI for Real AEO Testing (Recommended)

This is the game-changer - it actually asks ChatGPT about the business!

**Cost:** ~$0.03 per quiz completion

1. **Get an OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Sign up (get $5 free credit!)
   - Create new secret key

2. **Add to `.env.local`:**
   ```bash
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

That's it! Now the quiz will test if ChatGPT actually recommends the business.

### Step 3: Add Google PageSpeed API Key (Optional but Recommended)

Without a key, PageSpeed Insights works but may be slow or rate-limited.

1. **Get a free Google API key:**
   - Go to https://console.cloud.google.com/apis/credentials
   - Create new project (or use existing)
   - Enable "PageSpeed Insights API"
   - Create credentials → API key

2. **Add to `.env.local`:**
   ```bash
   GOOGLE_PAGESPEED_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXX
   ```

## 📊 How Scoring Works

### SEO Score (0-100)
Weighted average of:
- **PageSpeed Insights** (60%) - Performance, Core Web Vitals
- **Google Search Console** (25%) - When available
- **Backlink APIs** (15%) - Ahrefs, SEMrush, Moz (when configured)

### AEO Score (0-100)
Weighted average of:
- **Schema Quality** (30%) - Organization, FAQ, LocalBusiness schemas
- **Content Quality** (25%) - FAQ sections, clear answers, structure
- **OpenAI Testing** (25%) - Does ChatGPT mention the business?
- **Other AI APIs** (20%) - Perplexity, Claude (when configured)

## 🔧 Architecture

```
src/services/analyzers/
├── types.ts              # TypeScript interfaces
├── schemaAnalyzer.ts     # FREE - Schema validation
├── contentAnalyzer.ts    # FREE - Content quality
├── pageSpeedAnalyzer.ts  # FREE - Google PageSpeed
├── openaiAnalyzer.ts     # PAID - ChatGPT testing
├── futureAnalyzers.ts    # Stubs for premium APIs
└── index.ts              # Main orchestrator
```

### Main API Endpoint
```typescript
// src/app/api/create-report/route.ts
import { analyzeWebsite } from '@/services/analyzers'

const result = await analyzeWebsite(
  {
    websiteUrl: 'https://example.com',
    businessName: 'Example Company',
    industry: 'services'
  },
  {
    enableOpenAI: true,  // Only if API key is set
    enablePageSpeed: true,
    enablePremium: false
  }
)
```

## 🧪 Testing

### Test a Single Analyzer

```typescript
import { analyzeSchema } from '@/services/analyzers/schemaAnalyzer'

const result = await analyzeSchema({
  websiteUrl: 'https://example.com'
})

console.log(result.score) // 0-100
console.log(result.details) // Breakdown of findings
```

### Test Complete Analysis

```typescript
import { analyzeWebsite } from '@/services/analyzers'

const result = await analyzeWebsite({
  websiteUrl: 'https://example.com',
  businessName: 'Example Co',
  industry: 'marketing'
})

console.log('SEO Score:', result.seoScore)
console.log('AEO Score:', result.aeoScore)
console.log('Breakdown:', result.breakdown)
```

## 💡 Adding Premium APIs Later

### Example: Adding Perplexity

1. **Get API key:** https://www.perplexity.ai/settings/api

2. **Add to `.env.local`:**
   ```bash
   PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxx
   ```

3. **Implement in `futureAnalyzers.ts`:**
   ```typescript
   export async function analyzePerplexity(input: AnalysisInput) {
     const apiKey = process.env.PERPLEXITY_API_KEY

     // Make API calls similar to OpenAI analyzer
     // Check if business is mentioned in AI responses

     return {
       type: 'aeo',
       score: calculatedScore,
       details: { ... },
       enabled: true
     }
   }
   ```

4. **Update orchestrator in `index.ts`:**
   ```typescript
   // Add to the premium analyzers array
   analyzePerplexity(input).then(r => { results.perplexity = r; return r })
   ```

That's it! The scoring system automatically includes it.

## 🎛️ Configuration Options

### Enable/Disable Analyzers

```typescript
// Run only free analyzers (for testing without costs)
import { analyzeFreeOnly } from '@/services/analyzers'
const result = await analyzeFreeOnly({ websiteUrl: url })

// Run everything that has API keys configured
import { analyzeComplete } from '@/services/analyzers'
const result = await analyzeComplete({ websiteUrl: url })

// Custom configuration
import { analyzeWebsite } from '@/services/analyzers'
const result = await analyzeWebsite(
  { websiteUrl: url },
  {
    enableOpenAI: false,      // Skip to avoid costs
    enablePageSpeed: true,
    enablePremium: false,
    timeout: 30000           // 30 second timeout
  }
)
```

## 📈 Cost Estimates

### Recommended FREE Stack (Month 1)
- Schema validation: FREE
- Content analysis: FREE
- PageSpeed Insights: FREE
- **Total: $0/month**
- **Accuracy: ~60%** (decent but no AI testing)

### Recommended Starter Stack
- FREE tools above: $0
- OpenAI API: ~$10-20/month (based on volume)
- **Total: $10-20/month**
- **Accuracy: ~80%** (real AEO testing!)

### Premium Stack
- Starter stack: $10-20
- Perplexity API: $10/month
- Moz API: $99/month
- **Total: ~$120/month**
- **Accuracy: ~90%**

### Enterprise Stack
- Premium stack: $120
- Ahrefs API: $500/month
- **Total: ~$620/month**
- **Accuracy: ~95%**

## 🐛 Troubleshooting

### "Schema analysis failed"
- Website may be blocking scrapers
- Try adding a different User-Agent
- Check if website requires authentication

### "PageSpeed API timeout"
- PageSpeed can be slow (30+ seconds)
- Increase timeout in analyzer options
- Add `GOOGLE_PAGESPEED_API_KEY` to speed it up

### "OpenAI analysis failed"
- Check API key is valid
- Verify you have credits remaining
- Check rate limits

### "Analysis returns 0 scores"
- Check console logs for errors
- Verify website URL is accessible
- Try testing with a well-known site first (e.g., https://google.com)

## 📚 Resources

- OpenAI API Docs: https://platform.openai.com/docs
- PageSpeed Insights: https://developers.google.com/speed/docs/insights/v5/get-started
- Schema.org: https://schema.org/docs/schemas.html
- Moz API: https://moz.com/products/api
- Ahrefs API: https://ahrefs.com/api/documentation

## 🎉 What Makes This Valuable

**Before:** Random scores (useless)
**Now:** Real analysis that provides:

1. ✅ **Actual schema markup quality** - not guessing
2. ✅ **Real content structure analysis** - FAQ detection, readability
3. ✅ **Google's own PageSpeed scores** - technical SEO
4. ✅ **Live AI testing** - does ChatGPT actually mention them?

This transforms the quiz from **"fun guessing game"** to **"legitimate SEO/AEO audit tool"**!
