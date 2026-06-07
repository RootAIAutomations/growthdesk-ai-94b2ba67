import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import { B as Button } from "./button-CVbtLUK5.js";
import { L as Label, I as Input } from "./label-DFuWzPZ_.js";
import { T as Textarea } from "./textarea-BcenT5d5.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-CsaQ_wBd.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-zubmUa2R.js";
import { Sparkles, Plus, CalendarDays } from "lucide-react";
import { format, startOfWeek, parseISO } from "date-fns";
import { toast } from "sonner";
import { s as supabase } from "./client-ENSXcCDN.js";
import { r as requestContentPlan } from "./automation-SlvBVgvE.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
function CalendarPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    topic: "",
    content_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
    status: "Generated",
    instagram_caption: "",
    linkedin_post: "",
    blog_opener: ""
  });
  const {
    data = []
  } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("content_calendar").select("*").order("content_date");
      return data2 ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("content_calendar").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["calendar"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setOpen(false);
      setForm({
        topic: "",
        content_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
        status: "Generated",
        instagram_caption: "",
        linkedin_post: "",
        blog_opener: ""
      });
      toast.success("Post scheduled");
    }
  });
  const generatePlan = useMutation({
    mutationFn: async () => {
      const weekStartDate = format(startOfWeek(/* @__PURE__ */ new Date(), {
        weekStartsOn: 1
      }), "yyyy-MM-dd");
      const result = await requestContentPlan({
        weekStartDate
      });
      if (!result.posts?.length) throw new Error("Automation did not return content posts.");
      const {
        error
      } = await supabase.from("content_calendar").insert(result.posts);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["calendar"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      toast.success("Content plan generated");
    },
    onError: (e) => toast.error(e.message || "Could not generate content plan")
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Content Calendar", description: `${data.length} posts`, actions: /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs(Button, { variant: "outline", disabled: generatePlan.isPending, onClick: () => generatePlan.mutate(), children: [
        /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }),
        " ",
        generatePlan.isPending ? "Generating..." : "Generate 7-day plan"
      ] }),
      /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
          /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
          " Schedule post"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Schedule content" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Topic" }),
              /* @__PURE__ */ jsx(Input, { value: form.topic, onChange: (e) => setForm({
                ...form,
                topic: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Date" }),
              /* @__PURE__ */ jsx(Input, { type: "date", value: form.content_date, onChange: (e) => setForm({
                ...form,
                content_date: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Status" }),
              /* @__PURE__ */ jsxs(Select, { value: form.status, onValueChange: (v) => setForm({
                ...form,
                status: v
              }), children: [
                /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
                /* @__PURE__ */ jsx(SelectContent, { children: ["Generated", "Saved", "Published", "Archived"].map((p) => /* @__PURE__ */ jsx(SelectItem, { value: p, children: p }, p)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Instagram caption" }),
              /* @__PURE__ */ jsx(Textarea, { rows: 2, value: form.instagram_caption, onChange: (e) => setForm({
                ...form,
                instagram_caption: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "LinkedIn post" }),
              /* @__PURE__ */ jsx(Textarea, { rows: 2, value: form.linkedin_post, onChange: (e) => setForm({
                ...form,
                linkedin_post: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Blog opener" }),
              /* @__PURE__ */ jsx(Textarea, { rows: 2, value: form.blog_opener, onChange: (e) => setForm({
                ...form,
                blog_opener: e.target.value
              }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { disabled: !form.topic, onClick: () => create.mutate(), children: "Schedule" }) })
          ] })
        ] })
      ] })
    ] }) }),
    data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-10 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(CalendarDays, { className: "size-8 mx-auto mb-2 opacity-50" }),
      "No posts scheduled yet."
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-3", children: data.map((p) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: p.topic || "Content idea" }),
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: p.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground flex gap-3", children: [
        /* @__PURE__ */ jsx("span", { children: "Weekly content" }),
        /* @__PURE__ */ jsx("span", { children: format(parseISO(p.content_date), "MMM d, yyyy") })
      ] }),
      p.linkedin_post && /* @__PURE__ */ jsx("p", { className: "text-sm mt-2 text-muted-foreground line-clamp-2", children: p.linkedin_post })
    ] }) }, p.id)) })
  ] });
}
export {
  CalendarPage as component
};
