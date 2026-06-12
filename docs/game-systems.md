# Dokumentasi Sistem Game

Dokumen ini menjelaskan isi game yang akan menjadi fondasi Meki Adventure: leveling, musuh, mining, reward, inventory, quest, dan ekonomi. Fokus awal tetap game retro playable, lalu sistem ini bisa dikembangkan untuk Web3 di tahap berikutnya.

## Core Loop

Loop utama game:

1. Player masuk map.
2. Player menerima objective dari NPC atau papan quest.
3. Player eksplorasi area.
4. Player mengumpulkan resource, item, atau clue.
5. Player menghadapi musuh/rintangan.
6. Player menyelesaikan objective.
7. Player mendapat XP, item, badge, atau akses area baru.
8. Player kembali ke village untuk upgrade/progres.

Core loop pendek:

```text
Explore -> Collect -> Fight/Avoid -> Complete Quest -> Get Reward -> Unlock
```

## Leveling Player

Leveling dipakai untuk memberi rasa progres, bukan untuk membuat grind berat.

### Stat Player

Stat dasar:

- `level`: level player.
- `xp`: pengalaman saat ini.
- `xpToNextLevel`: XP yang dibutuhkan untuk naik level.
- `hp`: health.
- `maxHp`: maksimum health.
- `attack`: damage dasar.
- `defense`: pengurangan damage.
- `stamina`: energi untuk action tertentu.
- `luck`: peluang drop item tambahan.

Contoh data:

```ts
type PlayerStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  stamina: number;
  luck: number;
};
```

### Formula XP

Formula sederhana:

```text
xpToNextLevel = 100 + (level - 1) * 75
```

Contoh:

- Level 1 ke 2: 100 XP
- Level 2 ke 3: 175 XP
- Level 3 ke 4: 250 XP

### Reward Saat Naik Level

Setiap naik level:

- `maxHp +1` setiap 2 level.
- `attack +1` setiap 3 level.
- `defense +1` setiap 4 level.
- `stamina +1` setiap 2 level.

Level cap MVP:

- Maksimum level awal: `10`

Alasan:

- Cukup untuk progres MVP.
- Tidak membuat scope balancing terlalu besar.
- Mudah diperluas nanti.

## Musuh

Musuh harus sederhana dulu. Untuk MVP, musuh tidak perlu AI kompleks.

### Tipe Musuh Awal

1. **Slime Byte**
   - Musuh dasar.
   - Bergerak pelan.
   - Cocok untuk area village/forest.

2. **Bugling**
   - Musuh kecil yang bergerak bolak-balik.
   - Cocok sebagai rintangan jalur.

3. **Rock Imp**
   - Musuh area mining.
   - Bergerak lambat tapi HP lebih besar.

4. **Cave Warden**
   - Mini boss dungeon awal.
   - Menjaga pintu atau chest penting.

### Stat Musuh

```ts
type Enemy = {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  xpReward: number;
  drops: DropTableEntry[];
  behavior: "idle" | "patrol" | "chase" | "guard";
};
```

### Behavior Musuh

Untuk MVP:

- `idle`: diam, damage jika disentuh.
- `patrol`: bergerak bolak-balik.
- `guard`: menjaga area/chest.

Untuk versi lanjut:

- `chase`: mengejar player jika masuk radius.
- `flee`: kabur saat HP rendah.
- `ranged`: menyerang dari jarak jauh.

### Damage Sederhana

Formula:

```text
damage = max(1, attacker.attack - defender.defense)
```

Contoh:

- Player attack 5
- Enemy defense 2
- Damage = 3

## Combat

Combat MVP bisa dibuat sangat sederhana.

Pilihan combat:

- Sentuh musuh membuat player terkena damage.
- Tombol aksi menyerang di arah hadap.
- Musuh punya invulnerability singkat setelah terkena hit.

Input:

- `E`: interact.
- `Space`: attack.
- Mobile: tombol aksi tambahan.

State combat:

```ts
type CombatState = {
  isAttacking: boolean;
  attackCooldown: number;
  invulnerableUntil: number;
};
```

Kriteria combat MVP:

- Player bisa menyerang.
- Musuh bisa kalah.
- Player bisa menerima damage.
- Ada feedback visual saat hit.
- Tidak perlu combo dulu.

## Mining

Mining adalah sistem resource gathering. Cocok untuk area cave, forest, atau ruins.

### Tujuan Mining

Mining dipakai untuk:

- Mengumpulkan resource.
- Membuka crafting/upgrade.
- Memberi aktivitas selain combat.
- Menjadi sumber reward quest.

### Resource Awal

1. **Stone Chip**
   - Resource dasar.
   - Dipakai untuk upgrade kecil.

2. **Copper Bit**
   - Resource mining level 1.
   - Dipakai untuk crafting item awal.

3. **Glow Crystal**
   - Resource langka.
   - Dipakai untuk membuka shrine/portal.

4. **Ancient Fragment**
   - Resource quest.
   - Bisa jadi collectible/badge material.

### Mining Node

```ts
type MiningNode = {
  id: string;
  type: "stone" | "copper" | "crystal" | "ancient";
  x: number;
  y: number;
  hp: number;
  requiredToolLevel: number;
  respawnMs?: number;
  drops: DropTableEntry[];
};
```

### Mining Flow

1. Player mendekati mining node.
2. Prompt muncul: `Mine`.
3. Player tekan tombol aksi.
4. Node HP berkurang.
5. Jika HP habis, node memberi resource.
6. Node hilang atau masuk cooldown.

### Tool Level

Tool awal:

- `Old Pickaxe`

Upgrade:

- Level 1: bisa mining stone/copper.
- Level 2: bisa mining crystal.
- Level 3: bisa mining ancient node.

```ts
type Tool = {
  id: string;
  name: string;
  level: number;
  durability?: number;
};
```

Untuk MVP, durability tidak perlu dipakai dulu.

## Give / Reward System

`Give` adalah sistem pemberian item/reward dari NPC, chest, mining, enemy drop, atau quest.

### Sumber Reward

- NPC gift.
- Chest.
- Enemy drop.
- Mining node.
- Quest completion.
- Achievement.
- Web3 claim nanti.

### Reward Type

```ts
type Reward =
  | { type: "xp"; amount: number }
  | { type: "item"; itemId: string; amount: number }
  | { type: "currency"; currencyId: string; amount: number }
  | { type: "unlock"; unlockId: string }
  | { type: "badge"; badgeId: string };
```

### Give Function Concept

```ts
function giveReward(player: PlayerState, reward: Reward): PlayerState {
  // update xp, inventory, currency, unlock, or badge
  return player;
}
```

Aturan:

- Reward harus tercatat di log progress.
- Reward quest penting tidak boleh diberikan dua kali.
- Reward random boleh diberikan berulang sesuai drop table.

## Drop Table

Drop table dipakai untuk enemy dan mining.

```ts
type DropTableEntry = {
  itemId: string;
  chance: number;
  minAmount: number;
  maxAmount: number;
};
```

Contoh:

```ts
const slimeDrops = [
  { itemId: "gel_bit", chance: 0.7, minAmount: 1, maxAmount: 2 },
  { itemId: "tiny_core", chance: 0.1, minAmount: 1, maxAmount: 1 },
];
```

Rule:

- `chance` memakai nilai 0 sampai 1.
- Luck player bisa menambah peluang kecil.
- Item quest sebaiknya tidak full random jika wajib untuk progres.

## Inventory

Inventory awal dibuat sederhana.

Kategori item:

- `key`: membuka pintu/area.
- `resource`: hasil mining/drop.
- `consumable`: potion/food.
- `quest`: item objective.
- `badge`: achievement/koleksi.
- `cosmetic`: skin/title.

```ts
type InventoryItem = {
  itemId: string;
  amount: number;
};

type Inventory = InventoryItem[];
```

Rule:

- Key item tidak perlu stack besar.
- Resource bisa stack.
- Quest item tidak bisa dijual.
- Cosmetic tidak memengaruhi combat.

## Currency

Currency awal jangan terlalu banyak.

Currency MVP:

- `coin`: uang dasar.
- `crystal`: resource premium in-game, bukan token Web3.

Penggunaan:

- Upgrade tool.
- Beli consumable.
- Buka dekorasi/cosmetic.

Jangan buat token Web3 dulu untuk MVP.

## Quest System

Quest memberi arah untuk player.

```ts
type Quest = {
  id: string;
  title: string;
  status: "locked" | "active" | "completed";
  objectives: QuestObjective[];
  rewards: Reward[];
};

type QuestObjective =
  | { type: "talk"; npcId: string }
  | { type: "collect"; itemId: string; amount: number }
  | { type: "defeat"; enemyId: string; amount: number }
  | { type: "mine"; nodeType: string; amount: number }
  | { type: "visit"; areaId: string };
```

Quest awal:

1. **Welcome to Meki Village**
   - Talk to Eldrin.
   - Reward: 25 XP.

2. **Find the Forest Key**
   - Open forest chest.
   - Collect `forest_key`.
   - Reward: 50 XP.

3. **Clear the Cave Gate**
   - Defeat 2 Slime Byte.
   - Open cave door.
   - Reward: 75 XP + `stone_chip`.

4. **Mine the Glow Crystal**
   - Mine 3 stone nodes.
   - Mine 1 crystal node.
   - Reward: `glow_crystal`.

5. **Activate the Shrine**
   - Bring `glow_crystal` to shrine.
   - Reward: badge/local achievement.

## Upgrade System

Upgrade awal:

- Pickaxe level.
- Max HP.
- Attack.
- Inventory capacity.

Upgrade cost contoh:

```ts
const upgrades = [
  {
    id: "pickaxe_2",
    cost: [
      { itemId: "stone_chip", amount: 10 },
      { itemId: "copper_bit", amount: 5 },
    ],
  },
];
```

Rule:

- Upgrade harus terasa membantu.
- Jangan membuat player wajib grinding lama.
- Upgrade combat jangan membuat konten terlalu mudah.

## Area Progression

Area awal:

1. `village`
   - Aman.
   - NPC, shop, quest board.

2. `forest`
   - Chest, enemy ringan, resource dasar.

3. `cave`
   - Mining, musuh rock, puzzle.

4. `shrine`
   - Objective akhir MVP.
   - Contact/Web3 future portal.

Unlock:

- Forest terbuka dari awal.
- Cave butuh `forest_key`.
- Shrine butuh `glow_crystal`.

## Save Progress

Progress yang perlu disimpan:

- Player stats.
- Inventory.
- Currency.
- Quest status.
- Opened chests.
- Defeated unique enemies jika perlu.
- Mined non-respawn nodes.
- Unlocked areas.
- Badges.

```ts
type SaveData = {
  version: number;
  player: PlayerStats;
  inventory: Inventory;
  currencies: Record<string, number>;
  quests: Record<string, "locked" | "active" | "completed">;
  openedChests: string[];
  unlockedAreas: string[];
  badges: string[];
  updatedAt: string;
};
```

MVP storage:

- `localStorage`

Web3/server storage nanti:

- Server DB untuk progress yang berhubungan dengan reward.
- On-chain hanya untuk badge/cosmetic claim.

## Web3 Integration Nanti

Web3 tidak masuk ke core gameplay awal.

Yang bisa jadi Web3:

- Badge setelah quest selesai.
- Cosmetic skin.
- Title/profile frame.
- Seasonal achievement.

Yang jangan dibuat Web3 dulu:

- Damage item.
- Resource utama.
- Coin dasar.
- Quest key.
- Item wajib untuk progres.

Flow Web3 reward:

1. Player menyelesaikan quest.
2. Progress divalidasi server.
3. Server membuat claim eligibility.
4. Player connect wallet.
5. Player claim badge/cosmetic.

## Balancing Awal

Target durasi MVP:

- 3 sampai 7 menit untuk first clear.

XP reward:

- Talk/tutorial: 25 XP.
- Chest/key quest: 50 XP.
- Enemy ringan: 10 sampai 20 XP.
- Mining quest: 50 sampai 80 XP.
- MVP final quest: 100 XP.

Enemy HP:

- Slime Byte: 3 HP.
- Bugling: 2 HP.
- Rock Imp: 6 HP.
- Cave Warden: 12 HP.

Player awal:

- HP: 5
- Attack: 2
- Defense: 0
- Stamina: 5

## MVP Sistem yang Harus Dibuat Dulu

Urutan implementasi paling masuk akal:

1. Inventory.
2. Give reward.
3. Quest state.
4. XP dan level.
5. Enemy sederhana.
6. Mining node.
7. Upgrade/tool.
8. Save progress.
9. Wallet optional.
10. Web3 badge.

## Checklist Sistem

- [x] Player stats tersedia.
- [x] XP bisa bertambah.
- [x] Level up bisa terjadi.
- [x] Inventory bisa menerima item.
- [x] Reward bisa diberikan dari NPC/chest/enemy/mining.
- [x] Quest bisa active/completed.
- [x] Enemy bisa dikalahkan.
- [x] Mining node bisa menghasilkan resource.
- [x] Area bisa terkunci/terbuka.
- [x] Progress bisa disimpan.
- [x] Web3 reward tetap opsional.

## Catatan Scope

Untuk MVP, jangan langsung membuat:

- Marketplace.
- Token ekonomi.
- Crafting kompleks.
- Equipment banyak.
- Skill tree besar.
- Multiplayer.
- On-chain resource utama.

Mulai dari sistem kecil yang terasa enak, lalu perluas.
