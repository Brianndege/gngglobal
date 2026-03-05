# Admin CMS SOP (One Page)

## Scope
This SOP is for daily operations in the GNG Global Admin CMS.

## Access
1. Open `/admin/login`.
2. Sign in with admin or editor credentials.
3. If login fails, check JWT/API health and credentials.

## Roles
- `admin`: create, edit, publish, archive, delete, bulk publish.
- `editor`: create/edit and submit for review; cannot publish directly.

## Daily Operations
### A) Publish New Post
1. Go to `/admin/posts/new`.
2. Fill required fields: Title, Slug, Content.
3. Add featured image and alt text.
4. Add SEO fields (meta title/description, OG, Twitter).
5. Set status/workflow:
   - Editor: `draft` + `review`
   - Admin: `published`
6. Save and verify on public `/news/{slug}`.

### B) Review Queue
1. Open `/admin/posts`.
2. Filter workflow to `review`.
3. Open post, validate content/SEO/media.
4. Publish (admin) or return with notes.

### C) Bulk Content Actions
1. Open `/admin/posts`.
2. Select rows.
3. Run one action: Duplicate, Archive, Submit Review, Publish, Delete.
4. Confirm table and summary metrics refresh.

### D) Contact Inbox
1. Open `/admin/messages`.
2. Filter to `new`.
3. Action externally (email/helpdesk), then click `Mark Responded`.
4. Add response notes when prompted.
5. Use `Send SMTP Test` for email diagnostics.

### E) Newsletter Subscribers
1. Open `/admin/subscribers`.
2. Filter/search as required.
3. Export CSV for reporting.
4. Optional: copy page emails for campaigns.

## Built-In Safety Behaviors
- Session token clears on unauthorized responses and redirects to login.
- Edit screen autosaves every 12 seconds in edit mode.
- Revision history is available on edited posts and supports restore.
- API health banner shows admin API status on admin screens.

## Incident Triage
### Login Loop / 401
- Re-login.
- Verify `JWT_SECRET` in runtime env.
- Confirm API + DB health.

### Cannot Publish
- Confirm user role is `admin`.

### Featured Image Validation Error
- Add alt text and ensure image is valid.

### CSV Export Failure
- Confirm auth token and `/api/admin/newsletter/export.csv` reachability.

## Minimum Daily Checklist
- Check API banner is healthy.
- Clear review queue.
- Process new contact messages.
- Export subscriber delta if required.
- Verify at least one public post render after publish changes.

## Escalation
Escalate to IT if any of the following occur:
- Repeated API unreachable state.
- Persistent 500 errors on admin routes.
- Auth failures across multiple users.
- Newsletter export or SMTP test failing after config verification.
