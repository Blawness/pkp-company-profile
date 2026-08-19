import { expect, test, describe } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PUBLIC_ROOTS = ["app/[locale]", "app/components", "components"];
const SKIP = new Set(["node_modules", ".next"]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    if (SKIP.has(entry)) return [];
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".tsx") || full.endsWith(".ts") ? [full] : [];
  });
}

describe("public surface has no dark-mode classes", () => {
  test("no file under the public roots contains a dark: variant", () => {
    const offenders = PUBLIC_ROOTS.flatMap(walk).filter((file) =>
      readFileSync(file, "utf8").includes("dark:"),
    );
    expect(offenders).toEqual([]);
  });
});
