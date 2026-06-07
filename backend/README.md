# Backend — GrowthDesk AI

The backend AI layer is powered by **n8n** (self-hosted or n8n Cloud) using **OpenAI** for AI generation.

## Workflows

| File | Purpose |
|------|---------|
| `n8n_outreach_workflow.json` | Receives client data → OpenAI → returns personalised outreach draft |
| `n8n_content_workflow.json` | Receives week start date → OpenAI → returns 7-day content plan (Instagram + LinkedIn + Blog) |

## How to Import

1. Open your n8n instance
2. Go to **Workflows → Import from file**
3. Import each JSON file
4. Add your OpenAI API key in n8n credentials
5. Activate the workflow
6. Copy the webhook URL
7. Paste into Lovable environment variables:
   - `VITE_N8N_OUTREACH_WEBHOOK_URL`
   - `VITE_N8N_CONTENT_WEBHOOK_URL`

## Outreach Webhook — Input / Output

**POST** to webhook URL

Input (sent by the app):
```json
{
  "client": {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+919876543210",
    "business_type": "Graphic Designer",
    "tags": ["design", "logo"],
    "notes": "Looking for brand identity package. Budget ₹50k.",
    "status": "Active",
    "last_contact_date": "2026-06-04"
  },
  "messages": [
    { "message_type": "WhatsApp", "direction": "Inbound", "summary": "Client loved the proposal" }
  ],
  "followUps": [
    { "title": "Send updated proposal", "due_date": "2026-06-10", "status": "Pending" }
  ]
}
```

Expected output:
```json
{
  "draft_text": "Hi Priya! Following up on the brand identity proposal...",
  "channel": "WhatsApp",
  "status": "Draft"
}
```

## Content Webhook — Input / Output

**POST** to webhook URL

Input:
```json
{
  "weekStartDate": "2026-06-09",
  "businessContext": "GrowthDesk AI helps solo service providers manage clients and content."
}
```

Expected output:
```json
{
  "posts": [
    {
      "content_date": "2026-06-09",
      "day_number": 1,
      "topic": "Why solo freelancers need a CRM",
      "instagram_caption": "Your memory is not a CRM...",
      "linkedin_post": "After 5 years of freelancing...",
      "blog_opener": "Most service businesses don't need more tools...",
      "tags": ["crm", "freelancer"],
      "status": "Generated"
    }
  ]
}
```

## Database

Supabase project: `haeulonsftedrdgsxqpn`

Tables:
- `clients` — client records
- `message_log` — conversation history
- `follow_up_schedule` — follow-up tasks
- `outreach_drafts` — AI-generated outreach messages
- `content_calendar` — weekly AI content plans
- `content_library` — saved reusable content

Schema migrations are in `/supabase/migrations/`.
