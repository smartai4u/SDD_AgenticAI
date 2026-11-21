import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false && "hidden", undefined, null)).toBe("px-2");
  });

  it("resolves conflicting Tailwind classes, keeping the last", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-base")).toBe("text-base");
  });
});
