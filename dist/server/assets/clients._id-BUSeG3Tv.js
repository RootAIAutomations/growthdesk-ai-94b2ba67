import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { c as cn, R as Route, P as PageHeader } from "./router-BsMuOcQ9.js";
import { B as Button } from "./button-CVbtLUK5.js";
import { L as Label, I as Input } from "./label-DFuWzPZ_.js";
import { T as Textarea } from "./textarea-BcenT5d5.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-zubmUa2R.js";
import { ArrowLeft, Sparkles, Copy, MessageCircle, Mail, Phone, Briefcase, Send, Plus } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { s as statusColor } from "./db-IT-o_MWQ.js";
import { a as requestOutreachDraft } from "./automation-SlvBVgvE.js";
import { s as supabase } from "./client-ENSXcCDN.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
function ClientDetail() {
  const {
    id
  } = Route.useParams();
  const qc = useQueryClient();
  const {
    data: client
  } = useQuery({
    queryKey: ["client", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clients").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: messages = []
  } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("message_log").select("*").eq("client_id", id).order("interaction_date", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const {
    data: followUps = []
  } = useQuery({
    queryKey: ["followups", id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("follow_up_schedule").select("*").eq("client_id", id).order("due_date");
      return data ?? [];
    }
  });
  const {
    data: drafts = []
  } = useQuery({
    queryKey: ["drafts", id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("outreach_drafts").select("*").eq("client_id", id).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const [msgContent, setMsgContent] = useState("");
  const [msgChannel, setMsgChannel] = useState("WhatsApp");
  const [msgDir, setMsgDir] = useState("Outbound");
  const addMessage = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("message_log").insert({
        client_id: id,
        message: msgContent,
        summary: msgContent,
        message_type: msgChannel,
        direction: msgDir
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["messages", id]
      });
      setMsgContent("");
      toast.success("Message logged");
    }
  });
  const [task, setTask] = useState("");
  const [due, setDue] = useState(format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"));
  const addFollowUp = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("follow_up_schedule").insert({
        client_id: id,
        title: task,
        due_date: due
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["followups", id]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setTask("");
      toast.success("Follow-up added");
    }
  });
  const toggleFollowUp = useMutation({
    mutationFn: async (f) => {
      const isCompleted = f.status === "Completed";
      const {
        error
      } = await supabase.from("follow_up_schedule").update({
        status: isCompleted ? "Pending" : "Completed",
        completed_at: isCompleted ? null : (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", f.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["followups", id]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
    }
  });
  const generateDraft = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error("Client is still loading.");
      const result = await requestOutreachDraft({
        client,
        messages,
        followUps
      });
      if (result.saved_draft_id) return;
      const draftText = result.draft_text || result.edited_text;
      if (!draftText) throw new Error("Automation did not return a draft.");
      const {
        error
      } = await supabase.from("outreach_drafts").insert({
        client_id: id,
        channel: result.channel || "WhatsApp",
        draft_text: draftText,
        edited_text: result.edited_text || null,
        status: result.status || "Draft",
        prompt_context: result.prompt_context || {}
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["drafts", id]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      toast.success("Outreach draft generated");
    },
    onError: (e) => toast.error(e.message || "Could not generate outreach draft")
  });
  const copyDraft = (text) => {
    if (text) navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const openWhatsApp = () => {
    if (!client?.phone) return toast.error("No phone number on file");
    const phone = client.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}`, "_blank");
  };
  if (!client) return /* @__PURE__ */ jsx("div", { className: "p-8 text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/clients", className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { className: "size-4" }),
      " All clients"
    ] }),
    /* @__PURE__ */ jsx(PageHeader, { title: client.name, description: client.business_type ?? void 0, actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", disabled: generateDraft.isPending, onClick: () => generateDraft.mutate(), children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }),
        " ",
        generateDraft.isPending ? "Generating..." : "Generate Outreach Draft"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => copyDraft(drafts[0]?.edited_text || drafts[0]?.draft_text), children: [
        /* @__PURE__ */ jsx(Copy, { className: "size-4" }),
        " Copy Draft"
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: openWhatsApp, children: [
        /* @__PURE__ */ jsx(MessageCircle, { className: "size-4" }),
        " Open WhatsApp"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "lg:col-span-1", children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Client info" }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: statusColor(client.status), children: client.status }) }),
          /* @__PURE__ */ jsx(Info, { icon: Mail, label: "Email", value: client.email }),
          /* @__PURE__ */ jsx(Info, { icon: Phone, label: "Phone", value: client.phone }),
          /* @__PURE__ */ jsx(Info, { icon: Briefcase, label: "Business", value: client.business_type }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Tags" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1 mt-1", children: [
              (client.tags ?? []).length === 0 && /* @__PURE__ */ jsx("span", { className: "text-muted-foreground text-xs", children: "—" }),
              (client.tags ?? []).map((t) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: t }, t))
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Last contact" }),
            /* @__PURE__ */ jsx("div", { children: client.last_contact_date ? format(parseISO(client.last_contact_date), "PPP") : "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Follow-up" }),
            /* @__PURE__ */ jsx("div", { children: client.follow_up_date ? format(parseISO(client.follow_up_date), "PPP") : "—" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
            /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap text-sm mt-1 text-foreground/80", children: client.notes || "—" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "conversation", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "grid grid-cols-3 w-full", children: [
          /* @__PURE__ */ jsx(TabsTrigger, { value: "conversation", children: "Conversation" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "followups", children: "Follow-ups" }),
          /* @__PURE__ */ jsx(TabsTrigger, { value: "outreach", children: "Outreach" })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "conversation", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Log a conversation" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxs(Select, { value: msgDir, onValueChange: setMsgDir, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "Outbound", children: "Outbound" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Inbound", children: "Inbound" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(Select, { value: msgChannel, onValueChange: setMsgChannel, children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { className: "w-36", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsx(SelectItem, { value: "WhatsApp", children: "WhatsApp" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Email", children: "Email" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Call", children: "Call" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Meeting", children: "Meeting" }),
                    /* @__PURE__ */ jsx(SelectItem, { value: "Other", children: "Other" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Textarea, { rows: 2, placeholder: "What was said?", value: msgContent, onChange: (e) => setMsgContent(e.target.value) }),
              /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { size: "sm", disabled: !msgContent.trim() || addMessage.isPending, onClick: () => addMessage.mutate(), children: [
                /* @__PURE__ */ jsx(Send, { className: "size-3.5" }),
                " Log"
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            messages.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No conversation history yet." }),
            messages.map((m) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
                  /* @__PURE__ */ jsx(Badge, { variant: m.direction === "Inbound" ? "secondary" : "default", className: "text-xs", children: m.direction }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: m.message_type })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: format(parseISO(m.interaction_date), "MMM d, p") })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap", children: m.summary || m.message })
            ] }) }, m.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "followups", className: "space-y-4", children: [
          /* @__PURE__ */ jsxs(Card, { children: [
            /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-sm", children: "Add follow-up task" }) }),
            /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Input, { placeholder: "Task (e.g. send quote)", value: task, onChange: (e) => setTask(e.target.value) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsx(Input, { type: "date", value: due, onChange: (e) => setDue(e.target.value) }),
                /* @__PURE__ */ jsxs(Button, { disabled: !task.trim() || addFollowUp.isPending, onClick: () => addFollowUp.mutate(), children: [
                  /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
                  " Add"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            followUps.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No follow-ups scheduled." }),
            followUps.map((f) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.status === "Completed", onChange: () => toggleFollowUp.mutate(f), className: "size-4" }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: `text-sm ${f.status === "Completed" ? "line-through text-muted-foreground" : ""}`, children: f.title }),
                  /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                    "Due ",
                    format(parseISO(f.due_date), "MMM d, yyyy")
                  ] })
                ] })
              ] }),
              f.status === "Completed" && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: "Done" })
            ] }) }, f.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxs(TabsContent, { value: "outreach", className: "space-y-2", children: [
          drafts.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "No outreach drafts yet." }),
          drafts.map((d) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
              /* @__PURE__ */ jsx(Badge, { variant: "outline", children: d.channel }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: format(parseISO(d.created_at), "MMM d, yyyy") })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap mb-2", children: d.edited_text || d.draft_text }),
            /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => copyDraft(d.edited_text || d.draft_text), children: [
              /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
              " Copy"
            ] })
          ] }) }, d.id))
        ] })
      ] }) })
    ] })
  ] });
}
function Info({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
    /* @__PURE__ */ jsx(Icon, { className: "size-4 text-muted-foreground mt-0.5" }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsx("div", { className: "text-sm", children: value || "—" })
    ] })
  ] });
}
export {
  ClientDetail as component
};
