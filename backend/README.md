# Backend — GrowthDesk AI (n8n Workflows)

All AI automation is handled by **n8n** using **OpenAI GPT-4o-mini** and **DALL-E 3**.

## Workflows

| File | Webhook | Purpose |
|------|---------|---------|
| `n8n_outreach_workflow.json` | `/webhook/growthdesk-outreach` | Generates personalised WhatsApp + Email + LinkedIn drafts |
| `n8n_content_workflow.json` | `/webhook/growthdesk-content` | Generates 7-day content calendar (Instagram, LinkedIn, Blog) |
| `n8n_email_workflow.json` | `/webhook/growthdesk-email` | Auto-sends email draft to client via SMTP |
| `n8n_image_workflow.json` | `/webhook/growthdesk-image` | DALL-E 3 image → Cloudinary → returns URL |

## How to Import

1. Open n8n → **Workflows → Import from file**
2. Import each JSON file
3. Add your **OpenAI API** credentials in n8n
4. Add **SMTP** credentials (for email workflow)
5. Activate each workflow
6. The webhook URLs activate automatically at `/webhook/<path>`

## Outreach Workflow

**Input:**
```json
{
  "client": { "name": "...", "business_type": "...", "notes": "...", "tags": [], "status": "Active" },
  "messages": [{ "direction": "Inbound", "message_type": "WhatsApp", "summary": "..." }],
  "followUps": [{ "title": "Send proposal", "due_date": "2026-06-10", "status": "Pending" }],
  "businessContext": "User's business description from their profile"
}
```

**Output:**
```json
{
  "drafts": [
    { "channel": "WhatsApp", "draft_text": "Hi [Name]! ..." },
    { "channel": "Email", "draft_text": "Dear [Name], ..." },
    { "channel": "LinkedIn", "draft_text": "Hi [Name], ..." }
  ],
  "status": "Draft"
}
```

## Content Workflow

**Input:**
```json
{ "weekStartDate": "2026-06-09", "businessContext": "..." }
```

**Output:**
```json
{
  "posts": [
    {
      "content_date": "2026-06-09",
      "day_number": 1,
      "topic": "Why freelancers need a CRM",
      "instagram_caption": "...",
      "linkedin_post": "...",
      "blog_opener": "..."
    }
  ]
}
```

## Image Workflow

**Input:**
```json
{ "topic": "Social media automation tips", "businessContext": "..." }
```

**Output:**
```json
{ "image_url": "https://res.cloudinary.com/..." }
```

## Email Workflow

**Input:**
```json
{
  "clientEmail": "client@example.com",
  "clientName": "Client Name",
  "draftText": "Email body text...",
  "businessName": "Your Business"
}
```

## Environment Variables (app side)

```env
VITE_N8N_OUTREACH_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-outreach
VITE_N8N_CONTENT_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-content
VITE_N8N_EMAIL_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-email
VITE_N8N_IMAGE_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-image
```

> The app works without n8n — it falls back to local template generation automatically.
