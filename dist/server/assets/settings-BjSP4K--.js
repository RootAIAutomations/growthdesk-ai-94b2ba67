import { jsxs, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, B as Badge } from "./badge-CMJlSgS1.js";
import { Sparkles, Database, Shield } from "lucide-react";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "react";
import "clsx";
import "tailwind-merge";
import "sonner";
import "class-variance-authority";
function SettingsPage() {
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Settings", description: "Manage workspace preferences and service connections." }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-4 text-primary" }),
          " Workspace"
        ] }) }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx(Row, { label: "Product", value: "GrowthDesk AI" }),
          /* @__PURE__ */ jsx(Row, { label: "Status", value: /* @__PURE__ */ jsx(Badge, { children: "Live workspace" }) }),
          /* @__PURE__ */ jsx(Row, { label: "Account type", value: "Solo business" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Database, { className: "size-4 text-info" }),
          " Data"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "space-y-2 text-sm text-muted-foreground", children: /* @__PURE__ */ jsx("p", { children: "Client records, follow-ups, outreach drafts, and content assets are stored securely in your connected backend." }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Shield, { className: "size-4 text-warning-foreground" }),
          " Automation"
        ] }) }),
        /* @__PURE__ */ jsx(CardContent, { className: "text-sm text-muted-foreground space-y-1", children: /* @__PURE__ */ jsx("p", { children: "AI outreach, content generation, and messaging integrations can be connected as your workflow grows." }) })
      ] })
    ] })
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1.5 border-b last:border-0", children: [
    /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsx("span", { children: value })
  ] });
}
export {
  SettingsPage as component
};
