import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Lock, Mail, User, Eye, EyeOff, Building2, Users, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const INDUSTRIES = [
  "Graphic Design", "Web Development", "Digital Marketing", "Copywriting",
  "Consulting", "Coaching", "Photography", "Video Production",
  "Social Media Management", "SEO / Content", "Finance / Accounting",
  "Legal Services", "Architecture / Interior Design", "HR / Recruitment",
  "Education / Tutoring", "Health & Wellness", "E-commerce", "Other",
];

const TONES = [
  { value: "professional", label: "Professional", desc: "Polished and business-focused" },
  { value: "friendly", label: "Friendly", desc: "Approachable and conversational" },
  { value: "bold", label: "Bold", desc: "Direct and confident" },
  { value: "warm", label: "Warm", desc: "Genuine and relationship-first" },
  { value: "witty", label: "Witty", desc: "Creative with personality" },
];

const STEPS = [
  { id: 1, title: "Your account", icon: User },
  { id: 2, title: "Your business", icon: Building2 },
  { id: 3, title: "Your audience", icon: Users },
  { id: 4, title: "Your voice", icon: MessageSquare },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Credentials (step 1)
  const [credentials, setCredentials] = useState({ full_name: "", email: "", password: "" });

  // Business profile (steps 2-4)
  const [profile, setProfile] = useState({
    business_name: "",
    business_type: "",
    industry: "",
    business_description: "",
    target_audience: "",
    tone: "professional",
  });

  // If user is already signed in and onboarding complete, skip to dashboard
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.onboarding_complete) {
        navigate({ to: "/" });
      } else if (user) {
        // Already signed in but not complete — skip to step 2
        setStep(2);
      }
    });
  }, [navigate]);

  function updateCreds(field: string, value: string) {
    setCredentials(c => ({ ...c, [field]: value }));
  }
  function updateProfile(field: string, value: string) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  function canProceed(): boolean {
    if (step === 1) return !!(credentials.full_name.trim() && credentials.email.trim() && credentials.password.length >= 6);
    if (step === 2) return !!(profile.business_name.trim() && profile.business_type.trim() && profile.industry);
    if (step === 3) return !!(profile.business_description.trim() && profile.target_audience.trim());
    return true;
  }

  async function handleStep1() {
    setLoading(true);
    try {
      // Sign up
      const { error: signUpError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: { data: { full_name: credentials.full_name } },
      });
      if (signUpError) throw signUpError;

      // Auto sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (signInError) throw signInError;

      setStep(2);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not create account. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFinish() {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: credentials.full_name,
          ...profile,
          onboarding_complete: true,
        },
      });
      if (error) throw error;
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Could not save your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (step === 1) { handleStep1(); return; }
    if (step === 4) { handleFinish(); return; }
    setStep(s => s + 1);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="size-8 rounded-lg bg-primary grid place-items-center text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <span className="font-semibold text-foreground">GrowthDesk AI</span>
        </div>

        {/* Progress steps */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`size-7 rounded-full grid place-items-center text-xs font-bold border-2 shrink-0 transition-colors ${
                  step > s.id ? "bg-primary border-primary text-primary-foreground" :
                  step === s.id ? "border-primary text-primary bg-primary/10" :
                  "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step >= s.id ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 rounded transition-colors ${step > s.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="space-y-6">

          {/* Step 1: Create account */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
                <p className="text-muted-foreground mt-1">Already have one?{" "}
                  <button onClick={() => navigate({ to: "/login" })} className="text-primary hover:underline font-medium">Sign in</button>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your name <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={credentials.full_name}
                      onChange={e => updateCreds("full_name", e.target.value)}
                      placeholder="First name is fine"
                      className="w-full pl-9 pr-4 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={credentials.email}
                      onChange={e => updateCreds("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-9 pr-4 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Password <span className="text-destructive">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={e => updateCreds("password", e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-9 pr-10 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Business basics */}
          {step === 2 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Tell us about your business</h2>
                <p className="text-muted-foreground mt-1">This personalises every AI output — drafts, content ideas, tone — to your business specifically.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Business name <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={profile.business_name}
                    onChange={e => updateProfile("business_name", e.target.value)}
                    placeholder="e.g. Studio by Priya, Vikram Consults"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">What do you do? <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={profile.business_type}
                    onChange={e => updateProfile("business_type", e.target.value)}
                    placeholder="e.g. Freelance Graphic Designer, Business Coach"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Industry <span className="text-destructive">*</span></label>
                  <select
                    value={profile.industry}
                    onChange={e => updateProfile("industry", e.target.value)}
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3: Audience */}
          {step === 3 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Who do you serve?</h2>
                <p className="text-muted-foreground mt-1">Help the AI understand your clients so outreach and content hit the right note.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">About your business <span className="text-destructive">*</span></label>
                  <textarea
                    value={profile.business_description}
                    onChange={e => updateProfile("business_description", e.target.value)}
                    placeholder="What do you do, what problem do you solve, what makes you different?"
                    rows={4}
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your ideal client <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={profile.target_audience}
                    onChange={e => updateProfile("target_audience", e.target.value)}
                    placeholder="e.g. D2C founders in India, fitness coaches, small restaurant owners"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 4: Tone */}
          {step === 4 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">How do you like to communicate?</h2>
                <p className="text-muted-foreground mt-1">This sets the tone for all AI-written drafts and content.</p>
              </div>

              <div className="space-y-3">
                {TONES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => updateProfile("tone", t.value)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border-2 text-left transition-all ${
                      profile.tone === t.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{t.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                    </div>
                    <div className={`size-4 rounded-full border-2 shrink-0 transition-all ${
                      profile.tone === t.value ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={loading}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed() || loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : step === 4 ? (
                <><Sparkles className="size-4" /> Take me to my workspace</>
              ) : step === 1 ? (
                <>Create account <ArrowRight className="size-4" /></>
              ) : (
                <>Continue <ArrowRight className="size-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
