import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { claimAdminRole } from "@/lib/admin.functions";
import { useServerFn } from "@tanstack/react-start";

export const Route = createFileRoute("/studio")({
  ssr: false,
  component: StudioLayout,
});

function StudioLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const claim = useServerFn(claimAdminRole);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await claim({});
        if (cancelled) return;
        if (res.granted) {
          setIsAdmin(true);
          return;
        }
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();
        if (!cancelled) setIsAdmin(!!data);
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session, claim]);

  if (!checked) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-xs uppercase tracking-[0.3em]">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <StudioLogin />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/studio" className="text-[10px] font-semibold uppercase tracking-[0.3em]">
            Studio
          </Link>
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {session.user.email}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
            View site
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/studio" });
            }}
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </div>

      {isAdmin === null ? (
        <div className="p-12 text-muted-foreground text-xs uppercase tracking-[0.3em]">Checking access…</div>
      ) : !isAdmin ? (
        <div className="p-12 max-w-lg">
          <h1 className="font-serif italic text-3xl mb-4">Not authorized.</h1>
          <p className="text-sm text-muted-foreground">
            This account is signed in but doesn't have admin access to this studio.
          </p>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}

function StudioLogin() {
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    setInfo(null);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/studio` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/studio/reset-password`,
        });
        if (error) throw error;
        setInfo("Check your email for a password reset link.");
      }
    } catch (e: any) {
      setErr(e.message ?? "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const title = mode === "in" ? "Sign in." : mode === "up" ? "Create account." : "Reset password.";
  const cta = mode === "in" ? "Sign in" : mode === "up" ? "Create account" : "Send reset link";

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
          Studio
        </div>
        <h1 className="font-serif italic text-4xl mb-8">{title}</h1>
        <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border px-3 py-3 mb-4 text-sm focus:outline-none focus:border-foreground"
        />
        {mode !== "forgot" && (
          <>
            <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border px-3 py-3 mb-6 text-sm focus:outline-none focus:border-foreground"
            />
          </>
        )}
        {err && <p className="text-xs text-destructive mb-4">{err}</p>}
        {info && <p className="text-xs text-muted-foreground mb-4">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-foreground text-background py-3 text-sm uppercase tracking-[0.25em] disabled:opacity-50"
        >
          {busy ? "…" : cta}
        </button>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              setMode(mode === "in" ? "up" : "in");
              setErr(null);
              setInfo(null);
            }}
            className="w-full text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            {mode === "up" ? "Have an account?" : "Need an account?"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode(mode === "forgot" ? "in" : "forgot");
              setErr(null);
              setInfo(null);
            }}
            className="w-full text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
          >
            {mode === "forgot" ? "Back to sign in" : "Forgot password?"}
          </button>
        </div>
      </form>
    </div>
  );
}
