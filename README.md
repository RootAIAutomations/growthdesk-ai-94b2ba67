# GrowthDesk AI — Service Business Hub

> IIT Roorkee × MASAI — New Age Software Engineering | Capstone Project 04

**GrowthDesk AI** is an AI-powered CRM and business management platform for solo service providers — freelancers, consultants, coaches, and SMB owners.

It solves the problem of managing clients, outreach, content, and follow-ups across 5 different apps by bringing everything into one intelligent workspace.

---

## 🔗 Live App

**[Open GrowthDesk AI →](https://growthdesk-ai-94b2ba67.lovable.app)**

> No login required — open in incognito to test fresh.

---

## 🗂️ Repository Structure

```
/
├── frontend/          ← Frontend documentation (Lovable app lives at root)
├── backend/           ← n8n AI workflow JSONs + integration guide
├── supabase/
│   └── migrations/    ← Database schema migrations
├── src/               ← Application source code (Lovable/TanStack Start)
│   ├── routes/        ← All pages
│   └── lib/           ← Database + automation helpers
└── README.md
```

---

## ✅ Core Features

| Feature | Status |
|---------|--------|
| Client management (add, edit, tag, status) | ✅ Live |
| Conversation history per client | ✅ Live |
| Follow-up tracking (overdue / today / this week) | ✅ Live |
| AI outreach draft generation | ✅ Live (n8n + fallback) |
| WhatsApp Web pre-filled draft link | ✅ Live |
| AI content calendar (7-day, 3 platforms) | ✅ Live (n8n + fallback) |
| Content library (save, search, filter) | ✅ Live |
| Dashboard with live stats | ✅ Live |

---

## 🏗️ System Architecture

```
Lovable Frontend (TanStack Start + React)
          │
          ▼
    Supabase (PostgreSQL)
          │
          ▼
        n8n
  (AI Workflow Engine)
          │
          ▼
   OpenAI GPT-4o-mini
```

---

## 🔄 Core Workflows

### Outreach Draft Workflow
```
Add Client + Notes → Supabase → Click "Generate Draft"
→ n8n Webhook → OpenAI (personalised with client context)
→ Draft saved → Copy / Open WhatsApp (wa.me prefilled)
```

### Content Calendar Workflow
```
Click "Generate 7-day plan" → n8n Webhook → OpenAI
→ 7 posts × 3 formats (Instagram, LinkedIn, Blog)
→ Saved to Content Calendar → Save to Library
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Lovable (TanStack Start + React 19 + Tailwind CSS) |
| Database | Supabase (PostgreSQL) |
| AI Workflow | n8n |
| AI Model | OpenAI GPT-4o-mini |
| Version Control | GitHub |
| Deployment | Lovable Hosting + Supabase |

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `clients` | Client records, tags, status, notes |
| `message_log` | Conversation history per client |
| `follow_up_schedule` | Follow-up tasks with due dates |
| `outreach_drafts` | AI-generated outreach messages |
| `content_calendar` | Weekly AI content plans |
| `content_library` | Saved reusable content |

Schema migrations: [`/supabase/migrations/`](./supabase/migrations/)

---

## ⚙️ Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_N8N_OUTREACH_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-outreach
VITE_N8N_CONTENT_WEBHOOK_URL=https://your-n8n/webhook/growthdesk-content
```

> The app works without n8n — it falls back to local templates automatically.

---

## 🤖 n8n Workflows

Import-ready workflow files are in [`/backend/`](./backend/):

- `n8n_outreach_workflow.json` — personalised outreach draft generator
- `n8n_content_workflow.json` — 7-day content calendar generator

See [`/backend/README.md`](./backend/README.md) for setup instructions.

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:8080`

---

## 👤 Author

**Vikram Hora**
IIT Roorkee × MASAI — New Age Software Engineering (No-Code Track)
Capstone Project 04 — Service Business Hub
2026
