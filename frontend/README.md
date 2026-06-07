# Frontend — GrowthDesk AI

The frontend is built with **Lovable** (TanStack Start + React + Tailwind CSS) and lives in the **root of this repository** — this is a Lovable project constraint.

## Live App
The deployed app is hosted on Lovable. See the root README for the live URL.

## Key Source Files (root-level)
```
src/
  routes/
    index.tsx          ← Dashboard
    clients.index.tsx  ← Client list
    clients.$id.tsx    ← Client detail (conversation, follow-ups, outreach)
    follow-ups.tsx     ← Follow-up tracker
    outreach.tsx       ← Outreach drafts
    calendar.tsx       ← Content calendar (AI-generated)
    library.tsx        ← Content library
    settings.tsx       ← Settings
  lib/
    db.ts              ← Supabase client + type helpers
    automation.ts      ← n8n webhook integration (outreach + content)
  components/
    AppLayout.tsx      ← Sidebar navigation
    ClientForm.tsx     ← Add/edit client form
```

## Tech Stack
- **Framework:** Lovable (TanStack Start + React 19)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database client:** Supabase JS SDK
- **State / Data fetching:** TanStack Query
- **Routing:** TanStack Router (file-based)

## Environment Variables Required
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_N8N_OUTREACH_WEBHOOK_URL=   # optional — falls back to local template
VITE_N8N_CONTENT_WEBHOOK_URL=    # optional — falls back to local template
```
