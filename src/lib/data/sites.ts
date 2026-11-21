import type { Database } from "@/lib/supabase/database.types";
import { createServerClient } from "@/lib/supabase/server";
import { DataError, cleanName, toDataError } from "./errors";

export type Site = Database["public"]["Tables"]["sites"]["Row"];

/** Server-side data access for sequestration sites. */
export const sites = {
  async create(name: string): Promise<Site> {
    const { data, error } = await createServerClient()
      .from("sites")
      .insert({ name: cleanName(name) })
      .select()
      .single();
    if (error) throw toDataError(error);
    return data;
  },

  async get(id: string): Promise<Site | null> {
    const { data, error } = await createServerClient()
      .from("sites")
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw toDataError(error);
    return data;
  },

  async list(): Promise<Site[]> {
    const { data, error } = await createServerClient()
      .from("sites")
      .select()
      .order("name");
    if (error) throw toDataError(error);
    return data;
  },

  async update(id: string, name: string): Promise<Site> {
    const { data, error } = await createServerClient()
      .from("sites")
      .update({ name: cleanName(name) })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw toDataError(error);
    if (!data) throw new DataError("not_found", "Site not found.");
    return data;
  },

  /** Returns true when a row was deleted. Fails with `in_use` if movements reference it. */
  async remove(id: string): Promise<boolean> {
    const { data, error } = await createServerClient()
      .from("sites")
      .delete()
      .eq("id", id)
      .select("id");
    if (error) throw toDataError(error);
    return data.length > 0;
  },
};
