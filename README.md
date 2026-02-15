# Spaceific

## Description
Repository ini adalah bagian backend dari project Spaceific, yang merupakan suatu sistem pemesanan ruangan kampus berbasis web.
<br>
Aplikasi ini terhubung ke backend Room Booking API dan menyediakan UI untuk:
+ autentikasi user (register & login),
+ melihat dashboard dan daftar rooms,
+ melihat dan mengelola daftar ruangan (admin),
+ melihat/mengelola booking (user),
+ mengelola status booking (admin).

## Features
+ Authentication UI (Login & Register)
+ Protected Routes (halaman tertentu hanya bisa diakses jika sudah login)
+ Rooms Page (menampilkan data ruangan dari API)
+ Bookings
  + User: create, view detail, edit, delete booking
  + Admin: melihat semua booking dan update status (Approved / Pending / Rejected)
+ Search & Pagination pada halaman booking
+ Toast notification untuk feedback sukses/gagal

## Tech Stack
+ React 19 + TypeScript
+ Vite
+ React Router DOM
+ Tailwind CSS v4 (via ```@tailwindcss/vite```)
+ react-hot-toast

## Installation
1. Clone this repository
    ```bash
    git clone https://github.com/aishazrh/2026-spaceific-frontend.git
    cd 2026-spaceific-frontend
    ```
2. Install dependencies
    ```bash
    npm install
3. Run project (development)
    ```bash
    npm run dev
    ```
Frontend akan berjalan di URL yang ditampilkan oleh Vite, di
```arduino
http://localhost:5173
```
<br>
Build (Production)
```bash
npm run build
npm run preview
```

## Usage
1. Pastikan backend API sudah berjalan (akses repository backend pada https://github.com/aishazrh/2026-spaceific-backend.git)
2. Buka aplikasi frontend (Vite dev server)
3. Login/Register (informasi login ada pada README repository backend)
4. Navigasi halaman:
    + ```/dashboard```
    + ```/rooms```
    + ```/all-bookings```
    + ```/profile```

#### Auth & Session
Aplikasi menyimpan session di localStorage:
+ token → JWT token
+ user → data user (termasuk role, misalnya Admin atau User)
<br>
Protected route ada di ```src/components/ProtectedRoute.tsx``` (jika tidak ada token/user, akan redirect ke ```/login```).

## Environment Variables
Di file API (src/api/*.ts) aplikasi memakai API_BASE_URL dari:
```import { API_BASE_URL } from "../config/api";```

## License
This project is licensed under the MIT License.

## Credits
Owner & Developer: Aisha Zarrah Amalia.