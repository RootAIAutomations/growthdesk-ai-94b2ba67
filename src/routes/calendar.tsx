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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CalendarDays, Sparkles, Copy, BookmarkPlus, Instagram, Linkedin, FileText, Trash2 } from "lucide-react";
import { format, parseISO, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { supabase, type ContentItem } from "@/lib/db";
import { requestContentPlan } from "@/lib/automation";
import { useProfile } from "@/hooks/useProfile";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Content Calendar — GrowthDesk AI" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const qc = useQueryClient();
  const { getBusinessContext } = useProfile();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selected, setSelected] = useState<ContentItem | null>(null);
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
      setScheduleOpen(false);
      setForm({ topic: "", content_date: format(new Date(), "yyyy-MM-dd"), status: "Generated", instagram_caption: "", linkedin_post: "", blog_opener: "" });
      toast.success("Post scheduled");
    },
  });

  const generatePlan = useMutation({
    mutationFn: async () => {
      const weekStartDate = format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
      const result = await requestContentPlan({
        weekStartDate,
        businessContext: getBusinessContext(),
      });
      if (!result.posts?.length) throw new Error("Automation did not return content posts.");
      const posts = result.posts.map((p) => ({
        content_date: p.content_date,
        day_number: p.day_number ?? null,
        topic: p.topic ?? "Content idea",
        instagram_caption: p.instagram_caption ?? null,
        linkedin_post: p.linkedin_post ?? null,
        blog_opener: p.blog_opener ?? null,
        tags: p.tags ?? [],
        status: p.status ?? "Generated",
      }));
      const { error } = await supabase.from("content_calendar").insert(posts);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("7-day content plan generated");
    },
    onError: (e: any) => toast.error(e.message || "Could not generate content plan"),
  });

  const saveToLibrary = useMutation({
    mutationFn: async ({ item, platform, content }: { item: ContentItem; platform: string; content: string }) => {
      const { error } = await supabase.from("content_library").insert({
        title: item.topic || "Content idea",
        platform,
        content,
        tags: item.tags ?? [],
        source: "Generated",
        content_calendar_id: item.id,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["library"] });
      toast.success(`Saved ${vars.platform} post to library`);
    },
    onError: (e: any) => toast.error(e.message || "Could not save to library"),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_calendar").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setSelected(null);
      toast.success("Post deleted");
    },
    onError: (e: any) => toast.error(e.message || "Could not delete post"),
  });

  const statusColor: Record<string, string> = {
    Generated: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Saved: "bg-green-500/10 text-green-600 border-green-500/20",
    Published: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    Archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <PageHeader
        title="Content Calendar"
        description={`${data.length} post${data.length !== 1 ? "s" : ""} scheduled`}
        actions={
          <>
            <Button variant="outline" disabled={generatePlan.isPending} onClick={() => generatePlan.mutate()}>
              <Sparkles className="size-4" />
              {generatePlan.isPending ? "Generating..." : "Generate 7-day plan"}
            </Button>
            <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
              <DialogTrigger asChild>
                <Button><Plus className="size-4" /> Schedule post</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Schedule content</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label className="text-xs">Topic / Title</Label><Input value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="e.g. 5 tips for solo freelancers" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-xs">Date</Label><Input type="date" value={form.content_date} onChange={(e) => setForm({ ...form, content_date: e.target.value })} /></div>
                    <div><Label className="text-xs">Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{["Generated", "Saved", "Published", "Archived"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div><Label className="text-xs flex items-center gap-1"><Instagram className="size-3" /> Instagram caption</Label><Textarea rows={3} value={form.instagram_caption} onChange={(e) => setForm({ ...form, instagram_caption: e.target.value })} placeholder="Write a caption with hashtags..." /></div>
                  <div><Label className="text-xs flex items-center gap-1"><Linkedin className="size-3" /> LinkedIn post</Label><Textarea rows={3} value={form.linkedin_post} onChange={(e) => setForm({ ...form, linkedin_post: e.target.value })} placeholder="Professional LinkedIn copy..." /></div>
                  <div><Label className="text-xs flex items-center gap-1"><FileText className="size-3" /> Blog opener</Label><Textarea rows={3} value={form.blog_opener} onChange={(e) => setForm({ ...form, blog_opener: e.target.value })} placeholder="Opening paragraph for a blog post..." /></div>
                  <div className="flex justify-end"><Button disabled={!form.topic || create.isPending} onClick={() => create.mutate()}>{create.isPending ? "Saving..." : "Schedule"}</Button></div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {data.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <CalendarDays className="size-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium mb-1">No posts scheduled yet</p>
            <p className="text-sm">Click "Generate 7-day plan" to create a full week of content, or add a post manually.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((p) => (
            <Card
              key={p.id}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all"
              onClick={() => setSelected(p)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="font-medium text-sm leading-snug">{p.topic || "Content idea"}</div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${statusColor[p.status] ?? ""}`}>{p.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {format(parseISO(p.content_date), "EEEE, MMM d yyyy")}
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {p.instagram_caption && <PlatformChip label="Instagram" color="bg-pink-500/10 text-pink-600" />}
                  {p.linkedin_post && <PlatformChip label="LinkedIn" color="bg-blue-600/10 text-blue-700" />}
                  {p.blog_opener && <PlatformChip label="Blog" color="bg-orange-500/10 text-orange-600" />}
                </div>
                {(p.tags ?? []).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(p.tags ?? []).slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Content detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8">{selected.topic || "Content idea"}</DialogTitle>
                <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{format(parseISO(selected.content_date), "EEEE, MMMM d yyyy")}</span>
                    <Badge variant="outline" className={`text-xs ${statusColor[selected.status] ?? ""}`}>{selected.status}</Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    disabled={deletePost.isPending}
                    onClick={() => {
                      if (confirm("Delete this post? This cannot be undone.")) deletePost.mutate(selected.id);
                    }}
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              </DialogHeader>

              <Tabs defaultValue={selected.instagram_caption ? "instagram" : selected.linkedin_post ? "linkedin" : "blog"}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="instagram" disabled={!selected.instagram_caption}>
                    <Instagram className="size-3.5 mr-1.5" /> Instagram
                  </TabsTrigger>
                  <TabsTrigger value="linkedin" disabled={!selected.linkedin_post}>
                    <Linkedin className="size-3.5 mr-1.5" /> LinkedIn
                  </TabsTrigger>
                  <TabsTrigger value="blog" disabled={!selected.blog_opener}>
                    <FileText className="size-3.5 mr-1.5" /> Blog
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="instagram" className="mt-4">
                  <div className="bg-muted/40 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {selected.instagram_caption || "No Instagram caption."}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(selected.instagram_caption ?? ""); toast.success("Copied Instagram caption"); }}>
                      <Copy className="size-3.5" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => saveToLibrary.mutate({ item: selected, platform: "Instagram", content: selected.instagram_caption ?? "" })} disabled={saveToLibrary.isPending || !selected.instagram_caption}>
                      <BookmarkPlus className="size-3.5" /> Save to Library
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="linkedin" className="mt-4">
                  <div className="bg-muted/40 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {selected.linkedin_post || "No LinkedIn post."}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(selected.linkedin_post ?? ""); toast.success("Copied LinkedIn post"); }}>
                      <Copy className="size-3.5" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => saveToLibrary.mutate({ item: selected, platform: "LinkedIn", content: selected.linkedin_post ?? "" })} disabled={saveToLibrary.isPending || !selected.linkedin_post}>
                      <BookmarkPlus className="size-3.5" /> Save to Library
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="blog" className="mt-4">
                  <div className="bg-muted/40 rounded-lg p-4 text-sm whitespace-pre-wrap leading-relaxed">
                    {selected.blog_opener || "No blog opener."}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(selected.blog_opener ?? ""); toast.success("Copied blog opener"); }}>
                      <Copy className="size-3.5" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => saveToLibrary.mutate({ item: selected, platform: "Blog", content: selected.blog_opener ?? "" })} disabled={saveToLibrary.isPending || !selected.blog_opener}>
                      <BookmarkPlus className="size-3.5" /> Save to Library
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlatformChip({ label, color }: { label: string; color: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>;
}
