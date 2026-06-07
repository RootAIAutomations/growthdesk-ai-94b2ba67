# AGENTS.md

# GrowthDesk AI - Codex Project Instructions

## Project Overview

GrowthDesk AI is an IIT Roorkee Capstone Project based on:

Project 04 – Service Business Hub

The application is an AI-powered business management platform for solo service providers.

The goal is to help users manage clients, outreach, follow-ups and content creation from a single dashboard.

---

# Project Objective

Build a working MVP that satisfies the capstone requirements.

The project must prioritise:

1. Client Management
2. Conversation History
3. Follow-Up Tracking
4. AI Outreach Draft Generation
5. WhatsApp Draft Integration
6. Content Calendar Generation
7. Content Library

---

# Required Technology Stack

Frontend:
- Lovable

Database:
- Supabase

AI Workflow Engine:
- n8n

AI Models:
- OpenAI

Version Control:
- GitHub

Deployment:
- Lovable Hosting
- Supabase

---

# Required Database Entities

clients

message_log

outreach_drafts

content_calendar

follow_up_schedule

content_library

---

# Core Workflow

Add Client + Notes
→ Save to Supabase

Generate Outreach Draft
→ n8n AI Workflow
→ Save Draft
→ Copy or Open WhatsApp

Generate Weekly Content
→ n8n AI Workflow
→ Save Content
→ Store in Content Library

Follow-Up Tracking
→ Due Today
→ Due This Week
→ Overdue

---

# Required Pages

Dashboard

Clients

Client Detail

Outreach Drafts

Content Calendar

Content Library

Follow-Ups

Settings

---

# Dashboard Requirements

Show:

- Total Clients
- Follow-Ups Due
- Outreach Drafts Generated
- Content Posts Generated

Display:

- Clients Requiring Attention
- Upcoming Follow-Ups
- Recent Outreach Drafts
- Recent Content

---

# Client Requirements

Store:

- Name
- Email
- Phone
- Business Type
- Tags
- Notes
- Status
- Last Contact Date
- Follow-Up Date

Statuses:

- Lead
- Active
- Follow-Up
- Won
- Lost

---

# Client Detail Requirements

Show:

- Client Information
- Notes
- Conversation History
- Follow-Up Information
- Outreach History

Actions:

- Add Note
- Add Conversation Entry
- Generate Outreach Draft
- Copy Draft
- Open WhatsApp

---

# Content Calendar Requirements

Generate:

- Instagram Caption
- LinkedIn Post
- Blog Opener

Generate 7-day content plans.

---

# WhatsApp Integration

Use:

https://wa.me/<phone>?text=<message>

No WhatsApp Business API.

No direct WhatsApp sending.

Only pre-filled drafts.

---

# Content Library Requirements

Store:

- Title
- Platform
- Content
- Tags
- Created Date

Allow search and reuse.

---

# Development Rules

Always prefer simple solutions.

Do not introduce unnecessary complexity.

Do not add authentication unless specifically requested.

Do not add payment systems.

Do not add multi-tenant architecture.

Do not add user roles.

Do not add analytics dashboards.

Do not add features outside the capstone scope.

---

# UI Guidelines

Modern SaaS appearance.

Professional business styling.

Responsive layout.

Clean dashboard.

Easy to demo within 5 minutes.

Prioritise usability over visual complexity.

---

# Priority Order

1. Database
2. Client Management
3. Conversation History
4. Follow-Up Tracking
5. Outreach Drafts
6. WhatsApp Integration
7. Content Calendar
8. Content Library
9. Testing
10. Deployment

---

# Success Criteria

A user can:

- Add a client
- Add notes
- View conversation history
- Generate outreach drafts
- Open WhatsApp draft links
- Generate content calendars
- Save content
- Track follow-ups

If all above work, the MVP is complete.
