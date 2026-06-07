# GrowthDesk AI

## AI-Powered Service Business Hub

GrowthDesk AI is an AI-powered CRM and business management platform designed for solo service providers, freelancers, consultants, coaches, therapists, marketers, and small business owners.

The platform helps users manage client relationships, track conversations, generate personalised outreach messages, organise follow-ups, and create AI-generated content calendars from a single dashboard.

This project is being developed as part of the IIT Roorkee – New Age Software Engineering (No-Code Track) Capstone Project.

---

## Problem Statement

Service-based businesses often manage clients, outreach, content creation, and follow-ups across multiple disconnected tools.

This leads to:

- Missed follow-ups
- Inconsistent client communication
- Poor lead management
- Time spent switching between applications
- Difficulty maintaining a content publishing schedule

GrowthDesk AI centralises these activities into a single platform and uses AI to reduce repetitive administrative work.

---

## Core Features

### Client Management

- Add and manage clients
- Store contact information
- Organise client tags
- Track status and engagement
- Store business notes

### Conversation History

- Maintain communication records
- Track client interactions
- Record important discussion points
- Build a historical client timeline

### AI Outreach Drafts

Generate personalised outreach messages using:

- Client notes
- Client tags
- Business information
- Previous interactions

Generated drafts can be reviewed, edited, and copied before sending.

### WhatsApp Draft Integration

Users can open WhatsApp Web with a pre-filled message using:

`wa.me` links

No WhatsApp Business API is required.

### Follow-Up Management

- Follow-up due dates
- Overdue reminders
- Engagement tracking
- Client attention dashboard

### AI Content Calendar

Generate weekly content drafts including:

- Instagram captions
- LinkedIn posts
- Blog openers

### Content Library

Store and reuse successful content assets.

---

## System Architecture

Lovable Frontend
        │
        ▼
    Supabase
(Database Layer)
        │
        ▼
      n8n
(AI Workflow Engine)
        │
        ▼
 OpenAI / LLM

---

## Project Workflow

### Client Outreach Workflow

Add Client + Notes
        │
        ▼
     Supabase
        │
        ▼
 Generate Outreach Draft
        │
        ▼
      n8n AI
        │
        ▼
 Save Draft
        │
        ▼
 Copy / WhatsApp Web


### Weekly Content Workflow

Generate Content Calendar
        │
        ▼
      n8n AI
        │
        ▼
 Save Content
        │
        ▼
 Content Library


---

## Technology Stack

### Frontend

- Lovable

### Database

- Supabase

### AI Workflow Layer

- n8n

### AI Models

- OpenAI

### Version Control

- GitHub

### Deployment

- Lovable Hosting
- Supabase

---

## Database Structure

### Clients

Stores:

- Contact information
- Tags
- Notes
- Status
- Follow-up dates

### Message Log

Stores:

- Conversation history
- Communication records

### Outreach Drafts

Stores:

- AI-generated outreach messages

### Content Calendar

Stores:

- Weekly content plans

### Follow-Up Schedule

Stores:

- Follow-up reminders
- Engagement tasks

### Content Library

Stores:

- Reusable content assets

---

## Project Status

**Current Phase:** Foundation & Architecture Setup

### Planned Milestones

1. Database Design
2. Frontend Development
3. AI Outreach Workflow
4. Content Calendar Workflow
5. Testing
6. Deployment
7. Final Presentation

---

## Capstone Alignment

This project is based on **Project 04 – Service Business Hub** and delivers the following required outcomes:

- Client list with notes and tags
- Conversation history
- Follow-up reminders and due dates
- AI-generated personalised outreach drafts
- WhatsApp Web pre-filled draft links
- AI-generated content calendar
- Content library for reusable content

---

## Author

**Vikram Hora**  
IIT Roorkee x MASAI – New Age Software Engineering Capstone Project  
2026
