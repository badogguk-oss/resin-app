# 🪬 Resin Planner v3 — Setup Guide

Backend: Supabase · Frontend: React + Vite · Deploy: Vercel

---

## LANGKAH 1 — Setup Supabase (Database & Auth)

1. Buka **supabase.com** → Daftar gratis
2. Klik **"New project"** → isi nama: `resin-planner` → buat password database → Create
3. Tunggu ~2 menit sampai project siap
4. Klik **"SQL Editor"** di sidebar kiri
5. Klik **"New query"**
6. **Copy seluruh isi file `supabase_schema.sql`** → paste di editor → klik **RUN**
7. Semua tabel akan terbuat otomatis ✅

**Ambil API Keys:**
- Masih di Supabase → klik **"Settings"** → **"API"**
- Copy: **Project URL** dan **anon public** key
- Simpan dulu, akan dipakai di langkah 3

---

## LANGKAH 2 — Upload ke GitHub

1. Buka **github.com** → Login
2. Klik **"New repository"** → nama: `resin-planner` → Public → Create
3. Klik **"uploading an existing file"**
4. Upload **semua isi folder `resin-app`** (bukan folder-nya, tapi isinya)
5. Klik **"Commit changes"**

---

## LANGKAH 3 — Deploy ke Vercel

1. Buka **vercel.com** → Login dengan GitHub
2. **"Add New Project"** → pilih repo `resin-planner` → Import
3. Sebelum Deploy, klik **"Environment Variables"** → tambahkan:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | https://xxxxx.supabase.co |
   | `VITE_SUPABASE_ANON_KEY` | eyJhb... (anon key dari Supabase) |

4. Klik **"Deploy"** → tunggu ~2 menit
5. ✅ Dapat link: `https://resin-planner-xxx.vercel.app`

---

## LANGKAH 4 — Install di iPhone

1. Buka link Vercel di **Safari** iPhone
2. Tap ikon **Share** (↑) → **"Add to Home Screen"**
3. Tap **"Add"** → selesai! 🎉

---

## Fitur Aplikasi

- 🔐 **Login/Register** — data tersimpan per akun
- 📱 **Responsive** — desktop sidebar + mobile bottom nav
- ☁️ **Cloud sync** — data tersimpan di Supabase, bisa akses dari HP manapun
- 📦 **Dual Line** — Premium & Volume strategy
- 💰 **Auto-hitung harga** — HPP + tenaga + overhead + markup
- 📋 **Tracker order** — dengan status real-time
- 📊 **Proyeksi 6 bulan** — keuangan otomatis
- ⚠️ **Alert stok** — notifikasi bahan hampir habis

---

## Update App

Kalau ada perubahan di `App.jsx`:
1. Update file di GitHub
2. Vercel otomatis re-deploy dalam ~1 menit
