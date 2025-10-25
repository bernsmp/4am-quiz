# GHL Email Template Setup Instructions

## Overview
This guide will help you set up the automated email that sends when someone submits their email on the GHL capture page.

---

## Step 1: Create the Email Template in GHL

1. **Navigate to Email Templates**
   - Go to your GHL dashboard
   - Click on **Marketing** → **Email Templates**
   - Click **+ Create New Template**

2. **Choose Template Type**
   - Select **Custom HTML** template
   - Name it: `SEO AEO Gap Analysis - Report Delivery`

3. **Paste the HTML Template**
   - Copy the entire contents of `GHL_EMAIL_TEMPLATE.html`
   - Paste into the HTML editor in GHL
   - Click **Save**

4. **Set Email Settings**
   - **Subject Line**: `Your AI Visibility Report is Ready! 🎯`
   - **Preview Text**: `See how your website performs in traditional search and AI-powered results`
   - **From Name**: `Socially Square Team` (or your preferred name)
   - **From Email**: Use your verified domain email

---

## Step 2: Create the Workflow/Automation

1. **Navigate to Workflows**
   - Go to **Automation** → **Workflows**
   - Click **+ Create Workflow**
   - Name it: `SEO AEO Quiz - Send Report Email`

2. **Set the Trigger**
   - Click **Add Trigger**
   - Select **Form Submitted**
   - Choose your capture page form: `aeo-quiz-capture-7422`
   - Save trigger

3. **Add Email Action**
   - Click **+** to add new action
   - Select **Send Email**
   - Choose the template you created: `SEO AEO Gap Analysis - Report Delivery`
   - **Send To**: Contact Email
   - **Send Timing**: Immediately (or add a delay if you prefer)
   - Save action

4. **Activate the Workflow**
   - Review the workflow
   - Toggle **Active** to ON
   - Save workflow

---

## Step 3: Test the Integration

### Test Checklist:
- [ ] Form submission creates contact with custom fields
- [ ] Email is triggered immediately (or per your timing)
- [ ] All merge tags populate correctly in email
- [ ] Dashboard link works and loads the correct report
- [ ] Email displays properly on desktop and mobile

### How to Test:
1. Go to your capture page: `https://sociallysquare.com/aeo-quiz-capture-7422`
2. Complete the form with a test email
3. Check the email inbox for delivery
4. Click the dashboard link to verify it works
5. Check GHL contact record to verify all custom fields saved

---

## Available Merge Tags (Custom Fields)

These are automatically populated from the URL parameters:

| Merge Tag | Description | Example Value |
|-----------|-------------|---------------|
| `{{custom_field.report_url}}` | Full dashboard URL | `https://4am-test.vercel.app/dashboard/abc12345` |
| `{{custom_field.website_url}}` | Website analyzed | `https://example.com` |
| `{{custom_field.quiz_seo_score}}` | User's SEO prediction | `75` |
| `{{custom_field.quiz_aeo_score}}` | User's AEO prediction | `60` |
| `{{custom_field.total_gap}}` | Total gap score | `28` |
| `{{custom_field.gap_type}}` | Gap classification | `overconfident`, `underconfident`, or `accurate` |
| `{{custom_field.profile_type}}` | User's profile | `google_winner`, `ai_darling`, `balanced_operator`, `invisible_expert` |
| `{{custom_field.report_id}}` | Unique report ID | `abc12345` |

---

## Customization Guide

### Easy Edits (No Code Knowledge Required):

#### 1. Change the Header Text
Find this line (around line 24):
```html
<h1 style="margin: 0; color: #ffffff; font-size: 28px;">
    Your AI Visibility Report is Ready! 🎯
</h1>
```
Change the text between the `<h1>` tags.

#### 2. Update Greeting Message
Find this section (around line 34):
```html
<p style="...">
    Thanks for completing the SEO + AEO Gap Analysis Quiz! We've analyzed...
</p>
```
Edit the text to match your brand voice.

#### 3. Modify the CTA Button Text
Find this line (around line 137):
```html
<a href="{{custom_field.report_url}}" style="...">
    View Your Full Report →
</a>
```
Change "View Your Full Report →" to your preferred text.

#### 4. Update Calendar Link
Find this line (around line 179):
```html
<a href="https://calendly.com/sociallysquare/strategy-call" style="...">
```
Replace with your Calendly or booking link.

#### 5. Change Brand Colors
The template uses a purple gradient. To change:
- Find: `#667eea` (primary purple) - replace all instances
- Find: `#764ba2` (secondary purple) - replace all instances
- Suggested color combos:
  - Blue: `#4299e1` and `#3182ce`
  - Green: `#48bb78` and `#38a169`
  - Orange: `#ed8936` and `#dd6b20`
  - Red: `#f56565` and `#e53e3e`

#### 6. Update Footer Information
Find the footer section (around line 189):
```html
<p style="...">
    © 2024 Socially Square. All rights reserved.
</p>
```
Update with your company name and year.

---

## Advanced Customization Options

### Add Your Logo
Insert this code after line 23 (inside the header section):
```html
<img src="YOUR_LOGO_URL_HERE" alt="Company Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;">
```

### Add Social Media Links
Add this before the footer (around line 185):
```html
<tr>
    <td style="padding: 20px 40px; text-align: center;">
        <a href="YOUR_FACEBOOK_URL" style="margin: 0 10px;">
            <img src="FACEBOOK_ICON_URL" alt="Facebook" style="width: 24px; height: 24px;">
        </a>
        <a href="YOUR_LINKEDIN_URL" style="margin: 0 10px;">
            <img src="LINKEDIN_ICON_URL" alt="LinkedIn" style="width: 24px; height: 24px;">
        </a>
        <a href="YOUR_INSTAGRAM_URL" style="margin: 0 10px;">
            <img src="INSTAGRAM_ICON_URL" alt="Instagram" style="width: 24px; height: 24px;">
        </a>
    </td>
</tr>
```

### Add Additional Content Sections
Use this template structure to add more content:
```html
<tr>
    <td style="padding: 30px 40px;">
        <h2 style="margin: 0 0 15px; color: #333333; font-size: 20px; font-weight: 600;">
            Your Section Title
        </h2>
        <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
            Your content here...
        </p>
    </td>
</tr>
```

---

## Profile Type Display Names

If you want to show friendlier names instead of the raw profile values, you can use GHL's conditional logic:

**Current raw values:**
- `google_winner`
- `ai_darling`
- `balanced_operator`
- `invisible_expert`

**Friendly display names suggestion:**
- Google Winner → "SEO Champion"
- AI Darling → "AI Visibility Leader"
- Balanced Operator → "Balanced Performer"
- Invisible Expert → "Hidden Gem"

To implement, you'll need to create conditional content in GHL based on the profile_type custom field value.

---

## Gap Type Display Logic

**Gap types:**
- `overconfident` - Quiz prediction was higher than actual performance
- `underconfident` - Quiz prediction was lower than actual performance
- `accurate` - Quiz prediction matched actual performance closely

You could add conditional messaging:
```
If gap_type = "overconfident":
"You're more optimistic than your current data shows - let's close that gap!"

If gap_type = "underconfident":
"Great news! You're performing better than you think!"

If gap_type = "accurate":
"You have a great understanding of your current visibility!"
```

---

## Troubleshooting

### Merge Tags Not Populating?
- Verify custom fields are created in GHL with exact names
- Check that hidden fields on the form match the custom field names
- Ensure URL parameters are being passed correctly

### Email Not Sending?
- Check workflow is active
- Verify trigger is set to correct form
- Check GHL email sending limits/quotas
- Review workflow logs for errors

### Dashboard Link Not Working?
- Verify `NEXT_PUBLIC_APP_URL` environment variable is set correctly
- Test the report_url custom field value in GHL
- Check that reportId is being passed through correctly

### Email Looks Broken?
- Test in multiple email clients (Gmail, Outlook, Apple Mail)
- Some email clients strip certain CSS - the template uses inline styles for best compatibility
- Use GHL's "Send Test Email" feature before going live

---

## Email Marketing Best Practices

### Subject Line Tips:
- Current: `Your AI Visibility Report is Ready! 🎯`
- Alternative 1: `[NAME], Your Search Visibility Report is Inside`
- Alternative 2: `See How AI Views Your Brand (Quiz Results)`
- Alternative 3: `Your Gap Analysis Score: [TOTAL_GAP] Points`

### Timing Recommendations:
- **Immediate**: Best for maintaining momentum (recommended)
- **5-minute delay**: Allows user to reach dashboard first, then get email for future reference
- **1-hour delay**: Can include follow-up content if they haven't viewed yet

### Deliverability Tips:
- Use a verified sending domain
- Avoid spam trigger words
- Keep images optimized (under 1MB total)
- Include plain text version (GHL can auto-generate)
- Add unsubscribe link (GHL adds automatically)

---

## Follow-Up Sequence Ideas

Consider creating additional automated emails:

1. **Day 1** (This email): Report delivery with dashboard link
2. **Day 3**: "Did you check your report? Here's what it means..."
3. **Day 7**: "Ready to close your gaps? Here's how we can help"
4. **Day 14**: Case study or success story
5. **Day 30**: "Schedule your strategy call" reminder

---

## Support

If you need help with the GHL setup:
1. Check GHL documentation: https://help.gohighlevel.com
2. GHL Support Portal: support@gohighlevel.com
3. For template customization questions, refer to this guide

---

## Checklist for Going Live

- [ ] Email template created and saved in GHL
- [ ] Subject line and preview text set
- [ ] From name and email configured with verified domain
- [ ] Workflow created with form submission trigger
- [ ] Send email action added to workflow
- [ ] All merge tags tested and working
- [ ] Test email sent and reviewed on multiple devices
- [ ] Dashboard link tested and working
- [ ] Workflow activated
- [ ] Confirmation email received for test submission
- [ ] Contact record in GHL shows all custom fields populated

---

**Ready to launch!** 🚀

Once you complete this checklist, your automated email system will be live and ready to send personalized reports to everyone who completes the quiz.