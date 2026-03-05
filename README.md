# GNG Global Investment Group - Website Prototype

This is a high-fidelity, editable website prototype for GNG Global Investment Group.

## About This Prototype

This prototype is populated with the public textual content from GNG Global's website (homepage, portfolio, news items, and team information). Visual assets are placeholders — replace them with approved firm photography when available. Source references and used pages are listed in [SOURCE.md](./SOURCE.md).

## Content Sources

All content in this prototype has been sourced from the public GNG Global website:
- Company information and messaging from https://gngglobal.com.au/
- Team member details from the public team page
- News articles with exact titles and dates
- Portfolio company descriptions
- Contact details and land acknowledgement

**Note:** Images are placeholders using neutral stock photography. No proprietary images have been copied. Replace these with GNG Global's approved brand imagery.

## Design Structure

The visual design and layout are inspired by modern professional service firm websites, featuring:
- Clean, professional navigation
- Large hero section with company messaging
- Dedicated sections for: Portfolio, News & Media, Team, and Contact
- Responsive design for mobile, tablet, and desktop
- Professional color scheme based on GNG Global's brand colors

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Package Manager:** Bun
- **CMS API Database:** PostgreSQL via Prisma
- **Deployment:** Netlify-ready

## Getting Started

```bash
# Install dependencies (if not already installed)
bun install

# Run development server
bun dev

# Build for production
bun run build
```

Open [http://localhost:3000](http://localhost:3000) to view the prototype.

## CMS Integration (Dynamic News)

The `news` page now supports dynamic posts from a standalone CMS API.

1. Set frontend environment variable:

```bash
cp .env.example .env.local
```

By default this uses `CMS_API_SERVER_URL=http://localhost:8081` and proxies frontend requests through Next.js rewrites (`/api/*` and `/uploads/*`).

2. Run CMS backend from `cms-api/`:

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
npm run seed:admin
npm run dev
```

Set `DATABASE_URL` in `cms-api/.env` to your Postgres connection string (for Netlify DB, use `NETLIFY_DATABASE_URL`).

3. Open admin panel routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/posts/new`
- `/admin/posts/edit/:id`
## Project Structure

```
gng-global-prototype/
├── content/              # Markdown files with actual GNG Global content
│   ├── news/            # News articles from gngglobal.com.au
│   ├── team/            # Team member profiles
│   └── portfolio/       # Portfolio company descriptions
├── src/
│   ├── app/             # Next.js app pages
│   └── components/      # Reusable UI components
├── SOURCE.md            # Detailed attribution of content sources
└── README.md            # This file
```

## Editing Content

All content is organized in the `/content` folder as markdown files, making it easy to:
- Update news articles
- Add/remove team members
- Modify portfolio descriptions
- Change company messaging

The site can also be connected to a headless CMS for easier content management.

## Key Features

- ✅ Exact company messaging from GNG Global's website
- ✅ Real news items with accurate dates
- ✅ Actual team member information
- ✅ Portfolio companies with descriptions from the live site
- ✅ Indigenous land acknowledgement as published
- ✅ Contact details matching the public website
- ✅ Professional, modern design structure
- ✅ Fully responsive layout
- ✅ Fast performance with Next.js

## Next Steps

1. **Replace placeholder images** with GNG Global's approved brand photography
2. **Review and refine content** to ensure accuracy
3. **Add additional pages** as needed (e.g., individual portfolio pages, news article detail pages)
4. **Connect to CMS** for easier content management
5. **Deploy** to production when ready

## Legal & Attribution

All textual content is sourced from the public GNG Global website (https://gngglobal.com.au/). This prototype is for demonstration and internal use only. See [SOURCE.md](./SOURCE.md) for complete attribution details.

© 2024 GNG Global Investment Group Pty Ltd and its related entities. All rights reserved.
