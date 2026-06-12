# Karakter Meki Adventure

Dokumen ini mendefinisikan desain, latar belakang (lore), stats, dan dialog untuk karakter-karakter dalam game **Meki Adventure**.

---

## 1. Player (Protagonis)
*   **Nama**: Kira
*   **Peran**: Karakter utama yang dikendalikan oleh pemain untuk mengeksplorasi dunia website.
*   **Lore**: Seorang petualang muda yang tersesat di dimensi digital bernama "Meki Grove". Menggunakan tas ransel kecil berisi perkakas penting untuk memecahkan kode-kode kuno dan mengoleksi lencana proyek.
*   **Statistik**:
    *   **Kecepatan**: 4 pixel per frame
    *   **Health**: 3 / 3 Jantung (Retro Style)
    *   **Inventory**: `[]` (Mulai kosong, bisa menampung Kunci Hutan, Lentera, Lencana Proyek)
*   **Visual**: Petualang pixel-art lucu dengan tunik hijau dan ransel cokelat kecil.
*   **Path Aset**: `/game/sprites/player.png`

---

## 2. NPC Guide (Pemandu Desa)
*   **Nama**: Eldrin the Sage
*   **Peran**: Memberikan tutorial dasar, menjelaskan kontrol, dan memicu petualangan pertama.
*   **Lore**: Penjaga gerbang desa Meki yang bijaksana. Dia tahu segalanya tentang sejarah pembuatan website ini.
*   **Dialog**:
    *   *Pertemuan Pertama*: `"Selamat datang di Meki Village, petualang asing! Gunakan WASD/Arrow Keys untuk bergerak, dan tekan E untuk berinteraksi dengan dunia ini."`
    *   *Quest Active*: `"Hutan di sebelah utara menyimpan rahasia besar. Carilah 'Forest Key' di dalam peti kayu untuk membuka gerbang gua kuno!"`
    *   *Setelah Gerbang Terbuka*: `"Luar biasa! Kamu berhasil membuka gerbang gua. Silakan jelajahi warisan proyek kami di dalam sana."`
*   **Path Aset**: `/game/sprites/guide.png`

---

## 3. NPC Builder (Pengembang Proyek)
*   **Nama**: Miko the Crafter
*   **Peran**: Menghubungkan pemain ke daftar proyek (Projects Showcase).
*   **Lore**: Ahli rancang bangun di desa Meki yang bertugas menyusun berbagai bangunan megah (merepresentasikan karya/aplikasi web).
*   **Dialog**:
    *   *Sebelum Membuka Proyek*: `"Halo! Saya Miko. Saya merancang berbagai keajaiban arsitektur di sini. Tapi semuanya masih terkunci di balik portal kode."`
    *   *Interaksi Utama (Membuka Menu Proyek)*: `"Ini adalah proyek-proyek terbaik yang pernah saya bangun! Apakah kamu ingin melihat cetak birunya?"`
*   **Path Aset**: `/game/sprites/builder.png`

---

## 4. NPC Archivist (Penjaga Pengalaman & Skill)
*   **Nama**: Lyra the Keeper
*   **Peran**: Menghubungkan pemain ke daftar skill, pengalaman kerja, dan riwayat hidup (Skills & Resume).
*   **Lore**: Pustakawan kerajaan Meki yang bertugas mencatat dan memelihara seluruh buku pengetahuan tentang teknologi modern (Next.js, TypeScript, CSS, React, dll).
*   **Dialog**:
    *   *Interaksi Utama*: `"Salam, pencari pengetahuan. Di perpustakaan ini, saya menyimpan catatan kemampuan dan riwayat petualangan sang kreator. Silakan dibaca!"`
*   **Path Aset**: `/game/sprites/archivist.png`
