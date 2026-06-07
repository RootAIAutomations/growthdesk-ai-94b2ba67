import { supabase } from "@/integrations/supabase/client";

export async function getUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("You must be signed in to do that");
  return user.id;
}
