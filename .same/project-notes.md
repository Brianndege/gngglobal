# GNG Global Prototype - Project Notes

## Project Overview
High-fidelity website prototype for GNG Global Investment Group, combining Mills Oakley-inspired design with actual GNG Global content.

## Design Approach
- **Visual Structure**: Inspired by Mills Oakley's professional corporate design
- **Content**: 100% sourced from GNG Global's public website
- **Color Scheme**: Navy blue (#293d7c) primary, cyan (#06b6d4) accent
- **Typography**: Clean, professional, corporate

## Content Sources
All content pulled from https://gngglobal.com.au/:
- ✅ Homepage hero and messaging
- ✅ "The GNG Value Exchange" framework description
- ✅ Portfolio companies (GNG Healthcare Group, GNG Property Group, Scenes)
- ✅ News articles with exact titles and dates
- ✅ Team members with roles and LinkedIn profiles
- ✅ Contact information
- ✅ Indigenous land acknowledgement

## Features Implemented
1. **Navigation**
   - Sticky header with shadow
   - Smooth scroll to sections
   - Hover transitions

2. **Hero Section**
   - Large impactful headline with exact company messaging
   - Gradient background with subtle image overlay
   - Call-to-action button

3. **Value Exchange Section**
   - Highlighted framework explanation
   - Clean card design

4. **Portfolio Section**
   - Grid layout for three portfolio companies
   - Sector tags in cyan
   - External link to GNG Healthcare website

5. **News & Media**
   - Two latest news items with dates
   - Clean card layout
   - Read more links

6. **Team Section**
   - Dark navy background
   - Four team members with LinkedIn links
   - Placeholder avatars (to be replaced)

7. **Contact Section**
   - Address, phone, email
   - LinkedIn social link
   - Clean layout

8. **Footer**
   - Indigenous land acknowledgement (exact wording)
   - Copyright notice
   - Email link

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Bun package manager

## Content Management
- Markdown files in `/content` directory:
  - `/content/news/` - News articles
  - `/content/team/` - Team member profiles
  - `/content/portfolio/` - Portfolio company descriptions

## Next Steps for Client
1. Replace placeholder team photos with actual headshots
2. Add more news articles as they're published
3. Consider adding individual portfolio company pages
4. Add news article detail pages
5. Consider implementing a headless CMS for easier content management
6. Add contact form functionality
7. Consider adding case studies or client testimonials
8. Deploy to production

## Deployment Notes
- Ready for Netlify deployment
- `netlify.toml` already configured
- Can deploy as static or dynamic site
- Recommend dynamic for future API routes/CMS integration

## Attribution & Legal
- All content sourced from public GNG Global website
- Detailed attribution in SOURCE.md
- No proprietary images copied
- Design inspired by professional service firm best practices
- Prototype for demonstration purposes only

## Version History
- v1: Initial setup
- v2: Added shadcn components
- v3-4: Complete homepage with all sections
