import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, MessageSquareText, MessageCircle, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase, type Outreach } from "@/lib/db";

export const Route = createFileRoute("/outreach")({
  head: () => ({ meta: [{ title: "Outreach Drafts — GrowthDesk AI" }] }),
  component: OutreachPage,
});

const CHANNELS = ["All", "WhatsApp", "Email", "LinkedIn", "Other"];

const statusColor: Record<string, string> = {
  Draft: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Reviewed: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Copied: "bg-green-500/10 text-green-600 border-green-500/20",
  Archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

const channelColor: Record<string, string> = {
  WhatsApp: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Email: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  LinkedIn: "bg-blue-700/10 text-blue-800 border-blue-700/20",
  Other: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function OutreachPage() {
  const qc = useQueryClient();
  const [channelFilter, setChannelFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { data: drafts = [] } = useQuery({
    queryKey: ["all-drafts"],
    queryFn: async () => {
      const { data } = await supabase.from("outreach_drafts").select("*, clients(id, name, phone)").order("generated_at", { ascending: false });
      return (data ?? []) as (Outreach & { clients: { id: string; name: string; phone: string | null } | null })[];
    },
  });

  const markCopied = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("outreach_drafts").update({ status: "Copied", copied_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["all-drafts"] }),
  });

  const deleteDraft = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("outreach_drafts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["all-drafts"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Draft deleted");
    },
    onError: (e: any) => toast.error(e.message || "Could not delete draft"),
  });

  const filtered = drafts.filter((d) => {
    const matchChannel = channelFilter === "All" || d.channel === channelFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || (d.clients?.name ?? "").toLowerCase().includes(q) || (d.draft_text ?? "").toLowerCase().includes(q) || (d.edited_text ?? "").toLowerCase().includes(q);
    return matchChannel && matchSearch;
  });

  const copyDraft = (d: typeof drafts[0]) => {
    navigator.clipboard.writeText(d.edited_text || d.draft_text);
    toast.success("Copied to clipboard");
    if (d.status === "Draft") markCopied.mutate(d.id);
  };

  const openWhatsApp = (d: typeof drafts[0]) => {
    const phone = d.clients?.phone?.replace(/\D/g, "");
    const text = encodeURIComponent(d.edited_text || d.draft_text);
    if (phone) {
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
    } else {
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
    if (d.status === "Draft") markCopied.mutate(d.id);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader
        title="Outreach Drafts"
        description={`${drafts.length} draft${drafts.length !== 1 ? "s" : ""}`}
      />

      {/* Search + channel filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by client or message…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                channelFilter === ch
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            <MessageSquareText className="size-8 mx-auto mb-2 opacity-50" />
            {drafts.length === 0 ? "No outreach drafts yet. Generate one from a client's page." : "No drafts match your filter."}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filtered.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {d.clients ? (
                    <Link to="/clients/$id" params={{ id: d.clients.id }} className="font-semibold hover:underline">{d.clients.name}</Link>
                  ) : (
                    <span className="font-semibold text-muted-foreground">Untitled</span>
                  )}
                  <Badge variant="outline" className={`text-xs ${channelColor[d.channel] ?? ""}`}>{d.channel}</Badge>
                  <Badge variant="outline" className={`text-xs ${statusColor[d.status] ?? ""}`}>{d.status}</Badge>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{format(parseISO(d.generated_at), "MMM d, yyyy")}</span>
              </div>

              <div className="bg-muted/40 rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed mb-3">
                {d.edited_text || d.draft_text}
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={() => copyDraft(d)}>
                  <Copy className="size-3.5" /> Copy
                </Button>
                {d.channel === "WhatsApp" && (
                  <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-500/30 hover:bg-emerald-50" onClick={() => openWhatsApp(d)}>
                    <MessageCircle className="size-3.5" /> Open in WhatsApp
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto text-destructive border-destructive/30 hover:bg-destructive/10"
                  disabled={deleteDraft.isPending}
                  onClick={() => {
                    if (confirm("Delete this draft? This cannot be undone.")) deleteDraft.mutate(d.id);
                  }}
                >
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
