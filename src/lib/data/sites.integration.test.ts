import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DataError } from "./errors";
import { sites } from "./sites";
import { cleanup, requireDatabaseEnv, testName } from "./test-helpers";

describe("sites data layer (real Supabase)", () => {
  const created: string[] = [];

  beforeAll(() => {
    requireDatabaseEnv();
  });

  afterAll(async () => {
    await cleanup({ sites: created });
  });

  it("creates, gets, lists, updates and deletes a site", async () => {
    const name = testName("site");
    const site = await sites.create(name);
    created.push(site.id);
    expect(site.name).toBe(name);
    expect(site.id).toMatch(/^[0-9a-f-]{36}$/);

    expect(await sites.get(site.id)).toMatchObject({ id: site.id, name });

    const listed = await sites.list();
    expect(listed.some((s) => s.id === site.id)).toBe(true);

    const renamed = testName("site-renamed");
    const updated = await sites.update(site.id, renamed);
    expect(updated.name).toBe(renamed);

    expect(await sites.remove(site.id)).toBe(true);
    expect(await sites.get(site.id)).toBeNull();
    expect(await sites.remove(site.id)).toBe(false);
  });

  it("trims names and rejects an empty name", async () => {
    await expect(sites.create("   ")).rejects.toMatchObject({
      code: "invalid_input",
    });
    const name = testName("trim");
    const site = await sites.create(`  ${name}  `);
    created.push(site.id);
    expect(site.name).toBe(name);
  });

  it("rejects a duplicate name, case-insensitively", async () => {
    const name = testName("dup");
    const first = await sites.create(name);
    created.push(first.id);
    const attempt = sites.create(name.toUpperCase());
    await expect(attempt).rejects.toBeInstanceOf(DataError);
    await expect(attempt).rejects.toMatchObject({ code: "duplicate" });
  });

  it("reports not_found when updating a missing site", async () => {
    await expect(
      sites.update("00000000-0000-0000-0000-000000000000", testName("x")),
    ).rejects.toMatchObject({ code: "not_found" });
  });
});
