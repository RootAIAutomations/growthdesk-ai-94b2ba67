import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, statusColor, type Client, type FollowUp, type Outreach, type ContentItem } from "@/lib/db";
import { Users, CalendarClock, MessageSquareText, CalendarDays, AlertTriangle, ArrowRight } from "lucide-react";
import { format, isToday, isBefore, parseISO, startOfDay } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — GrowthDesk AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [clients, followUps, drafts, content] = await Promise.all([
        supabase.from("clients").select("*").order("updated_at", { ascending: false }),
        supabase.from("follow_up_schedule").select("*, clients(name)").neq("status", "Completed").order("due_date"),
        supabase.from("outreach_drafts").select("*, clients(name)").order("generated_at", { ascending: false }),
        supabase.from("content_calendar").select("*").order("generated_at", { ascending: false }),
      ]);
      return {
        clients: (clients.data ?? []) as Client[],
        followUps: (followUps.data ?? []) as (FollowUp & { clients: { name: string } | null })[],
        drafts: (drafts.data ?? []) as (Outreach & { clients: { name: string } | null })[],
        content: (content.data ?? []) as ContentItem[],
      };
    },
  });

  const today = startOfDay(new Date());
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

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Dashboard" description="Your CRM overview at a glance." />

      {/* Clickable stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/clients">
          <Stat icon={Users} label="Total clients" value={data?.clients.length ?? 0} accent="text-primary" />
        </Link>
        <Link to="/follow-ups">
          <Stat icon={CalendarClock} label="Follow-ups due" value={followUpsDue} accent="text-warning-foreground" />
        </Link>
        <Link to="/outreach">
          <Stat icon={MessageSquareText} label="Outreach drafts" value={data?.drafts.length ?? 0} accent="text-info" />
        </Link>
        <Link to="/calendar">
          <Stat icon={CalendarDays} label="Content posts" value={data?.content.length ?? 0} accent="text-success" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-4 text-warning-foreground" /> Clients requiring attention</CardTitle>
            <Link to="/clients" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {attention.length === 0 && <Empty>All clients are up to date.</Empty>}
            {attention.map((c) => (
              <Link key={c.id} to="/clients/$id" params={{ id: c.id }} className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/40 transition">
                <div>
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.last_contact_date ? `Last contact ${format(parseISO(c.last_contact_date), "MMM d")}` : "Never contacted"}
                  </div>
                </div>
                <Badge variant="outline" className={statusColor(c.status)}>{c.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="size-4 text-primary" /> Upcoming follow-ups</CardTitle>
            <Link to="/follow-ups" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data?.followUps ?? []).slice(0, 6).length === 0 && <Empty>No upcoming follow-ups.</Empty>}
            {(data?.followUps ?? []).slice(0, 6).map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-md border">
                <div>
                  <div className="font-medium text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.clients?.name ?? "—"}</div>
                </div>
                <div className="text-xs text-muted-foreground">{format(parseISO(f.due_date), "MMM d")}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><MessageSquareText className="size-4 text-info" /> Recent outreach drafts</CardTitle>
            <Link to="/outreach" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data?.drafts ?? []).length === 0 && <Empty>No drafts yet.</Empty>}
            {(data?.drafts ?? []).slice(0, 5).map((d) => (
              <div key={d.id} className="p-3 rounded-md border">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">{d.clients?.name ?? "Untitled"}</div>
                  <Badge variant="outline" className="text-xs">{d.channel}</Badge>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-2">{d.edited_text || d.draft_text}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="size-4 text-success" /> Recent content</CardTitle>
            <Link to="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data?.content ?? []).length === 0 && <Empty>No content scheduled yet.</Empty>}
            {(data?.content ?? []).slice(0, 5).map((c) => (
              <Link key={c.id} to="/calendar" className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/40 transition">
                <div>
                  <div className="font-medium text-sm">{c.topic || "Content idea"}</div>
                  <div className="text-xs text-muted-foreground">Weekly content</div>
                </div>
                <div className="text-xs text-muted-foreground">{format(parseISO(c.content_date), "MMM d")}</div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: number; accent: string }) {
  return (
    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
            <div className="text-3xl font-semibold mt-1">{value}</div>
          </div>
          <Icon className={`size-6 ${accent}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted-foreground py-6 text-center">{children}</div>;
}
