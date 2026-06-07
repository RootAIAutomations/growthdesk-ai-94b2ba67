const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY environment variables.");
}

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const today = new Date("2026-06-07T00:00:00.000Z");
const isoDate = (offset) => {
  const d = new Date(today);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
};

async function request(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${text}`);
  }
  return body;
}

async function clearTable(table) {
  await request(`${table}?id=not.is.null`, {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}

async function insert(table, rows) {
  return request(table, {
    method: "POST",
    body: JSON.stringify(rows),
  });
}

await clearTable("content_library");
await clearTable("content_calendar");
await clearTable("outreach_drafts");
await clearTable("follow_up_schedule");
await clearTable("message_log");
await clearTable("clients");

const clients = await insert("clients", [
  {
    name: "Aarav Mehta",
    email: "aarav@mehtaconsulting.co",
    phone: "919876543210",
    business_type: "Business Consultant",
    tags: ["high-intent", "proposal-sent"],
    notes: "Needs a simple client follow-up system for a boutique consulting practice.",
    status: "Follow-Up",
    last_contact_date: isoDate(-3),
    follow_up_date: isoDate(0),
  },
  {
    name: "Priya Shah",
    email: "priya@wellnesswithpriya.com",
    phone: "919812345678",
    business_type: "Wellness Coach",
    tags: ["active", "content-support"],
    notes: "Active client. Wants weekly content prompts and better WhatsApp follow-up tracking.",
    status: "Active",
    last_contact_date: isoDate(-1),
    follow_up_date: isoDate(4),
  },
  {
    name: "Neha Kapoor",
    email: "hello@kapoordesignstudio.com",
    phone: "919900112233",
    business_type: "Brand Designer",
    tags: ["lead", "instagram"],
    notes: "Interested in outreach drafts for warm Instagram leads.",
    status: "Lead",
    last_contact_date: null,
    follow_up_date: isoDate(2),
  },
  {
    name: "Rohan Iyer",
    email: "rohan@iyerdigital.in",
    phone: "919845001122",
    business_type: "Digital Marketer",
    tags: ["won", "referral-source"],
    notes: "Converted after demo. Potential source of agency referrals.",
    status: "Won",
    last_contact_date: isoDate(-8),
    follow_up_date: isoDate(14),
  },
  {
    name: "Sara Fernandes",
    email: "sara@therapyspace.in",
    phone: "919833445566",
    business_type: "Therapist",
    tags: ["overdue", "sensitive-tone"],
    notes: "Prefers gentle, low-pressure client communication.",
    status: "Follow-Up",
    last_contact_date: isoDate(-12),
    follow_up_date: isoDate(-2),
  },
]);

const byName = Object.fromEntries(clients.map((client) => [client.name, client]));

await insert("message_log", [
  {
    client_id: byName["Aarav Mehta"].id,
    message: "Discussed replacing spreadsheet tracking with a lightweight CRM workflow.",
    summary: "Discovery call: spreadsheet follow-ups are becoming hard to manage.",
    message_type: "Call",
    direction: "Internal",
    interaction_date: `${isoDate(-3)}T10:30:00Z`,
  },
  {
    client_id: byName["Priya Shah"].id,
    message: "Shared examples of weekly wellness content prompts and follow-up reminders.",
    summary: "Reviewed content calendar workflow and WhatsApp draft flow.",
    message_type: "Meeting",
    direction: "Internal",
    interaction_date: `${isoDate(-1)}T14:00:00Z`,
  },
  {
    client_id: byName["Sara Fernandes"].id,
    message: "Client asked for more time before deciding. Follow-up should be empathetic and brief.",
    summary: "Needs a soft follow-up after decision delay.",
    message_type: "Email",
    direction: "Inbound",
    interaction_date: `${isoDate(-12)}T09:15:00Z`,
  },
]);

await insert("follow_up_schedule", [
  {
    client_id: byName["Aarav Mehta"].id,
    title: "Send proposal recap and next steps",
    notes: "Mention CRM setup, follow-up tracking, and content workflow.",
    due_date: isoDate(0),
    priority: "High",
    status: "Pending",
  },
  {
    client_id: byName["Sara Fernandes"].id,
    title: "Send gentle check-in message",
    notes: "Use a low-pressure tone and avoid urgency.",
    due_date: isoDate(-2),
    priority: "High",
    status: "Pending",
  },
  {
    client_id: byName["Neha Kapoor"].id,
    title: "Ask about current lead outreach process",
    notes: "Explore Instagram DM and referral follow-ups.",
    due_date: isoDate(2),
    priority: "Medium",
    status: "Pending",
  },
  {
    client_id: byName["Priya Shah"].id,
    title: "Review next week's content themes",
    notes: "Focus on stress management and client retention posts.",
    due_date: isoDate(4),
    priority: "Medium",
    status: "Pending",
  },
  {
    client_id: byName["Rohan Iyer"].id,
    title: "Request testimonial and referral intro",
    notes: "Ask after onboarding confirmation.",
    due_date: isoDate(14),
    priority: "Low",
    status: "Pending",
  },
]);

await insert("outreach_drafts", [
  {
    client_id: byName["Aarav Mehta"].id,
    channel: "WhatsApp",
    draft_text: "Hi Aarav, thanks again for the call. Based on what you shared, GrowthDesk AI can help you keep client notes, follow-ups, and outreach drafts in one clean workspace. Would you like me to send over the proposed setup plan?",
    status: "Draft",
    prompt_context: { source: "demo-seed", tone: "consultative" },
  },
  {
    client_id: byName["Sara Fernandes"].id,
    channel: "WhatsApp",
    draft_text: "Hi Sara, just checking in gently after our last conversation. No rush at all, but if it would help, I can share a simple outline of how GrowthDesk AI could support your client communication workflow.",
    status: "Draft",
    prompt_context: { source: "demo-seed", tone: "gentle" },
  },
]);

await insert("content_calendar", [
  {
    week_start_date: isoDate(1),
    content_date: isoDate(1),
    day_number: 1,
    topic: "Why follow-ups matter",
    instagram_caption: "Most client opportunities are not lost on the first call. They are lost in the silence after it.",
    linkedin_post: "Consistent follow-up is one of the simplest growth levers for service businesses. A clear CRM rhythm keeps warm leads from going cold.",
    blog_opener: "For solo service providers, missed follow-ups are rarely a strategy problem. They are usually a system problem.",
    tags: ["follow-up", "crm", "service-business"],
    status: "Generated",
  },
  {
    week_start_date: isoDate(1),
    content_date: isoDate(2),
    day_number: 2,
    topic: "Client notes as business memory",
    instagram_caption: "Your notes are not admin. They are your relationship memory.",
    linkedin_post: "The best client experience often comes from remembering the small details: goals, objections, timelines, and preferred communication style.",
    blog_opener: "A good client note can save hours of context switching and make every follow-up feel more personal.",
    tags: ["client-notes", "productivity"],
    status: "Generated",
  },
  {
    week_start_date: isoDate(1),
    content_date: isoDate(3),
    day_number: 3,
    topic: "Content consistency",
    instagram_caption: "You do not need more ideas. You need a repeatable system for capturing and publishing them.",
    linkedin_post: "A simple weekly content calendar helps service providers stay visible without treating content as a daily emergency.",
    blog_opener: "Content consistency gets easier when planning, drafting, and reuse live in the same workflow.",
    tags: ["content-calendar", "marketing"],
    status: "Generated",
  },
]);

await insert("content_library", [
  {
    title: "Soft follow-up template",
    platform: "Other",
    content: "Hi {{name}}, just checking in gently after our last conversation. No rush, but happy to help if this is still useful.",
    tags: ["follow-up", "whatsapp", "gentle"],
    source: "Manual",
  },
  {
    title: "LinkedIn CRM thought starter",
    platform: "LinkedIn",
    content: "A CRM is not just a place to store contacts. For a service business, it is the operating system for trust, timing, and follow-through.",
    tags: ["crm", "linkedin", "thought-leadership"],
    source: "Generated",
  },
]);

console.log(`Seeded ${clients.length} clients with conversations, follow-ups, drafts, and content.`);
