import type { Client, FollowUp, Message } from "@/lib/db";

type OutreachPayload = {
  client: Client;
  messages: Message[];
  followUps: FollowUp[];
  businessContext?: string;
};

type ContentPayload = {
  businessContext?: string;
  weekStartDate: string;
};

type EmailPayload = {
  clientName: string;
  clientEmail: string;
  draftText: string;
  businessName?: string;
  senderName?: string;
};

type ImagePayload = {
  topic: string;
  caption?: string;
  businessContext?: string;
};

type OutreachDraft = {
  channel: string;
  draft_text: string;
  edited_text?: string | null;
};

type OutreachResponse = {
  // Multi-channel response (new)
  drafts?: OutreachDraft[];
  // Legacy single-draft fields
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

type EmailResponse = {
  success?: boolean;
  message?: string;
};

type ImageResponse = {
  image_url?: string;
  error?: string;
};

async function postWebhook<TPayload, TResponse>(url: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;
  // n8n sometimes wraps the response in an array — unwrap it
  const body = Array.isArray(parsed) ? parsed[0] : parsed;

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

export async function sendEmailDraft(payload: EmailPayload): Promise<EmailResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_EMAIL_WEBHOOK_URL || "https://automation.mavops.co.uk/webhook/growthdesk-email";
  return postWebhook<EmailPayload, EmailResponse>(webhookUrl, payload);
}

export async function generatePostImage(payload: ImagePayload): Promise<ImageResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_IMAGE_WEBHOOK_URL || "https://automation.mavops.co.uk/webhook/growthdesk-image";
  return postWebhook<ImagePayload, ImageResponse>(webhookUrl, payload);
}
