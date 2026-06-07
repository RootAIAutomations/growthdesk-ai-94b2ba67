import { jsxs, jsx } from "react/jsx-runtime";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import { B as Button } from "./button-CVbtLUK5.js";
import { L as Label, I as Input } from "./label-DFuWzPZ_.js";
import { T as Textarea } from "./textarea-BcenT5d5.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-CsaQ_wBd.js";
import { Plus, Library, Copy } from "lucide-react";
import { toast } from "sonner";
import { s as supabase } from "./client-ENSXcCDN.js";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@supabase/supabase-js";
function LibraryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    platform: "Instagram",
    content: "",
    tags: ""
  });
  const {
    data = []
  } = useQuery({
    queryKey: ["library"],
    queryFn: async () => {
      const {
        data: data2
      } = await supabase.from("content_library").select("*").order("created_at", {
        ascending: false
      });
      return data2 ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("content_library").insert({
        title: form.title,
        platform: form.platform,
        content: form.content,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean)
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["library"]
      });
      setOpen(false);
      setForm({
        title: "",
        platform: "Instagram",
        content: "",
        tags: ""
      });
      toast.success("Saved to library");
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Content Library", description: `${data.length} items`, actions: /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
        " Add item"
      ] }) }),
      /* @__PURE__ */ jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New library item" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Title" }),
            /* @__PURE__ */ jsx(Input, { value: form.title, onChange: (e) => setForm({
              ...form,
              title: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Platform" }),
            /* @__PURE__ */ jsx(Input, { value: form.platform, onChange: (e) => setForm({
              ...form,
              platform: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Content" }),
            /* @__PURE__ */ jsx(Textarea, { rows: 6, value: form.content, onChange: (e) => setForm({
              ...form,
              content: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Tags (comma-separated)" }),
            /* @__PURE__ */ jsx(Input, { value: form.tags, onChange: (e) => setForm({
              ...form,
              tags: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { disabled: !form.title, onClick: () => create.mutate(), children: "Save" }) })
        ] })
      ] })
    ] }) }),
    data.length === 0 ? /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-10 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Library, { className: "size-8 mx-auto mb-2 opacity-50" }),
      "Your content library is empty."
    ] }) }) : /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-3", children: data.map((it) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: it.title }),
        it.platform && /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: it.platform })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap text-muted-foreground line-clamp-4 mb-2", children: it.content }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mb-2", children: (it.tags ?? []).map((t) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: t }, t)) }),
      it.content && /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
        navigator.clipboard.writeText(it.content);
        toast.success("Copied");
      }, children: [
        /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
        " Copy"
      ] })
    ] }) }, it.id)) })
  ] });
}
export {
  LibraryPage as component
};
