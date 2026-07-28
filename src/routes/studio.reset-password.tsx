import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/studio/reset-password")({
  ssr: false,
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase auto-consumes the recovery token from the URL hash on load.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords don't match.");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setInfo("Password updated. Redirecting…");
      setTimeout(() => navigate({ to: "/studio" }), 1200);
    } catch (e: any) {
      setErr(e.message ?? "Update failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground mb-4">
          Studio
        </div>
        <h1 className="font-serif italic text-4xl mb-8">Set a new password.</h1>

        {!ready && (
          <p className="text-xs text-muted-foreground mb-4">
            Waiting for recovery link… open this page from the reset email.
          </p>
        )}

        <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">New password</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-border px-3 py-3 mb-4 text-sm focus:outline-none focus:border-foreground"
        />
        <label className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">Confirm</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-background border border-border px-3 py-3 mb-6 text-sm focus:outline-none focus:border-foreground"
        />
        {err && <p className="text-xs text-destructive mb-4">{err}</p>}
        {info && <p className="text-xs text-muted-foreground mb-4">{info}</p>}
        <button
          type="submit"
          disabled={busy || !ready}
          className="w-full bg-foreground text-background py-3 text-sm uppercase tracking-[0.25em] disabled:opacity-50"
        >
          {busy ? "…" : "Update password"}
        </button>
      </form>
    </div>
  );
}
