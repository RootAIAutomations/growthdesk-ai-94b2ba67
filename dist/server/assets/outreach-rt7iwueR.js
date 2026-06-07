import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import { B as Button } from "./button-CVbtLUK5.js";
import { MessageSquareText, Copy } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { s as supabase } from "./client-ENSXcCDN.js";
import "react";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@supabase/supabase-js";
function OutreachPage() {
  const {
    data: drafts = []
  } = useQuery({
    queryKey: ["all-drafts"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("outreach_drafts").select("*, clients(id, name)").order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Outreach Drafts", description: "All AI-generated and manual outreach messages." }),
    drafts.length === 0 && /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-10 text-center text-muted-foreground", children: [
      /* @__PURE__ */ jsx(MessageSquareText, { className: "size-8 mx-auto mb-2 opacity-50" }),
      "No outreach drafts yet. Generate one from a client's page."
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: drafts.map((d) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          d.clients ? /* @__PURE__ */ jsx(Link, { to: "/clients/$id", params: {
            id: d.clients.id
          }, className: "font-medium hover:underline", children: d.clients.name }) : /* @__PURE__ */ jsx("span", { className: "font-medium text-muted-foreground", children: "Untitled" }),
          /* @__PURE__ */ jsx(Badge, { variant: "outline", children: d.channel }),
          /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: d.status })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: format(parseISO(d.created_at), "MMM d, yyyy p") })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm whitespace-pre-wrap mb-3", children: d.edited_text || d.draft_text }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
        navigator.clipboard.writeText(d.edited_text || d.draft_text);
        toast.success("Copied");
      }, children: [
        /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
        " Copy"
      ] })
    ] }) }, d.id)) })
  ] });
}
export {
  OutreachPage as component
};
