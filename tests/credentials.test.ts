import { expect, test, describe } from "bun:test";
import { credentials } from "@/lib/data/credentials";

describe("credentials", () => {
  test("disabled by default so no unverified numbers ship", () => {
    expect(credentials.enabled).toBe(false);
  });

  test("has empty placeholders while legal has not confirmed", () => {
    expect(credentials.foundedYear).toBeNull();
    expect(credentials.stats).toEqual([]);
    expect(credentials.legalEntities).toEqual([]);
  });
});
