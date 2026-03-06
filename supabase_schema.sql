-- ============================================================
-- RESIN PLANNER — Supabase Database Schema
-- Jalankan seluruh file ini di: Supabase > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nama            TEXT DEFAULT '',
  tagline         TEXT DEFAULT '',
  ig              TEXT DEFAULT '',
  marketplace     TEXT DEFAULT '',
  lokasi          TEXT DEFAULT '',
  strategi        TEXT DEFAULT 'hybrid',
  "hargaTenagaPerJam" NUMERIC DEFAULT 20000,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── PRODUK ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produk (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama            TEXT DEFAULT '',
  line            TEXT DEFAULT 'premium',
  kategori        TEXT DEFAULT 'Aksesoris',
  waktu           NUMERIC DEFAULT 2,
  "bahanCost"     NUMERIC DEFAULT 0,
  overhead        NUMERIC DEFAULT 20,
  markup          NUMERIC DEFAULT 200,
  stok            NUMERIC DEFAULT 0,
  "channelUtama"  TEXT DEFAULT 'Instagram',
  "minOrder"      NUMERIC DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── BAHAN ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bahan (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama            TEXT DEFAULT '',
  satuan          TEXT DEFAULT 'gram',
  hpp             NUMERIC DEFAULT 0,
  stok            NUMERIC DEFAULT 0,
  min             NUMERIC DEFAULT 50,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── ORDERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama            TEXT DEFAULT '',
  produk          TEXT DEFAULT '',
  qty             INTEGER DEFAULT 1,
  total           NUMERIC DEFAULT 0,
  dp              NUMERIC DEFAULT 0,
  platform        TEXT DEFAULT 'Instagram DM',
  status          TEXT DEFAULT 'Pending',
  tgl             DATE DEFAULT CURRENT_DATE,
  deadline        DATE,
  catatan         TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── MODAL ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modal (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nama            TEXT DEFAULT '',
  kategori        TEXT DEFAULT 'Bahan',
  harga           NUMERIC DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── OPERASIONAL ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operasional (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  items           JSONB DEFAULT '[]',
  "targetOmzet"   NUMERIC DEFAULT 3000000,
  "growthRate"    NUMERIC DEFAULT 20,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) — Setiap user hanya bisa akses data sendiri
-- ============================================================

ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE produk      ENABLE ROW LEVEL SECURITY;
ALTER TABLE bahan       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE modal       ENABLE ROW LEVEL SECURITY;
ALTER TABLE operasional ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL USING (auth.uid() = user_id);

-- Produk
CREATE POLICY "Users can manage own produk"
  ON produk FOR ALL USING (auth.uid() = user_id);

-- Bahan
CREATE POLICY "Users can manage own bahan"
  ON bahan FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users can manage own orders"
  ON orders FOR ALL USING (auth.uid() = user_id);

-- Modal
CREATE POLICY "Users can manage own modal"
  ON modal FOR ALL USING (auth.uid() = user_id);

-- Operasional
CREATE POLICY "Users can manage own operasional"
  ON operasional FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_operasional_updated_at
  BEFORE UPDATE ON operasional
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SELESAI ✅
-- Sekarang buka src/supabase.js dan isi VITE_SUPABASE_URL
-- dan VITE_SUPABASE_ANON_KEY dari Settings > API di Supabase
-- ============================================================
