import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { movements } from "./movements";
import { producers } from "./producers";
import { sites } from "./sites";
import { cleanup, requireDatabaseEnv, testName } from "./test-helpers";

describe("movements data layer (real Supabase)", () => {
  const ids = {
    movements: [] as string[],
    producers: [] as string[],
    sites: [] as string[],
  };

  beforeAll(() => {
    requireDatabaseEnv();
  });

  afterAll(async () => {
    await cleanup(ids);
  });

  it("records inbound and outbound movements and lists them back (T6)", async () => {
    const producer = await producers.create(testName("mv-producer"));
    const site = await sites.create(testName("mv-site"));
    ids.producers.push(producer.id);
    ids.sites.push(site.id);

    const inbound = await movements.recordInbound({
      producerId: producer.id,
      weightKg: 12.5,
      occurredAt: "2026-01-01T08:00:00Z",
    });
    const outbound = await movements.recordOutbound({
      siteId: site.id,
      weightKg: 8.25,
      occurredAt: "2026-01-02T08:00:00Z",
    });
    ids.movements.push(inbound.id, outbound.id);

    expect(inbound).toMatchObject({
      direction: "inbound",
      weightKg: 12.5,
      producerId: producer.id,
      siteId: null,
      partyName: producer.name,
    });
    expect(outbound).toMatchObject({
      direction: "outbound",
      weightKg: 8.25,
      producerId: null,
      siteId: site.id,
      partyName: site.name,
    });

    expect(await movements.get(inbound.id)).toMatchObject({
      id: inbound.id,
      weightKg: 12.5,
    });
    expect(await movements.get("00000000-0000-0000-0000-000000000000")).toBeNull();

    const listed = await movements.list({ limit: 500 });
    const mine = listed.filter((m) => ids.movements.includes(m.id));
    expect(mine.map((m) => m.id)).toEqual([outbound.id, inbound.id]); // newest first
    expect(mine.find((m) => m.id === inbound.id)?.partyName).toBe(producer.name);
    expect(mine.find((m) => m.id === outbound.id)?.partyName).toBe(site.name);
  });

  it("rejects invalid input (T6)", async () => {
    const producer = await producers.create(testName("mv-bad-producer"));
    const site = await sites.create(testName("mv-bad-site"));
    ids.producers.push(producer.id);
    ids.sites.push(site.id);

    for (const weightKg of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
      await expect(
        movements.recordInbound({ producerId: producer.id, weightKg }),
      ).rejects.toMatchObject({ code: "invalid_input" });
      await expect(
        movements.recordOutbound({ siteId: site.id, weightKg }),
      ).rejects.toMatchObject({ code: "invalid_input" });
    }

    await expect(
      movements.recordInbound({ producerId: "", weightKg: 5 }),
    ).rejects.toMatchObject({ code: "invalid_input" });
    await expect(
      movements.recordOutbound({ siteId: "", weightKg: 5 }),
    ).rejects.toMatchObject({ code: "invalid_input" });

    // Well-formed ids that do not exist are rejected by the foreign key.
    const missing = "00000000-0000-0000-0000-000000000000";
    await expect(
      movements.recordInbound({ producerId: missing, weightKg: 5 }),
    ).rejects.toMatchObject({ code: "invalid_input" });
    await expect(
      movements.recordOutbound({ siteId: missing, weightKg: 5 }),
    ).rejects.toMatchObject({ code: "invalid_input" });
  });

  it("will not delete a producer or site that a movement references (T7)", async () => {
    const producer = await producers.create(testName("ref-producer"));
    const site = await sites.create(testName("ref-site"));
    ids.producers.push(producer.id);
    ids.sites.push(site.id);

    const inbound = await movements.recordInbound({
      producerId: producer.id,
      weightKg: 1,
    });
    const outbound = await movements.recordOutbound({ siteId: site.id, weightKg: 1 });
    ids.movements.push(inbound.id, outbound.id);

    await expect(producers.remove(producer.id)).rejects.toMatchObject({
      code: "in_use",
    });
    await expect(sites.remove(site.id)).rejects.toMatchObject({ code: "in_use" });

    // Still there, and deletable once nothing references them.
    expect(await producers.get(producer.id)).not.toBeNull();
    expect(await sites.get(site.id)).not.toBeNull();
    await cleanup({ movements: [inbound.id, outbound.id] });
    expect(await producers.remove(producer.id)).toBe(true);
    expect(await sites.remove(site.id)).toBe(true);
  });
});
