# 🪬 Resin Planner v3 — Setup Guide (FIXED)

Backend: Supabase · Frontend: React + Vite · Deploy: Vercel

---

## BUG YANG SUDAH DIFIX

1. ✅ Nama kolom database sekarang konsisten lowercase (tidak ada camelCase)
2. ✅ Google OAuth redirect URL sudah benar
3. ✅ Error handling login lebih informatif
4. ✅ maybeSingle() dipakai agar tidak error saat data kosong
5. ✅ useIsMobile() responsive hook dengan event listener
6. ✅ Field `order.produk` tidak konflik dengan nama tabel

---

## LANGKAH 1 — Setup Supabase

1. Buka **supabase.com** → daftar gratis
2. Klik **"New project"** → isi nama: `resin-planner` → Create
3. Tunggu ~2 menit project siap
4. Klik **"SQL Editor"** → **"New query"**
5. Copy-paste seluruh isi `supabase_schema.sql` → klik **RUN**
6. Pastikan muncul "Success. No rows returned"

**Ambil API Keys:**
- Supabase sidebar → **Settings** → **API**
- Copy: **Project URL** dan **anon public** key

---

## LANGKAH 2 — Aktifkan Login Google (Opsional)

Jika ingin fitur "Login dengan Google":

1. Buka **console.cloud.google.com** → buat project baru
2. APIs & Services → **Credentials** → Create Credentials → **OAuth client ID**
3. Application type: **Web application**
4. Authorized redirect URIs tambahkan:
   ```
   https://[PROJECT-REF].supabase.co/auth/v1/callback
   ```
   (Project ref ada di Supabase → Settings → General)
5. Copy **Client ID** dan **Client Secret**
6. Kembali ke Supabase → **Authentication** → **Providers** → **Google**
7. Enable → paste Client ID & Secret → Save
8. Di Supabase → Authentication → **URL Configuration** → tambahkan URL Vercel kamu ke **Redirect URLs**:
   ```
   https://resin-planner-xxx.vercel.app
   ```

Jika tidak mau setup Google, tombol "Lanjut dengan Google" tetap ada tapi akan muncul pesan error — tidak masalah, login email tetap berfungsi normal.

---

## LANGKAH 3 — Upload ke GitHub

1. Buka **github.com** → New repository → nama: `resin-planner` → Create
2. Klik **"uploading an existing file"**
3. Upload **semua isi folder `resin-app`** (isinya, bukan foldernya)
4. Commit changes

---

## LANGKAH 4 — Deploy ke Vercel

1. **vercel.com** → Login with GitHub → New Project → Import `resin-planner`
2. Sebelum deploy, buka **Environment Variables** dan tambahkan:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | https://xxxxx.supabase.co |
   | `VITE_SUPABASE_ANON_KEY` | eyJhb... (anon key) |

3. Klik **Deploy** → tunggu ~2 menit
4. ✅ Dapat link: `https://resin-planner-xxx.vercel.app`

**Jangan lupa:** Tambahkan URL Vercel ke Supabase:
- Authentication → URL Configuration → Site URL → isi URL Vercel kamu

---

## LANGKAH 5 — Install di iPhone

1. Buka link Vercel di **Safari** iPhone
2. Tap ikon **Share** (↑) → **"Add to Home Screen"** → Add
3. ✅ Muncul di home screen seperti app native!

---

## Troubleshooting Login

**"Invalid login credentials"** → Email/password salah atau belum daftar

**"Email not confirmed"** → Cek inbox/spam, klik link konfirmasi dari Supabase

**"User already registered"** → Sudah pernah daftar, gunakan "Masuk" bukan "Daftar"

**Halaman putih / tidak load** → Cek environment variable di Vercel sudah diisi

**Google login tidak bekerja** → Ikuti Langkah 2 di atas, atau pakai login email biasa

---

## Update App

1. Edit file di GitHub (atau upload ulang App.jsx)
2. Vercel otomatis redeploy dalam ~1 menit
