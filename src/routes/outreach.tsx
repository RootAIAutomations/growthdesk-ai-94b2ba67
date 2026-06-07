import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, MessageSquareText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase, type Outreach } from "@/lib/db";

export const Route = createFileRoute("/outreach")({
  head: () => ({ meta: [{ title: "Outreach Drafts — GrowthDesk AI" }] }),
  component: OutreachPage,
});

function OutreachPage() {
  const { data: drafts = [] } = useQuery({
    queryKey: ["all-drafts"],
    queryFn: async () => {
      const { data } = await supabase.from("outreach_drafts").select("*, clients(id, name)").order("created_at", { ascending: false });
      return (data ?? []) as (Outreach & { clients: { id: string; name: string } | null })[];
    },
  });

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <PageHeader title="Outreach Drafts" description="All AI-generated and manual outreach messages." />
      {drafts.length === 0 && (
        <Card><CardContent className="p-10 text-center text-muted-foreground">
          <MessageSquareText className="size-8 mx-auto mb-2 opacity-50" />
          No outreach drafts yet. Generate one from a client's page.
        </CardContent></Card>
      )}
      <div className="space-y-3">
        {drafts.map((d) => (
          <Card key={d.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {d.clients ? (
                    <Link to="/clients/$id" params={{ id: d.clients.id }} className="font-medium hover:underline">{d.clients.name}</Link>
                  ) : <span className="font-medium text-muted-foreground">Untitled</span>}
                  <Badge variant="outline">{d.channel}</Badge>
                  <Badge variant="secondary">{d.status}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">{format(parseISO(d.created_at), "MMM d, yyyy p")}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap mb-3">{d.edited_text || d.draft_text}</p>
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(d.edited_text || d.draft_text); toast.success("Copied"); }}>
                <Copy className="size-3.5" /> Copy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
