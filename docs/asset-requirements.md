# Kebutuhan Asset Desain

Dokumen ini adalah brief asset untuk Meki Adventure. Tujuannya supaya desain sprite, tileset, UI, item, musuh, mining, audio, dan Web3 collectible bisa dibuat konsisten sejak awal.

## Arah Visual

Style:

- Retro pixel art.
- Top-down adventure.
- Original, tidak menyalin Nintendo/Zelda.
- Warna tegas, kontras tinggi, mudah dibaca.
- Cocok untuk game web desktop dan mobile.

Resolusi dasar:

- Tile size: `32x32 px`.
- Sprite karakter MVP: `64x64 px`.
- Icon item: `32x32 px`.
- Badge collectible: `512x512 px`.
- UI panel bisa dibuat dengan 9-slice pixel frame.

Format:

- Sprite/tiles: `.png`.
- Background transparan untuk karakter, item, musuh, icon.
- Audio: `.ogg` untuk web, `.wav` untuk source/master.
- Metadata art preview: `.png`.

Naming:

```text
public/game/sprites/player_idle_down.png
public/game/sprites/player_walk_down_01.png
public/game/tiles/grass_01.png
public/game/items/forest_key.png
public/game/enemies/slime_byte_idle_01.png
public/game/badges/first_clear.png
public/game/audio/sfx_item_pickup.ogg
```

## Prioritas Asset MVP

Prioritas 1:

- Player sprite.
- 1 tileset village/forest.
- 1 NPC guide.
- 1 chest.
- 1 key item.
- 1 door/gate.
- Dialog box UI.
- Start button/UI frame.

Prioritas 2:

- Enemy basic.
- Mining node.
- Pickaxe/tool icon.
- Resource icons.
- Quest HUD.
- Inventory HUD.

Prioritas 3:

- Badge Web3.
- Cosmetic/skin.
- Audio.
- Extra NPC.
- Extra areas.

## Player

Nama karakter awal: `Kira`

Kebutuhan:

- Idle down.
- Idle up.
- Idle left.
- Idle right.
- Walk down 2 sampai 4 frame.
- Walk up 2 sampai 4 frame.
- Walk left 2 sampai 4 frame.
- Walk right 2 sampai 4 frame.
- Attack/down optional.
- Mining/down optional.
- Damage/hit optional.

Ukuran:

- Frame: `64x64 px`.
- Sprite sheet boleh, tetapi tiap frame harus grid rapi.

Path:

```text
public/game/sprites/player.png
public/game/sprites/player_sheet.png
```

Catatan desain:

- Silhouette harus terbaca pada background rumput dan cave.
- Jangan terlalu mirip Link.
- Hindari topi/tunik/senjata ikonik yang identik dengan Zelda.

## NPC

NPC MVP:

1. `Eldrin the Sage`
   - Guide/tutorial.
   - Wise village elder.

2. `Miko the Crafter`
   - Project/building/crafting NPC.

3. `Lyra the Keeper`
   - Archivist/skill/resume NPC.

Kebutuhan tiap NPC:

- Idle front.
- Optional blink/idle 2 frame.
- Optional talk frame.

Ukuran:

- Frame: `64x64 px`.

Path:

```text
public/game/sprites/guide.png
public/game/sprites/builder.png
public/game/sprites/archivist.png
```

Catatan desain:

- Setiap NPC harus punya warna dan silhouette berbeda.
- Guide: robe/staff original.
- Builder: tools/apron/crafting vibe.
- Archivist: book/scroll/library vibe.

## Enemy

Enemy MVP:

1. `Slime Byte`
   - Enemy dasar.
   - Bentuk blob/pixel creature.

2. `Bugling`
   - Enemy kecil bergerak bolak-balik.

3. `Rock Imp`
   - Enemy cave/mining area.

4. `Cave Warden`
   - Mini boss awal.

Kebutuhan tiap enemy:

- Idle 2 frame.
- Move 2 frame.
- Hit frame.
- Defeat/death frame optional.

Ukuran:

- Basic enemy: `32x32 px` atau `48x48 px`.
- Mini boss: `64x64 px` atau `96x96 px`.

Path:

```text
public/game/enemies/slime_byte_sheet.png
public/game/enemies/bugling_sheet.png
public/game/enemies/rock_imp_sheet.png
public/game/enemies/cave_warden_sheet.png
```

Catatan desain:

- Musuh harus original.
- Hindari bentuk monster yang terlalu identik dengan franchise tertentu.
- Warna musuh harus kontras dengan tile area.

## Tileset

Tile size: `32x32 px`.

Area MVP:

1. Village.
2. Forest.
3. Cave.
4. Shrine.

Tiles wajib:

- Grass.
- Grass variant.
- Dirt path.
- Stone path.
- Tree top.
- Tree trunk.
- Water.
- Wall/rock.
- Cave floor.
- Cave wall.
- Shrine floor.
- Door/gate.
- Sign.
- Chest closed.
- Chest open.

Path:

```text
public/game/tiles/village_tileset.png
public/game/tiles/forest_tileset.png
public/game/tiles/cave_tileset.png
public/game/tiles/shrine_tileset.png
```

Catatan desain:

- Setiap tile harus align ke grid `32x32`.
- Buat variasi kecil agar map tidak monoton.
- Collision tile harus mudah dikenali secara visual.

## Object dan Interactable

Object MVP:

- Chest closed.
- Chest open.
- Locked gate.
- Open gate.
- Sign board.
- Shrine altar.
- Mining node stone.
- Mining node copper.
- Mining node crystal.
- Mining node ancient.
- Door/portal.

Ukuran:

- Object kecil: `32x32 px`.
- Object sedang: `64x64 px`.
- Shrine/portal: `96x96 px` jika perlu.

Path:

```text
public/game/objects/chest_closed.png
public/game/objects/chest_open.png
public/game/objects/gate_locked.png
public/game/objects/gate_open.png
public/game/objects/shrine_altar.png
```

## Item dan Resource

Item MVP:

- Forest Key.
- Old Pickaxe.
- Stone Chip.
- Copper Bit.
- Glow Crystal.
- Ancient Fragment.
- Health Potion.
- Coin.
- Quest Badge.

Ukuran:

- Icon: `32x32 px`.
- Inventory large preview optional: `64x64 px`.

Path:

```text
public/game/items/forest_key.png
public/game/items/old_pickaxe.png
public/game/items/stone_chip.png
public/game/items/copper_bit.png
public/game/items/glow_crystal.png
public/game/items/ancient_fragment.png
public/game/items/health_potion.png
public/game/items/coin.png
```

Catatan desain:

- Icon harus terbaca di ukuran kecil.
- Key item harus beda jelas dari resource biasa.
- Resource mining sebaiknya punya bentuk/warna berbeda.

## UI Game

UI wajib:

- Dialog box.
- Name plate NPC.
- Inventory panel.
- Quest HUD.
- Item pickup toast.
- Start screen.
- Pause menu.
- Button pixel.
- Health bar.
- XP bar.
- Wallet/claim panel.

Ukuran:

- UI bisa dibuat sebagai PNG frame atau CSS pixel style.
- Jika PNG frame, buat 9-slice style:
  - corner.
  - edge.
  - fill.

Path:

```text
public/game/ui/dialog_frame.png
public/game/ui/panel_frame.png
public/game/ui/button_default.png
public/game/ui/button_pressed.png
public/game/ui/health_heart.png
public/game/ui/xp_bar_frame.png
```

Catatan desain:

- Text area harus cukup luas.
- Jangan memakai font yang sulit dibaca untuk paragraf.
- UI harus cocok dengan desktop dan mobile.

## Web3 Collectible Asset

Collectible awal:

1. `First Clear Badge`
2. `Forest Key Badge`
3. `Miner Badge`
4. `Shrine Keeper Badge`

Ukuran:

- Badge image: `512x512 px`.
- Thumbnail optional: `128x128 px`.
- Metadata preview: `1024x1024 px` optional.

Path:

```text
public/game/badges/first_clear.png
public/game/badges/forest_key.png
public/game/badges/miner.png
public/game/badges/shrine_keeper.png
```

Metadata fields nanti:

```json
{
  "name": "First Clear Badge",
  "description": "Awarded for completing the first Meki Adventure quest.",
  "image": "ipfs://...",
  "attributes": [
    { "trait_type": "Type", "value": "Achievement" },
    { "trait_type": "Season", "value": "Genesis" },
    { "trait_type": "Rarity", "value": "Common" }
  ]
}
```

Catatan desain:

- Badge harus original.
- Jangan pakai simbol triforce, master sword, atau bentuk ikonik Nintendo.
- Badge boleh memakai bahasa visual game: crystal, key, shrine, cave, pixel frame.

## Cosmetic

Cosmetic opsional:

- Hat.
- Cloak.
- Backpack.
- Aura.
- Name title.
- Profile frame.

Rule:

- Cosmetic tidak memengaruhi attack/defense.
- Cosmetic aman untuk Web3 reward.
- Cosmetic harus tetap terbaca di sprite kecil.

Path:

```text
public/game/cosmetics/hat_red.png
public/game/cosmetics/cloak_blue.png
public/game/cosmetics/profile_frame_genesis.png
```

## Audio

SFX MVP:

- `sfx_step.ogg`
- `sfx_interact.ogg`
- `sfx_dialog_next.ogg`
- `sfx_item_pickup.ogg`
- `sfx_chest_open.ogg`
- `sfx_gate_open.ogg`
- `sfx_enemy_hit.ogg`
- `sfx_enemy_defeat.ogg`
- `sfx_mining_hit.ogg`
- `sfx_level_up.ogg`
- `sfx_badge_claim.ogg`

Music:

- `music_village_loop.ogg`
- `music_forest_loop.ogg`
- `music_cave_loop.ogg`
- `music_shrine_loop.ogg`

Catatan:

- Audio harus original atau berlisensi bebas.
- Jangan memakai musik/sfx Nintendo.
- Semua musik loop harus nyaman didengar berulang.
- Sediakan mute toggle.

## Font

Font harus readable.

Opsi:

- Font pixel untuk title/button.
- Font mono/readable untuk dialog panjang.

Jangan memakai font yang membuat dialog panjang sulit dibaca.

## Checklist Asset MVP

- [ ] Player 4 arah.
- [ ] Guide NPC.
- [ ] Builder NPC.
- [ ] Archivist NPC.
- [ ] Grass/path/tree/water tiles.
- [ ] Cave tiles.
- [ ] Chest closed/open.
- [ ] Forest key.
- [ ] Gate locked/open.
- [ ] Slime Byte enemy.
- [ ] Mining nodes.
- [ ] Stone/Copper/Crystal resource icons.
- [ ] Dialog frame.
- [ ] Inventory frame.
- [ ] Quest HUD.
- [ ] First Clear Badge.
- [ ] Item pickup SFX.
- [ ] Chest open SFX.

## Checklist Asset Web3

- [ ] Badge image `512x512`.
- [ ] Badge thumbnail `128x128`.
- [ ] Metadata name.
- [ ] Metadata description.
- [ ] Metadata attributes.
- [ ] IPFS-ready file names.
- [ ] Rarity label.
- [ ] Season label.
- [ ] Claim preview UI.

## Asset yang Tidak Boleh Dipakai

- Sprite Nintendo/Zelda/Mario/Pokemon asli.
- Musik Nintendo.
- Sound effect Nintendo.
- Logo Nintendo.
- Nama Hyrule, Zelda, Link, Triforce, Master Sword.
- Map layout yang menyalin game tertentu.
- Simbol yang terlalu identik dengan IP lain.

## Deliverable Desain

Untuk setiap asset, idealnya siapkan:

- PNG final.
- Source file desain jika ada.
- Ukuran frame.
- Jumlah frame animasi.
- Notes warna/palette.
- Lisensi/asal asset.

Contoh deliverable:

```text
player_sheet.png
player_sheet.source
player_sheet_notes.md
```

## Palette Awal

Rekomendasi warna:

- Deep navy: `#08080d`
- Console blue: `#1b2b72`
- Alert red: `#e63946`
- Coin yellow: `#ffd166`
- Parchment: `#fff4c4`
- Grass green: `#6ab04c`
- Cave brown: `#7b3f21`
- Crystal cyan: `#5eead4`

Palette boleh dikembangkan, tetapi hindari tampilan terlalu satu warna.
