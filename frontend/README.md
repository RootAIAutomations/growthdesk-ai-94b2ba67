# Frontend — GrowthDesk AI

The frontend is built with **Lovable** (TanStack Start + React 19 + Tailwind CSS).

> Because this is a Lovable project, the source code lives at the **root of the repository** (in `/src`) — this is a Lovable constraint. This `/frontend` folder exists to satisfy the repo structure requirement and points graders to the right place.

## Live App
**[growthdesk-ai.lovable.app/login](https://growthdesk-ai.lovable.app/login)**

## Source Code Location
```
/src
  /routes        ← All pages (dashboard, clients, calendar, outreach, etc.)
  /hooks         ← useAuth, useProfile, useVoiceTranscription
  /lib           ← Supabase client, automation webhooks
  /components    ← Shared UI components
/supabase
  /migrations    ← PostgreSQL schema
```

## Key Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard — KPI tiles, follow-up summary |
| `/clients` | Client list with search + filters |
| `/clients/$id` | Client detail — conversation, follow-ups, outreach |
| `/outreach` | All AI drafts across clients (WhatsApp / Email / LinkedIn) |
| `/calendar` | 7-day AI content calendar with image generation |
| `/library` | Content library — save and reuse posts |
| `/settings` | Business profile + onboarding |

## Tech Stack
- **Framework:** Lovable · TanStack Start · React 19
- **Styling:** Tailwind CSS · shadcn/ui
- **Database:** Supabase JS SDK
- **State:** TanStack Query
- **Routing:** TanStack Router (file-based)
- **Voice:** Browser Web Speech API
