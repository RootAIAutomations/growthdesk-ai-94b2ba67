# GrowthDesk AI — Service Business Hub

> IIT Roorkee × MASAI — New Age Software Engineering | Capstone Project 04

**GrowthDesk AI** is an AI-powered CRM and business management platform for solo service providers — freelancers, consultants, coaches, and SMB owners.

---

## 🔗 Live App

**[Open GrowthDesk AI →](https://growthdesk-ai.lovable.app**

> Open in incognito to test as a fresh user. Sign up → complete onboarding → explore.

---

## 🗂️ Repository Structure

```
/
├── frontend/          ← Frontend documentation
├── backend/           ← n8n AI workflow JSONs (import-ready)
├── supabase/
│   └── migrations/    ← PostgreSQL schema migrations
├── src/               ← Application source code (TanStack Start + React 19)
│   ├── routes/        ← All pages
│   ├── hooks/         ← Custom React hooks (auth, voice, profile)
│   └── lib/           ← Supabase client + automation helpers
└── README.md
```

---

## ✅ Core Features (Project 04 Requirements)

| Feature | Status |
|---------|--------|
| Client management (add, edit, tag, status) | ✅ Live |
| Conversation history per client | ✅ Live |
| Follow-up tracking (overdue / today / this week) | ✅ Live |
| AI outreach draft generation (personalised) | ✅ Live |
| WhatsApp Web pre-filled draft (wa.me) | ✅ Live |
| AI content calendar (7-day, 3 platforms) | ✅ Live |
| Content library (save, search, filter) | ✅ Live |
| Dashboard with live KPI stats | ✅ Live |

---

## 🚀 Open-Ended Stretch Features (All 3 Completed)

| Stretch | Implementation |
|---------|---------------|
| Auto-send via email | n8n SMTP → "Send Email" button on email drafts |
| AI image generation | DALL-E 3 via n8n → Cloudinary → shown in calendar post |
| Voice transcription → auto-draft | Web Speech API mic button in conversation + notes |

### Additional Beyond Spec
- **Multi-channel outreach** — one click generates WhatsApp + Email + LinkedIn simultaneously
- **4-step onboarding wizard** — account creation merged with business profile setup
- **Secure auth** — server-side `getUser()` validation, stale/deleted sessions auto-cleared

---

## 🏗️ Architecture

```
Lovable Frontend (TanStack Start + React 19 + Tailwind)
          │
          ▼
    Supabase (PostgreSQL + Auth + Row Level Security)
          │
          ▼
     n8n (automation.mavops.co.uk)
          │
     ┌────┴────┐
  OpenAI      DALL-E 3
 GPT-4o-mini      │
                Cloudinary
```

---

## 🔄 AI Workflows (n8n)

| Workflow | Trigger | Output |
|----------|---------|--------|
| Outreach | "Generate Draft" on client | 3 drafts (WhatsApp, Email, LinkedIn) |
| Content | "Generate 7-day plan" | 7 posts × 3 formats per post |
| Image | "Generate Image" on post | DALL-E image → Cloudinary URL |
| Email | "Send Email" on draft | Delivered via SMTP to client |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Lovable · TanStack Start · React 19 · Tailwind CSS · shadcn/ui |
| Database | Supabase (PostgreSQL + Auth + RLS) |
| AI Workflow | n8n (self-hosted) |
| AI Model | OpenAI GPT-4o-mini + DALL-E 3 |
| Image Storage | Cloudinary |
| Voice Input | Browser Web Speech API |
| Deployment | Lovable Hosting |

---

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `clients` | Client records, tags, status, notes |
| `message_log` | Conversation history per client |
| `follow_up_schedule` | Follow-up tasks with due dates |
| `outreach_drafts` | AI drafts (WhatsApp / Email / LinkedIn) |
| `content_calendar` | AI-generated weekly content posts |
| `content_library` | Saved reusable content pieces |
| `profiles` | User business profile + onboarding state |

---

## ⚙️ Backend — n8n Workflows

Import-ready files in [`/backend/`](./backend/):

| File | Webhook Path |
|------|-------------|
| `n8n_outreach_workflow.json` | `/webhook/growthdesk-outreach` |
| `n8n_content_workflow.json` | `/webhook/growthdesk-content` |
| `n8n_email_workflow.json` | `/webhook/growthdesk-email` |
| `n8n_image_workflow.json` | `/webhook/growthdesk-image` |

Setup guide: [`/backend/README.md`](./backend/README.md)

---

## 🚀 Run Locally

```bash
npm install
npm run dev
# → http://localhost:8080
```

---

## 👤 Author

**Vikram Hora** · IIT Roorkee × MASAI · New Age Software Engineering · Capstone Project 04 · 2026
