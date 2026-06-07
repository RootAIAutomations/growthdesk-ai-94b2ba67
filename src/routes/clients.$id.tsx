import { createFileRoute, Link } from "@tanstack/react-router";
import { getUserId } from "@/lib/getUserId";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Copy, MessageCircle, Send, Plus, Mail, Phone, Briefcase, Trash2, Mic, MicOff, SendHorizonal } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { supabase, statusColor, type Client, type Message, type FollowUp, type Outreach } from "@/lib/db";
import { requestOutreachDraft, sendEmailDraft } from "@/lib/automation";
import { useProfile } from "@/hooks/useProfile";
import { useVoiceTranscription } from "@/hooks/useVoiceTranscription";

export const Route = createFileRoute("/clients/$id")({
  head: () => ({ meta: [{ title: "Client — GrowthDesk AI" }] }),
  component: ClientDetail,
});

function ClientDetail() {
  const { id } = Route.useParams();
  const { getBusinessContext } = useProfile();
  const qc = useQueryClient();

  const { data: client } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").eq("id", id).single();
      if (error) throw error;
      return data as Client;
    },
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const { data } = await supabase.from("message_log").select("*").eq("client_id", id).order("interaction_date", { ascending: false });
      return (data ?? []) as Message[];
    },
  });

  const { data: followUps = [] } = useQuery({
    queryKey: ["followups", id],
    queryFn: async () => {
      const { data } = await supabase.from("follow_up_schedule").select("*").eq("client_id", id).order("due_date");
      return (data ?? []) as FollowUp[];
    },
  });

  const { data: drafts = [] } = useQuery({
    queryKey: ["drafts", id],
    queryFn: async () => {
      const { data } = await supabase.from("outreach_drafts").select("*").eq("client_id", id).order("generated_at", { ascending: false });
      return (data ?? []) as Outreach[];
    },
  });

  const [msgContent, setMsgContent] = useState("");
  const [msgChannel, setMsgChannel] = useState("WhatsApp");
  const [msgDir, setMsgDir] = useState("Outbound");

  const voice = useVoiceTranscription((text) => setMsgContent((prev) => prev ? `${prev} ${text}` : text));
  const addMessage = useMutation({
    mutationFn: async () => {
      const user_id = await getUserId();
      const { error } = await supabase.from("message_log").insert({ client_id: id, message: msgContent, summary: msgContent, message_type: msgChannel, direction: msgDir, user_id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["messages", id] }); setMsgContent(""); toast.success("Message logged"); },
  });

  const [activeTab, setActiveTab] = useState("conversation");
  const [task, setTask] = useState("");
  const [due, setDue] = useState(format(new Date(), "yyyy-MM-dd"));
  const addFollowUp = useMutation({
    mutationFn: async () => {
      const user_id = await getUserId();
      const { error } = await supabase.from("follow_up_schedule").insert({ client_id: id, title: task, due_date: due, user_id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["followups", id] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); setTask(""); toast.success("Follow-up added"); },
  });

  const toggleFollowUp = useMutation({
    mutationFn: async (f: FollowUp) => {
      const isCompleted = f.status === "Completed";
      const { error } = await supabase.from("follow_up_schedule").update({ status: isCompleted ? "Pending" : "Completed", completed_at: isCompleted ? null : new Date().toISOString() }).eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["followups", id] }); qc.invalidateQueries({ queryKey: ["dashboard"] }); },
  });

  const generateDraft = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error("Client is still loading.");

      const result = await requestOutreachDraft({ client, messages, followUps, businessContext: getBusinessContext() });

      if (result.saved_draft_id) return;

      const user_id = await getUserId();

      // Multi-channel response: insert all drafts at once
      if (result.drafts && result.drafts.length > 0) {
        const rows = result.drafts.map((d) => ({
          client_id: id,
          channel: d.channel || "WhatsApp",
          draft_text: d.draft_text,
          edited_text: d.edited_text || null,
          status: "Draft",
          prompt_context: null,
          user_id,
        }));
        const { error } = await supabase.from("outreach_drafts").insert(rows);
        if (error) throw error;
        return result.drafts.length;
      }

      // Legacy single-draft fallback
      const draftText = result.draft_text || result.edited_text;
      if (!draftText) throw new Error("No draft. Response: " + JSON.stringify(result));
      const { error } = await supabase.from("outreach_drafts").insert({
        client_id: id,
        channel: result.channel || "WhatsApp",
        draft_text: draftText,
        edited_text: result.edited_text || null,
        status: result.status || "Draft",
        prompt_context: (result.prompt_context || null) as any,
        user_id,
      });
      if (error) throw error;
      return 1;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ["drafts", id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      const label = count && count > 1 ? `${count} drafts generated (WhatsApp, Email, LinkedIn)` : "Outreach draft generated";
      toast.success(label);
      setActiveTab("outreach");
    },
    onError: (e: any) => toast.error(e.message || "Could not generate outreach draft"),
  });

  const deleteDraft = useMutation({
    mutationFn: async (draftId: string) => {
      const { error } = await supabase.from("outreach_drafts").delete().eq("id", draftId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["drafts", id] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Draft deleted");
    },
    onError: (e: any) => toast.error(e.message || "Could not delete draft"),
  });
  const { profile } = useProfile();

  const emailDraft = useMutation({
    mutationFn: async ({ draftText }: { draftText: string }) => {
      if (!client?.email) throw new Error("No email address on file for this client.");
      await sendEmailDraft({
        clientName: client.name,
        clientEmail: client.email,
        draftText,
        businessName: profile?.business_name,
        senderName: profile?.full_name,
      });
    },
    onSuccess: () => toast.success("Email sent successfully"),
    onError: (e: any) => toast.error(e.message || "Could not send email"),
  });

  const copyDraft = (text?: string) => {
    if (text) navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const openWhatsApp = (draftText?: string) => {
    if (!client?.phone) return toast.error("No phone number on file");
    const phone = client.phone.replace(/\D/g, "");
    const text = draftText || drafts[0]?.edited_text || drafts[0]?.draft_text;
    const query = text ? `?text=${encodeURIComponent(text)}` : "";
    window.open(`https://wa.me/${phone}${query}`, "_blank");
  };

  if (!client) return <div className="p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"><ArrowLeft className="size-4" /> All clients</Link>

      <PageHeader
        title={client.name}
        description={client.business_type ?? undefined}
        actions={
          <>
            <Button variant="outline" disabled={generateDraft.isPending} onClick={() => generateDraft.mutate()}>
              <Sparkles className="size-4" /> {generateDraft.isPending ? "Generating..." : "Generate Outreach Draft"}
            </Button>
            <Button variant="outline" onClick={() => copyDraft(drafts[0]?.edited_text || drafts[0]?.draft_text)}><Copy className="size-4" /> Copy Draft</Button>
            <Button onClick={() => openWhatsApp()}><MessageCircle className="size-4" /> Open WhatsApp</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base">Client info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><Badge variant="outline" className={statusColor(client.status)}>{client.status}</Badge></div>
            <Info icon={Mail} label="Email" value={client.email} />
            <Info icon={Phone} label="Phone" value={client.phone} />
            <Info icon={Briefcase} label="Business" value={client.business_type} />
            <div>
              <Label className="text-xs text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {(client.tags ?? []).length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                {(client.tags ?? []).map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Last contact</Label>
              <div>{client.last_contact_date ? format(parseISO(client.last_contact_date), "PPP") : "—"}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Follow-up</Label>
              <div>{client.follow_up_date ? format(parseISO(client.follow_up_date), "PPP") : "—"}</div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Notes</Label>
              <div className="whitespace-pre-wrap text-sm mt-1 text-foreground/80">{client.notes || "—"}</div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="followups">Follow-ups</TabsTrigger>
              <TabsTrigger value="outreach">Outreach</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Log a conversation</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Select value={msgDir} onValueChange={setMsgDir}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Outbound">Outbound</SelectItem>
                        <SelectItem value="Inbound">Inbound</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={msgChannel} onValueChange={setMsgChannel}>
                      <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Call">Call</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Textarea rows={2} placeholder="What was said? Or tap the mic to speak…" value={msgContent} onChange={(e) => setMsgContent(e.target.value)} className="pr-10" />
                    {voice.isSupported && (
                      <button
                        type="button"
                        onClick={voice.state === "listening" ? voice.stop : voice.start}
                        className={`absolute right-2 top-2 p-1.5 rounded-md transition-colors ${voice.state === "listening" ? "bg-red-100 text-red-600 animate-pulse" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                        title={voice.state === "listening" ? "Stop recording" : "Speak to fill"}
                      >
                        {voice.state === "listening" ? <MicOff className="size-4" /> : <Mic className="size-4" />}
                      </button>
                    )}
                  </div>
                  {voice.errorMsg && <p className="text-xs text-destructive">{voice.errorMsg}</p>}
                  <div className="flex justify-end">
                    <Button size="sm" disabled={!msgContent.trim() || addMessage.isPending} onClick={() => addMessage.mutate()}>
                      <Send className="size-3.5" /> Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No conversation history yet.</p>}
                {messages.map((m) => (
                  <Card key={m.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-2 items-center">
                          <Badge variant={m.direction === "Inbound" ? "secondary" : "default"} className="text-xs">{m.direction}</Badge>
                          <span className="text-xs text-muted-foreground">{m.message_type}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{format(parseISO(m.interaction_date), "MMM d, p")}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{m.summary || m.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="followups" className="space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-sm">Add follow-up task</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Input placeholder="Task (e.g. send quote)" value={task} onChange={(e) => setTask(e.target.value)} />
                  <div className="flex gap-2">
                    <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
                    <Button disabled={!task.trim() || addFollowUp.isPending} onClick={() => addFollowUp.mutate()}><Plus className="size-4" /> Add</Button>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                {followUps.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No follow-ups scheduled.</p>}
                {followUps.map((f) => (
                  <Card key={f.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={f.status === "Completed"} onChange={() => toggleFollowUp.mutate(f)} className="size-4" />
                        <div>
                          <div className={`text-sm ${f.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>{f.title}</div>
                          <div className="text-xs text-muted-foreground">Due {format(parseISO(f.due_date), "MMM d, yyyy")}</div>
                        </div>
                      </div>
                      {f.status === "Completed" && <Badge variant="secondary">Done</Badge>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="outreach" className="space-y-2">
              {drafts.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No outreach drafts yet.</p>}
              {drafts.map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{d.channel}</Badge>
                      <span className="text-xs text-muted-foreground">{format(parseISO(d.generated_at), "MMM d, yyyy")}</span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 text-sm whitespace-pre-wrap mb-3 leading-relaxed">{d.edited_text || d.draft_text}</div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" onClick={() => copyDraft(d.edited_text || d.draft_text)}><Copy className="size-3.5" /> Copy</Button>
                      {client.email && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-blue-600 border-blue-500/30 hover:bg-blue-50"
                          disabled={emailDraft.isPending}
                          onClick={() => emailDraft.mutate({ draftText: d.edited_text || d.draft_text })}
                        >
                          <SendHorizonal className="size-3.5" /> Send Email
                        </Button>
                      )}
                      {d.channel === "WhatsApp" && (
                        <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-500/30 hover:bg-emerald-50" onClick={() => openWhatsApp(d.edited_text || d.draft_text)}>
                          <MessageCircle className="size-3.5" /> Open in WhatsApp
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive/30 hover:bg-destructive/10"
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-4 text-muted-foreground mt-0.5" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm">{value || "—"}</div>
      </div>
    </div>
  );
}
