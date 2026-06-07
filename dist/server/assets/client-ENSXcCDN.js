import { createClient } from "@supabase/supabase-js";
function createSupabaseClient() {
  const SUPABASE_URL = "https://haeulonsftedrdgsxqpn.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZXVsb25zZnRlZHJkZ3N4cXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzgzMjUsImV4cCI6MjA5NjM1NDMyNX0.tlFjVHg4Fp-fBjXq3ojlBDm5UJJbCjqexFUZd3Y9Y1w";
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : void 0,
      persistSession: true,
      autoRefreshToken: true
    }
  });
}
let _supabase;
const supabase = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  }
});
export {
  supabase as s
};
