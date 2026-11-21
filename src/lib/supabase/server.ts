import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ServerClient = SupabaseClient<Database>;

/**
 * Supabase client for server-side code only. It uses the secret key, which
 * bypasses row-level security, so it must never run in the browser and the
 * variables must never carry a NEXT_PUBLIC_ prefix.
 */
export function createServerClient(): ServerClient {
  if (typeof window !== "undefined") {
    throw new Error("createServerClient must only be used on the server.");
  }

  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url) {
    throw new Error("Missing SUPABASE_URL. Set it in .env.local (see .env.example).");
  }
  if (!secretKey) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY. Set it in .env.local (see .env.example).",
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
