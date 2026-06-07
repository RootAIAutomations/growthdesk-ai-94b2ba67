import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouterState, Link, createRootRouteWithContext, useRouter, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { Sparkles, LayoutDashboard, Users, CalendarClock, MessageSquareText, CalendarDays, Library, Settings } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Toaster as Toaster$1 } from "sonner";
const appCss = "/assets/styles-CxB_6Uch.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/follow-ups", label: "Follow-Ups", icon: CalendarClock },
  { to: "/outreach", label: "Outreach Drafts", icon: MessageSquareText },
  { to: "/calendar", label: "Content Calendar", icon: CalendarDays },
  { to: "/library", label: "Content Library", icon: Library },
  { to: "/settings", label: "Settings", icon: Settings }
];
function AppLayout({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to, exact) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex bg-background", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center gap-2 px-6 border-b border-sidebar-border", children: [
        /* @__PURE__ */ jsx("div", { className: "size-8 rounded-lg bg-primary grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "size-4" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold text-sidebar-foreground", children: "GrowthDesk AI" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 px-3 py-4 space-y-1", children: nav.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.to, item.exact);
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: item.to,
            className: cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            ),
            children: [
              /* @__PURE__ */ jsx(Icon, { className: "size-4" }),
              item.label
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsx("div", { className: "px-6 py-4 text-xs text-muted-foreground border-t border-sidebar-border", children: "GrowthDesk AI" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("header", { className: "md:hidden h-14 flex items-center gap-2 px-4 border-b bg-card", children: [
        /* @__PURE__ */ jsx("div", { className: "size-7 rounded-md bg-primary grid place-items-center text-primary-foreground", children: /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold", children: "GrowthDesk AI" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "md:hidden flex overflow-x-auto gap-1 px-3 py-2 border-b bg-card", children: nav.map((item) => {
        const active = isActive(item.to, item.exact);
        return /* @__PURE__ */ jsx(
          Link,
          {
            to: item.to,
            className: cn(
              "px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap",
              active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: item.label
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 min-w-0 overflow-x-hidden", children })
    ] })
  ] });
}
function PageHeader({
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 mb-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold tracking-tight text-foreground", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: actions })
  ] });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$8 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GrowthDesk AI — CRM for Solopreneurs" },
      { name: "description", content: "Manage clients, generate AI outreach drafts, track follow-ups, and create content calendars from one intelligent workspace." },
      { name: "author", content: "GrowthDesk AI" },
      { property: "og:title", content: "GrowthDesk AI — CRM for Solopreneurs" },
      { property: "og:description", content: "Manage clients, generate AI outreach drafts, track follow-ups, and create content calendars from one intelligent workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "GrowthDesk AI — CRM for Solopreneurs" },
      { name: "twitter:description", content: "Manage clients, generate AI outreach drafts, track follow-ups, and create content calendars from one intelligent workspace." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/egCe9rOSLkNkQ2OdGCdtqR85WBs2/social-images/social-1780804747854-image.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/egCe9rOSLkNkQ2OdGCdtqR85WBs2/social-images/social-1780804747854-image.webp" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$8.useRouteContext();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(AppLayout, { children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$7 = () => import("./settings-BjSP4K--.js");
const Route$7 = createFileRoute("/settings")({
  head: () => ({
    meta: [{
      title: "Settings — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./outreach-rt7iwueR.js");
const Route$6 = createFileRoute("/outreach")({
  head: () => ({
    meta: [{
      title: "Outreach Drafts — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./library-B6Suuv8c.js");
const Route$5 = createFileRoute("/library")({
  head: () => ({
    meta: [{
      title: "Content Library — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./follow-ups-D9b32Psf.js");
const Route$4 = createFileRoute("/follow-ups")({
  head: () => ({
    meta: [{
      title: "Follow-Ups — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./calendar-DeydeYmE.js");
const Route$3 = createFileRoute("/calendar")({
  head: () => ({
    meta: [{
      title: "Content Calendar — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./index-DI2D39RT.js");
const Route$2 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./clients.index-DKXMeOxL.js");
const Route$1 = createFileRoute("/clients/")({
  head: () => ({
    meta: [{
      title: "Clients — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./clients._id-BUSeG3Tv.js");
const Route = createFileRoute("/clients/$id")({
  head: () => ({
    meta: [{
      title: "Client — GrowthDesk AI"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SettingsRoute = Route$7.update({
  id: "/settings",
  path: "/settings",
  getParentRoute: () => Route$8
});
const OutreachRoute = Route$6.update({
  id: "/outreach",
  path: "/outreach",
  getParentRoute: () => Route$8
});
const LibraryRoute = Route$5.update({
  id: "/library",
  path: "/library",
  getParentRoute: () => Route$8
});
const FollowUpsRoute = Route$4.update({
  id: "/follow-ups",
  path: "/follow-ups",
  getParentRoute: () => Route$8
});
const CalendarRoute = Route$3.update({
  id: "/calendar",
  path: "/calendar",
  getParentRoute: () => Route$8
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$8
});
const ClientsIndexRoute = Route$1.update({
  id: "/clients/",
  path: "/clients/",
  getParentRoute: () => Route$8
});
const ClientsIdRoute = Route.update({
  id: "/clients/$id",
  path: "/clients/$id",
  getParentRoute: () => Route$8
});
const rootRouteChildren = {
  IndexRoute,
  CalendarRoute,
  FollowUpsRoute,
  LibraryRoute,
  OutreachRoute,
  SettingsRoute,
  ClientsIdRoute,
  ClientsIndexRoute
};
const routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  PageHeader as P,
  Route as R,
  cn as c,
  router as r
};
