import { createServerClient } from "@/lib/supabase/server";

/**
 * Integration tests run against the real Supabase project. A missing key must
 * fail loudly rather than skip, so a missing secret can never look like a pass.
 */
export function requireDatabaseEnv(): void {
  const missing = ["SUPABASE_URL", "SUPABASE_SECRET_KEY"].filter(
    (name) => !process.env[name],
  );
  if (missing.length > 0) {
    throw new Error(
      `Integration tests need ${missing.join(" and ")} in .env.local (see .env.example).`,
    );
  }
}

/** A name that cannot collide with real data or with another test run. */
export function testName(label: string): string {
  const run = Math.random().toString(36).slice(2, 8);
  return `it-${label}-${run}`;
}

/** Removes every row a test created, in dependency order (movements first). */
export async function cleanup(ids: {
  movements?: string[];
  producers?: string[];
  sites?: string[];
}): Promise<void> {
  const client = createServerClient();
  if (ids.movements?.length) {
    await client.from("movements").delete().in("id", ids.movements);
  }
  if (ids.producers?.length) {
    await client.from("producers").delete().in("id", ids.producers);
  }
  if (ids.sites?.length) {
    await client.from("sites").delete().in("id", ids.sites);
  }
}
