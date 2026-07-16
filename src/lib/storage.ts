import { supabase } from "@/integrations/supabase/client";

const BUCKET = "site-images";
const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year

const cache = new Map<string, { url: string; expires: number }>();

/**
 * Resolve a storage path or URL into a displayable URL.
 * - Full URLs pass through.
 * - Paths like "artists/abc.jpg" get a long-lived signed URL (bucket is private).
 */
export async function resolveImageUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  const cached = cache.get(pathOrUrl);
  const now = Date.now();
  if (cached && cached.expires > now + 60_000) return cached.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(pathOrUrl, TTL_SECONDS);
  if (error || !data) return null;
  cache.set(pathOrUrl, { url: data.signedUrl, expires: now + TTL_SECONDS * 1000 });
  return data.signedUrl;
}

export async function uploadImage(file: File, folder = "misc"): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteImage(path: string) {
  if (!path || /^https?:\/\//.test(path)) return;
  await supabase.storage.from(BUCKET).remove([path]);
  cache.delete(path);
}
