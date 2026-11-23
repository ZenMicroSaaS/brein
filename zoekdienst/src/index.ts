// brein-zoek — search service for jouw Brein in Craft.
// A minimal remote MCP server (Streamable HTTP, JSON responses) on Cloudflare Workers:
// hybrid search = Vectorize (bge-m3 embeddings) + D1 FTS5 keyword search, fused with RRF,
// plus a small graph of links and typed relations parsed from the pages.

import {
  chunkText,
  craftLink,
  normId,
  extractVectors,
  ftsQuery,
  parseLinks,
  parseRelations,
  rrf,
  snippet,
  type Ranked,
} from "./lib";

export interface Env {
  AI: Ai;
  VECTORS: VectorizeIndex;
  DB: D1Database;
  MCP_SECRET: string;
  CRAFT_SPACE_ID: string;
}

const EMBED_MODEL = "@cf/baai/bge-m3";
const SERVER_INFO = { name: "brein-zoek", version: "1.0.0" };
const PROTOCOL_VERSIONS = ["2025-06-18", "2025-03-26", "2024-11-05"];

// ---------- tool definitions ----------

const TOOLS = [
  {
    name: "zoek",
    description:
      "Zoek in het Brein op betekenis én trefwoord (hybride). Geeft de best passende pagina's met titel, map, Craft-link en een fragment. Gebruik dit vóór Craft-zoeken bij vragen over mensen, organisaties, gesprekken, ideeën en feiten.",
    inputSchema: {
      type: "object",
      properties: {
        vraag: { type: "string", description: "Zoekvraag in gewone taal (Nederlands of Engels)." },
        aantal: { type: "integer", minimum: 1, maximum: 25, description: "Aantal pagina's, standaard 8." },
        map: {
          type: "string",
          description: "Optioneel: alleen in deze map zoeken (Mensen, Organisaties, Gesprekken, Ideeën & Concepten, Bronnen, Feiten).",
        },
      },
      required: ["vraag"],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "relaties",
    description:
      "Toon de verbanden van één pagina: getypeerde relaties (uit de sectie 'Relaties', in beide richtingen), pagina's die ernaar linken en pagina's waar hij naar linkt.",
    inputSchema: {
      type: "object",
      properties: {
        page_id: { type: "string", description: "rootBlockId van de pagina." },
        naam: { type: "string", description: "Of: (deel van) de paginatitel." },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "vergelijkbaar",
    description: "Pagina's die inhoudelijk het meest lijken op een gegeven pagina.",
    inputSchema: {
      type: "object",
      properties: {
        page_id: { type: "string" },
        aantal: { type: "integer", minimum: 1, maximum: 20 },
      },
      required: ["page_id"],
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "index_status",
    description:
      "Lijst van alle geïndexeerde pagina's met map, laatst gewijzigd en moment van indexeren. Gebruik dit om te bepalen welke pagina's opnieuw geïndexeerd moeten worden.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
  {
    name: "indexeer_pagina",
    description:
      "Voeg een Brein-pagina toe aan de zoekindex of werk hem bij (vervangt de vorige versie). Geef de volledige tekst als markdown, inclusief block://-links en de sectie 'Relaties'.",
    inputSchema: {
      type: "object",
      properties: {
        page_id: { type: "string", description: "rootBlockId van de pagina in Craft." },
        titel: { type: "string" },
        map: { type: "string", description: "Mensen, Organisaties, Gesprekken, Ideeën & Concepten, Bronnen, Feiten, Reflecties of Documenten (Google Drive; page_id dan \"gdrive:<fileId>\")." },
        tekst: { type: "string", description: "Volledige paginatekst in markdown." },
        gewijzigd: { type: "string", description: "Laatst gewijzigd in Craft (ISO-datum/tijd), indien bekend." },
      },
      required: ["page_id", "titel", "map", "tekst"],
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true },
  },
  {
    name: "verwijder_pagina",
    description: "Haal een pagina uit de zoekindex (bijvoorbeeld als hij in Craft is verwijderd of samengevoegd).",
    inputSchema: {
      type: "object",
      properties: { page_id: { type: "string" } },
      required: ["page_id"],
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true },
  },
];

// ---------- helpers ----------

async function embed(env: Env, texts: string[]): Promise<number[][]> {
  const out: number[][] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    const res = await env.AI.run(EMBED_MODEL as Parameters<Ai["run"]>[0], { text: batch } as never);
    out.push(...extractVectors(res));
  }
  return out;
}

const vecId = (pageId: string, no: number) => `${pageId}#${no}`;

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---------- tool implementations ----------

type Args = Record<string, unknown>;

export async function indexeerPagina(env: Env, a: Args) {
  const pageId = normId(String(a.page_id));
  const titel = String(a.titel || "").trim();
  const map = String(a.map || "").trim();
  const tekst = String(a.tekst || "");
  if (!pageId || !titel) throw new Error("page_id en titel zijn verplicht");

  const chunks = chunkText(titel, map, tekst);
  const vectors = await embed(env, chunks.map((c) => c.text));

  const prev = await env.DB.prepare("SELECT chunk_count FROM pages WHERE page_id = ?").bind(pageId).first<{ chunk_count: number }>();
  const prevCount = prev?.chunk_count ?? 0;
  if (prevCount > chunks.length) {
    const stale = [];
    for (let i = chunks.length; i < prevCount; i++) stale.push(vecId(pageId, i));
    await env.VECTORS.deleteByIds(stale);
  }
  await env.VECTORS.upsert(
    chunks.map((c, i) => ({
      id: vecId(pageId, c.no),
      values: vectors[i],
      metadata: { page_id: pageId, title: titel, map },
    })),
  );

  const links = parseLinks(tekst).filter((l) => l.dstId !== pageId);
  const relations = parseRelations(tekst);
  const now = new Date().toISOString();
  const stmts: D1PreparedStatement[] = [
    env.DB.prepare("DELETE FROM chunks_fts WHERE page_id = ?").bind(pageId),
    env.DB.prepare("DELETE FROM links WHERE src_id = ?").bind(pageId),
    env.DB.prepare("DELETE FROM relations WHERE src_id = ?").bind(pageId),
    ...chunks.map((c) =>
      env.DB.prepare("INSERT INTO chunks_fts (chunk_id, page_id, title, map, text) VALUES (?, ?, ?, ?, ?)").bind(
        vecId(pageId, c.no),
        pageId,
        titel,
        map,
        c.text,
      ),
    ),
    ...links.map((l) =>
      env.DB.prepare("INSERT OR REPLACE INTO links (src_id, dst_id, dst_title) VALUES (?, ?, ?)").bind(pageId, l.dstId, l.dstTitle),
    ),
    ...relations.map((r) =>
      env.DB.prepare("INSERT INTO relations (src_id, src_title, type, dst_id, dst_title, note) VALUES (?, ?, ?, ?, ?, ?)").bind(
        pageId,
        titel,
        r.type,
        r.dstId,
        r.dstTitle,
        r.note,
      ),
    ),
    env.DB.prepare(
      `INSERT INTO pages (page_id, title, map, gewijzigd, indexed_at, chunk_count) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(page_id) DO UPDATE SET title=excluded.title, map=excluded.map, gewijzigd=excluded.gewijzigd,
       indexed_at=excluded.indexed_at, chunk_count=excluded.chunk_count`,
    ).bind(pageId, titel, map, a.gewijzigd ? String(a.gewijzigd) : null, now, chunks.length),
  ];
  await env.DB.batch(stmts);
  return { page_id: pageId, titel, fragmenten: chunks.length, links: links.length, relaties: relations.length };
}

export async function verwijderPagina(env: Env, a: Args) {
  const pageId = normId(String(a.page_id));
  const prev = await env.DB.prepare("SELECT chunk_count FROM pages WHERE page_id = ?").bind(pageId).first<{ chunk_count: number }>();
  if (!prev) return { page_id: pageId, verwijderd: false, reden: "niet in de index" };
  const ids = [];
  for (let i = 0; i < prev.chunk_count; i++) ids.push(vecId(pageId, i));
  if (ids.length) await env.VECTORS.deleteByIds(ids);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM chunks_fts WHERE page_id = ?").bind(pageId),
    env.DB.prepare("DELETE FROM links WHERE src_id = ?").bind(pageId),
    env.DB.prepare("DELETE FROM relations WHERE src_id = ?").bind(pageId),
    env.DB.prepare("DELETE FROM pages WHERE page_id = ?").bind(pageId),
  ]);
  return { page_id: pageId, verwijderd: true };
}

export async function zoek(env: Env, a: Args) {
  const vraag = String(a.vraag || "").trim();
  if (!vraag) throw new Error("vraag is verplicht");
  const aantal = Math.min(25, Math.max(1, Number(a.aantal) || 8));
  const map = a.map ? String(a.map) : "";

  const lists: Ranked[][] = [];

  // Keyword (FTS5) leg.
  const fq = ftsQuery(vraag);
  if (fq) {
    const sql = `SELECT chunk_id, page_id FROM chunks_fts WHERE chunks_fts MATCH ?${map ? " AND map = ?" : ""}
                 ORDER BY bm25(chunks_fts, 0.0, 0.0, 4.0, 0.0, 1.0) LIMIT 25`;
    const stmt = map ? env.DB.prepare(sql).bind(fq, map) : env.DB.prepare(sql).bind(fq);
    const { results } = await stmt.all<{ chunk_id: string; page_id: string }>();
    lists.push(results.map((r) => ({ id: r.chunk_id, pageId: r.page_id })));
  }

  // Semantic (vector) leg.
  const [qv] = await embed(env, [vraag]);
  const vq = await env.VECTORS.query(qv, {
    topK: 25,
    returnMetadata: "all",
    ...(map ? { filter: { map } } : {}),
  });
  lists.push(
    vq.matches.map((m) => ({ id: m.id, pageId: String((m.metadata as Record<string, unknown>)?.page_id ?? m.id.split("#")[0]) })),
  );

  const fused = [...rrf(lists).entries()].sort((x, y) => y[1].score - x[1].score).slice(0, aantal);
  if (!fused.length) return { vraag, resultaten: [] };

  const results = [];
  for (const [pageId, { score, bestChunk }] of fused) {
    const page = await env.DB.prepare("SELECT title, map, gewijzigd FROM pages WHERE page_id = ?").bind(pageId).first<{
      title: string;
      map: string;
      gewijzigd: string | null;
    }>();
    const chunk = await env.DB.prepare("SELECT text FROM chunks_fts WHERE chunk_id = ?").bind(bestChunk).first<{ text: string }>();
    if (!page) continue;
    results.push({
      titel: page.title,
      map: page.map,
      page_id: pageId,
      link: craftLink(env.CRAFT_SPACE_ID, pageId),
      score: Number(score.toFixed(4)),
      fragment: chunk ? snippet(chunk.text, vraag) : "",
      gewijzigd: page.gewijzigd,
    });
  }
  return { vraag, resultaten: results };
}

async function resolvePage(env: Env, a: Args) {
  if (a.page_id) {
    const id = normId(String(a.page_id));
    return env.DB.prepare("SELECT page_id, title, map FROM pages WHERE page_id = ?").bind(id).first<{ page_id: string; title: string; map: string }>();
  }
  if (a.naam) {
    const naam = String(a.naam).trim();
    return (
      (await env.DB.prepare("SELECT page_id, title, map FROM pages WHERE lower(title) = lower(?)").bind(naam).first<{
        page_id: string;
        title: string;
        map: string;
      }>()) ??
      (await env.DB.prepare("SELECT page_id, title, map FROM pages WHERE title LIKE ? ORDER BY length(title) LIMIT 1")
        .bind(`%${naam}%`)
        .first<{ page_id: string; title: string; map: string }>())
    );
  }
  throw new Error("geef page_id of naam");
}

export async function relaties(env: Env, a: Args) {
  const page = await resolvePage(env, a);
  if (!page) return { gevonden: false };
  const id = page.page_id;
  const uit = await env.DB.prepare("SELECT type, dst_id, dst_title, note FROM relations WHERE src_id = ?").bind(id).all();
  const inn = await env.DB.prepare("SELECT type, src_id, src_title, note FROM relations WHERE dst_id = ?").bind(id).all();
  const genoemdIn = await env.DB.prepare(
    "SELECT l.src_id AS page_id, p.title, p.map FROM links l JOIN pages p ON p.page_id = l.src_id WHERE l.dst_id = ? ORDER BY p.map, p.title",
  )
    .bind(id)
    .all();
  const linktNaar = await env.DB.prepare("SELECT dst_id AS page_id, dst_title AS title FROM links WHERE src_id = ?").bind(id).all();
  return {
    pagina: { ...page, link: craftLink(env.CRAFT_SPACE_ID, id) },
    relaties_uitgaand: uit.results,
    relaties_inkomend: inn.results,
    genoemd_in: genoemdIn.results,
    linkt_naar: linktNaar.results,
  };
}

export async function vergelijkbaar(env: Env, a: Args) {
  const id = normId(String(a.page_id));
  const aantal = Math.min(20, Math.max(1, Number(a.aantal) || 8));
  const [first] = await env.VECTORS.getByIds([vecId(id, 0)]);
  if (!first?.values) return { page_id: id, resultaten: [], reden: "pagina niet in de index" };
  const vq = await env.VECTORS.query(Array.from(first.values as ArrayLike<number>), { topK: 40, returnMetadata: "all" });
  const seen = new Map<string, { score: number; title: string; map: string }>();
  for (const m of vq.matches) {
    const md = (m.metadata || {}) as Record<string, string>;
    const pid = md.page_id || m.id.split("#")[0];
    if (pid === id || seen.has(pid)) continue;
    seen.set(pid, { score: m.score, title: md.title, map: md.map });
  }
  return {
    page_id: id,
    resultaten: [...seen.entries()].slice(0, aantal).map(([pid, v]) => ({
      titel: v.title,
      map: v.map,
      page_id: pid,
      link: craftLink(env.CRAFT_SPACE_ID, pid),
      score: Number(v.score.toFixed(4)),
    })),
  };
}

export async function indexStatus(env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT page_id, title, map, gewijzigd, indexed_at, chunk_count FROM pages ORDER BY map, title",
  ).all();
  return { aantal: results.length, paginas: results };
}

// ---------- MCP plumbing ----------

interface RpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

const rpcResult = (id: RpcRequest["id"], result: unknown) => ({ jsonrpc: "2.0", id: id ?? null, result });
const rpcError = (id: RpcRequest["id"], code: number, message: string) => ({ jsonrpc: "2.0", id: id ?? null, error: { code, message } });

export async function handleRpc(env: Env, req: RpcRequest): Promise<object | null> {
  if (!req || req.jsonrpc !== "2.0" || typeof req.method !== "string") return rpcError(req?.id, -32600, "Invalid Request");
  const isNotification = req.id === undefined;
  switch (req.method) {
    case "initialize": {
      const asked = String(req.params?.protocolVersion || "");
      return rpcResult(req.id, {
        protocolVersion: PROTOCOL_VERSIONS.includes(asked) ? asked : PROTOCOL_VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "Zoekdienst voor het Brein in Craft. Gebruik 'zoek' voor vragen, 'relaties' voor verbanden, en 'indexeer_pagina' na elke wijziging aan een Brein-pagina.",
      });
    }
    case "ping":
      return rpcResult(req.id, {});
    case "tools/list":
      return rpcResult(req.id, { tools: TOOLS });
    case "tools/call": {
      const name = String(req.params?.name || "");
      const args = (req.params?.arguments || {}) as Args;
      try {
        let out: unknown;
        if (name === "zoek") out = await zoek(env, args);
        else if (name === "relaties") out = await relaties(env, args);
        else if (name === "vergelijkbaar") out = await vergelijkbaar(env, args);
        else if (name === "index_status") out = await indexStatus(env);
        else if (name === "indexeer_pagina") out = await indexeerPagina(env, args);
        else if (name === "verwijder_pagina") out = await verwijderPagina(env, args);
        else return rpcError(req.id, -32602, `Onbekende tool: ${name}`);
        return rpcResult(req.id, { content: [{ type: "text", text: JSON.stringify(out, null, 2) }] });
      } catch (e) {
        return rpcResult(req.id, { content: [{ type: "text", text: `Fout: ${(e as Error).message}` }], isError: true });
      }
    }
    default:
      if (isNotification) return null; // e.g. notifications/initialized
      return rpcError(req.id, -32601, `Methode niet gevonden: ${req.method}`);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    if (parts.length === 0) return new Response("brein-zoek", { status: 200 });
    if (parts[0] !== "mcp" || parts.length !== 2 || !env.MCP_SECRET || !timingSafeEqual(parts[1], env.MCP_SECRET)) {
      return new Response("Not found", { status: 404 });
    }
    if (request.method === "GET") return new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } });
    if (request.method === "DELETE") return new Response(null, { status: 204 });
    if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(rpcError(null, -32700, "Parse error"), { status: 400 });
    }

    if (Array.isArray(body)) {
      const out = (await Promise.all(body.map((r) => handleRpc(env, r as RpcRequest)))).filter(Boolean);
      return out.length ? Response.json(out) : new Response(null, { status: 202 });
    }
    const out = await handleRpc(env, body as RpcRequest);
    return out ? Response.json(out) : new Response(null, { status: 202 });
  },
};
