import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const sourceRoot = new URL("../", import.meta.url);

test("blueprint pins the three independently published Card releases", async () => {
  const manifest = JSON.parse(await readFile(new URL("card.json", sourceRoot), "utf8"));

  assert.equal(manifest.name, "@darwinian/darwinian-cards-worker");
  assert.equal(manifest.version, "2.0.0");
  assert.equal(manifest.kind, "blueprint");
  assert.deepEqual(manifest.composedFrom, [
    "@remyjkim/fal@0.2.2",
    "@darwinian/operator@2.0.0",
    "@darwinian/notion@1.0.0",
  ]);
});

test("blueprint requires and records Darwinian Worker CLI 0.9", async () => {
  const manifest = JSON.parse(await readFile(new URL("card.json", sourceRoot), "utf8"));

  assert.equal(manifest.harness?.minVersion, "0.9.0");
  assert.equal(manifest.lastValidatedWith, "0.9.0");
});

test("blueprint remains composition-only", async () => {
  const manifest = JSON.parse(await readFile(new URL("card.json", sourceRoot), "utf8"));

  for (const field of ["skills", "servers", "hooks", "persona", "beliefs", "memory"]) {
    assert.equal(manifest[field], undefined, `${field} must remain owned by member Cards`);
  }
});

test("documentation defines one non-stackable Worker composed from Cards", async () => {
  const readme = await readFile(new URL("README.md", sourceRoot), "utf8");

  assert.match(readme, /one Worker/i);
  assert.match(readme, /Cards compose/i);
  assert.match(readme, /Workers do not stack/i);
  assert.doesNotMatch(readme, /@leeminseung\/notion|@darwinian\/operator@\^1|@remyjkim\/fal@\^/);
});
