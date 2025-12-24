import { expect, test, describe } from "bun:test";
import { cn } from "@/lib/cn";

describe("cn utility", () => {
  test("joins classes correctly", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  test("filters out falsy values", () => {
    expect(cn("a", false, "b", null, undefined)).toBe("a b");
  });
});
