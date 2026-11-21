export type DataErrorCode =
  | "invalid_input"
  | "duplicate"
  | "in_use"
  | "not_found"
  | "database_error";

export class DataError extends Error {
  readonly code: DataErrorCode;

  constructor(code: DataErrorCode, message: string) {
    super(message);
    this.name = "DataError";
    this.code = code;
  }
}

/** Maps a PostgREST/Postgres error to a DataError the app can reason about. */
export function toDataError(error: { code?: string; message: string }): DataError {
  switch (error.code) {
    case "23505":
      return new DataError("duplicate", "That name already exists.");
    case "23503":
      return new DataError("in_use", "It is referenced by existing movements.");
    case "23514":
    case "23502":
      return new DataError("invalid_input", error.message);
    default:
      return new DataError("database_error", error.message);
  }
}

export function cleanName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new DataError("invalid_input", "Name is required.");
  }
  return trimmed;
}
