import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import * as React from "react";
import { useState } from "react";
import { c as cn, P as PageHeader } from "./router-BsMuOcQ9.js";
import { b as buttonVariants, B as Button } from "./button-CVbtLUK5.js";
import { I as Input, L as Label } from "./label-DFuWzPZ_.js";
import { C as Card, B as Badge } from "./badge-CMJlSgS1.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-CsaQ_wBd.js";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-zubmUa2R.js";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { C as CLIENT_STATUSES, s as statusColor } from "./db-IT-o_MWQ.js";
import { T as Textarea } from "./textarea-BcenT5d5.js";
import { s as supabase } from "./client-ENSXcCDN.js";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
import "@radix-ui/react-select";
import "@supabase/supabase-js";
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold", className),
    ...props
  }
));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const Table = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = React.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function ClientForm({
  initial,
  onSubmit,
  submitting,
  onCancel
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    business_type: initial?.business_type ?? "",
    tags: initial?.tags ?? [],
    notes: initial?.notes ?? "",
    status: initial?.status ?? "Lead",
    last_contact_date: initial?.last_contact_date ?? null,
    follow_up_date: initial?.follow_up_date ?? null
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));
  return /* @__PURE__ */ jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
          last_contact_date: form.last_contact_date || null,
          follow_up_date: form.follow_up_date || null
        });
      },
      className: "space-y-4",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsx(Field, { label: "Name *", children: /* @__PURE__ */ jsx(Input, { required: true, value: form.name, onChange: (e) => setForm({ ...form, name: e.target.value }) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxs(Select, { value: form.status ?? "Lead", onValueChange: (v) => setForm({ ...form, status: v }), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsx(SelectContent, { children: CLIENT_STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s)) })
          ] }) }),
          /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx(Input, { type: "email", value: form.email ?? "", onChange: (e) => setForm({ ...form, email: e.target.value }) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsx(Input, { value: form.phone ?? "", onChange: (e) => setForm({ ...form, phone: e.target.value }) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Business type", children: /* @__PURE__ */ jsx(Input, { value: form.business_type ?? "", onChange: (e) => setForm({ ...form, business_type: e.target.value }) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Tags (comma-separated)", children: /* @__PURE__ */ jsx(Input, { value: tagsInput, onChange: (e) => setTagsInput(e.target.value), placeholder: "vip, referral" }) }),
          /* @__PURE__ */ jsx(Field, { label: "Last contact date", children: /* @__PURE__ */ jsx(Input, { type: "date", value: form.last_contact_date ?? "", onChange: (e) => setForm({ ...form, last_contact_date: e.target.value }) }) }),
          /* @__PURE__ */ jsx(Field, { label: "Follow-up date", children: /* @__PURE__ */ jsx(Input, { type: "date", value: form.follow_up_date ?? "", onChange: (e) => setForm({ ...form, follow_up_date: e.target.value }) }) })
        ] }),
        /* @__PURE__ */ jsx(Field, { label: "Notes", children: /* @__PURE__ */ jsx(Textarea, { rows: 3, value: form.notes ?? "", onChange: (e) => setForm({ ...form, notes: e.target.value }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
          onCancel && /* @__PURE__ */ jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" }),
          /* @__PURE__ */ jsx(Button, { type: "submit", disabled: submitting, children: submitting ? "Saving…" : "Save client" })
        ] })
      ]
    }
  );
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsx(Label, { className: "text-xs font-medium", children: label }),
    children
  ] });
}
function ClientsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const {
    data: clients = [],
    isLoading
  } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("clients").select("*").order("updated_at", {
        ascending: false
      });
      if (error) throw error;
      return data;
    }
  });
  const addMutation = useMutation({
    mutationFn: async (input) => {
      const {
        error
      } = await supabase.from("clients").insert(input);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["clients"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setAddOpen(false);
      toast.success("Client added");
    },
    onError: (e) => toast.error(e.message)
  });
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      input
    }) => {
      const {
        error
      } = await supabase.from("clients").update(input).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["clients"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setEditing(null);
      toast.success("Client updated");
    },
    onError: (e) => toast.error(e.message)
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["clients"]
      });
      qc.invalidateQueries({
        queryKey: ["dashboard"]
      });
      setDeleting(null);
      toast.success("Client deleted");
    },
    onError: (e) => toast.error(e.message)
  });
  const filtered = clients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q) || (c.business_type ?? "").toLowerCase().includes(q);
  });
  return /* @__PURE__ */ jsxs("div", { className: "p-6 md:p-8 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(PageHeader, { title: "Clients", description: `${clients.length} total`, actions: /* @__PURE__ */ jsxs(Dialog, { open: addOpen, onOpenChange: setAddOpen, children: [
      /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { children: [
        /* @__PURE__ */ jsx(Plus, { className: "size-4" }),
        " Add client"
      ] }) }),
      /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "New client" }) }),
        /* @__PURE__ */ jsx(ClientForm, { onSubmit: (d) => addMutation.mutate(d), submitting: addMutation.isPending, onCancel: () => setAddOpen(false) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx(Input, { className: "pl-9", placeholder: "Search by name, email, business...", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "w-full sm:w-48", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: "All statuses" }),
          CLIENT_STATUSES.map((s) => /* @__PURE__ */ jsx(SelectItem, { value: s, children: s }, s))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Card, { className: "overflow-hidden p-0", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs(Table, { children: [
      /* @__PURE__ */ jsx(TableHeader, { children: /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableHead, { children: "Name" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Contact" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Business" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Tags" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Last contact" }),
        /* @__PURE__ */ jsx(TableHead, { children: "Follow-up" }),
        /* @__PURE__ */ jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxs(TableBody, { children: [
        isLoading && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center text-muted-foreground py-8", children: "Loading…" }) }),
        !isLoading && filtered.length === 0 && /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, { colSpan: 8, className: "text-center text-muted-foreground py-8", children: 'No clients found. Click "Add client" to get started.' }) }),
        filtered.map((c) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Link, { to: "/clients/$id", params: {
            id: c.id
          }, className: "font-medium hover:text-primary hover:underline", children: c.name }) }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("div", { children: c.email }),
            /* @__PURE__ */ jsx("div", { children: c.phone })
          ] }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: c.business_type ?? "—" }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1", children: (c.tags ?? []).map((t) => /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-xs", children: t }, t)) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Badge, { variant: "outline", className: statusColor(c.status), children: c.status }) }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: c.last_contact_date ? format(parseISO(c.last_contact_date), "MMM d, yyyy") : "—" }),
          /* @__PURE__ */ jsx(TableCell, { className: "text-sm", children: c.follow_up_date ? format(parseISO(c.follow_up_date), "MMM d, yyyy") : "—" }),
          /* @__PURE__ */ jsxs(TableCell, { className: "text-right", children: [
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => setEditing(c), children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" }) }),
            /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", onClick: () => setDeleting(c), children: /* @__PURE__ */ jsx(Trash2, { className: "size-4 text-destructive" }) })
          ] })
        ] }, c.id))
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx(Dialog, { open: !!editing, onOpenChange: (o) => !o && setEditing(null), children: /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-2xl", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Edit client" }) }),
      editing && /* @__PURE__ */ jsx(ClientForm, { initial: editing, submitting: updateMutation.isPending, onSubmit: (d) => updateMutation.mutate({
        id: editing.id,
        input: d
      }), onCancel: () => setEditing(null) })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialog, { open: !!deleting, onOpenChange: (o) => !o && setDeleting(null), children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxs(AlertDialogTitle, { children: [
          "Delete ",
          deleting?.name,
          "?"
        ] }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { children: "This will also remove their messages, follow-ups, and drafts." })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { children: "Cancel" }),
        /* @__PURE__ */ jsx(AlertDialogAction, { onClick: () => deleting && deleteMutation.mutate(deleting.id), children: "Delete" })
      ] })
    ] }) })
  ] });
}
export {
  ClientsPage as component
};
