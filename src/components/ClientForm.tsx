import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CLIENT_STATUSES, type Client, type ClientInsert } from "@/lib/db";

export function ClientForm({
  initial,
  onSubmit,
  submitting,
  onCancel,
}: {
  initial?: Partial<Client>;
  onSubmit: (data: ClientInsert) => void;
  submitting?: boolean;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<ClientInsert>({
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    business_type: initial?.business_type ?? "",
    tags: initial?.tags ?? [],
    notes: initial?.notes ?? "",
    status: initial?.status ?? "Lead",
    last_contact_date: initial?.last_contact_date ?? null,
    follow_up_date: initial?.follow_up_date ?? null,
  });
  const [tagsInput, setTagsInput] = useState((initial?.tags ?? []).join(", "));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
          last_contact_date: form.last_contact_date || null,
          follow_up_date: form.follow_up_date || null,
        });
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name *">
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Status">
          <Select value={form.status ?? "Lead"} onValueChange={(v) => setForm({ ...form, status: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CLIENT_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Email">
          <Input type="email" value={form.email ?? ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        <Field label="Business type">
          <Input value={form.business_type ?? ""} onChange={(e) => setForm({ ...form, business_type: e.target.value })} />
        </Field>
        <Field label="Tags (comma-separated)">
          <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="vip, referral" />
        </Field>
        <Field label="Last contact date">
          <Input type="date" value={form.last_contact_date ?? ""} onChange={(e) => setForm({ ...form, last_contact_date: e.target.value })} />
        </Field>
        <Field label="Follow-up date">
          <Input type="date" value={form.follow_up_date ?? ""} onChange={(e) => setForm({ ...form, follow_up_date: e.target.value })} />
        </Field>
      </div>
      <Field label="Notes">
        <Textarea rows={3} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </Field>
      <div className="flex justify-end gap-2">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save client"}</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
