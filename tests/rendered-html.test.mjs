import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("production build contains the public enrollment route", async () => {
  const manifest = JSON.parse(await readFile(".next/routes-manifest.json", "utf8"));
  assert.ok(manifest.dynamicRoutes.some((route) => route.page === "/status/[reference]"));
  assert.ok(manifest.dynamicRoutes.some((route) => route.page === "/receipt/[receipt]"));
});

test("service worker handles push notifications", async () => {
  const worker = await readFile("public/sw.js", "utf8");
  assert.match(worker, /showNotification/);
  assert.match(worker, /notificationclick/);
});
