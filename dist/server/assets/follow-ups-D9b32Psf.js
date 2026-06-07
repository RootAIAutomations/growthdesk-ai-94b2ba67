import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { P as PageHeader } from "./router-BsMuOcQ9.js";
import { C as Card, a as CardHeader, b as CardTitle, B as Badge, c as CardContent } from "./badge-CMJlSgS1.js";
import { B as Button } from "./button-CVbtLUK5.js";
import { L as Label, I as Input } from "./label-DFuWzPZ_.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-zubmUa2R.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-CsaQ_wBd.js";
import { Plus, AlertTriangle, CalendarClock, CalendarRange } from "lucide-react";
import { format, startOfDay, endOfWeek, isBefore, parseISO, isToday, isWithinInterval, addDays } from "date-fns";
import { toast } from "sonner";
import { s as supabase } from "./client-ENSXcCDN.js";
import "clsx";
import "tailwind-merge";
import "class-variance-authority";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
import "@radix-ui/react-dialog";
import "@supabase/supabase-js";
function FollowUpsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const {
    data: items = []
  } = useQuery({
    queryKey: ["followups-all"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("follow_up_schedule").select("*, clients(id, name)").order("due_date");
      return data ?? [];
    }
  });
  const {
    data: clients = []
  } = useQuery({
    queryKey: ["clients-min"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("clients").select("id, name").order("name");
      return data ?? [];
    }
  });
  const toggle = useMutation({
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
        queryKey: ["followups-all"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
    }
  });
  const [form, setForm] = useState({
    client_id: "",
    title: "",
    due_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
    priority: "Medium"
  });
  const create = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("follow_up_schedule").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["followups-all"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setOpen(false);
      setForm({
        client_id: "",
        title: "",
        due_date: format(/* @__PURE__ */ new Date(), "yyyy-MM-dd"),
        priority: "Medium"
      });
      toast.success("Follow-up created");
    }
  });
  const today = startOfDay(/* @__PURE__ */ new Date());
  const weekEnd = endOfWeek(today);
  const active = items.filter((i) => i.status !== "Completed");
  const overdue = active.filter((i) => isBefore(parseISO(i.due_date), today));
  const dueToday = active.filter((i) => isToday(parseISO(i.due_date)));
  const dueWeek = active.filter((i) => {
    const d = parseISO(i.due_date);
    return !isToday(d) && !isBefore(d, today) && isWithinInterval(d, {
      start: addDays(today, 1),
      end: weekEnd
    });
  });
  const later = active.filter((i) => {
    const d = parseISO(i.due_date);
    return !isBefore(d, today) && !isToday(d) && !isWithinInterval(d, {
      start: addDays(today, 1),
      end: weekEnd
    });
  });
  const completed = items.filter((i) => i.status === "Completed").slice(0, 10);
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Follow-Ups", description: `${active.length} active`, actions: /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
        " New follow-up"
      ] }) }),
      /* @__PURE__ */ jsxs(DialogContent, { children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New follow-up task" }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Client" }),
            /* @__PURE__ */ jsxs(Select, { value: form.client_id, onValueChange: (v) => setForm({
              ...form,
              client_id: v
            }), children: [
              /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select client" }) }),
              /* @__PURE__ */ jsx(SelectContent, { children: clients.map((c) => /* @__PURE__ */ jsx(SelectItem, { value: c.id, children: c.name }, c.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Task" }),
            /* @__PURE__ */ jsx(Input, { value: form.title, onChange: (e) => setForm({
              ...form,
              title: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx(Label, { className: "text-xs", children: "Due date" }),
            /* @__PURE__ */ jsx(Input, { type: "date", value: form.due_date, onChange: (e) => setForm({
              ...form,
              due_date: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { disabled: !form.client_id || !form.title, onClick: () => create.mutate(), children: "Create" }) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(Section, { title: "Overdue", icon: AlertTriangle, color: "text-destructive", items: overdue, onToggle: (f) => toggle.mutate(f) }),
      /* @__PURE__ */ jsx(Section, { title: "Due today", icon: CalendarClock, color: "text-warning-foreground", items: dueToday, onToggle: (f) => toggle.mutate(f) }),
      /* @__PURE__ */ jsx(Section, { title: "Due this week", icon: CalendarRange, color: "text-primary", items: dueWeek, onToggle: (f) => toggle.mutate(f) }),
      /* @__PURE__ */ jsx(Section, { title: "Later", icon: CalendarRange, color: "text-muted-foreground", items: later, onToggle: (f) => toggle.mutate(f) }),
      completed.length > 0 && /* @__PURE__ */ jsx(Section, { title: "Recently completed", icon: CalendarClock, color: "text-success", items: completed, onToggle: (f) => toggle.mutate(f) })
    ] })
  ] });
}
function Section({
  title,
  icon: Icon,
  color,
  items,
  onToggle
}) {
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsx(Icon, { className: `size-4 ${color}` }),
      " ",
      title,
      " ",
      /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: items.length })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-2", children: [
      items.length === 0 && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground py-3 text-center", children: "Nothing here." }),
      items.map((f) => /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between p-3 rounded-md border", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.status === "Completed", onChange: () => onToggle(f), className: "size-4" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: `text-sm font-medium ${f.status === "Completed" ? "line-through text-muted-foreground" : ""}`, children: f.title }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
            f.clients ? /* @__PURE__ */ jsx(Link, { to: "/clients/$id", params: {
              id: f.clients.id
            }, className: "hover:underline", children: f.clients.name }) : "—",
            " · ",
            "Due ",
            format(parseISO(f.due_date), "MMM d, yyyy")
          ] })
        ] })
      ] }) }, f.id))
    ] })
  ] });
}
export {
  FollowUpsPage as component
};
