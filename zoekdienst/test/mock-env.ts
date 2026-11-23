// In-memory stand-ins for D1 (node:sqlite, with FTS5), Vectorize and Workers AI, for local tests.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import type { Env } from "../src/index";

class Stmt {
  constructor(private db: DatabaseSync, private sql: string, private params: unknown[] = []) {}
  bind(...p: unknown[]) {
    return new Stmt(this.db, this.sql, p);
  }
  async first<T>() {
    return (this.db.prepare(this.sql).get(...(this.params as never[])) as T) ?? null;
  }
  async all<T>() {
    return { results: this.db.prepare(this.sql).all(...(this.params as never[])) as T[] };
  }
  run() {
    this.db.prepare(this.sql).run(...(this.params as never[]));
  }
}

export function mockD1(): D1Database {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../migrations/0001_init.sql", import.meta.url), "utf8"));
  return {
    prepare: (sql: string) => new Stmt(db, sql),
    batch: async (stmts: Stmt[]) => {
      db.exec("BEGIN");
      try {
        for (const s of stmts) s.run();
        db.exec("COMMIT");
      } catch (e) {
        db.exec("ROLLBACK");
        throw e;
      }
      return [];
    },
  } as unknown as D1Database;
}

// Toy embedding: hashed bag of word stems with a few hand-made synonyms, so "geld" ~ "budget".
const SYN: Record<string, string> = { geld: "budget", financieel: "budget", kosten: "budget", investeerder: "investering", investeerde: "investering" };
const DIM = 256;
function toyEmbed(text: string): number[] {
  const v = new Array(DIM).fill(0);
  for (let w of text.toLowerCase().split(/[^\p{L}\p{N}]+/u)) {
    if (w.length < 3) continue;
    w = SYN[w] ?? w.slice(0, 6);
    let h = 0;
    for (const ch of w) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    v[h % DIM] += 1;
  }
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
}

export function mockAI(): Ai {
  return { run: async (_m: string, input: { text: string[] }) => ({ shape: [input.text.length, DIM], data: input.text.map(toyEmbed) }) } as unknown as Ai;
}

export function mockVectorize(): VectorizeIndex & { store: Map<string, { values: number[]; metadata: Record<string, string> }> } {
  const store = new Map<string, { values: number[]; metadata: Record<string, string> }>();
  const cos = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
  return {
    store,
    upsert: async (vs: { id: string; values: number[]; metadata: Record<string, string> }[]) => {
      for (const v of vs) store.set(v.id, { values: v.values, metadata: v.metadata });
      return { mutationId: "x" };
    },
    deleteByIds: async (ids: string[]) => {
      ids.forEach((id) => store.delete(id));
      return { mutationId: "x" };
    },
    getByIds: async (ids: string[]) => ids.filter((id) => store.has(id)).map((id) => ({ id, ...store.get(id)! })),
    query: async (q: number[], opts: { topK: number; filter?: Record<string, string> }) => {
      const matches = [...store.entries()]
        .filter(([, v]) => !opts.filter || Object.entries(opts.filter).every(([k, val]) => v.metadata[k] === val))
        .map(([id, v]) => ({ id, score: cos(q, v.values), metadata: v.metadata }))
        .sort((a, b) => b.score - a.score)
        .slice(0, opts.topK);
      return { matches, count: matches.length };
    },
  } as unknown as VectorizeIndex & { store: Map<string, { values: number[]; metadata: Record<string, string> }> };
}

export function mockEnv(): Env {
  return { AI: mockAI(), VECTORS: mockVectorize(), DB: mockD1(), MCP_SECRET: "geheim-123", CRAFT_SPACE_ID: "space-1" };
}
