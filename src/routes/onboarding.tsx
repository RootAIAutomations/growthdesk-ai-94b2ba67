import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowRight, Building2, Users, MessageSquare, Loader2 } from "lucide-react";
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
  { id: 1, title: "Your business", icon: Building2 },
  { id: 2, title: "Your audience", icon: Users },
  { id: 3, title: "Your voice", icon: MessageSquare },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    business_name: "",
    business_type: "",
    industry: "",
    business_description: "",
    target_audience: "",
    tone: "professional",
  });

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function canProceed() {
    if (step === 1) return form.business_name.trim() && form.business_type.trim() && form.industry;
    if (step === 2) return form.business_description.trim() && form.target_audience.trim();
    return true;
  }

  async function handleFinish() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { ...form, onboarding_complete: true },
    });
    if (error) {
      // If the session is stale or the user no longer exists, sign out cleanly
      const isAuthError = error.message?.toLowerCase().includes("jwt") ||
        error.message?.toLowerCase().includes("session") ||
        error.message?.toLowerCase().includes("user") ||
        error.status === 401 || error.status === 403;
      if (isAuthError) {
        await supabase.auth.signOut();
        navigate({ to: "/login" });
        return;
      }
      toast.error("Could not save your profile. Please try again.");
      setLoading(false);
      return;
    }
    navigate({ to: "/" });
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

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`size-7 rounded-full grid place-items-center text-xs font-bold border-2 transition-colors ${
                  step > s.id ? "bg-primary border-primary text-primary-foreground" :
                  step === s.id ? "border-primary text-primary bg-primary/10" :
                  "border-muted-foreground/30 text-muted-foreground"
                }`}>
                  {step > s.id ? "✓" : s.id}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s.title}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 ml-2 rounded transition-colors ${step > s.id ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Tell us about your business</h2>
                <p className="text-muted-foreground mt-1">This personalises every AI output — drafts, content ideas, tone — to your business specifically.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your name</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => update("full_name", e.target.value)}
                    placeholder="First name is fine"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Business name <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={form.business_name}
                    onChange={e => update("business_name", e.target.value)}
                    placeholder="e.g. Studio by Priya, Vikram Consults"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">What do you do? <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={form.business_type}
                    onChange={e => update("business_type", e.target.value)}
                    placeholder="e.g. Freelance Graphic Designer, Business Coach"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Industry <span className="text-destructive">*</span></label>
                  <select
                    value={form.industry}
                    onChange={e => update("industry", e.target.value)}
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Who do you serve?</h2>
                <p className="text-muted-foreground mt-1">Help the AI understand your clients so outreach and content hit the right note.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">About your business <span className="text-destructive">*</span></label>
                  <textarea
                    value={form.business_description}
                    onChange={e => update("business_description", e.target.value)}
                    placeholder="What do you do, what problem do you solve, what makes you different?"
                    rows={4}
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Your ideal client <span className="text-destructive">*</span></label>
                  <input
                    type="text"
                    value={form.target_audience}
                    onChange={e => update("target_audience", e.target.value)}
                    placeholder="e.g. D2C founders in India, fitness coaches, small restaurant owners"
                    className="w-full px-3 py-2.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-foreground">How do you like to communicate?</h2>
                <p className="text-muted-foreground mt-1">This sets the tone for all AI-written drafts and content.</p>
              </div>

              <div className="space-y-3">
                {TONES.map(t => (
                  <button
                    key={t.value}
                    onClick={() => update("tone", t.value)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border-2 text-left transition-all ${
                      form.tone === t.value
                        ? "border-primary bg-primary/5"
                        : "border-input hover:border-primary/40"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{t.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                    </div>
                    <div className={`size-4 rounded-full border-2 transition-all ${
                      form.tone === t.value ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {loading ? "Setting up..." : "Take me to my workspace"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
