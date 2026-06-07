import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, CalendarClock, AlertTriangle, CalendarRange } from "lucide-react";
import { format, parseISO, isToday, isBefore, isWithinInterval, startOfDay, endOfWeek, addDays } from "date-fns";
import { toast } from "sonner";
import { supabase, type FollowUp, type Client } from "@/lib/db";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({ meta: [{ title: "Follow-Ups — GrowthDesk AI" }] }),
  component: FollowUpsPage,
});

type FollowUpJoined = FollowUp & { clients: { id: string; name: string } | null };

function FollowUpsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["followups-all"],
    queryFn: async () => {
      const { data } = await supabase.from("follow_up_schedule").select("*, clients(id, name)").order("due_date");
      return (data ?? []) as FollowUpJoined[];
    },
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => {
      const { data } = await supabase.from("clients").select("id, name").order("name");
      return (data ?? []) as Pick<Client, "id" | "name">[];
    },
  });

  const toggle = useMutation({
    mutationFn: async (f: FollowUpJoined) => {
      const isCompleted = f.status === "Completed";
      const { error } = await supabase.from("follow_up_schedule").update({ status: isCompleted ? "Pending" : "Completed", completed_at: isCompleted ? null : new Date().toISOString() }).eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["followups-all"] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); },
  });

  const [form, setForm] = useState({ client_id: "", title: "", due_date: format(new Date(), "yyyy-MM-dd"), priority: "Medium" });
  const create = useMutation({
    mutationFn: async () => {
      const user_id = await getUserId();
      const { error } = await supabase.from("follow_up_schedule").insert({ ...form, user_id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["followups-all"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false); setForm({ client_id: "", title: "", due_date: format(new Date(), "yyyy-MM-dd"), priority: "Medium" });
      toast.success("Follow-up created");
    },
  });

  const today = startOfDay(new Date());
  const weekEnd = endOfWeek(today);
  const active = items.filter((i) => i.status !== "Completed");

  const overdue = active.filter((i) => isBefore(parseISO(i.due_date), today));
  const dueToday = active.filter((i) => isToday(parseISO(i.due_date)));
  const dueWeek = active.filter((i) => {
    const d = parseISO(i.due_date);
    return !isToday(d) && !isBefore(d, today) && isWithinInterval(d, { start: addDays(today, 1), end: weekEnd });
  });
  const later = active.filter((i) => {
    const d = parseISO(i.due_date);
    return !isBefore(d, today) && !isToday(d) && !isWithinInterval(d, { start: addDays(today, 1), end: weekEnd });
  });
  const completed = items.filter((i) => i.status === "Completed").slice(0, 10);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Follow-Ups"
        description={`${active.length} active`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> New follow-up</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New follow-up task</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Client</Label>
                  <Select value={form.client_id} onValueChange={(v) => setForm({ ...form, client_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                    <SelectContent>{clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Task</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label className="text-xs">Due date</Label><Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} /></div>
                <div className="flex justify-end"><Button disabled={!form.client_id || !form.title} onClick={() => create.mutate()}>Create</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="space-y-6">
        <Section title="Overdue" icon={AlertTriangle} color="text-destructive" items={overdue} onToggle={(f) => toggle.mutate(f)} />
        <Section title="Due today" icon={CalendarClock} color="text-warning-foreground" items={dueToday} onToggle={(f) => toggle.mutate(f)} />
        <Section title="Due this week" icon={CalendarRange} color="text-primary" items={dueWeek} onToggle={(f) => toggle.mutate(f)} />
        <Section title="Later" icon={CalendarRange} color="text-muted-foreground" items={later} onToggle={(f) => toggle.mutate(f)} />
        {completed.length > 0 && <Section title="Recently completed" icon={CalendarClock} color="text-success" items={completed} onToggle={(f) => toggle.mutate(f)} />}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, items, onToggle }: { title: string; icon: any; color: string; items: FollowUpJoined[]; onToggle: (f: FollowUpJoined) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><Icon className={`size-4 ${color}`} /> {title} <Badge variant="secondary">{items.length}</Badge></CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground py-3 text-center">Nothing here.</p>}
        {items.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-3 rounded-md border">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={f.status === "Completed"} onChange={() => onToggle(f)} className="size-4" />
              <div>
                <div className={`text-sm font-medium ${f.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>{f.title}</div>
                <div className="text-xs text-muted-foreground">
                  {f.clients ? <Link to="/clients/$id" params={{ id: f.clients.id }} className="hover:underline">{f.clients.name}</Link> : "—"}
                  {" · "}Due {format(parseISO(f.due_date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
