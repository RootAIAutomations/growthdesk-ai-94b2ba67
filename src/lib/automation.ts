import type { Client, FollowUp, Message } from "@/lib/db";

type OutreachPayload = {
  client: Client;
  messages: Message[];
  followUps: FollowUp[];
};

type ContentPayload = {
  businessContext?: string;
  weekStartDate: string;
};

type OutreachResponse = {
  draft_text?: string;
  edited_text?: string | null;
  channel?: string;
  status?: string;
  prompt_context?: Record<string, unknown>;
  saved_draft_id?: string;
};

type ContentResponse = {
  posts?: Array<{
    content_date: string;
    day_number?: number | null;
    topic?: string | null;
    instagram_caption?: string | null;
    linkedin_post?: string | null;
    blog_opener?: string | null;
    tags?: string[];
    status?: string;
  }>;
};

async function postWebhook<TPayload, TResponse>(url: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = body?.message || body?.error || `Automation request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body as TResponse;
}

export async function requestOutreachDraft(payload: OutreachPayload): Promise<OutreachResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_OUTREACH_WEBHOOK_URL || "https://automation.mavops.co.uk/webhook/growthdesk-outreach";
  return postWebhook<OutreachPayload, OutreachResponse>(webhookUrl, payload);
}

export async function requestContentPlan(payload: ContentPayload): Promise<ContentResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_CONTENT_WEBHOOK_URL || "https://automation.mavops.co.uk/webhook/growthdesk-content";
  return postWebhook<ContentPayload, ContentResponse>(webhookUrl, payload);
}
// Sun Jun  7 13:17:13 BST 2026
