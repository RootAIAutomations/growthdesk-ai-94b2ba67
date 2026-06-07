import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import { s as statusColor } from "./db-IT-o_MWQ.js";
import { Users, CalendarClock, MessageSquareText, CalendarDays, AlertTriangle, ArrowRight } from "lucide-react";
import { startOfDay, parseISO, isToday, isBefore, format } from "date-fns";
import { s as supabase } from "./client-ENSXcCDN.js";
import "react";
import "clsx";
import "tailwind-merge";
import "sonner";
import "class-variance-authority";
import "@supabase/supabase-js";
function Dashboard() {
  const {
    data
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [clients, followUps, drafts, content] = await Promise.all([supabase.from("clients").select("*").order("updated_at", {
        ascending: false
      }), supabase.from("follow_up_schedule").select("*, clients(name)").neq("status", "Completed").order("due_date"), supabase.from("outreach_drafts").select("*, clients(name)").order("created_at", {
        ascending: false
      }), supabase.from("content_calendar").select("*").order("created_at", {
        ascending: false
      })]);
      return {
        clients: clients.data ?? [],
        followUps: followUps.data ?? [],
        drafts: drafts.data ?? [],
        content: content.data ?? []
      };
    }
  });
  const today = startOfDay(/* @__PURE__ */ new Date());
  const followUpsDue = data?.followUps.filter((f) => {
    const d = parseISO(f.due_date);
    return isToday(d) || isBefore(d, today);
  }).length ?? 0;
  const attention = data?.clients.filter((c) => {
    if (c.status === "Lost" || c.status === "Won") return false;
    if (c.follow_up_date && isBefore(parseISO(c.follow_up_date), today)) return true;
    if (!c.last_contact_date) return true;
    return false;
  }).slice(0, 6) ?? [];
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Dashboard", description: "Your CRM overview at a glance." }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsx(Stat, { icon: Users, label: "Total clients", value: data?.clients.length ?? 0, accent: "text-primary" }),
      /* @__PURE__ */ jsx(Stat, { icon: CalendarClock, label: "Follow-ups due", value: followUpsDue, accent: "text-warning-foreground" }),
      /* @__PURE__ */ jsx(Stat, { icon: MessageSquareText, label: "Outreach drafts", value: data?.drafts.length ?? 0, accent: "text-info" }),
      /* @__PURE__ */ jsx(Stat, { icon: CalendarDays, label: "Content posts", value: data?.content.length ?? 0, accent: "text-success" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-warning-foreground" }),
            " Clients requiring attention"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/clients", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          attention.length === 0 && /* @__PURE__ */ jsx(Empty, { children: "All clients are up to date." }),
          attention.map((c) => /* @__PURE__ */ jsxs(Link, { to: "/clients/$id", params: {
            id: c.id
          }, className: "flex items-center justify-between p-3 rounded-md border hover:bg-accent/40 transition", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: c.name }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: c.last_contact_date ? `Last contact ${format(parseISO(c.last_contact_date), "MMM d")}` : "Never contacted" })
            ] }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", className: statusColor(c.status), children: c.status })
          ] }, c.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx(CalendarClock, { className: "size-4 text-primary" }),
            " Upcoming follow-ups"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/follow-ups", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          (data?.followUps ?? []).slice(0, 6).length === 0 && /* @__PURE__ */ jsx(Empty, { children: "No upcoming follow-ups." }),
          (data?.followUps ?? []).slice(0, 6).map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-md border", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: f.title }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: f.clients?.name ?? "—" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: format(parseISO(f.due_date), "MMM d") })
          ] }, f.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx(MessageSquareText, { className: "size-4 text-info" }),
            " Recent outreach drafts"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/outreach", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          (data?.drafts ?? []).length === 0 && /* @__PURE__ */ jsx(Empty, { children: "No drafts yet." }),
          (data?.drafts ?? []).slice(0, 5).map((d) => /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-md border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: d.clients?.name ?? "Untitled" }),
              /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: d.channel })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground line-clamp-2", children: d.edited_text || d.draft_text })
          ] }, d.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
            /* @__PURE__ */ jsx(CalendarDays, { className: "size-4 text-success" }),
            " Recent content"
          ] }),
          /* @__PURE__ */ jsxs(Link, { to: "/calendar", className: "text-xs text-primary hover:underline flex items-center gap-1", children: [
            "View all ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "size-3" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
          (data?.content ?? []).length === 0 && /* @__PURE__ */ jsx(Empty, { children: "No content scheduled yet." }),
          (data?.content ?? []).slice(0, 5).map((c) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-3 rounded-md border", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: c.topic || "Content idea" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Weekly content" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: format(parseISO(c.content_date), "MMM d") })
          ] }, c.id))
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-3xl font-semibold mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsx(Icon, { className: `size-6 ${accent}` })
  ] }) }) });
}
function Empty({
  children
}) {
  return /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground py-6 text-center", children });
}
export {
  Dashboard as component
};
