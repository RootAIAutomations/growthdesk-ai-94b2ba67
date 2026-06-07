import { useState, useEffect } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use getUser() which verifies the token server-side.
    // getSession() reads from local storage and will return a "valid" session
    // even for users that have been deleted from Supabase — getUser() catches that.
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error || !user) {
        // Token is invalid or user no longer exists — clear the stale session
        supabase.auth.signOut();
        setUser(null);
        setSession(null);
      } else {
        setUser(user);
        // Still grab session for the token itself
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, session, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
}
