import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Building2, Sparkles, Shield, Trash2, Save, Loader2, LogOut, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth, signOut } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — GrowthDesk AI" }] }),
  component: SettingsPage,
});

const INDUSTRIES = [
  "Graphic Design", "Web Development", "Digital Marketing", "Copywriting",
  "Consulting", "Coaching", "Photography", "Video Production",
  "Social Media Management", "SEO / Content", "Finance / Accounting",
  "Legal Services", "Architecture / Interior Design", "HR / Recruitment",
  "Education / Tutoring", "Health & Wellness", "E-commerce", "Other",
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & Conversational" },
  { value: "bold", label: "Bold & Direct" },
  { value: "warm", label: "Warm & Personal" },
  { value: "witty", label: "Witty & Creative" },
];

function SettingsPage() {
  const { user } = useAuth();
  const { profile, saving, saveProfile } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState<typeof profile | null>(null);
  const current = form ?? profile;

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(field: string, value: string) {
    setForm({ ...current, [field]: value });
    setSaved(false);
  }

  async function handleSave() {
    const error = await saveProfile(current);
    if (error) {
      toast.error("Failed to save — " + error.message);
    } else {
      setSaved(true);
      setForm(null);
      toast.success("Profile saved");
      setTimeout(() => setSaved(false), 3000);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    try {
      // Clear all user data first
      await Promise.all([
        supabase.from("content_library").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("content_calendar").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("outreach_drafts").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("follow_up_schedule").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("message_log").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
        supabase.from("clients").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      ]);
      await signOut();
      navigate({ to: "/login" });
      toast.success("Account deleted");
    } catch {
      toast.error("Could not delete account. Please contact support.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your profile, business details, and account."
        actions={
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
            {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <CheckCircle className="size-4" /> : <Save className="size-4" />}
            {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
          </Button>
        }
      />

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="size-4 text-primary" /> Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={current.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="size-4 text-primary" /> Business Profile
          </CardTitle>
          <CardDescription>
            This is used to personalise every AI prompt — outreach drafts, content ideas, and tone — specifically for your business.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Business name</Label>
              <Input value={current.business_name} onChange={(e) => update("business_name", e.target.value)} placeholder="e.g. Studio by Priya" />
            </div>
            <div className="space-y-1.5">
              <Label>Business type</Label>
              <Input value={current.business_type} onChange={(e) => update("business_type", e.target.value)} placeholder="e.g. Freelance Graphic Designer" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Industry</Label>
            <Select value={current.industry} onValueChange={(v) => update("industry", v)}>
              <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>About your business</Label>
            <Textarea
              value={current.business_description}
              onChange={(e) => update("business_description", e.target.value)}
              placeholder="What do you do, who do you help, what makes you different?"
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Target audience</Label>
            <Input value={current.target_audience} onChange={(e) => update("target_audience", e.target.value)} placeholder="e.g. D2C founders, small restaurants, fitness coaches" />
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="size-4 text-primary" /> AI Preferences
          </CardTitle>
          <CardDescription>Set the tone and voice for all AI-generated content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Communication tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => update("tone", t.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    current.tone === t.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-input hover:border-primary/50"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Preview: </span>
            {current.tone === "professional" && "Your drafts will sound polished and business-focused."}
            {current.tone === "friendly" && "Your drafts will feel approachable and easy to read."}
            {current.tone === "bold" && "Your drafts will be direct, confident, and to the point."}
            {current.tone === "warm" && "Your drafts will feel genuine and relationship-first."}
            {current.tone === "witty" && "Your drafts will have personality, humour, and creative edge."}
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="size-4 text-muted-foreground" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <div className="text-sm font-medium">Account status</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <Badge variant="outline" className="text-success border-success/40 bg-success/10">Active</Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b">
            <div className="text-sm font-medium">Sign out</div>
            <Button variant="outline" size="sm" className="gap-2" onClick={async () => { await signOut(); navigate({ to: "/login" }); }}>
              <LogOut className="size-3.5" /> Sign out
            </Button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium text-destructive">Delete account</div>
              <div className="text-xs text-muted-foreground">Permanently removes your account and all data.</div>
            </div>
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="size-3.5" /> Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">Delete your account</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete your account and all data — clients, drafts, content, follow-ups. This cannot be undone.
                  </p>
                  <div className="space-y-1.5">
                    <Label>Type <span className="font-mono font-bold">DELETE</span> to confirm</Label>
                    <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={deleteConfirm !== "DELETE" || deleting}
                    onClick={handleDeleteAccount}
                  >
                    {deleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />}
                    Permanently delete account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
