# PRD: Interactive Robot Physics System

---

## 1. Latar Belakang

Section portfolio saat ini punya kolom besar berisi banyak robot yang berjalan dan berinteraksi dengan ekspresi random. Fitur ini akan menambahkan lapisan **physics interaction**: robot bisa di-*hold* & *dilempar* oleh cursor user, menabrak robot lain secara chain reaction, lalu bangun dan lanjut jalan normal — lengkap dengan ekspresi emosional yang kontekstual.

**Existing stack (dari codebase saat ini):**
- Matter.js untuk physics engine badge-falling animation di hero
- `TypewriterText` component (pernah ada infinite `setState` loop bug — dijadikan catatan agar tidak terulang di sistem baru)

---

## 2. Tujuan

- Robot bereaksi realistis saat di-drag & dilempar (velocity-based throw, bukan teleport)
- Tabrakan antar robot memicu efek domino yang natural
- Robot yang jatuh bisa "bangun" dan kembali ke perilaku jalan normal
- Ekspresi wajah robot merefleksikan state interaksi (takut saat dipegang, marah saat ketabrak)
- Performa tetap smooth di mobile (mengingat riwayat bug performa animasi mobile sebelumnya)

## 3. Non-Goals

- Tidak membuat physics 3D (tetap 2D top-down/side, konsisten dengan Matter.js)
- Tidak mengubah desain visual robot (hanya menambah state ekspresi & animasi gerak)
- Tidak menambahkan multiplayer/sync antar user

---

## 4. Elemen & Teknologi yang Digunakan

| Elemen | Teknologi/Konsep | Fungsi |
|---|---|---|
| Hold & Throw | `Matter.MouseConstraint` + velocity capture manual | Menangkap gesture drag & menghitung velocity lempar |
| Tabrakan antar robot | Native Matter.js rigid body collision (`restitution`, `mass`, `friction`) | Efek nabrak & memantul otomatis dari engine |
| Chain reaction | Collision event propagation (`collisionStart`) | Robot yang tertabrak ikut terlempar ke robot lain |
| Jatuh → Bangun → Jalan lagi | State Machine "Stagger & Recover" + switch kinematic/dynamic body | Transisi antara mode scripted-walk dan mode physics-driven |
| Ekspresi (takut/marah/normal) | Event-driven expression layer, terpisah dari physics body | Sprite-swap/morph ekspresi berdasarkan trigger event |

---

## 5. Arsitektur Sistem

### 5.1 Body Mode Switching
Setiap robot punya dua mode pergerakan:
- **Kinematic mode** (default/idle/walking): posisi diatur manual per frame oleh AI walking logic, tidak terpengaruh gravity/collision dari luar.
- **Dynamic mode** (thrown/knocked): posisi diatur penuh oleh physics engine (gravity, impulse, collision response).

Switch terjadi otomatis berdasarkan trigger event (lihat state machine di bawah).

### 5.2 State Machine per Robot

```
IDLE/WALKING (kinematic)
   │  onDragStart (cursor hold)
   ▼
HELD (kinematic, posisi = cursor, ekspresi: takut)
   │  onDragEnd (release + velocity capture)
   ▼
THROWN (dynamic/physics-driven)
   │  onCollision (menabrak robot lain)
   ▼
KNOCKED (dynamic, ekspresi: marah/kesal)
   │  onSettled (velocity < threshold, ~beberapa frame stabil)
   ▼
RECOVERING (kinematic, mainkan animasi get-up, ekspresi: normal/pusing)
   │  animasi get-up selesai
   ▼
IDLE/WALKING (kinematic) ← kembali ke awal
```

### 5.3 Velocity Capture (Hold & Throw)
- Simpan posisi cursor di **beberapa frame terakhir** (misal 5 frame terakhir), bukan hanya posisi awal vs akhir.
- Saat `onDragEnd`, hitung delta rata-rata antar frame tersebut → jadikan vector velocity.
- Apply ke robot via `Body.setVelocity()` saat transisi ke mode dynamic.
- Beri **cap/limit** maksimum velocity agar tidak terlalu ekstrem (robot terbang keluar layar).

### 5.4 Collision & Chain Reaction
- Semua robot punya `restitution`, `mass`, `friction` yang di-tune agar tabrakan terasa natural (tidak terlalu mantul/kaku).
- Listen `Matter.Events.on(engine, 'collisionStart', ...)` untuk:
  - Mendeteksi robot mana yang jadi "korban" tabrakan
  - Trigger transisi state korban ke `KNOCKED`
  - Trigger ekspresi marah pada korban
- Chain reaction terjadi natural karena setiap robot yang ter-impact otomatis punya velocity baru dari collision response engine — tidak perlu logic manual tambahan untuk propagasi.

### 5.5 Settle Detection (Kapan robot "sudah diam")
- Cek `body.speed` dan `body.angularSpeed` tiap frame.
- Jika kedua nilai di bawah threshold selama N frame berturut-turut (misal 15-20 frame), anggap robot sudah settle.
- Trigger transisi ke `RECOVERING`.

### 5.6 Expression Layer (Terpisah dari Physics)
- Ekspresi **tidak** menjadi bagian dari physics body — render sebagai layer terpisah (sprite/SVG) yang posisinya di-sync ke posisi body fisika tiap frame.
- Mapping trigger → ekspresi:

| Trigger | Ekspresi |
|---|---|
| `onDragStart` | Takut |
| `onCollision` (sebagai korban) | Marah/kesal |
| `onSettled` → `RECOVERING` | Pusing/normal (transisi) |
| `IDLE/WALKING` | Random (perilaku existing, tidak berubah) |

---

## 6. Interaksi Detail (User Flow)

1. User hover robot → cursor berubah jadi indikasi "draggable" (opsional: cursor grab)
2. User klik & hold robot → robot masuk state `HELD`, ekspresi berubah jadi takut, robot mengikuti posisi cursor
3. User drag robot ke arah tertentu lalu release → robot masuk state `THROWN`, terbang sesuai velocity drag
4. Robot yang terlempar menabrak robot lain yang sedang `WALKING` → robot korban masuk state `KNOCKED`, ekspresi marah, terpental sesuai arah tabrakan (chain reaction bisa berlanjut ke robot lain)
5. Setelah kecepatan robot korban mendekati nol → masuk state `RECOVERING`, mainkan animasi bangun
6. Animasi bangun selesai → robot kembali ke `WALKING` normal dengan ekspresi random seperti semula

---

## 7. Requirement Non-Fungsional

- **Performa mobile:** Batasi jumlah robot yang aktif dalam mode `dynamic` bersamaan (misal max 5-8 robot fisika aktif) untuk mencegah frame drop, mengingat riwayat isu performa mobile di hero section sebelumnya.
- **Sleep state Matter.js:** Aktifkan `enableSleeping` pada engine agar body yang sudah diam benar-benar "tidur" dan tidak terus dihitung tiap frame (pelajaran dari bug sebelumnya di mana physics jalan terus tanpa sleep).
- **Guard infinite loop:** Pastikan transisi state machine punya guard/timeout supaya tidak ada robot yang stuck di satu state (misal stuck di `KNOCKED` karena settle detection gagal).
- **Boundary/wall:** Beri collision boundary di tepi kolom besar agar robot yang dilempar tidak keluar dari area visible.

---

## 8. Acceptance Criteria

- [ ] Robot bisa di-hold dengan cursor dan mengikuti posisi cursor secara real-time
- [ ] Saat hold, ekspresi robot berubah jadi takut
- [ ] Saat dilepas, robot terlempar dengan velocity sesuai arah & kecepatan drag user
- [ ] Robot yang dilempar bisa menabrak robot lain, dan robot yang tertabrak ikut terlempar (chain reaction)
- [ ] Robot yang tertabrak menampilkan ekspresi marah/kesal
- [ ] Robot yang sudah settle otomatis bangun (animasi get-up) lalu lanjut jalan normal
- [ ] Ekspresi kembali random/normal setelah robot kembali ke mode walking
- [ ] Tidak ada frame drop signifikan di mobile saat 3-5 robot terlibat tabrakan bersamaan
- [ ] Tidak ada robot yang stuck permanen di satu state

---

## 9. Referensi Teknis Singkat (Matter.js API yang relevan)

- `Matter.MouseConstraint.create(engine, options)` — drag handling
- `Body.setVelocity(body, vector)` — apply velocity saat throw
- `Matter.Events.on(engine, 'collisionStart', callback)` — deteksi tabrakan
- `body.speed`, `body.angularSpeed` — untuk settle detection
- `Body.setStatic(body, bool)` — switch kinematic (static) ↔ dynamic
- `engine.enableSleeping = true` — optimasi performa

---

*Catatan: PRD ini adalah spesifikasi fungsional & arsitektural, implementasi kode detail disusun terpisah saat eksekusi di Antigravity.*
