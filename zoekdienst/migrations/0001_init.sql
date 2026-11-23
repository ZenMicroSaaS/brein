-- brein-zoek: register of indexed pages, chunk text for keyword search, links and typed relations.

CREATE TABLE IF NOT EXISTS pages (
  page_id     TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  map         TEXT NOT NULL DEFAULT '',
  gewijzigd   TEXT,
  indexed_at  TEXT NOT NULL,
  chunk_count INTEGER NOT NULL DEFAULT 0
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  chunk_id UNINDEXED,
  page_id  UNINDEXED,
  title,
  map      UNINDEXED,
  text,
  tokenize = 'unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS links (
  src_id    TEXT NOT NULL,
  dst_id    TEXT NOT NULL,
  dst_title TEXT NOT NULL,
  PRIMARY KEY (src_id, dst_id)
);
CREATE INDEX IF NOT EXISTS links_dst ON links (dst_id);

CREATE TABLE IF NOT EXISTS relations (
  src_id    TEXT NOT NULL,
  src_title TEXT NOT NULL,
  type      TEXT NOT NULL,
  dst_id    TEXT,
  dst_title TEXT NOT NULL,
  note      TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS relations_src ON relations (src_id);
CREATE INDEX IF NOT EXISTS relations_dst ON relations (dst_id);
