# GrowthDesk AI n8n Automation Setup

GrowthDesk AI can call n8n webhooks for outreach draft generation and weekly content planning.

If the webhook URLs are blank, the app uses a local fallback so the product remains usable.

## Environment Variables

Add these values in Lovable and in local `.env` when the n8n workflows are live:

```text
VITE_N8N_OUTREACH_WEBHOOK_URL=https://<your-n8n-domain>/webhook/growthdesk-outreach-draft
VITE_N8N_CONTENT_WEBHOOK_URL=https://<your-n8n-domain>/webhook/growthdesk-content-plan
```

## Outreach Draft Workflow

Webhook path:

```text
growthdesk-outreach-draft
```

Expected request body:

```json
{
  "client": {
    "id": "uuid",
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "919876543210",
    "business_type": "Consultant",
    "tags": ["lead"],
    "notes": "Client notes",
    "status": "Follow-Up",
    "last_contact_date": "2026-06-04",
    "follow_up_date": "2026-06-07"
  },
  "messages": [],
  "followUps": []
}
```

Expected response body:

```json
{
  "channel": "WhatsApp",
  "status": "Draft",
  "draft_text": "Hi Aarav, thanks again for the call...",
  "prompt_context": {
    "source": "n8n_openai",
    "model": "gpt-4.1-mini"
  }
}
```

The app saves the returned draft into `outreach_drafts`.

Recommended n8n nodes:

1. Webhook
2. Code node to normalize `client`, `messages`, and `followUps`
3. OpenAI Chat node
4. Respond to Webhook

Suggested OpenAI system prompt:

```text
You write concise, professional outreach drafts for solo service providers.
Use the client's notes, tags, status, previous interactions, and follow-up task.
Return one warm message suitable for WhatsApp. Do not claim the message was sent.
Keep it under 90 words.
```

## Content Plan Workflow

Webhook path:

```text
growthdesk-content-plan
```

Expected request body:

```json
{
  "businessContext": "GrowthDesk AI helps solo service providers manage clients...",
  "weekStartDate": "2026-06-08"
}
```

Expected response body:

```json
{
  "posts": [
    {
      "content_date": "2026-06-08",
      "day_number": 1,
      "topic": "Why follow-ups matter",
      "instagram_caption": "Most client opportunities are not lost on the first call...",
      "linkedin_post": "Consistent follow-up is one of the simplest growth levers...",
      "blog_opener": "For solo service providers, missed follow-ups are rarely a strategy problem...",
      "tags": ["follow-up", "crm"],
      "status": "Generated"
    }
  ]
}
```

The app inserts each returned post into `content_calendar`.

Recommended n8n nodes:

1. Webhook
2. Code node to calculate 7 dates from `weekStartDate`
3. OpenAI Chat node
4. Code node to parse and validate JSON
5. Respond to Webhook

Suggested OpenAI system prompt:

```text
You create practical weekly content plans for solo service providers.
Return valid JSON only. Create exactly 7 items.
Each item must include content_date, day_number, topic, instagram_caption,
linkedin_post, blog_opener, tags, and status.
Keep the tone professional, useful, and specific.
```
