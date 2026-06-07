import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type ClientInsert = Database["public"]["Tables"]["clients"]["Insert"];
export type ClientUpdate = Database["public"]["Tables"]["clients"]["Update"];
export type Message = Database["public"]["Tables"]["message_log"]["Row"];
export type FollowUp = Database["public"]["Tables"]["follow_up_schedule"]["Row"];
export type Outreach = Database["public"]["Tables"]["outreach_drafts"]["Row"];
export type ContentItem = Database["public"]["Tables"]["content_calendar"]["Row"];
export type LibraryItem = Database["public"]["Tables"]["content_library"]["Row"];
export type ClientStatus = Database["public"]["Enums"]["client_status"];

export const CLIENT_STATUSES: ClientStatus[] = ["Lead", "Active", "Follow-Up", "Won", "Lost"];

export const statusColor = (s: ClientStatus) => {
  switch (s) {
    case "Lead": return "bg-info/15 text-info border-info/30";
    case "Active": return "bg-primary/15 text-primary border-primary/30";
    case "Follow-Up": return "bg-warning/20 text-warning-foreground border-warning/40";
    case "Won": return "bg-success/15 text-success border-success/30";
    case "Lost": return "bg-destructive/15 text-destructive border-destructive/30";
  }
};

export { supabase };
