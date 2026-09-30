# Ikatan Periset Indonesia

Next.js App Router portal with Tailwind CSS and shadcn/ui (Base UI) components.

## Run

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use Node.js 22.18+ (native TypeScript stripping is needed for the tests).

## Demo login

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@periset.id | admin123 |
| Admin | admin2@periset.id | admin123 |
| Periset | periset1@periset.id | periset123 |
| Other researchers | periset2@periset.id through periset16@periset.id | periset123 |

The original `admin@periset.or.id / admin123` login remains an alias for the main admin while its email remains `admin@periset.id`. Credentials are also displayed on `/login`. Seed identities, contact details, and portfolios are fictional.

## Permissions and routes

- `/dashboard`: overview and an interactive SVG Indonesia map. Hub totals are derived from all accounts with the Periset role, including inactive profiles; the active count is shown separately. Hover, keyboard focus, Enter/Space, or touch reveal hub names and counts. Text buttons offer a small-screen alternative.
- `/dashboard/karyawan`: Admin-only account and personnel management. Hidden for Periset; direct navigation renders an access-denied state without mounting management controls.
- `/dashboard/settings`: editable profile, verified password change, saved notification preferences, and Admin-only Master Akun. Admins can create accounts, change roles, reset demo passwords, edit profiles, and delete accounts. The last Admin cannot be removed/demoted, and the signed-in account cannot delete itself.
- `/dashboard/profil`: own profile, photo upload/removal, short biography, location, and personnel details. Photos accept decoded PNG/JPG/WebP up to 500 KB; click **Simpan Profil** to persist.
- `/dashboard/portofolio`: own Publications, Copyrights/Patents, and Other Works, each with create, read, edit, and confirmed delete. Entries include title, year, description, publisher/organization, identifier, and optional HTTP(S) link.
- Existing `/`, `/login`, `/berita/[id]`, `/dashboard/program-kerja`, and `/dashboard/monev` routes are preserved. Program and Monev retain their existing in-memory CRUD behavior.

The landing page places a complete decorative Earth, centered on Indonesia, in a separate responsive hero column. Its land outlines are illustrative, not administrative boundaries.

## Pendaftaran, donasi, dan peta

- `/daftar`: pendaftaran anggota dengan nama, email unik, nomor telepon, instansi, bidang riset, lokasi jejaring, dan kata sandi. Akun baru selalu berperan sebagai periset dan dapat langsung masuk melalui `/login`.
- `/dashboard/donasi`: nominal pilihan atau nominal sendiri (Rp1.000–Rp100.000.000), metode QRIS, Transfer Bank, Dompet Digital, dan Virtual Account. Alur konfirmasi dan pembayaran hanya simulasi; tidak ada transaksi ke penyedia pembayaran.
- Admin dapat berdonasi dan melihat riwayat seluruh donasi. Periset hanya mendapat formulir donasi dan konfirmasi miliknya, tanpa total atau riwayat donatur lain. Pemeriksaan akses ini mengikuti batas simulasi lokal yang dijelaskan di bawah.
- Empat donasi contoh ditambahkan sekali pada basis data lama. Donasi baru disimpan di `ipi_database_v1` dan tetap ada setelah muat ulang. Data iuran lama dipertahankan sebagai arsip; rute `/dashboard/iuran-kelembagaan` dialihkan ke halaman donasi.
- Peta dasbor menggunakan MapLibre GL JS, peta dasar vektor OpenFreeMap/OpenStreetMap, serta titik jejaring GeoJSON. Peta memerlukan WebGL dan koneksi internet untuk ubin peta; daftar lokasi tetap tersedia bila peta gagal dimuat. Skrip `predev` dan `prebuild` menyalin worker MapLibre beserta modul pendampingnya ke `public/maplibre` secara otomatis.
- `src/lib/map-data.ts` menyediakan tipe `RegionalData` dengan `regionCode`, `name`, dan `value`. Masukkan GeoJSON Polygon/MultiPolygon resmi melalui properti `regions` pada `IndonesiaMap` untuk mengaktifkan lapisan warna dan batas wilayah. Belum ada batas administratif contoh yang diklaim sebagai data resmi.

Alur uji: daftar lalu masuk sebagai periset, buat donasi, muat ulang, kemudian masuk sebagai admin untuk memeriksa riwayat. Uji juga nominal tidak valid, email duplikat, pembatalan konfirmasi, dan tampilan seluler. Akun baru hanya menerima kata sandi yang didaftarkan, bukan kata sandi demo umum.

## Mock database schema

`src/lib/research-store.ts` defines the versioned tables, deterministic seed, validation, permission checks, and immutable mutations:

| Table | Key / relationship | Fields |
| --- | --- | --- |
| accounts | id | name, unique normalized email, role (`admin` / `periset`), demo password |
| profiles | userId → accounts.id (one-to-one) | bio, avatar data URL, locationId, bidangRiset, jabatan, nip, phone, status, notification preferences |
| publications | id; userId → accounts.id | title, year, description, publisher, identifier (DOI/ISBN), url, createdAt, updatedAt |
| copyrights | id; userId → accounts.id | same common fields; identifier holds copyright/patent number |
| works | id; userId → accounts.id | same common fields; publisher holds partner and identifier holds project code |
| locations | fixed id | city, region, longitude, latitude (14 hubs across Indonesia) |

Seed: 2 Admins, 16 Periset, 18 profiles, and 48 portfolio entries. Account deletion cascades to the profile and all owned portfolio records. Role changes immediately affect navigation, mutation permissions, and map totals. Each mutation rechecks the current account and ownership; a researcher cannot supply another owner ID when creating a work.

The database is persisted in browser `localStorage` under `ipi_database_v1`; the session stores only the account ID under `ipi_session_v1`. Reloads and logout/login preserve edits. Storage events synchronize tabs. Failed storage writes report errors and do not show a success state. On a first visit, the seed is installed automatically. To intentionally reset the demo, remove those two keys through browser developer tools and reload (this erases local demo changes).

**Demo boundary:** this is a client-side mock, not production authentication. All seeded credentials and data are available to the browser, passwords are plaintext demo values, and browser storage can be manipulated. Before handling real users, replace it with server sessions, hashed passwords, server-side authorization/row policies, database constraints, and managed image storage. Notification delivery is not connected. Data is local to one browser/origin and is not shared between devices.

## Validation

```sh
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Regression tests cover seed integrity, account permissions, duplicate emails, demotion, last-Admin protection, profile ownership, unsafe URLs, all three portfolio CRUD flows, persistence serialization, cascade deletion, map counts, and password verification.

Manual acceptance flow:
1. Log in as Admin; create a Periset with a unique email, password, and location. Verify its row and map count. Edit its role in Master Akun.
2. Log out and use the new credentials; verify the correct sidebar and direct-route guard for `/dashboard/karyawan` as a Periset.
3. Save a biography and photo, change location, and reload. Confirm profile/avatar/map updates persist.
4. Add, edit, and delete an entry in each portfolio category. Sign in as another Periset to verify portfolios remain separate.
5. Visit news, program kerja, and monev routes. Verify forms have dark text on white backgrounds, including under a dark OS preference.
