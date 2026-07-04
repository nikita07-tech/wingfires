import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Vendor Sign In · Wing Fires" },
      { name: "description", content: "Sign in or create a vendor account on Wing Fires to submit quotes on live RFQs from airlines, MROs, and brokers worldwide." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/vendor" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/vendor",
            data: { company_name: company, contact_name: email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
      navigate({ to: "/vendor" });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/vendor" });
    if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
    if (result.redirected) return;
    navigate({ to: "/vendor" });
  }

  return (
    <div className="min-h-screen bg-hero relative overflow-hidden grid place-items-center px-4 py-16">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <BrandLogo size={44} subtitle="Aircraft Parts Supplier" />
        </Link>

        <div className="glass-strong rounded-2xl p-7">
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 mb-6">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                  mode === m ? "bg-gradient-to-br from-electric to-electric-glow text-navy-deep" : "text-silver hover:text-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create vendor account"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field label="Company name" value={company} onChange={setCompany} placeholder="Acme Aviation Ltd." required />
            )}
            <Field label="Work email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" required />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-3 text-sm font-semibold text-navy-deep disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-silver-dim">
            <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={onGoogle}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-medium transition"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs text-silver-dim">
            <Link to="/" className="hover:text-foreground">← Back to Wing Fires</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-3 text-sm placeholder:text-silver-dim/70 focus:outline-none focus:border-electric focus:bg-white/10 transition"
      />
    </label>
  );
}
