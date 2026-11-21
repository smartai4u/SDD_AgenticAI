import { createServerClient } from "@/lib/supabase/server";
import { DataError, toDataError } from "./errors";

export type Direction = "inbound" | "outbound";

export type Movement = {
  id: string;
  direction: Direction;
  /** Weight in kilograms. */
  weightKg: number;
  /** ISO timestamp of when the movement happened. */
  occurredAt: string;
  producerId: string | null;
  siteId: string | null;
  /** The producer's name for inbound, the site's name for outbound. */
  partyName: string;
};

const SELECT =
  "id, direction, weight_kg, occurred_at, producer_id, site_id, producer:producers(name), site:sites(name)";

type MovementRow = {
  id: string;
  direction: string;
  weight_kg: number;
  occurred_at: string;
  producer_id: string | null;
  site_id: string | null;
  producer: { name: string } | null;
  site: { name: string } | null;
};

function toMovement(row: MovementRow): Movement {
  return {
    id: row.id,
    direction: row.direction as Direction,
    weightKg: Number(row.weight_kg),
    occurredAt: row.occurred_at,
    producerId: row.producer_id,
    siteId: row.site_id,
    partyName: (row.direction === "inbound" ? row.producer?.name : row.site?.name) ?? "",
  };
}

function checkWeight(weightKg: number): void {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new DataError("invalid_input", "Weight must be a number greater than 0 (kg).");
  }
}

function checkId(id: string, label: string): void {
  if (!id || !id.trim()) {
    throw new DataError("invalid_input", `${label} is required.`);
  }
}

/** Inserting with an id that does not exist is bad input, not "in use". */
function toInsertError(error: { code?: string; message: string }, label: string): DataError {
  if (error.code === "23503") {
    return new DataError("invalid_input", `Unknown ${label}.`);
  }
  return toDataError(error);
}

type RecordInput = { weightKg: number; occurredAt?: string };

/** Server-side data access for inbound and outbound movements (weights in kg). */
export const movements = {
  /** Feedstock arriving from a producer. */
  async recordInbound(input: RecordInput & { producerId: string }): Promise<Movement> {
    checkWeight(input.weightKg);
    checkId(input.producerId, "Producer");
    const { data, error } = await createServerClient()
      .from("movements")
      .insert({
        direction: "inbound",
        weight_kg: input.weightKg,
        producer_id: input.producerId,
        ...(input.occurredAt ? { occurred_at: input.occurredAt } : {}),
      })
      .select(SELECT)
      .single();
    if (error) throw toInsertError(error, "producer");
    return toMovement(data as unknown as MovementRow);
  },

  /** Processed feedstock leaving for a sequestration site. */
  async recordOutbound(input: RecordInput & { siteId: string }): Promise<Movement> {
    checkWeight(input.weightKg);
    checkId(input.siteId, "Site");
    const { data, error } = await createServerClient()
      .from("movements")
      .insert({
        direction: "outbound",
        weight_kg: input.weightKg,
        site_id: input.siteId,
        ...(input.occurredAt ? { occurred_at: input.occurredAt } : {}),
      })
      .select(SELECT)
      .single();
    if (error) throw toInsertError(error, "site");
    return toMovement(data as unknown as MovementRow);
  },

  async get(id: string): Promise<Movement | null> {
    const { data, error } = await createServerClient()
      .from("movements")
      .select(SELECT)
      .eq("id", id)
      .maybeSingle();
    if (error) throw toDataError(error);
    return data ? toMovement(data as unknown as MovementRow) : null;
  },

  /** Newest first. */
  async list(options: { limit?: number } = {}): Promise<Movement[]> {
    const { data, error } = await createServerClient()
      .from("movements")
      .select(SELECT)
      .order("occurred_at", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(options.limit ?? 100);
    if (error) throw toDataError(error);
    return (data as unknown as MovementRow[]).map(toMovement);
  },
};
