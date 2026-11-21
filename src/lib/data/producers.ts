import type { Database } from "@/lib/supabase/database.types";
import { createServerClient } from "@/lib/supabase/server";
import { DataError, cleanName, toDataError } from "./errors";

export type Producer = Database["public"]["Tables"]["producers"]["Row"];

/** Server-side data access for feedstock producers. */
export const producers = {
  async create(name: string): Promise<Producer> {
    const { data, error } = await createServerClient()
      .from("producers")
      .insert({ name: cleanName(name) })
      .select()
      .single();
    if (error) throw toDataError(error);
    return data;
  },

  async get(id: string): Promise<Producer | null> {
    const { data, error } = await createServerClient()
      .from("producers")
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw toDataError(error);
    return data;
  },

  async list(): Promise<Producer[]> {
    const { data, error } = await createServerClient()
      .from("producers")
      .select()
      .order("name");
    if (error) throw toDataError(error);
    return data;
  },

  async update(id: string, name: string): Promise<Producer> {
    const { data, error } = await createServerClient()
      .from("producers")
      .update({ name: cleanName(name) })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw toDataError(error);
    if (!data) throw new DataError("not_found", "Producer not found.");
    return data;
  },

  /** Returns true when a row was deleted. Fails with `in_use` if movements reference it. */
  async remove(id: string): Promise<boolean> {
    const { data, error } = await createServerClient()
      .from("producers")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw toDataError(error);
    return data.length > 0;
  },
};
