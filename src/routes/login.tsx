import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { GrowthDeskLogo } from "@/components/GrowthDeskLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary/90 via-primary to-primary/70 flex-col justify-between p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <GrowthDeskLogo size={40} />
          <span className="text-xl font-bold">GrowthDesk AI</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Everything your service<br />business needs, in one place.
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Clients, outreach, follow-ups, content — GrowthDesk brings it all together so you can focus on doing great work.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Client CRM", desc: "Full history, every conversation" },
              { label: "AI Outreach", desc: "Personalised WhatsApp drafts" },
              { label: "Content Calendar", desc: "A week of posts, in seconds" },
              { label: "Follow-Ups", desc: "No lead falls through the cracks" },
            ].map((f) => (
              <div key={f.label} className="bg-white/10 rounded-lg p-3">
                <div className="font-medium text-sm">{f.label}</div>
                <div className="text-xs text-primary-foreground/70 mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-primary-foreground/50">© 2026 GrowthDesk AI</div>
      </div>

      {/* Right panel — sign in form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center">
            <GrowthDeskLogo size={32} />
            <span className="font-semibold text-lg">GrowthDesk AI</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full pl-9 pr-10 py-2.5 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <>Sign In <ArrowRight className="size-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New to GrowthDesk?{" "}
            <Link to="/onboarding" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
