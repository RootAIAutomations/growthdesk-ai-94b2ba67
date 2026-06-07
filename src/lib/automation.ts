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
    scheduled_date: string;
    title: string;
    platform?: string | null;
    notes?: string | null;
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
  const webhookUrl = import.meta.env.VITE_N8N_OUTREACH_WEBHOOK_URL;

  if (webhookUrl) {
    return postWebhook<OutreachPayload, OutreachResponse>(webhookUrl, payload);
  }

  const latestMessage = payload.messages[0]?.content;
  const nextFollowUp = payload.followUps.find((item) => !item.completed);
  const tags = payload.client.tags?.length ? ` Tags: ${payload.client.tags.join(", ")}.` : "";
  const context = latestMessage ? ` I noted: ${latestMessage}` : "";
  const followUp = nextFollowUp ? ` I wanted to follow up on ${nextFollowUp.task.toLowerCase()}.` : "";

  return {
    channel: "WhatsApp",
    status: "Draft",
    draft_text: `Hi ${payload.client.name}, hope you're doing well.${context}${followUp} If it is still useful, I would be happy to help you move this forward with a simple next step.${tags}`,
    prompt_context: {
      source: "local_template",
      reason: "VITE_N8N_OUTREACH_WEBHOOK_URL is not configured",
    },
  };
}

export async function requestContentPlan(payload: ContentPayload): Promise<ContentResponse> {
  const webhookUrl = import.meta.env.VITE_N8N_CONTENT_WEBHOOK_URL;

  if (webhookUrl) {
    return postWebhook<ContentPayload, ContentResponse>(webhookUrl, payload);
  }

  const baseDate = new Date(`${payload.weekStartDate}T00:00:00.000Z`);
  const topics = [
    "Client follow-up rhythm",
    "Keeping better client notes",
    "Turning conversations into content",
    "Simple systems for solo service businesses",
    "Reusable outreach templates",
    "Weekly content planning",
    "Building trust through consistency",
  ];

  return {
    posts: topics.map((topic, index) => {
      const date = new Date(baseDate);
      date.setUTCDate(date.getUTCDate() + index);
      return {
        scheduled_date: date.toISOString().slice(0, 10),
        title: topic,
        platform: "LinkedIn",
        notes: `For solo service providers, ${topic.toLowerCase()} is not about adding complexity. It is about creating a reliable rhythm that protects relationships and keeps work moving.`,
        status: "Generated",
      };
    }),
  };
}
