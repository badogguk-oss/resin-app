-- ============================================================
-- RESIN PLANNER — Supabase Database Schema (FIXED v2)
-- Jalankan di: Supabase > SQL Editor > New Query > RUN
-- ============================================================

-- Drop tables lama jika ada
DROP TABLE IF EXISTS operasional CASCADE;
DROP TABLE IF EXISTS modal       CASCADE;
DROP TABLE IF EXISTS orders      CASCADE;
DROP TABLE IF EXISTS bahan       CASCADE;
DROP TABLE IF EXISTS produk      CASCADE;
DROP TABLE IF EXISTS profiles    CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id                  UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nama                TEXT DEFAULT '',
  tagline             TEXT DEFAULT '',
  ig                  TEXT DEFAULT '',
  marketplace         TEXT DEFAULT '',
  lokasi              TEXT DEFAULT '',
  strategi            TEXT DEFAULT 'hybrid',
  hargatenagaperjam   NUMERIC DEFAULT 20000,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUK
CREATE TABLE produk (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama         TEXT DEFAULT '',
  line         TEXT DEFAULT 'premium',
  kategori     TEXT DEFAULT 'Aksesoris',
  waktu        NUMERIC DEFAULT 2,
  bahancost    NUMERIC DEFAULT 0,
  overhead     NUMERIC DEFAULT 20,
  markup       NUMERIC DEFAULT 200,
  stok         NUMERIC DEFAULT 0,
  channelusama TEXT DEFAULT 'Instagram',
  minorder     NUMERIC DEFAULT 1,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- BAHAN
CREATE TABLE bahan (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama       TEXT DEFAULT '',
  satuan     TEXT DEFAULT 'gram',
  hpp        NUMERIC DEFAULT 0,
  stok       NUMERIC DEFAULT 0,
  min        NUMERIC DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ORDERS
CREATE TABLE orders (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama       TEXT DEFAULT '',
  produk     TEXT DEFAULT '',
  qty        INTEGER DEFAULT 1,
  total      NUMERIC DEFAULT 0,
  dp         NUMERIC DEFAULT 0,
  platform   TEXT DEFAULT 'Instagram DM',
  status     TEXT DEFAULT 'Pending',
  tgl        DATE DEFAULT CURRENT_DATE,
  deadline   DATE,
  catatan    TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MODAL
CREATE TABLE modal (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama       TEXT DEFAULT '',
  kategori   TEXT DEFAULT 'Bahan',
  harga      NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OPERASIONAL
CREATE TABLE operasional (
  id           UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  items        JSONB DEFAULT '[]',
  targetomzet  NUMERIC DEFAULT 3000000,
  growthrate   NUMERIC DEFAULT 20,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bahan       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE modal       ENABLE ROW LEVEL SECURITY;
ALTER TABLE operasional ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_profiles"    ON profiles    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_produk"      ON produk      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_bahan"       ON bahan       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_orders"      ON orders      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_modal"       ON modal       FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_operasional" ON operasional FOR ALL USING (auth.uid() = user_id);

-- Auto updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_upd    BEFORE UPDATE ON profiles    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_operasional_upd BEFORE UPDATE ON operasional FOR EACH ROW EXECUTE FUNCTION update_updated_at();
