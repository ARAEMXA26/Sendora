# Bot Tele Auto Send Website

Implementasi website berdasarkan SRS Bot Tele dengan cakupan:

- Flow autentikasi: Login/Register Web -> OTP Telegram -> Verifikasi Lisensi -> Dashboard
- Role Super Admin berdasarkan nomor Telegram khusus
- User dashboard: kelola group, teks pesan, delay, start/stop auto send
- Admin dashboard: generate key, monitor overview, CRUD user dan key

## Tech Stack

- Next.js 16 (App Router, Route Handlers)
- TypeScript
- Tailwind CSS 4
- Firebase Authentication (Client SDK + Admin SDK)
- PostgreSQL + Prisma ORM (schema + migration)

## Entitas Data yang Diimplementasikan

- Users
- Sessions
- OTP Sessions (Telegram)
- Target Groups
- Message Texts
- License Keys
- Auto Send Status
- Send Logs

Semua entitas berada di `prisma/schema.prisma` dengan migration awal di
`prisma/migrations/202604060001_init/migration.sql`.

## Menjalankan Proyek

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Lalu buka http://localhost:3000

Pastikan `DATABASE_URL` pada `.env.local` mengarah ke PostgreSQL Anda.

Jika muncul error Prisma `P1010: User was denied access on the database`, cek hal berikut:

- User PostgreSQL pada `DATABASE_URL` benar-benar punya akses ke database target.
- Database target sudah dibuat.

Contoh setup lokal cepat:

```bash
createdb bot_tele_web
DATABASE_URL='postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/bot_tele_web?schema=public' npm run prisma:deploy
```

## Konfigurasi Firebase Authentication (Real)

Isi environment pada file .env.local berdasarkan .env.example:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY

Catatan penting FIREBASE_PRIVATE_KEY:

- Simpan private key service account dalam satu baris dengan escape newline (\\n).
- Contoh format nilai: -----BEGIN PRIVATE KEY-----\\nABC...\\n-----END PRIVATE KEY-----\\n

Alur FR1 sekarang:

1. Halaman /auth melakukan register/login langsung ke Firebase Authentication.
2. Client mengambil Firebase ID token.
3. Token dikirim ke backend /api/auth/firebase-session.
4. Backend verifikasi token via Firebase Admin dan membuat sesi aplikasi (cookie bt_session).

## Super Admin

Secara default, nomor berikut diperlakukan sebagai Super Admin:

```text
6288293680886
```

Anda dapat override melalui env:

```bash
SUPER_ADMIN_PHONE=6288293680886
```

## Konfigurasi Telegram Login (MTProto)

Sistem menggunakan Client API (MTProto) dari aplikasi Telegram resmi, bukan API Bot. Saat user menginputkan nomor HP, Telegram akan secara langsung mengirimkan kode OTP ke dalam aplikasi Telegram resmi mereka.

Anda harus mendaftar di [my.telegram.org](https://my.telegram.org) untuk mendapatkan kredensial:

1. Buat aplikasi di my.telegram.org
2. Dapatkan `api_id` dan `api_hash`
3. Tambahkan ke file `.env.local`:

```bash
TELEGRAM_API_ID=XXXXXXX
TELEGRAM_API_HASH=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Sesudah terhubung, sistem dapat menarik seluruh daftar Grup yang ada di akun yang login dan bisa mengirim pesan text ter-otomatisasi dari *akun pribadi* tersebut.

## Alur Penggunaan

1. Register atau login di halaman /auth
2. Lanjut ke /telegram untuk request + verifikasi OTP
3. User biasa lanjut ke /license untuk validasi key
4. Setelah valid, user masuk /dashboard
5. Super Admin langsung diarahkan ke /admin

## Mapping Functional Requirement (FR)

- FR1: Firebase client auth + /api/auth/firebase-session
- FR2: /api/telegram/request-otp, /api/telegram/verify-otp
- FR3: /api/license/validate
- FR4: /api/admin/keys (POST)
- FR5: /api/groups (+ delete by id)
- FR6: /api/messages (+ delete by id)
- FR7: /api/config/delay
- FR8: /api/autosend/start, /api/autosend/stop, /api/autosend/logs
- FR9: /api/admin/overview, /api/admin/users/[userId], /api/admin/keys/[keyId]

## Catatan Implementasi

- Worker Auto Send berjalan background per user menggunakan timer di server process.
- Struktur class service menyesuaikan class diagram SRS: SistemWebsite, TelegramService,
  WorkerAutoSend, KeyGenerator, dan Database.
- Endpoint auth lokal /api/auth/register dan /api/auth/login dinonaktifkan agar tidak bypass Firebase.

