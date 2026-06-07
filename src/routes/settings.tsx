import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Database, Shield } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — GrowthDesk AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <PageHeader title="Settings" description="Manage workspace preferences and service connections." />

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles className="size-4 text-primary" /> Workspace</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Product" value="GrowthDesk AI" />
            <Row label="Workspace" value={<Badge>Live workspace</Badge>} />
            <Row label="Account type" value="Solo business" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Database className="size-4 text-info" /> Data</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Client records, follow-ups, outreach drafts, and content assets are stored securely in your connected backend.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="size-4 text-warning-foreground" /> Automation</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>AI outreach, content generation, and messaging integrations can be connected as your workflow grows.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
