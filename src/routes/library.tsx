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
import { Plus, Library as LibraryIcon, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase, type LibraryItem } from "@/lib/db";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Content Library — GrowthDesk AI" }] }),
  component: LibraryPage,
});

function LibraryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content_type: "Caption", body: "", tags: "" });

  const { data = [] } = useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      const { data } = await supabase.from("content_library").select("*").order("created_at", { ascending: false });
      return (data ?? []) as LibraryItem[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("content_library").insert({
        title: form.title, content_type: form.content_type, body: form.body,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library"] });
      setOpen(false); setForm({ title: "", content_type: "Caption", body: "", tags: "" });
      toast.success("Saved to library");
    },
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Content Library"
        description={`${data.length} items`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="size-4" /> Add item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New library item</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label className="text-xs">Type</Label><Input value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })} /></div>
                <div><Label className="text-xs">Body</Label><Textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
                <div><Label className="text-xs">Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
                <div className="flex justify-end"><Button disabled={!form.title} onClick={() => create.mutate()}>Save</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {data.length === 0 ? (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <LibraryIcon className="size-8 mx-auto mb-2 opacity-50" />
          Your content library is empty.
        </CardContent></Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {data.map((it) => (
            <Card key={it.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{it.title}</div>
                  {it.content_type && <Badge variant="secondary">{it.content_type}</Badge>}
                </div>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground line-clamp-4 mb-2">{it.body}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(it.tags ?? []).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                </div>
                {it.body && (
                  <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(it.body!); toast.success("Copied"); }}>
                    <Copy className="size-3.5" /> Copy
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
