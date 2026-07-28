import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the caller the 'admin' role if their auth email is on the
 * backend allowlist. Falls back to ADMIN_EMAIL for older environments.
 * Idempotent.
 */
export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = (context.claims?.email as string | undefined)?.toLowerCase().trim();
    if (!email) {
      return { granted: false as const };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: allowlisted, error: allowlistError } = await supabaseAdmin
      .from("admin_authorized_emails")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (allowlistError) throw allowlistError;

    const fallbackAdminEmails = (process.env.ADMIN_EMAIL ?? "")
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    if (!allowlisted && !fallbackAdminEmails.includes(email)) {
      return { granted: false as const };
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "admin" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    if (error) throw error;
    return { granted: true as const };
  });
