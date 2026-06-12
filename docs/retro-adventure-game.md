# Dokumentasi Game Retro Top-Down Adventure

## Ringkasan

Game ini adalah mini adventure top-down bergaya 8-bit untuk web. Inspirasinya datang dari game Nintendo jadul seperti The Legend of Zelda, tetapi seluruh nama, dunia, karakter, aset, musik, dan simbol dibuat original.

Tujuan utama game bukan hanya hiburan, tetapi juga menjadi cara interaktif untuk menjelajahi isi website. Pemain bisa berjalan di map kecil, berbicara dengan NPC, membuka peti, menyelesaikan puzzle ringan, dan masuk ke area yang merepresentasikan konten web seperti profil, project, galeri, atau kontak.

## Judul Sementara

Pilihan nama:

- Pixel Quest
- Forest Relic
- Meki Adventure
- Relic of the Grove

Rekomendasi awal: `Meki Adventure`, karena mudah diingat dan bisa langsung terasa sebagai bagian dari identitas website.

## Arah Visual

Gaya visual:

- Pixel art 8-bit atau 16-bit sederhana
- Kamera top-down
- Tile map berbasis grid
- Warna cerah, kontras, dan mudah dibaca
- UI dialog berbentuk panel retro
- Animasi pendek: idle, walk, interact, chest open

Yang boleh diambil sebagai inspirasi:

- Eksplorasi top-down
- Dungeon kecil
- Sistem kunci dan pintu
- Peti item
- NPC dengan dialog pendek
- Puzzle dorong batu atau aktifkan tombol

Yang harus dihindari:

- Nama Link, Zelda, Hyrule, Triforce, Master Sword
- Sprite, musik, sound effect, logo, atau map asli dari Nintendo
- Bentuk simbol yang terlalu identik dengan franchise tertentu
- Cerita, karakter, atau item yang menyalin langsung game aslinya

## Core Gameplay

Pemain mengontrol satu karakter di dunia kecil. Pemain bisa bergerak bebas di empat arah, berinteraksi dengan objek, dan membuka area baru lewat puzzle ringan.

Loop utama:

1. Pemain masuk ke map utama.
2. Pemain eksplorasi desa atau hutan kecil.
3. Pemain bertemu NPC yang memberi petunjuk.
4. Pemain menemukan item atau kunci.
5. Pemain membuka pintu, gua, atau portal.
6. Pemain melihat konten website atau menyelesaikan mini objective.

## Kontrol

Desktop:

- `WASD` atau `Arrow Keys`: bergerak
- `E`: interaksi
- `Esc`: tutup dialog/menu

Mobile:

- Virtual D-pad di kiri bawah
- Tombol aksi di kanan bawah
- Tap objek untuk interaksi opsional

## Struktur Dunia

Map awal dibuat kecil agar cepat selesai dan tetap terasa polished.

Area utama:

- Village: area aman, berisi NPC dan papan petunjuk
- Forest: area eksplorasi ringan, berisi rintangan dan peti
- Cave: dungeon kecil, berisi puzzle kunci/pintu
- Shrine: area goal, membuka pesan akhir atau highlight project

Contoh hubungan dengan website:

- NPC pertama: memperkenalkan pemilik website
- Papan desa: daftar project
- Peti hutan: skill atau achievement
- Gua: case study/project detail
- Shrine: contact/social link

## Entity

### Player

Data minimal:

- `x`, `y`: posisi
- `direction`: arah hadap
- `speed`: kecepatan gerak
- `inventory`: daftar item
- `canInteract`: status interaksi terdekat

### NPC

Data minimal:

- `id`
- `name`
- `x`, `y`
- `dialogue`
- `action`

Contoh NPC:

- Guide: memberi tutorial singkat
- Builder: membuka daftar project
- Archivist: menjelaskan pengalaman atau riwayat

### Item

Data minimal:

- `id`
- `name`
- `type`
- `description`
- `unlocks`

Contoh item:

- Forest Key: membuka Cave
- Tiny Lantern: memberi akses ke area gelap
- Project Badge: menandai project yang sudah ditemukan

### Obstacle

Jenis:

- Wall
- Tree
- Water
- Rock
- Locked Door

Obstacle perlu punya collision agar pemain tidak bisa menembus tile tertentu.

## Sistem Interaksi

Interaksi terjadi ketika pemain menghadap objek dalam jarak dekat lalu menekan `E`.

Jenis interaksi:

- Dialog NPC
- Membuka peti
- Membaca papan
- Membuka pintu
- Mengaktifkan tombol
- Menampilkan modal konten website

Prioritas interaksi:

1. NPC
2. Chest
3. Door
4. Sign
5. Generic object

## Puzzle Awal

Puzzle pertama sebaiknya sangat sederhana.

Contoh:

1. Pemain bicara dengan NPC Guide.
2. NPC memberi petunjuk: cari kunci di hutan.
3. Pemain masuk hutan dan membuka peti.
4. Peti memberi `Forest Key`.
5. Pemain kembali ke pintu gua.
6. Pintu terbuka jika inventory berisi `Forest Key`.

Puzzle ini cukup untuk membuat game terasa punya progres tanpa membuat implementasi berat.

## UI

Elemen UI utama:

- Dialog box di bawah layar
- Inventory kecil
- Prompt interaksi: `E`
- Mini status objective
- Pause/menu sederhana

Teks UI harus singkat. Game sebaiknya menjelaskan lewat interaksi, bukan paragraf panjang di layar.

## Audio

Audio opsional pada versi awal.

Jika ditambahkan:

- Gunakan chiptune original atau asset berlisensi bebas
- Tambahkan toggle mute
- Efek suara pendek untuk langkah, peti, dialog, dan unlock

Jangan menggunakan musik atau sound effect dari game Nintendo.

## Rencana Implementasi

### Versi 1: Prototype

Target:

- Canvas atau DOM grid sederhana
- Player bisa bergerak
- Collision dengan wall/tree
- Satu map kecil
- Satu NPC dengan dialog
- Satu peti dan satu item

### Versi 2: Website Integration

Target:

- NPC membuka profil
- Papan membuka daftar project
- Shrine membuka contact/social link
- Dialog box lebih rapi
- Responsive mobile control

### Versi 3: Polish

Target:

- Pixel art custom
- Animasi gerak
- Transisi antar area
- Puzzle kunci/pintu
- Save progress di localStorage
- Sound effect original

## Struktur File yang Disarankan

Jika dibuat di Next.js:

```text
app/
  page.tsx
  globals.css
components/
  game/
    RetroAdventure.tsx
    GameCanvas.tsx
    DialogueBox.tsx
    MobileControls.tsx
lib/
  game/
    maps.ts
    entities.ts
    collision.ts
    input.ts
    state.ts
public/
  game/
    sprites/
    tiles/
    audio/
```

Untuk tahap awal, game bisa dibuat di satu komponen `RetroAdventure.tsx` dulu. Setelah mekanik stabil, baru dipisah menjadi modul kecil.

## Data Map Contoh

Map bisa direpresentasikan sebagai array tile.

```ts
const villageMap = [
  "WWWWWWWWWW",
  "W........W",
  "W..N.....W",
  "W....C...W",
  "W........W",
  "W.....D..W",
  "WWWWWWWWWW",
];
```

Legenda:

- `W`: wall/tree
- `.`: ground
- `N`: NPC
- `C`: chest
- `D`: door

## Kriteria Sukses

Prototype dianggap berhasil jika:

- Pemain langsung mengerti cara bergerak
- Interaksi terasa responsif
- Tidak ada aset Nintendo yang digunakan
- Game bisa dimainkan di desktop dan mobile
- Setidaknya satu konten website bisa dibuka lewat interaksi game
- Pengalaman selesai dalam 1 sampai 3 menit

## Catatan Legal dan Kreatif

Game ini boleh terasa seperti game adventure retro klasik, tetapi harus punya identitas sendiri. Fokus pada bahasa visual umum seperti pixel art, eksplorasi, dungeon kecil, dan dialog box. Hindari menyalin karakter, nama, bentuk item ikonik, musik, atau layout map yang bisa dikenali dari game tertentu.
