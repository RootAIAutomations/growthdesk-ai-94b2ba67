import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase, type ContentItem } from "@/lib/db";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Content Calendar — GrowthDesk AI" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "Instagram", scheduled_date: format(new Date(), "yyyy-MM-dd"), status: "planned", notes: "" });

  const { data = [] } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const { data } = await supabase.from("content_calendar").select("*").order("scheduled_date");
      return (data ?? []) as ContentItem[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("content_calendar").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setOpen(false); setForm({ title: "", platform: "Instagram", scheduled_date: format(new Date(), "yyyy-MM-dd"), status: "planned", notes: "" });
      toast.success("Post scheduled");
    },
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Content Calendar"
        description={`${data.length} posts`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> Schedule post</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Schedule content</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="text-xs">Platform</Label>
                    <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Instagram", "LinkedIn", "Twitter", "Facebook", "TikTok", "Email"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs">Date</Label><Input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} /></div>
                </div>
                <div><Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["planned", "drafted", "scheduled", "published"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Notes</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
                <div className="flex justify-end"><Button disabled={!form.title} onClick={() => create.mutate()}>Schedule</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {data.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <CalendarDays className="size-8 mx-auto mb-2 opacity-50" />
          No posts scheduled yet.
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {data.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{p.title}</div>
                  <Badge variant="secondary">{p.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex gap-3">
                  <span>{p.platform}</span>
                  <span>{format(parseISO(p.scheduled_date), "MMM d, yyyy")}</span>
                </div>
                {p.notes && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{p.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
