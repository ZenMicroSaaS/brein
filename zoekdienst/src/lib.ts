// Pure helpers for brein-zoek: chunking, relation parsing, query building and ranking.
// No Cloudflare APIs here, so everything in this file is unit-testable in Node.

export interface Chunk {
  no: number;
  text: string;
}

export interface Relation {
  type: string;
  dstId: string | null;
  dstTitle: string;
  note: string;
}

export interface Link {
  dstId: string;
  dstTitle: string;
}

export const MAX_CHUNK_CHARS = 1200;

/** Split page text into chunks of roughly MAX_CHUNK_CHARS, preferring heading and paragraph boundaries. */
export function chunkText(title: string, map: string, text: string, max = MAX_CHUNK_CHARS): Chunk[] {
  const header = `${title}${map ? ` (${map})` : ""}`;
  const clean = (text || "").replace(/\r\n/g, "\n").trim();
  if (!clean) return [{ no: 0, text: header }];

  // Split into paragraphs; keep headings attached to what follows.
  const paras = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const pieces: string[] = [];
  for (const p of paras) {
    if (p.length <= max) {
      pieces.push(p);
      continue;
    }
    // Very long paragraph: split on line breaks, then on sentences, then hard-cut.
    let buf = "";
    for (const part of p.split(/(?<=[.!?])\s+|\n/)) {
      if (part.length > max) {
        if (buf) { pieces.push(buf); buf = ""; }
        for (let i = 0; i < part.length; i += max) pieces.push(part.slice(i, i + max));
        continue;
      }
      if ((buf + " " + part).trim().length > max) {
        pieces.push(buf.trim());
        buf = part;
      } else {
        buf = (buf + " " + part).trim();
      }
    }
    if (buf) pieces.push(buf);
  }

  const chunks: Chunk[] = [];
  let cur = "";
  let lastHeading = "";
  for (const piece of pieces) {
    const isHeading = /^#{1,6}\s/.test(piece);
    if (isHeading) lastHeading = piece.replace(/^#{1,6}\s+/, "");
    if (cur && (cur + "\n\n" + piece).length > max) {
      chunks.push({ no: chunks.length, text: cur });
      // Carry the last heading into the next chunk for context.
      cur = !isHeading && lastHeading ? `## ${lastHeading}\n\n${piece}` : piece;
    } else {
      cur = cur ? `${cur}\n\n${piece}` : piece;
    }
  }
  if (cur) chunks.push({ no: chunks.length, text: cur });
  return chunks.map((c) => ({ no: c.no, text: `${header}\n\n${c.text}` }));
}

const LINK_RE = /\[([^\]]+)\]\(block:\/\/([0-9A-Za-z-]+)\)/g;

/** All block:// links in a text, de-duplicated by target id. */
export function parseLinks(text: string): Link[] {
  const seen = new Map<string, Link>();
  for (const m of (text || "").matchAll(LINK_RE)) {
    const id = m[2].toLowerCase();
    if (!seen.has(id)) seen.set(id, { dstId: id, dstTitle: m[1] });
  }
  return [...seen.values()];
}

/** Lines in the "## Relaties" section: "- <type> → [Naam](block://id) (note)" or "- <type> → Naam (note)". */
export function parseRelations(text: string): Relation[] {
  const lines = (text || "").replace(/\r\n/g, "\n").split("\n");
  const out: Relation[] = [];
  let inSection = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^#{1,6}\s/.test(line)) {
      inSection = /^#{1,6}\s+relaties\s*$/i.test(line);
      continue;
    }
    if (!inSection || !/^[-*]\s/.test(line)) continue;
    const body = line.replace(/^[-*]\s+/, "");
    const m = body.match(/^(.+?)\s*(?:→|->)\s*(.+)$/);
    if (!m) continue;
    const type = m[1].trim().toLowerCase();
    let rest = m[2].trim();
    let dstId: string | null = null;
    let dstTitle: string;
    const lm = rest.match(/^\[([^\]]+)\]\(block:\/\/([0-9A-Za-z-]+)\)\s*(.*)$/);
    if (lm) {
      dstTitle = lm[1];
      dstId = lm[2].toLowerCase();
      rest = lm[3];
    } else {
      const pm = rest.match(/^([^(]+?)\s*(\(.*\))?$/);
      dstTitle = (pm ? pm[1] : rest).trim();
      rest = pm && pm[2] ? pm[2] : "";
    }
    const note = rest.trim().replace(/^\((.*)\)$/, "$1").trim();
    out.push({ type, dstId, dstTitle, note });
  }
  return out;
}

/** Build a safe FTS5 MATCH expression: each word quoted, prefix match, OR-combined. */
export function ftsQuery(q: string): string | null {
  const words = (q || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length >= 2)
    .slice(0, 12);
  if (!words.length) return null;
  return words.map((w) => `"${w.replace(/"/g, "")}"*`).join(" OR ");
}

export interface Ranked {
  id: string;
  pageId: string;
}

/** Reciprocal rank fusion over several ranked lists of chunks; returns best score per page. */
export function rrf(lists: Ranked[][], k = 60): Map<string, { score: number; bestChunk: string }> {
  const chunkScores = new Map<string, { score: number; pageId: string }>();
  for (const list of lists) {
    list.forEach((item, idx) => {
      const prev = chunkScores.get(item.id) || { score: 0, pageId: item.pageId };
      prev.score += 1 / (k + idx + 1);
      chunkScores.set(item.id, prev);
    });
  }
  const pages = new Map<string, { score: number; bestChunk: string }>();
  for (const [chunkId, { score, pageId }] of chunkScores) {
    const p = pages.get(pageId);
    if (!p) pages.set(pageId, { score, bestChunk: chunkId });
    else {
      // Page score: best chunk plus a small bonus for additional matching chunks.
      if (score > p.score) pages.set(pageId, { score: score + p.score * 0.1, bestChunk: chunkId });
      else p.score += score * 0.1;
    }
  }
  return pages;
}

/** Short snippet around the first query word, for display. */
export function snippet(text: string, q: string, len = 280): string {
  const body = text.replace(/\s+/g, " ").trim();
  const words = (q || "").toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  let pos = -1;
  for (const w of words) {
    pos = body.toLowerCase().indexOf(w);
    if (pos >= 0) break;
  }
  const start = Math.max(0, pos < 0 ? 0 : pos - 80);
  const s = body.slice(start, start + len);
  return (start > 0 ? "…" : "") + s + (start + len < body.length ? "…" : "");
}

export function craftLink(spaceId: string, pageId: string): string {
  if (pageId.startsWith("gdrive:")) return `https://drive.google.com/open?id=${pageId.slice(7)}`;
  return `craftdocs://open?spaceId=${spaceId}&blockId=${pageId}`;
}

/** Craft ids are case-insensitive UUIDs; Google Drive ids (prefix "gdrive:") are case-sensitive. */
export function normId(id: string): string {
  const v = String(id || "").trim();
  return v.toLowerCase().startsWith("gdrive:") ? "gdrive:" + v.slice(7) : v.toLowerCase();
}

/** Extract an embedding matrix from a Workers AI response, tolerating shape differences between models. */
export function extractVectors(res: unknown): number[][] {
  const r = res as { data?: unknown; response?: unknown };
  const cand = Array.isArray(r?.data) ? r.data : Array.isArray(r?.response) ? r.response : null;
  if (!cand || !cand.length || !Array.isArray(cand[0])) {
    throw new Error("Onverwacht antwoord van het embeddingmodel");
  }
  return cand as number[][];
}
