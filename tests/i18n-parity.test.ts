import { expect, test, describe } from "bun:test";
import id from "@/messages/id.json";
import en from "@/messages/en.json";

function flatten(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  if (Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("i18n message parity", () => {
  test("id and en expose the exact same key set", () => {
    const idKeys = flatten(id).sort();
    const enKeys = flatten(en).sort();
    const missingInEn = idKeys.filter((k) => !enKeys.includes(k));
    const missingInId = enKeys.filter((k) => !idKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInId).toEqual([]);
  });
});
