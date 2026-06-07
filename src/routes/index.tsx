import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, statusColor, type Client, type FollowUp, type Outreach, type ContentItem } from "@/lib/db";
import { Users, CalendarClock, MessageSquareText, CalendarDays, AlertTriangle, ArrowRight, TrendingUp } from "lucide-react";
import { format, isToday, isBefore, parseISO, startOfDay } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — GrowthDesk AI" }] }),
  component: Dashboard,
});

const STATUS_COLORS: Record<string, string> = {
  Lead: "#6366f1",
  Active: "#22c55e",
  "Follow-Up": "#f59e0b",
  Won: "#10b981",
  Lost: "#ef4444",
};

function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const firstName = profile.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const [clients, followUps, drafts, content] = await Promise.all([
        supabase.from("clients").select("*").order("updated_at", { ascending: false }),
        supabase.from("follow_up_schedule").select("*, clients(name)").neq("status", "Completed").order("due_date"),
        supabase.from("outreach_drafts").select("*, clients(name)").order("generated_at", { ascending: false }),
        supabase.from("content_calendar").select("*").order("content_date"),
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

  // Chart data
  const statusCounts = data?.clients.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {}) ?? {};

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Last 5 weeks content count
  const contentByWeek = data?.content.reduce<Record<string, number>>((acc, c) => {
    const week = format(parseISO(c.content_date), "'W'ww");
    acc[week] = (acc[week] || 0) + 1;
    return acc;
  }, {}) ?? {};

  const barData = Object.entries(contentByWeek).slice(-6).map(([week, count]) => ({ week, posts: count }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader
        title={`Good ${getTimeOfDay()}, ${firstName}`}
        description="Here's what needs your attention today."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Link to="/clients">
          <Stat icon={Users} label="Total clients" value={data?.clients.length ?? 0} accent="text-primary" delta={`${data?.clients.filter(c => c.status === "Active").length ?? 0} active`} />
        </Link>
        <Link to="/follow-ups">
          <Stat icon={CalendarClock} label="Follow-ups due" value={followUpsDue} accent="text-warning-foreground" delta={followUpsDue > 0 ? "Needs action" : "All clear"} urgent={followUpsDue > 0} />
        </Link>
        <Link to="/outreach">
          <Stat icon={MessageSquareText} label="Outreach drafts" value={data?.drafts.length ?? 0} accent="text-info" delta={`${data?.drafts.filter(d => d.status === "Draft").length ?? 0} unsent`} />
        </Link>
        <Link to="/calendar">
          <Stat icon={CalendarDays} label="Content posts" value={data?.content.length ?? 0} accent="text-success" delta="this week" />
        </Link>
      </div>

      {/* Charts row */}
      {(pieData.length > 0 || barData.length > 0) && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="size-4 text-primary" /> Client breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={40} paddingAngle={3}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#6366f1"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v, n) => [`${v} clients`, n]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 mt-2 justify-center">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="size-2.5 rounded-full" style={{ background: STATUS_COLORS[d.name] || "#6366f1" }} />
                      {d.name} ({d.value})
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {barData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-4 text-success" /> Content output
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="posts" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-warning-foreground" /> Clients needing attention
            </CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-primary" /> Upcoming follow-ups
            </CardTitle>
            <Link to="/follow-ups" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data?.followUps ?? []).slice(0, 6).length === 0 && <Empty>No upcoming follow-ups.</Empty>}
            {(data?.followUps ?? []).slice(0, 6).map((f) => {
              const due = parseISO(f.due_date);
              const overdue = isBefore(due, today) && !isToday(due);
              return (
                <div key={f.id} className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium text-sm">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.clients?.name ?? "—"}</div>
                  </div>
                  <div className={`text-xs font-medium ${overdue ? "text-destructive" : "text-muted-foreground"}`}>
                    {overdue ? "Overdue · " : ""}{format(due, "MMM d")}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareText className="size-4 text-info" /> Recent outreach drafts
            </CardTitle>
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
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 text-success" /> Upcoming content
            </CardTitle>
            <Link to="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="size-3" /></Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data?.content ?? []).length === 0 && <Empty>No content scheduled yet.</Empty>}
            {(data?.content ?? []).filter(c => !isBefore(parseISO(c.content_date), today)).slice(0, 5).map((c) => (
              <Link key={c.id} to="/calendar" className="flex items-center justify-between p-3 rounded-md border hover:bg-accent/40 transition">
                <div>
                  <div className="font-medium text-sm">{c.topic || "Content idea"}</div>
                  <div className="text-xs text-muted-foreground">{c.status}</div>
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

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function Stat({ icon: Icon, label, value, accent, delta, urgent }: {
  icon: any; label: string; value: number; accent: string; delta?: string; urgent?: boolean;
}) {
  return (
    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
            <div className="text-3xl font-bold">{value}</div>
            {delta && <div className={`text-xs mt-1 ${urgent ? "text-destructive font-medium" : "text-muted-foreground"}`}>{delta}</div>}
          </div>
          <Icon className={`size-5 mt-1 ${accent}`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted-foreground py-6 text-center">{children}</div>;
}
