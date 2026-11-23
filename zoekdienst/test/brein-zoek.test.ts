import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { handleRpc } from "../src/index";
import { chunkText, ftsQuery, parseLinks, parseRelations, rrf } from "../src/lib";
import { mockEnv } from "./mock-env";

const NOVA = "8b469f4e-563e-5d75-9848-cc656fbe3997";
const NOORD = "bd415f34-5dad-521f-ad31-9a83fb6db8d2";
const VETLY = "2caa12bf-757b-596e-98b5-7d798633d543";
const ACME = "2b5a172a-f9c2-54c7-9a4e-60bd9271da8e";

const noordPage = `**In één zin:** GGD-regio Noord; prospect van [Nova Health](block://${NOVA}).

## Relaties

- prospect van → [Nova Health](block://${NOVA})

## Stand van zaken

- Financieel afhankelijk van de gemeenten; Nova Health staat niet bovenaan de digitaliseringslijst. [Bron: gesprek, 2026-11-02]
- ECD: Kidos.`;

const acmePage = `**In één zin:** investeerder in [Vetly](block://${VETLY}).

## Relaties

- investeerder in → [Vetly](block://${VETLY})
- oud-collega van → Sanne (Acme)

## Stand van zaken

- Investeerde via Ons Fonds in Vetly BV.`;

const novaPage = `**In één zin:** platform voor patiëntinformatie. Klanten: [Regio Noord](block://${NOORD}).

## Stand van zaken

- Prijsindicatie € 10.000–12.000 per jaar.`;

async function call(env: ReturnType<typeof mockEnv>, name: string, args: Record<string, unknown>) {
  const res = (await handleRpc(env, { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } })) as {
    result: { content: { text: string }[]; isError?: boolean };
  };
  assert.ok(!res.result.isError, res.result.content[0].text);
  return JSON.parse(res.result.content[0].text);
}

test("parseRelations reads typed lines, with and without links", () => {
  const r = parseRelations(acmePage);
  assert.deepEqual(r, [
    { type: "investeerder in", dstId: VETLY, dstTitle: "Vetly", note: "" },
    { type: "oud-collega van", dstId: null, dstTitle: "Sanne", note: "Acme" },
  ]);
  assert.equal(parseRelations("## Stand van zaken\n- a → b").length, 0);
});

test("parseLinks de-duplicates and lowercases ids", () => {
  const l = parseLinks(`[A](block://ABC-1) en [A opnieuw](block://abc-1) en [B](block://def)`);
  assert.deepEqual(l.map((x) => x.dstId), ["abc-1", "def"]);
});

test("chunkText keeps chunks under the limit and prefixes the title", () => {
  const long = Array.from({ length: 40 }, (_, i) => `## Kop ${i}\n\nAlinea nummer ${i} met wat tekst erin.`).join("\n\n");
  const chunks = chunkText("Titel", "Mensen", long, 300);
  assert.ok(chunks.length > 3);
  for (const c of chunks) {
    assert.ok(c.text.startsWith("Titel (Mensen)"));
    assert.ok(c.text.length < 300 + 40);
  }
  assert.equal(chunkText("Leeg", "", "").length, 1);
});

test("ftsQuery is injection-safe", () => {
  assert.equal(ftsQuery('budget" OR 1=1 --'), '"budget"* OR "or"*');
  assert.equal(ftsQuery("a"), null);
  assert.match(ftsQuery("Prijsmodel Nova")!, /^"prijsmodel"\* OR "nova"\*$/);
});

test("rrf merges lists and scores per page", () => {
  const m = rrf([
    [{ id: "p1#0", pageId: "p1" }, { id: "p2#0", pageId: "p2" }],
    [{ id: "p2#0", pageId: "p2" }, { id: "p1#1", pageId: "p1" }],
  ]);
  assert.ok(m.get("p2")!.score > 0 && m.get("p1")!.score > 0);
});

test("full flow: index, search hybrid, relations, similar, re-index, delete", async () => {
  const env = mockEnv();
  await call(env, "indexeer_pagina", { page_id: NOORD.toUpperCase(), titel: "Regio Noord / GGD Noord", map: "Organisaties", tekst: noordPage, gewijzigd: "2026-11-21" });
  await call(env, "indexeer_pagina", { page_id: ACME, titel: "Acme", map: "Organisaties", tekst: acmePage });
  await call(env, "indexeer_pagina", { page_id: NOVA, titel: "Nova Health", map: "Organisaties", tekst: novaPage });

  const status = await call(env, "index_status", {});
  assert.equal(status.aantal, 3);
  assert.equal(status.paginas.find((p: { title: string }) => p.title === "Acme").chunk_count, 1);

  // Keyword hit.
  const k = await call(env, "zoek", { vraag: "Kidos" });
  assert.equal(k.resultaten[0].titel, "Regio Noord / GGD Noord");
  assert.match(k.resultaten[0].link, /craftdocs:\/\/open\?spaceId=space-1&blockId=bd415f34/);

  // Meaning-ish hit via the toy synonym map (geld ~ budget ~ financieel): no shared keyword "geld" in the page.
  const s = await call(env, "zoek", { vraag: "geld" });
  assert.equal(s.resultaten[0].titel, "Regio Noord / GGD Noord");

  // Map filter.
  const f = await call(env, "zoek", { vraag: "Nova Health", map: "Mensen" });
  assert.equal(f.resultaten.length, 0);

  // Relations in both directions + mentions.
  const r = await call(env, "relaties", { naam: "nova health" });
  assert.equal(r.pagina.page_id, NOVA);
  assert.equal(r.relaties_inkomend[0].type, "prospect van");
  assert.equal(r.genoemd_in.length, 1);
  assert.equal(r.linkt_naar[0].page_id, NOORD);

  const v = await call(env, "vergelijkbaar", { page_id: NOORD });
  assert.ok(v.resultaten.length >= 1);
  assert.ok(v.resultaten.every((x: { page_id: string }) => x.page_id !== NOORD));

  // Re-index with shorter text removes stale vectors and old relations.
  await call(env, "indexeer_pagina", { page_id: ACME, titel: "Acme", map: "Organisaties", tekst: "Alleen nog een korte tekst." });
  const r2 = await call(env, "relaties", { page_id: ACME });
  assert.equal(r2.relaties_uitgaand.length, 0);

  const d = await call(env, "verwijder_pagina", { page_id: ACME });
  assert.equal(d.verwijderd, true);
  assert.equal((env.VECTORS as unknown as { store: Map<string, unknown> }).store.has(`${ACME}#0`), false);
  assert.equal((await call(env, "index_status", {})).aantal, 2);
});

test("long page is chunked and stale chunks are removed on re-index", async () => {
  const env = mockEnv();
  const long = Array.from({ length: 30 }, (_, i) => `Alinea ${i}: ${"tekst ".repeat(60)}`).join("\n\n");
  const a = await call(env, "indexeer_pagina", { page_id: "p-long", titel: "Lang", map: "Bronnen", tekst: long });
  assert.ok(a.fragmenten > 5);
  await call(env, "indexeer_pagina", { page_id: "p-long", titel: "Lang", map: "Bronnen", tekst: "kort" });
  const store = (env.VECTORS as unknown as { store: Map<string, unknown> }).store;
  assert.equal([...store.keys()].filter((k) => k.startsWith("p-long#")).length, 1);
});

test("HTTP layer: secret path, initialize, notifications, tools/list, errors", async () => {
  const env = mockEnv();
  const post = (path: string, body: unknown) =>
    worker.fetch(new Request(`https://x.dev${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }), env);

  assert.equal((await post("/mcp/verkeerd", { jsonrpc: "2.0", id: 1, method: "ping" })).status, 404);
  assert.equal((await post("/mcp", { jsonrpc: "2.0", id: 1, method: "ping" })).status, 404);

  const init = await (await post("/mcp/geheim-123", { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-03-26" } })).json() as { result: { protocolVersion: string; serverInfo: { name: string } } };
  assert.equal(init.result.protocolVersion, "2025-03-26");
  assert.equal(init.result.serverInfo.name, "brein-zoek");

  assert.equal((await post("/mcp/geheim-123", { jsonrpc: "2.0", method: "notifications/initialized" })).status, 202);

  const list = await (await post("/mcp/geheim-123", { jsonrpc: "2.0", id: 2, method: "tools/list" })).json() as { result: { tools: { name: string }[] } };
  assert.deepEqual(list.result.tools.map((t) => t.name), ["zoek", "relaties", "vergelijkbaar", "index_status", "indexeer_pagina", "verwijder_pagina"]);

  const bad = await (await post("/mcp/geheim-123", { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "zoek", arguments: {} } })).json() as { result: { isError: boolean } };
  assert.equal(bad.result.isError, true);

  const get = await worker.fetch(new Request("https://x.dev/mcp/geheim-123"), env);
  assert.equal(get.status, 405);
  const parse = await worker.fetch(new Request("https://x.dev/mcp/geheim-123", { method: "POST", body: "{niet json" }), env);
  assert.equal(parse.status, 400);
});

import { craftLink as _cl, normId as _ni } from "../src/lib";
import { test as _t } from "node:test";
import _assert from "node:assert/strict";
_t("Google Drive-ids: hoofdletters blijven, link naar Drive", () => {
  _assert.equal(_ni("  gdrive:1wRE8Lf9dJCs6rtm "), "gdrive:1wRE8Lf9dJCs6rtm");
  _assert.equal(_ni("ABFC0D29-2333"), "abfc0d29-2333");
  _assert.equal(_cl("space", "gdrive:1wRE8"), "https://drive.google.com/open?id=1wRE8");
  _assert.equal(_cl("space", "abc"), "craftdocs://open?spaceId=space&blockId=abc");
});
