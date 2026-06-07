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
import { Plus, Library as LibraryIcon, Copy, Search, Instagram, Linkedin, FileText, Globe } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase, type LibraryItem } from "@/lib/db";

export const Route = createFileRoute("/library")({
  head: () => ({ meta: [{ title: "Content Library — GrowthDesk AI" }] }),
  component: LibraryPage,
});

const PLATFORMS = ["All", "Instagram", "LinkedIn", "Blog", "Other"];

const platformIcon: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="size-3.5" />,
  LinkedIn: <Linkedin className="size-3.5" />,
  Blog: <FileText className="size-3.5" />,
  Other: <Globe className="size-3.5" />,
};

const platformColor: Record<string, string> = {
  Instagram: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  LinkedIn: "bg-blue-600/10 text-blue-700 border-blue-600/20",
  Blog: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Other: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function LibraryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [form, setForm] = useState({ title: "", platform: "Instagram", content: "", tags: "" });

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
        title: form.title,
        platform: form.platform,
        content: form.content,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        source: "Manual",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["library"] });
      setOpen(false);
      setForm({ title: "", platform: "Instagram", content: "", tags: "" });
      toast.success("Saved to library");
    },
    onError: (e: any) => toast.error(e.message || "Could not save"),
  });

  const filtered = data.filter((it) => {
    const matchPlatform = platformFilter === "All" || it.platform === platformFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || it.title.toLowerCase().includes(q) || (it.content ?? "").toLowerCase().includes(q) || (it.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchPlatform && matchSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Content Library"
        description={`${data.length} saved item${data.length !== 1 ? "s" : ""}`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="size-4" /> Add item</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add to library</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Best follow-up template" /></div>
                <div>
                  <Label className="text-xs">Platform</Label>
                  <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Instagram", "LinkedIn", "Blog", "Other"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label className="text-xs">Content</Label><Textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paste or write your content here..." /></div>
                <div><Label className="text-xs">Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. outreach, templates, linkedin" /></div>
                <div className="flex justify-end"><Button disabled={!form.title || !form.content || create.isPending} onClick={() => create.mutate()}>{create.isPending ? "Saving..." : "Save to library"}</Button></div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by title, content, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                platformFilter === p
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <LibraryIcon className="size-10 mx-auto mb-3 opacity-40" />
            {data.length === 0 ? (
              <>
                <p className="font-medium mb-1">Your library is empty</p>
                <p className="text-sm">Save content from the Content Calendar or add items manually.</p>
              </>
            ) : (
              <p className="font-medium">No items match your filter.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((it) => (
            <Card key={it.id} className="flex flex-col">
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-medium text-sm leading-snug">{it.title}</div>
                  {it.platform && (
                    <Badge variant="outline" className={`text-xs shrink-0 flex items-center gap-1 ${platformColor[it.platform] ?? ""}`}>
                      {platformIcon[it.platform]}
                      {it.platform}
                    </Badge>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap text-muted-foreground line-clamp-5 flex-1 mb-3 leading-relaxed">
                  {it.content}
                </p>
                {(it.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(it.tags ?? []).map((t) => (
                      <Badge key={t} variant="outline" className="text-xs cursor-pointer hover:bg-accent" onClick={() => setSearch(t)}>{t}</Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    {it.source === "Generated" ? "AI Generated" : "Manual"} · {format(parseISO(it.created_at), "MMM d, yyyy")}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(it.content ?? "");
                      toast.success("Copied to clipboard");
                    }}
                  >
                    <Copy className="size-3" /> Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
