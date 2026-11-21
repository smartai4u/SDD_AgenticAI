// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createServerClient } from "./server";

describe("createServerClient", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("throws a clear error when SUPABASE_URL is missing", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SECRET_KEY", "secret");
    expect(() => createServerClient()).toThrow(/SUPABASE_URL/);
  });

  it("throws a clear error when SUPABASE_SECRET_KEY is missing", () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    expect(() => createServerClient()).toThrow(/SUPABASE_SECRET_KEY/);
  });

  it("creates a client when both variables are set", () => {
    vi.stubEnv("SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "secret");
    const client = createServerClient();
    expect(typeof client.from).toBe("function");
  });
});
