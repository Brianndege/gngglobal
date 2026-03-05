# GNG Global Admin User Guide

## Purpose
This guide is for IT and operations teams who need to run, support, and troubleshoot the GNG Global Admin CMS.

It covers:
- Access and authentication
- Role permissions
- Content publishing workflow
- Contact and newsletter operations
- Common troubleshooting and maintenance tasks

## Admin Portal Overview
Primary admin routes:
- `/admin/login` - Sign in
- `/admin/dashboard` - Command center and quick actions
- `/admin/posts` - Blog CMS list, filters, analytics, and bulk actions
- `/admin/posts/new` - Create post
- `/admin/posts/edit/{id}` - Edit post and restore versions
- `/admin/messages` - Contact message queue
- `/admin/subscribers` - Newsletter subscribers management and CSV export

## Access And Authentication
1. Open `/admin/login`.
2. Enter admin email and password.
3. On success, user is redirected to `/admin/dashboard`.

Notes:
- Authentication uses JWT bearer tokens.
- Token is stored in browser local storage under key `gng_admin_token`.
- On `401 Unauthorized`, UI clears token and redirects to `/admin/login`.
- Use **Logout** on dashboard to clear the session token explicitly.

## Roles And Permissions
Two roles are supported:
- `admin`: full permissions, including publish operations.
- `editor`: can create/edit/submit content for review but cannot publish directly.

Permission behavior:
- If an editor attempts publish, API downgrades to draft + review workflow.
- Bulk publish is blocked for non-admin users.

## CMS API Health Banner
A status banner appears on admin pages (except login):
- `CMS API connected` (green): API and DB reachable.
- `CMS API connecting/disconnecting` (amber): transient DB state.
- `CMS API unreachable` (red): API down or network failure.

The banner auto-checks health every 30 seconds via `/api/health`.

## Dashboard (`/admin/dashboard`)
Main functions:
- Quick links: Messages, Subscribers, Add New Post, Logout.
- Global search across content and dashboard datasets.
- Keyboard shortcuts:
  - `/` focus global search
  - `n` open new post
  - `?` open shortcuts dialog
- Content operations table with Edit/Delete shortcuts.
- Session activity log panel.

Important:
- Some marketplace analytics widgets on dashboard are UI-side operational views for command center usage and are session-scoped (not persisted as CMS content records).

## Blog CMS - Posts List (`/admin/posts`)
### What You Can Do
- View post summary metrics:
  - Total, Drafts, Published, Review, Scheduled, Archived, Featured
- View blog analytics:
  - Total views/likes/comments
  - Engagement rate
  - Popular posts
  - Referral sources
- Filter posts by:
  - Search term (title/slug/tag)
  - Category
  - Status (draft/published)
  - Workflow (draft/review/approved/rejected/archived)
  - Archive scope (active/archived/all)
- Select rows and run bulk actions:
  - Duplicate
  - Archive
  - Submit Review
  - Publish (admin only)
  - Delete

### Single-Row Actions
Each row supports:
- Edit
- Duplicate
- Archive

## Create Or Edit A Post
Routes:
- New: `/admin/posts/new`
- Edit: `/admin/posts/edit/{id}`

### Step-By-Step Publish Workflow
1. Fill core content fields: Title, Excerpt, Subheading, Slug, Category, Tags.
2. Choose content format:
   - HTML (rich text)
   - Markdown
3. Enter body content in editor.
4. Configure media (featured image upload or URL).
5. Add SEO/OpenGraph/Twitter metadata.
6. Set workflow and status.
7. Assign author (optional).
8. Add related posts (optional).
9. Save.
10. Publish if role allows, otherwise submit for review.

### Editor Features
- Basic insert controls:
  - Bold, Italic, Code block, Link, Link preview
- Drag/drop image embed directly into editor body.
- Content preview panel before save.

### Media Management
- Upload accepted formats: `png`, `jpeg`, `webp`, `avif`.
- Inline upload size safety limit: 2MB (larger files are ignored by upload helper).
- You can also provide a direct image URL.
- If a featured image is set, alt text is required.
- Existing image can be flagged for removal during edit.
- Image library allows quick reuse from recent post media.

### SEO + Social Metadata
Available fields:
- SEO: title, meta description, canonical URL
- OpenGraph: title, description, image URL
- Twitter: title, description, image URL, card type
- Social channel toggles: Facebook, Instagram, LinkedIn, Twitter/X

### Workflow And Status Rules
Status values:
- `draft`
- `published`

Workflow values:
- `draft`
- `review`
- `approved`
- `rejected`
- `archived`

System behavior:
- Published status forces workflow to approved/published state.
- Archive sets workflow to archived and removes active published state.
- Scheduled date (`scheduledFor`) is supported for planned release timing.

### Autosave And Version History
- Edit mode autosaves every 12 seconds via `?action=autosave`.
- Every manual save creates a revision snapshot.
- Version History panel allows restoring previous revision.
- Restore operation snapshots current state before rollback.

## Contact Messages (`/admin/messages`)
### Functions
- View inbound contact messages.
- Filter by status: all/new/responded.
- Mark message as responded (with optional notes).
- Revert responded message back to new.
- Send SMTP test notification from UI.

### SMTP Test Behavior
- Uses configured SMTP and contact notify env vars.
- If SMTP/contact env values are missing, action returns a configuration error.

## Newsletter Subscribers (`/admin/subscribers`)
### Functions
- Filter by status (all/active/unsubscribed).
- Search by email.
- Paginate with selectable page size.
- Copy tools:
  - Copy page emails (comma-separated)
  - Copy page emails (one per line)
  - Copy individual email from row
- Export filtered CSV.
- Manual refresh button and keyboard `r` refresh shortcut.

### Persistence Of View Preferences
The page stores user UI preferences in browser local storage:
- Row density
- Page size
- Status filter
- Search query

A reset action is available in the UI to clear saved preferences.

## Operational Runbooks
### Runbook: Publish A New Blog Post
1. Go to `/admin/posts/new`.
2. Enter title and validate auto-generated slug.
3. Add content and featured image + alt text.
4. Fill SEO metadata.
5. Set workflow:
   - Editors: set `review` and save.
   - Admins: set `published` and save.
6. Confirm post appears in `/admin/posts` with expected status.
7. Verify public rendering at `/news/{slug}`.

### Runbook: Review And Approve Editor Submission
1. Open `/admin/posts`.
2. Filter workflow = `review`.
3. Open post and validate content/SEO/media.
4. Set status to published (admin only) and save.
5. Verify in public news listing.

### Runbook: Process Contact Queue
1. Open `/admin/messages`.
2. Filter `new`.
3. Respond externally (email/helpdesk).
4. Click **Mark Responded** and add response notes.
5. Use SMTP test when investigating notification issues.

### Runbook: Export Subscriber List
1. Open `/admin/subscribers`.
2. Apply filter/search scope.
3. Click **Export CSV**.
4. Validate CSV contains expected rows and timestamped filename.

## Troubleshooting
### Cannot Sign In
Checks:
- Confirm credentials and account role in admin user table.
- Verify `JWT_SECRET` exists in runtime env.
- Confirm API is reachable and health endpoint returns success.

### Repeated Redirect To Login
Checks:
- Token expired/invalid; sign in again.
- Browser blocked local storage.
- API returning `401` due to mismatched JWT secret between services.

### API Health Banner Shows Unreachable
Checks:
- API service running.
- Database reachable from runtime.
- Environment variables present.
- Network/proxy rules permit `/api/*` path.

### Cannot Publish Post
Checks:
- User role is `admin`.
- Editor accounts are expected to submit for review, not publish.

### Featured Image Save Fails
Checks:
- Alt text provided.
- Upload size under 2MB for inline file handling.
- URL-based image is reachable and valid.

### CSV Export Fails
Checks:
- Auth token valid.
- API route `/api/admin/newsletter/export.csv` is reachable.
- Browser not blocking file download.

## Security And IT Maintenance
### Credential Hygiene
- Rotate default admin password immediately after environment setup.
- Enforce strong unique passwords for admin/editor accounts.
- Rotate JWT and SMTP secrets periodically.

### Environment Variables (High Priority)
Ensure these are configured per environment:
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DATABASE_URL`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `CONTACT_NOTIFY_FROM`
- `CONTACT_NOTIFY_TO`

### Recommended IT Controls
- Restrict admin portal access by IP/VPN where feasible.
- Enable monitoring on admin auth failures and `401`/`500` spikes.
- Keep audit trail of admin user changes and role assignments.

## Limitations To Be Aware Of
- No built-in password reset UI in current admin interface.
- Role management is not exposed in UI (managed via backend/database/admin tooling).
- Dashboard includes command-center widgets that are not all persisted to CMS records.

## Hand-Off Checklist For IT
- Confirm production env vars are present and rotated.
- Verify admin and editor accounts exist with correct roles.
- Verify login/logout flow.
- Verify publish flow (admin) and review flow (editor).
- Verify contact status updates and SMTP test.
- Verify subscriber CSV export.
- Verify health banner reports connected state.
