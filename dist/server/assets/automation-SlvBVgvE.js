async function requestOutreachDraft(payload) {
  const latestMessage = payload.messages[0]?.summary || payload.messages[0]?.message;
  const nextFollowUp = payload.followUps.find((item) => item.status !== "Completed");
  const tags = payload.client.tags?.length ? ` Tags: ${payload.client.tags.join(", ")}.` : "";
  const context = latestMessage ? ` I noted: ${latestMessage}` : "";
  const followUp = nextFollowUp ? ` I wanted to follow up on ${nextFollowUp.title.toLowerCase()}.` : "";
  return {
    channel: "WhatsApp",
    status: "Draft",
    draft_text: `Hi ${payload.client.name}, hope you're doing well.${context}${followUp} If it is still useful, I would be happy to help you move this forward with a simple next step.${tags}`,
    prompt_context: {
      source: "local_template",
      reason: "VITE_N8N_OUTREACH_WEBHOOK_URL is not configured"
    }
  };
}
async function requestContentPlan(payload) {
  const baseDate = /* @__PURE__ */ new Date(`${payload.weekStartDate}T00:00:00.000Z`);
  const topics = [
    "Client follow-up rhythm",
    "Keeping better client notes",
    "Turning conversations into content",
    "Simple systems for solo service businesses",
    "Reusable outreach templates",
    "Weekly content planning",
    "Building trust through consistency"
  ];
  return {
    posts: topics.map((topic, index) => {
      const date = new Date(baseDate);
      date.setUTCDate(date.getUTCDate() + index);
      return {
        content_date: date.toISOString().slice(0, 10),
        day_number: index + 1,
        topic,
        instagram_caption: `${topic}: a small system can save hours of scattered admin work.`,
        linkedin_post: `For solo service providers, ${topic.toLowerCase()} is not about adding complexity. It is about creating a reliable rhythm that protects relationships and keeps work moving.`,
        blog_opener: `Most service businesses do not need more tools. They need a clearer operating rhythm for ${topic.toLowerCase()}.`,
        tags: ["service-business", "growthdesk", "workflow"],
        status: "Generated"
      };
    })
  };
}
export {
  requestOutreachDraft as a,
  requestContentPlan as r
};
