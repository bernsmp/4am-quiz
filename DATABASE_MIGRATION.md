# Database Migration - Add Analysis Details Column

To show the Technical Analysis section on the dashboard, you need to add the `analysis_details` column to your Supabase database.

## Quick Migration (1 minute)

### Option 1: Supabase SQL Editor (Easiest)

1. **Go to your Supabase project:** https://supabase.com/dashboard
2. **Click "SQL Editor" in the left sidebar**
3. **Paste this SQL and click "Run":**

```sql
-- Add analysis_details column to store detailed analyzer results
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS analysis_details JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN reports.analysis_details IS 'Detailed analysis results from schema, content, PageSpeed, and OpenAI analyzers';
```

4. **Done!** The column is now added.

### Option 2: Supabase Table Editor (Manual)

1. Go to "Table Editor" in Supabase
2. Select the `reports` table
3. Click "+ Add column"
4. Configure:
   - **Name:** `analysis_details`
   - **Type:** `jsonb`
   - **Default value:** `NULL`
   - **Nullable:** ✅ (checked)
5. Click "Save"

## What This Stores

The `analysis_details` column will store a JSON object like this:

```json
{
  "schema": {
    "type": "aeo",
    "score": 75,
    "enabled": true,
    "details": {
      "hasSchema": true,
      "schemaCount": 3,
      "schemaTypes": ["Organization", "FAQPage", "LocalBusiness"],
      "hasOrganization": true,
      "hasFAQ": true,
      "hasLocalBusiness": true,
      "hasArticle": false,
      "hasProduct": false,
      "hasReview": false,
      "completenessScore": 85
    }
  },
  "content": {
    "type": "aeo",
    "score": 68,
    "enabled": true,
    "details": {
      "hasFAQSection": true,
      "faqCount": 12,
      "hasHeadings": true,
      "headingStructure": ["H1", "H2", "H2", "H3"],
      "hasAuthorInfo": false,
      "hasClearAnswers": true,
      "wordCount": 1523,
      "hasContactInfo": true,
      "readabilityScore": 72,
      "structureScore": 80
    }
  },
  "pageSpeed": {
    "type": "seo",
    "score": 82,
    "enabled": true,
    "details": {
      "performanceScore": 78,
      "seoScore": 95,
      "accessibilityScore": 88,
      "bestPracticesScore": 85,
      "firstContentfulPaint": 1200,
      "largestContentfulPaint": 2400,
      "speedIndex": 1800,
      "totalBlockingTime": 150,
      "cumulativeLayoutShift": 0.08,
      "timeToInteractive": 2800
    }
  },
  "openai": {
    "type": "aeo",
    "score": 45,
    "enabled": true,
    "details": {
      "tested": true,
      "mentionedInGeneral": false,
      "mentionedInLocal": true,
      "mentionedInComparison": true,
      "positiveContext": true,
      "totalMentions": 2,
      "queries": [
        {
          "query": "What are the top companies for services?",
          "mentioned": false
        },
        {
          "query": "What are the best services companies in New York?",
          "mentioned": true,
          "snippet": "...Socially Square is a reputable digital marketing agency..."
        }
      ]
    }
  }
}
```

## Testing

After running the migration:

1. **Take a new quiz:** http://localhost:3000
2. **Enter a website** (try `sociallysquare.com` or any real site)
3. **Wait for analysis** (~45-60 seconds with OpenAI enabled)
4. **View dashboard** - You should now see the "Technical Analysis" section with 4 cards!

## Troubleshooting

### "Column already exists"
- If you get this error, the column is already there. You're good to go!

### "Technical Analysis shows 'Analysis in progress...'"
- This means the report was created BEFORE you added the column
- Take a NEW quiz to see the analysis data

### "All cards show 'Analysis not enabled'"
- Check that your OpenAI API key is set in `.env.local`
- Restart the dev server: `npm run dev`

### Want to see old reports updated?
Old reports won't have `analysis_details`. To test:
1. Delete old reports from Supabase Table Editor
2. Take a fresh quiz

## What's Next?

Once you see the Technical Analysis section working:
- ✅ Schema analysis shows what markup is detected
- ✅ PageSpeed shows Google's performance scores
- ✅ Content analysis shows FAQ/heading quality
- ✅ AI Visibility shows ChatGPT mentions (if OpenAI enabled)

This makes your dashboard look like a **$5,000 professional audit tool**! 🚀
