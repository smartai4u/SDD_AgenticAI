import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { DataError } from "./errors";
import { producers } from "./producers";
import { cleanup, requireDatabaseEnv, testName } from "./test-helpers";

describe("producers data layer (real Supabase)", () => {
  const created: string[] = [];

  beforeAll(() => {
    requireDatabaseEnv();
  });

  afterAll(async () => {
    await cleanup({ producers: created });
  });

  it("creates, gets, lists, updates and deletes a producer", async () => {
    const name = testName("producer");
    const producer = await producers.create(name);
    created.push(producer.id);
    expect(producer.name).toBe(name);
    expect(producer.id).toMatch(/^[0-9a-f-]{36}$/);

    expect(await producers.get(producer.id)).toMatchObject({ id: producer.id, name });

    const listed = await producers.list();
    expect(listed.some((p) => p.id === producer.id)).toBe(true);

    const renamed = testName("producer-renamed");
    const updated = await producers.update(producer.id, renamed);
    expect(updated.name).toBe(renamed);
    expect(new Date(updated.updated_at).getTime()).toBeGreaterThanOrEqual(
      new Date(producer.updated_at).getTime(),
    );

    expect(await producers.remove(producer.id)).toBe(true);
    expect(await producers.get(producer.id)).toBeNull();
    expect(await producers.remove(producer.id)).toBe(false);
  });

  it("trims names and rejects an empty name", async () => {
    await expect(producers.create("   ")).rejects.toMatchObject({
      code: "invalid_input",
    });
    const name = testName("trim");
    const producer = await producers.create(`  ${name}  `);
    created.push(producer.id);
    expect(producer.name).toBe(name);
  });

  it("rejects a duplicate name, case-insensitively", async () => {
    const name = testName("dup");
    const first = await producers.create(name);
    created.push(first.id);
    const attempt = producers.create(name.toUpperCase());
    await expect(attempt).rejects.toBeInstanceOf(DataError);
    await expect(attempt).rejects.toMatchObject({ code: "duplicate" });
  });

  it("reports not_found when updating a missing producer", async () => {
    await expect(
      producers.update("00000000-0000-0000-0000-000000000000", testName("x")),
    ).rejects.toMatchObject({ code: "not_found" });
  });
});
