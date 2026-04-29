# 💍 Janji Kita — Wedding Planner App

Aplikasi perencanaan pernikahan untuk pasangan yang ingin terorganisir. Mobile-first, real-time sync, dan mudah digunakan berdua.

## Fitur
- ✅ Checklist & Tugas (dengan template otomatis)
- 👥 Daftar Tamu + RSVP tracking
- 🛍️ Manajemen Vendor
- 💰 Anggaran (estimasi vs aktual)
- 🕐 Timeline Acara Hari H
- 🔗 Akses Berdua via kode unik
- ☁️ Real-time sync (Supabase)

---

## Setup Cepat (5 Menit)

### 1. Install & Run Lokal
```bash
npm install
cp .env.example .env.local
# Isi .env.local dengan kredensial Supabase
npm run dev
```

### 2. Setup Supabase
1. Daftar di [supabase.com](https://supabase.com)
2. Buat project baru
3. Buka **SQL Editor** → paste isi file `supabase-setup.sql` → Run
4. Buka **Settings → API** → copy URL & Anon Key

### 3. Isi .env.local
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_KEY=eyJ...
```

### 4. Deploy ke Netlify
1. Push ke GitHub
2. Connect repo di [netlify.com](https://netlify.com)
3. Build: `npm run build` → Publish: `dist`
4. Add env variables di Netlify settings
5. Deploy! 🚀

---

## Alur Pengguna

```
Beli app (Rp 99k)
    ↓
Buka janjikita.app
    ↓
Daftar akun (nama, email, password)
    ↓
Isi data pernikahan
    ↓
Dapat KODE AKSES (contoh: JK-ABCD-1234)
    ↓
Share kode ke pasangan via WA
    ↓
Pasangan daftar → masukkan kode → connected! ✅
    ↓
Keduanya bisa akses & edit bersama real-time 💕
```

---

## Tech Stack
- React 18 + Vite
- React Router v6
- Supabase (PostgreSQL + Auth + RLS)
- Netlify (hosting)
- Lucide React (icons)
- Google Fonts (Cormorant Garamond + DM Sans)

## File Structure
```
src/
├── lib/supabase.js       # Supabase client + semua API
├── hooks/useAuth.jsx     # Auth context
├── components/Layout.jsx # Bottom nav + header
├── pages/
│   ├── Landing.jsx       # Halaman utama
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CreateWedding.jsx
│   ├── JoinWedding.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── Guests.jsx
│   ├── Vendors.jsx
│   ├── Budget.jsx
│   └── Timeline.jsx
└── App.jsx               # Router
```
