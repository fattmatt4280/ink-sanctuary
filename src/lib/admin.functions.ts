import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the caller the 'admin' role if their auth email matches
 * the server-side ADMIN_EMAIL secret. Idempotent.
 */
export const claimAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    if (!adminEmail) throw new Error("ADMIN_EMAIL not configured");
    const email = (context.claims?.email as string | undefined)?.toLowerCase().trim();
    if (!email || email !== adminEmail) {
      return { granted: false as const };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: context.userId, role: "admin" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    if (error) throw error;
    return { granted: true as const };
  });
