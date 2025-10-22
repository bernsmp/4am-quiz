# GoHighLevel Email Capture Page Setup Guide

## Overview
This guide walks you through setting up the GoHighLevel (GHL) email capture page that integrates with your AEO quiz application.

## Implementation Status ✅
- ✅ Partial-gap page redirects to GHL with all parameters
- ✅ URL parameters include all necessary data
- ✅ Dashboard page handles direct access
- ✅ Environment variables configured

## Quick Start

### 1. Update Your Environment Variable
Edit your `.env.local` file and replace the placeholder URL with your actual GHL page:

```bash
# Replace this with your actual GHL capture page URL
NEXT_PUBLIC_GHL_CAPTURE_PAGE_URL=https://your-actual-ghl-domain.com/aeo-quiz-capture
```

### 2. Deploy to Vercel
Add the same environment variable in Vercel:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add `NEXT_PUBLIC_GHL_CAPTURE_PAGE_URL` with your GHL page URL
3. Redeploy your application

## GHL Page Setup Instructions

### Step 1: Create Custom Fields in GHL

Go to **Settings → Custom Fields → Contact** and create these 8 fields:

| Field Name | Field Type | Description |
|------------|------------|-------------|
| `report_id` | Text | Unique report identifier from Supabase |
| `website_url` | URL | User's website being analyzed |
| `quiz_seo_score` | Number | User's predicted SEO score (0-100) |
| `quiz_aeo_score` | Number | User's predicted AEO score (0-100) |
| `total_gap` | Number | Combined SEO + AEO gap |
| `gap_type` | Dropdown | Options: overconfident, underconfident, accurate |
| `profile_type` | Dropdown | Options: google_winner, ai_darling, balanced_operator, invisible_expert |
| `report_url` | URL | Link back to dashboard |

### Step 2: Create the Email Capture Page

1. **Navigate to:** Sites → Pages → Create New Page

2. **Page Settings:**
   - Page Name: `AEO Quiz - Email Capture`
   - Page URL: `/aeo-quiz-capture`
   - Template: Start with blank

3. **Add Page Elements:**

#### Header Section
```
- Logo (your brand)
- Headline: "🎉 Your Analysis is Ready!"
- Subheadline: "Enter your email to unlock your full AEO gap analysis"
```

#### Gap Preview Section (Creates Urgency)
```html
<div>
  <h2>You have a {{query.gap}}-point visibility gap</h2>
  <p>Your competitors are stealing {{query.gap}} prospects every month</p>
</div>
```

#### Email Form Configuration

**Visible Fields:**
- Email (required, email validation)
- First Name (optional but recommended)

**Hidden Fields - IMPORTANT:**
Each hidden field must be configured to capture URL parameters:

| Hidden Field Name | Default Value | Maps to Contact Field |
|------------------|---------------|----------------------|
| report_id | `{{query.reportId}}` | report_id |
| website_url | `{{query.website}}` | website_url |
| quiz_seo_score | `{{query.seoScore}}` | quiz_seo_score |
| quiz_aeo_score | `{{query.aeoScore}}` | quiz_aeo_score |
| total_gap | `{{query.gap}}` | total_gap |
| gap_type | `{{query.gapType}}` | gap_type |
| profile_type | `{{query.profile}}` | profile_type |
| report_url | `{{query.reportUrl}}` | report_url |

#### Form Submit Configuration

**Success Action:**
- Action Type: Redirect to URL
- Redirect URL: `{{custom_field.report_url}}`

This will redirect each user to their specific dashboard after email capture.

### Step 3: Test Your GHL Page

Test with this URL format:
```
https://your-ghl-domain.com/aeo-quiz-capture?
  reportId=test123&
  gap=42&
  seoScore=75&
  aeoScore=60&
  gapType=overconfident&
  profile=google_winner&
  website=https%3A%2F%2Fexample.com&
  reportUrl=https%3A%2F%2Fyour-app.vercel.app%2Fdashboard%2Ftest123
```

**Verify:**
1. Hidden fields auto-populate from URL
2. Form submission creates contact with all fields
3. Redirect to dashboard works

## URL Parameters Reference

The partial-gap page sends these parameters to GHL:

| Parameter | Example Value | Description |
|-----------|--------------|-------------|
| `reportId` | `abc123xyz` | Unique report ID from Supabase |
| `gap` | `42` | Total gap score (SEO + AEO) |
| `seoScore` | `75` | User's quiz SEO score |
| `aeoScore` | `60` | User's quiz AEO score |
| `gapType` | `overconfident` | Gap classification |
| `profile` | `google_winner` | User's profile type |
| `website` | `https%3A%2F%2Fexample.com` | URL-encoded website |
| `reportUrl` | Full dashboard URL | Where to redirect after email capture |

## Email Automation Setup (Optional)

### Create Workflow in GHL

1. **Trigger:** Contact Created
2. **Filter:** Custom field `report_id` is not empty
3. **Actions:**

**Email 1 - Immediate:**
```
Subject: Your {{custom_field.total_gap}}-Point Gap Analysis is Ready
Body: Include link to {{custom_field.report_url}}
```

**Email 2 - Day 3 Follow-up:**
```
Subject: Still losing prospects to competitors?
Body: Reference their {{custom_field.website_url}} and gap
```

## Testing Checklist

- [ ] GHL custom fields created
- [ ] GHL page published with form
- [ ] Hidden fields configured with `{{query.paramName}}` syntax
- [ ] Form redirect set to `{{custom_field.report_url}}`
- [ ] Test complete flow from quiz to dashboard
- [ ] Verify contact created in GHL with all data
- [ ] Email automation triggers (if configured)
- [ ] Mobile responsiveness tested

## Troubleshooting

### Issue: Hidden fields not populating
**Solution:** Ensure you're using `{{query.paramName}}` syntax, not `{{paramName}}`

### Issue: Redirect after form submission fails
**Solution:** Try hard-coding your domain and using: `https://your-app.com/dashboard/{{custom_field.report_id}}`

### Issue: Contact not created in GHL
**Solution:** Check that all required fields are mapped correctly and email validation passes

### Issue: Wrong profile or gap type
**Solution:** Verify the dropdown options in GHL match exactly:
- Gap types: `overconfident`, `underconfident`, `accurate`
- Profile types: `google_winner`, `ai_darling`, `balanced_operator`, `invisible_expert`

## Support

For issues with:
- **Vercel/Next.js app:** Check the console logs and Vercel function logs
- **GHL setup:** Refer to GHL documentation or support
- **Integration:** Verify URL parameters match between systems

## Next Steps

1. ✅ Update `NEXT_PUBLIC_GHL_CAPTURE_PAGE_URL` in `.env.local`
2. ✅ Create GHL custom fields (10 minutes)
3. ✅ Build GHL capture page (15 minutes)
4. ✅ Test end-to-end flow (5 minutes)
5. ✅ Deploy to production
6. ✅ Monitor first 10 leads closely

Total setup time: ~30 minutes