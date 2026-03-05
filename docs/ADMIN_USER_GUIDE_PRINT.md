# GNG Global Admin CMS
## IT Handover Guide (Print Edition)

Version: 2026-03-05
Audience: IT Operations, Service Desk, Platform Support

---

## 1. Quick Access
- Login: `/admin/login`
- Dashboard: `/admin/dashboard`
- Posts: `/admin/posts`
- New Post: `/admin/posts/new`
- Edit Post: `/admin/posts/edit/{id}`
- Messages: `/admin/messages`
- Subscribers: `/admin/subscribers`

---

## 2. Roles And Permissions
- `admin`
  - Full access including publish and bulk publish.
- `editor`
  - Can create/edit and submit for review.
  - Cannot publish directly.

Operational note:
- If an editor attempts to publish, backend enforces review flow.

---

## 3. Daily Workflow
### 3.1 Create + Publish Content
1. Open `/admin/posts/new`.
2. Fill required fields: title, slug, content.
3. Add featured image and alt text.
4. Add SEO/OpenGraph/Twitter metadata.
5. Set status/workflow:
   - Editor: `draft` + `review`.
   - Admin: `published`.
6. Save and validate on public `/news/{slug}`.

### 3.2 Review Queue
1. Open `/admin/posts`.
2. Filter workflow = `review`.
3. Open and validate content.
4. Publish (admin) or return with notes.

### 3.3 Bulk Actions
From `/admin/posts`, select rows and run:
- Duplicate
- Archive
- Submit Review
- Publish (admin only)
- Delete

---

## 4. Editor Capabilities
- Content modes: HTML or Markdown.
- Toolbar inserts: bold, italic, code block, link, link preview.
- Drag/drop image embedding into body content.
- Autosave in edit mode every 12 seconds.
- Version history with restore.

---

## 5. Media + SEO Rules
### Media
- Upload formats: png, jpeg, webp, avif.
- Inline upload safety limit: 2MB.
- Direct image URL supported.
- If featured image exists, alt text is mandatory.

### SEO/Social
- Meta title, meta description, canonical URL.
- OpenGraph title/description/image.
- Twitter title/description/image/card.
- Social channel flags: Facebook, Instagram, LinkedIn, Twitter/X.

---

## 6. Contact Operations
Route: `/admin/messages`

Actions:
- Filter messages by status: all/new/responded.
- Mark message responded with optional notes.
- Revert to new if needed.
- Run SMTP test from UI.

If SMTP test fails:
- Verify SMTP and contact notification env values.

---

## 7. Newsletter Operations
Route: `/admin/subscribers`

Actions:
- Filter by status and search by email.
- Copy emails from current page.
- Export filtered CSV.
- Refresh view manually.

---

## 8. Health + Session Behavior
- Admin banner checks `/api/health` every 30s.
- Unauthorized responses clear token and redirect to login.
- Logout clears local token.

---

## 9. Incident Runbook
### A. Login Failure
- Verify credentials.
- Confirm `JWT_SECRET` exists and is consistent across runtime.
- Confirm API + DB health.

### B. Cannot Publish
- Confirm account role is `admin`.

### C. Image Save Rejected
- Confirm alt text exists.
- Confirm file size and format.

### D. CSV Export Failure
- Confirm auth session still valid.
- Confirm `/api/admin/newsletter/export.csv` reachable.

### E. API Unreachable Banner
- Check service process, DB connectivity, and environment settings.

---

## 10. IT Checklist (Go-Live / Ongoing)
- Verify admin and editor accounts.
- Validate login/logout flow.
- Validate editor review flow and admin publish flow.
- Validate contact queue updates.
- Validate newsletter CSV export.
- Validate API health banner status.
- Rotate secrets on schedule.

---

## 11. Security Notes
- Replace default passwords immediately.
- Rotate JWT and SMTP credentials periodically.
- Restrict admin access by VPN/IP where possible.
- Monitor for repeated auth failures and 500 spikes.

---

## PDF Export Tip
Use VS Code Markdown Preview print or your docs pipeline to export this file directly to PDF for IT distribution.
