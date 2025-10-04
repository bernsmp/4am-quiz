# AEO Strategist Branding Update Plan

## Overview
Update all branding to match AEO Strategist brand, using design inspiration from Socially Square reference site and provided brand colors.

## Brand Analysis

### Reference Site (sociallysquare.com)
- Clean, professional design with dark blue hero section
- White form overlay on hero
- Simple, readable typography
- Trust-building content structure
- Clear CTAs
- Professional footer with contact info

### Brand Colors Provided
- **#88a9c3** - Dusty Blue (light/mid tone)
- **#345e7d** - Darker Blue (primary dark)
- **#e3ebf2** - Off White (backgrounds)
- **#2b4257** - Darkest Blue (text/headers)
- **#6da7cc** - Sky Blue (accents)
- **#86c444** - Bright Green (CTAs/highlights)

### Logos Available
- Social Squared logo (chat bubble icon + text)
- AEO Strategist logo (text with target icon)

## Tasks

### 1. Analyze current branding
- [ ] Review current color scheme in tailwind.config.ts
- [ ] Review current components and color usage
- [ ] Identify all pages needing updates

### 2. Create Brand Guide Document
- [ ] Define primary, secondary, accent colors
- [ ] Define typography hierarchy
- [ ] Define button styles
- [ ] Define card/component styles
- [ ] Define spacing and layout patterns
- [ ] Create color usage guidelines

### 3. Update Tailwind Configuration
- [ ] Replace color palette in tailwind.config.ts
- [ ] Map brand colors to semantic names
- [ ] Test color combinations for accessibility

### 4. Update Components
- [ ] Update Button component variants
- [ ] Update Card component styles
- [ ] Update form input styles
- [ ] Update typography components

### 5. Update All Pages
- [ ] Landing page (/)
- [ ] Quiz page (/quiz)
- [ ] Verify page (/verify)
- [ ] Analyzing page (/analyzing)
- [ ] Gap Analysis page (/gap-analysis)

### 6. Testing & Review
- [ ] Visual review with Playwright
- [ ] Test all pages on desktop/tablet/mobile
- [ ] Check color contrast for accessibility
- [ ] Verify brand consistency across all pages

## Recommendations Needed
- Primary color usage strategy
- CTA button color (likely bright green #86c444)
- Background color strategy
- Text color hierarchy
- When to use each blue variant

## Next Steps
- [x] Present brand guide and recommendations to user
- [x] Get approval on plan
- [ ] Begin implementation

---

# Quiz Page Premium Design Enhancement Plan

## Design Review Summary
The quiz page uses correct brand colors but lacks polish and premium feel. Primary issue: button interactions are nearly invisible (borders disappear on click with no compensating feedback). The design is too flat with no depth, weak typography hierarchy, and missing micro-interactions.

## Critical Fixes (High Priority)

### 1. Fix Button Selection State
**Problem**: Selected buttons only lose their border - users can't tell what's selected
**Solution**:
- Background changes to green (#86c444) with white text when selected
- Add subtle scale transform (scale-[1.02]) for lift effect
- Smooth transition (200ms)
- Optional: checkmark icon

### 2. Add Hover State Feedback
**Problem**: Hovering produces no visible change
**Solution**:
- Light background tint on hover (bg-accent/10)
- Border color intensification
- Subtle lift effect (translateY(-2px))
- 200ms transition

### 3. Add Active/Press State
**Problem**: No tactile feedback when clicking
**Solution**:
- Brief scale-down (scale-[0.98]) on click
- Faster transition (100ms)

### 4. Enhance Card Depth
**Problem**: Card is flat with no visual hierarchy
**Solution**:
- Add shadow-lg for elevation
- Increase border radius to rounded-xl
- Consider subtle gradient overlay

### 5. Improve Typography Hierarchy
**Problem**: Question text is undersized (20-24px vs brand guide 28-32px)
**Solution**:
- Increase to text-2xl md:text-3xl
- Add font-semibold
- Increase line-height to leading-relaxed

## Medium Priority Enhancements

### 6. Improve Spacing & Breathing Room
**Current**: 16px between buttons
**Target**: 24px (space-y-6)
**Also**: Increase button internal padding to p-5 or p-6

### 7. Enhance Progress Bar
**Current**: Static blue bar
**Target**:
- Gradient from sky blue to green
- Subtle shine animation on updates
- Slightly increased height

### 8. Optimize Navigation Buttons
**Current**: Disabled state too subtle
**Target**: Make disabled state more obvious, strengthen primary vs secondary distinction

### 9. Mobile Spacing Optimization
**Current**: Adequate but cramped
**Target**: More generous spacing on mobile for touch targets

## Polish Details (Low Priority)

### 10. Add Focus States
**Issue**: Missing keyboard navigation feedback (accessibility)
**Solution**: Add focus-visible rings

### 11. Letter Spacing on Labels
**Enhancement**: Add slight tracking to A., B., C., D. labels

### 12. Badge Styling
**Current**: Outline variant
**Target**: Filled badge with sky blue background

## Implementation Checklist
- [ ] Update button component with selection, hover, and active states
- [ ] Increase question typography size and weight
- [ ] Add card shadows and enhanced border radius
- [ ] Improve button spacing (space-y-6)
- [ ] Add gradient progress bar
- [ ] Enhance button padding
- [ ] Add focus-visible states for accessibility
- [ ] Optimize mobile spacing
- [ ] Test all interactions
- [ ] Review on desktop, tablet, and mobile

## Expected Outcome
Transform from "bland wireframe" to "premium experience" with:
- Unmistakable interaction feedback
- Visual depth through shadows and layering
- Smooth micro-interactions
- Professional typography hierarchy
- Polished, confident feel throughout
