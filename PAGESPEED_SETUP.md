# PageSpeed API Setup Guide

## Problem: PageSpeed Shows 0/100 Scores

If you're seeing **0/100** for all PageSpeed scores, it means the Google PageSpeed Insights API is rate-limited.

Without an API key, Google limits you to **very few requests per day** (often just 5-10 total).

## Solution: Get a FREE Google PageSpeed API Key

### Step 1: Create a Google Cloud Project (FREE)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name it something like "AEO Quiz PageSpeed"
5. Click "Create"

### Step 2: Enable PageSpeed Insights API (FREE)

1. In your new project, go to [APIs & Services](https://console.cloud.google.com/apis/library)
2. Search for "PageSpeed Insights API"
3. Click on it and click **"Enable"**
4. Wait a few seconds for it to activate

### Step 3: Create API Credentials (FREE)

1. Go to [Credentials](https://console.cloud.google.com/apis/credentials)
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your new API key (looks like: `AIzaSyC9X...`)
4. *Optional but recommended:* Click "Restrict Key" and add:
   - **Application restrictions**: None (or HTTP referrers if you prefer)
   - **API restrictions**: Select "Restrict key" → Choose "PageSpeed Insights API"

### Step 4: Add to Your .env.local

```bash
# Add this line to your .env.local file:
GOOGLE_PAGESPEED_API_KEY=AIzaSyC9X...your-key-here...
```

### Step 5: Restart Your Dev Server

```bash
# Stop your server (Ctrl+C) and restart
npm run dev
```

## What This Gives You

- ✅ **25,000 FREE requests per day** (instead of ~5-10 total)
- ✅ **Faster PageSpeed analysis** (priority queue)
- ✅ **Real scores** for apple.com, google.com, and any website
- ✅ **No credit card required** (completely free tier)

## Testing It Works

After adding your API key and restarting:

1. Go through the quiz
2. Analyze a website (like apple.com)
3. Check the dashboard - you should see real PageSpeed scores (50-90+)

## Cost

**100% FREE** - Google gives 25,000 PageSpeed API calls per day at no cost.

Even with heavy usage, you won't hit this limit unless you're analyzing thousands of sites per day.

## Troubleshooting

### Still seeing 0/100?

1. **Check your .env.local**: Make sure the key is added and there are no extra spaces
2. **Restart dev server**: Environment variables only load on startup
3. **Check API is enabled**: Go back to [Google Cloud Console](https://console.cloud.google.com/apis/library) and verify "PageSpeed Insights API" shows as enabled
4. **Check billing**: While the API is free, sometimes Google requires you to enable billing (but won't charge you unless you exceed the free tier)

### Rate limit errors?

If you've been testing a lot today without an API key, you may have hit the daily limit. Wait until tomorrow or add the API key.

### Want to see the raw error?

Check your terminal/console where `npm run dev` is running - you'll see detailed error messages like:
```
❌ PageSpeed API error: 429 Quota exceeded for quota metric 'Queries'
```

## Alternative: Wait 24 Hours

If you don't want to set up an API key right now, the rate limit resets at midnight Pacific Time. You can wait and try again tomorrow (but you'll only get a few tests before hitting the limit again).

## Questions?

The PageSpeed API setup is documented in Google's official guide: https://developers.google.com/speed/docs/insights/v5/get-started
