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
  const [form, setForm] = useState({ topic: "", content_date: format(new Date(), "yyyy-MM-dd"), status: "Generated", instagram_caption: "", linkedin_post: "", blog_opener: "" });

  const { data = [] } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const { data } = await supabase.from("content_calendar").select("*").order("content_date");
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
      setOpen(false); setForm({ topic: "", content_date: format(new Date(), "yyyy-MM-dd"), status: "Generated", instagram_caption: "", linkedin_post: "", blog_opener: "" });
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
                <div><Label className="text-xs">Topic</Label><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></div>
                <div><Label className="text-xs">Date</Label><Input type="date" value={form.content_date} onChange={(e) => setForm({ ...form, content_date: e.target.value })} /></div>
                <div><Label className="text-xs">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{["Generated", "Saved", "Published", "Archived"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Instagram caption</Label><Textarea rows={2} value={form.instagram_caption} onChange={(e) => setForm({ ...form, instagram_caption: e.target.value })} /></div>
                <div><Label className="text-xs">LinkedIn post</Label><Textarea rows={2} value={form.linkedin_post} onChange={(e) => setForm({ ...form, linkedin_post: e.target.value })} /></div>
                <div><Label className="text-xs">Blog opener</Label><Textarea rows={2} value={form.blog_opener} onChange={(e) => setForm({ ...form, blog_opener: e.target.value })} /></div>
                <div className="flex justify-end"><Button disabled={!form.topic} onClick={() => create.mutate()}>Schedule</Button></div>
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
                  <div className="font-medium">{p.topic || "Content idea"}</div>
                  <Badge variant="secondary">{p.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex gap-3">
                  <span>Weekly content</span>
                  <span>{format(parseISO(p.content_date), "MMM d, yyyy")}</span>
                </div>
                {p.linkedin_post && <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{p.linkedin_post}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
