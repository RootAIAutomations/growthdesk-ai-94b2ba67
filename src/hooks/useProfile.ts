import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserProfile {
  full_name: string;
  business_name: string;
  business_type: string;
  business_description: string;
  industry: string;
  target_audience: string;
  tone: string;
}

const DEFAULTS: UserProfile = {
  full_name: "",
  business_name: "",
  business_type: "",
  business_description: "",
  industry: "",
  target_audience: "",
  tone: "professional",
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata || {};
    setProfile({
      full_name: meta.full_name || "",
      business_name: meta.business_name || "",
      business_type: meta.business_type || "",
      business_description: meta.business_description || "",
      industry: meta.industry || "",
      target_audience: meta.target_audience || "",
      tone: meta.tone || "professional",
    });
    setLoading(false);
  }, [user]);

  async function saveProfile(updates: Partial<UserProfile>) {
    setSaving(true);
    const merged = { ...profile, ...updates };
    const { error } = await supabase.auth.updateUser({ data: merged });
    if (!error) setProfile(merged);
    setSaving(false);
    return error;
  }

  // Build a rich business context string for AI prompts
  function getBusinessContext(): string {
    const parts: string[] = [];
    if (profile.business_name) parts.push(`Business: ${profile.business_name}`);
    if (profile.business_type) parts.push(`Type: ${profile.business_type}`);
    if (profile.industry) parts.push(`Industry: ${profile.industry}`);
    if (profile.business_description) parts.push(`About: ${profile.business_description}`);
    if (profile.target_audience) parts.push(`Target audience: ${profile.target_audience}`);
    if (profile.tone) parts.push(`Preferred tone: ${profile.tone}`);
    return parts.length
      ? parts.join(". ")
      : "A solo service provider business helping clients with professional services.";
  }

  return { profile, loading, saving, saveProfile, getBusinessContext };
}
