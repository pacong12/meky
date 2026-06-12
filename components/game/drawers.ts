import { TILE, C } from "./constants";
import { Entity, TileType, SpriteMap } from "./types";

let _sprites: SpriteMap = {};

export function setSprites(m: SpriteMap) {
  _sprites = m;
}

export function drawTile(
  ctx: CanvasRenderingContext2D,
  type: TileType,
  x: number,
  y: number,
  tick: number
) {
  const px = x * TILE;
  const py = y * TILE;

  if (type === "W") {
    ctx.fillStyle = C.wall;
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = C.wallTop;
    ctx.fillRect(px + 2, py + 2, TILE - 4, 6);
  } else if (type === "T") {
    // Grass base
    ctx.fillStyle = (x + y) % 2 === 0 ? C.grass : C.grassDark;
    ctx.fillRect(px, py, TILE, TILE);
    // Tree trunk
    ctx.fillStyle = C.treeTrunk;
    ctx.fillRect(px + 12, py + 18, 8, 12);
    // Tree canopy
    ctx.fillStyle = C.tree;
    ctx.fillRect(px + 4, py + 4, 24, 18);
    ctx.fillStyle = C.treeDark;
    ctx.fillRect(px + 2, py + 10, 6, 8);
    ctx.fillRect(px + 22, py + 10, 6, 8);
  } else if (type === "~") {
    const wave = Math.sin(tick * 0.05 + x * 0.8 + y * 0.5) > 0 ? C.waterLight : C.water;
    ctx.fillStyle = wave;
    ctx.fillRect(px, py, TILE, TILE);
    // Ripple
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(px + 4, py + 8 + (Math.sin(tick * 0.08 + x) > 0 ? 2 : 0), 12, 2);
    ctx.fillRect(px + 18, py + 18 + (Math.sin(tick * 0.06 + y) > 0 ? 2 : 0), 10, 2);
  } else if (type === "P") {
    ctx.fillStyle = (x + y) % 2 === 0 ? C.path : C.pathDark;
    ctx.fillRect(px, py, TILE, TILE);
  } else if (type === "S") {
    ctx.fillStyle = C.sand;
    ctx.fillRect(px, py, TILE, TILE);
  } else {
    // Grass
    ctx.fillStyle = (x + y) % 2 === 0 ? C.grass : C.grassDark;
    ctx.fillRect(px, py, TILE, TILE);
    // Grass detail
    if ((x * 3 + y * 7) % 5 === 0) {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(px + 8, py + 20, 3, 6);
      ctx.fillRect(px + 20, py + 10, 3, 6);
    }
  }
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  dir: string,
  tick: number,
  moving: boolean
) {
  const bx = Math.round(px);
  const by = Math.round(py);
  const SIZE = TILE * 2; // render at 2× tile = 64px

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(bx + 6, by + 26, 20, 6);

  const img = _sprites["player"];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;

    // Pre-calculated precise pixel coordinates for player_sheet.png (5 columns, 4 rows)
    const cols = [
      { x: 77, w: 152 },
      { x: 316, w: 147 },
      { x: 551, w: 157 },
      { x: 792, w: 147 },
      { x: 1026, w: 146 }
    ];
    const rows = [
      { y: 42, h: 271 }, // Row 0: Down
      { y: 314, h: 296 }, // Row 1: Left
      { y: 652, h: 251 }, // Row 2: Right
      { y: 946, h: 267 }  // Row 3: Up
    ];

    let rIdx = 0; // down (Row 0)
    if (dir === "left") rIdx = 1;      // Row 1
    else if (dir === "right") rIdx = 2; // Row 2
    else if (dir === "up") rIdx = 3;    // Row 3

    let cIdx = 0; // idle (Frame 0)
    if (moving) {
      const frameSpeed = 6; // cycle through frames at 6 game ticks per frame
      cIdx = Math.floor(tick / frameSpeed) % 5;
    }

    const col = cols[cIdx] || cols[0];
    const row = rows[rIdx] || rows[0];

    // Maintain aspect ratio to prevent distortion
    const destW = SIZE;
    const destH = Math.round(SIZE * (row.h / col.w));
    const dx = bx - 16;
    const dy = (by + 28) - destH; // anchor feet to shadow

    ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
    return;
  }

  // ── Fallback procedural ──
  ctx.fillStyle = C.playerBody;
  ctx.fillRect(bx + 8, by + 10, 16, 14);
  ctx.fillStyle = C.player;
  ctx.fillRect(bx + 9, by + 2, 14, 12);
  ctx.fillStyle = "#1a1a1a";
  if (dir === "down") {
    ctx.fillRect(bx + 11, by + 6, 3, 3);
    ctx.fillRect(bx + 18, by + 6, 3, 3);
  } else if (dir === "up") {
    ctx.fillStyle = "#c8b830";
    ctx.fillRect(bx + 10, by + 2, 12, 10);
  } else if (dir === "left") {
    ctx.fillRect(bx + 10, by + 6, 3, 3);
  } else {
    ctx.fillRect(bx + 19, by + 6, 3, 3);
  }
  const legOffset = moving ? Math.sin(tick * 0.3) * 3 : 0;
  ctx.fillStyle = "#3a3a6a";
  ctx.fillRect(bx + 8, by + 22, 7, 8 + legOffset);
  ctx.fillRect(bx + 17, by + 22, 7, 8 - legOffset);
  ctx.fillStyle = C.playerAccent;
  ctx.fillRect(bx + 8, by + 18, 16, 3);
}

export function drawNPC(ctx: CanvasRenderingContext2D, entity: Entity, tick: number) {
  if (entity.type === "enemy" && entity.isDead && (entity.deathTimer === undefined || entity.deathTimer <= 0)) {
    return;
  }
  const px = entity.currPixelX !== undefined ? entity.currPixelX : entity.x * TILE;
  const py = entity.currPixelY !== undefined ? entity.currPixelY : entity.y * TILE;
  const bob = entity.moving ? 0 : Math.sin(tick * 0.05 + entity.x) * 2;
  const bx = Math.round(px);
  const by = Math.round(py + bob);
  const SIZE = TILE * 2; // 64px — same scale as player

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(bx + 6, by + 27, 20, 5);

  // Map entity id → sprite key
  const spriteKey: Record<string, string> = {
    guide: "guide",
    builder: "builder",
    archivist: "archivist",
  };
  let key = spriteKey[entity.id] || "";
  if (entity.type === "enemy") {
    if (entity.id.startsWith("bugling")) {
      key = "bugling";
    } else if (entity.id.startsWith("rockimp")) {
      key = "rockimp";
    } else if (entity.id.startsWith("cavewarden")) {
      key = "cavewarden";
    } else {
      key = "slime";
    }
  }

  if (key) {
    const img = _sprites[key];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      
      if (entity.id === "builder") {
        // Pre-calculated precise pixel coordinates for builder_sheet.png (5 columns, 4 rows)
        const cols = [
          { x: 54, w: 186 },
          { x: 311, w: 172 },
          { x: 551, w: 168 },
          { x: 786, w: 170 },
          { x: 1015, w: 186 }
        ];
        const rows = [
          { y: 31, h: 280 },
          { y: 341, h: 269 },
          { y: 641, h: 279 },
          { y: 945, h: 286 }
        ];

        let rIdx = 0; // down (Row 0)
        if (entity.dir === "left") rIdx = 1;      // Row 1
        else if (entity.dir === "right") rIdx = 2; // Row 2
        else if (entity.dir === "up") rIdx = 3;    // Row 3

        let cIdx = 0; // idle (Frame 0)
        if (entity.moving) {
          const frameSpeed = 8;
          cIdx = Math.floor(tick / frameSpeed) % 5; // Frame 0, 1, 2, 3, 4
        }

        const col = cols[cIdx] || cols[0];
        const row = rows[rIdx] || rows[0];

        const destW = SIZE;
        const destH = Math.round(SIZE * (row.h / col.w));
        const dx = bx - 16;
        const dy = (by + 28) - destH;

        ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
      } else if (entity.id === "archivist") {
        // Pre-calculated precise pixel coordinates for archivist_sheet.png (5 columns, 4 rows)
        const cols = [
          { x: 82, w: 168 },
          { x: 316, w: 169 },
          { x: 543, w: 174 },
          { x: 779, w: 163 },
          { x: 1006, w: 159 }
        ];
        const rows = [
          { y: 40, h: 310 },
          { y: 360, h: 292 },
          { y: 670, h: 292 },
          { y: 965, h: 264 }
        ];

        let rIdx = 0; // down (Row 0)
        if (entity.dir === "left") rIdx = 1;      // Row 1
        else if (entity.dir === "right") rIdx = 2; // Row 2
        else if (entity.dir === "up") rIdx = 3;    // Row 3

        let cIdx = 0; // idle (Frame 0)
        if (entity.moving) {
          const frameSpeed = 8;
          cIdx = Math.floor(tick / frameSpeed) % 5; // Frame 0, 1, 2, 3, 4
        }

        const col = cols[cIdx] || cols[0];
        const row = rows[rIdx] || rows[0];

        const destW = SIZE;
        const destH = Math.round(SIZE * (row.h / col.w));
        const dx = bx - 16;
        const dy = (by + 28) - destH;

        ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
      } else if (entity.id === "guide") {
        // Pre-calculated precise pixel coordinates for guide_sheet.png (5 columns, 4 rows)
        const cols = [
          { x: 29, w: 218 },
          { x: 276, w: 218 },
          { x: 518, w: 215 },
          { x: 756, w: 244 },
          { x: 1000, w: 218 }
        ];
        const rows = [
          { y: 35, h: 278 },  // Row 0: Down
          { y: 313, h: 303 }, // Row 1: Left
          { y: 643, h: 296 }, // Row 2: Right
          { y: 939, h: 265 }  // Row 3: Up
        ];

        let rIdx = 0; // down (Row 0)
        if (entity.dir === "left") rIdx = 1;      // Row 1
        else if (entity.dir === "right") rIdx = 2; // Row 2
        else if (entity.dir === "up") rIdx = 3;    // Row 3

        let cIdx = 0; // idle (Frame 0)
        if (entity.moving) {
          const frameSpeed = 8;
          cIdx = Math.floor(tick / frameSpeed) % 5; // Frame 0, 1, 2, 3, 4
        }

        const col = cols[cIdx] || cols[0];
        const row = rows[rIdx] || rows[0];

        const destW = SIZE;
        const destH = Math.round(SIZE * (row.h / col.w));
        const dx = bx - 16;
        const dy = (by + 28) - destH;

        ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
      } else if (entity.type === "enemy") {
        if (key === "bugling") {
          // Pre-calculated precise pixel coordinates for bugling_sheet.png
          const cols = [
            { x: 30, w: 150 },
            { x: 230, w: 160 },
            { x: 424, w: 176 },
            { x: 639, w: 160 },
            { x: 860, w: 134 }
          ];
          const rows = [
            { y: 41, h: 123 },  // Row 0: Down
            { y: 220, h: 98 },  // Row 1: Left
            { y: 389, h: 98 },  // Row 2: Right
            { y: 527, h: 134 }, // Row 3: Up
            { y: 701, h: 129 }, // Row 4: Attack
            { y: 901, h: 88 }   // Row 5: Death/Vanish
          ];

          let rIdx = 0; // default down
          if (entity.dir === "left") rIdx = 1;
          else if (entity.dir === "right") rIdx = 2;
          else if (entity.dir === "up") rIdx = 3;

          let cIdx = 0; // idle
          if (entity.isDead) {
            rIdx = 5; // Death Row
            cIdx = Math.min(4, Math.floor((40 - (entity.deathTimer || 0)) / 8));
          } else if (entity.isHit) {
            rIdx = 5;
            cIdx = 0; // hit frame
          } else if (entity.isAttacking) {
            rIdx = 4; // Attack Row
            const elapsed = 40 - (entity.attackTimer || 0);
            cIdx = Math.min(4, Math.floor(elapsed / 8));
          } else if (entity.moving) {
            cIdx = Math.floor(tick / 8) % 5; // walk cycle
          }

          const col = cols[cIdx] || cols[0];
          const row = rows[rIdx] || rows[0];

          const destW = SIZE;
          const destH = Math.round(SIZE * (row.h / col.w));
          const dx = bx - 16;
          const dy = (by + 28) - destH;

          const shouldMirror = (rIdx === 4 || rIdx === 5) && entity.dir === "left";

          if (entity.isHit && !entity.isDead) {
            ctx.save();
            if (shouldMirror) {
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(-destW / 2, -destH / 2, destW, destH);
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(dx, dy, destW, destH);
            }
            ctx.restore();
          } else {
            if (shouldMirror) {
              ctx.save();
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.restore();
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
            }
          }
        } else if (key === "rockimp") {
          // Pre-calculated precise pixel coordinates for rock_imp_sheet.png
          const cols = [
            { x: 28, w: 148 },
            { x: 232, w: 150 },
            { x: 437, w: 150 },
            { x: 642, w: 150 },
            { x: 849, w: 148 }
          ];
          const rows = [
            { y: 25, h: 143 },  // Row 0: Down
            { y: 187, h: 151 }, // Row 1: Left
            { y: 357, h: 151 }, // Row 2: Right
            { y: 518, h: 161 }, // Row 3: Up
            { y: 700, h: 145 }, // Row 4: Attack
            { y: 850, h: 170 }  // Row 5: Death/Vanish
          ];

          let rIdx = 0; // default down
          if (entity.dir === "left") rIdx = 1;
          else if (entity.dir === "right") rIdx = 2;
          else if (entity.dir === "up") rIdx = 3;

          let cIdx = 0; // idle
          if (entity.isDead) {
            rIdx = 5; // Death Row
            cIdx = Math.min(4, Math.floor((40 - (entity.deathTimer || 0)) / 8));
          } else if (entity.isHit) {
            rIdx = 5;
            cIdx = 0; // hit frame
          } else if (entity.isAttacking) {
            rIdx = 4; // Attack Row
            const elapsed = 40 - (entity.attackTimer || 0);
            cIdx = Math.min(4, Math.floor(elapsed / 8));
          } else if (entity.moving) {
            cIdx = Math.floor(tick / 8) % 5; // walk cycle
          }

          const col = cols[cIdx] || cols[0];
          const row = rows[rIdx] || rows[0];

          const destW = SIZE;
          const destH = Math.round(SIZE * (row.h / col.w));
          const dx = bx - 16;
          const dy = (by + 28) - destH;

          const shouldMirror = (rIdx === 4 || rIdx === 5) && entity.dir === "left";

          if (entity.isHit && !entity.isDead) {
            ctx.save();
            if (shouldMirror) {
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(-destW / 2, -destH / 2, destW, destH);
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(dx, dy, destW, destH);
            }
            ctx.restore();
          } else {
            if (shouldMirror) {
              ctx.save();
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.restore();
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
            }
          }
        } else if (key === "cavewarden") {
          // Pre-calculated precise pixel coordinates for cave_warden_sheet.png (5 columns, 6 rows)
          // Generated by analyze_cave_warden.py — widest-frame col widths, tallest-frame row heights
          const cols = [
            { x: 13, w: 169 },  // Col 0
            { x: 218, w: 176 }, // Col 1
            { x: 423, w: 184 }, // Col 2
            { x: 627, w: 182 }, // Col 3
            { x: 832, w: 180 }  // Col 4
          ];
          const rows = [
            { y: 25,  h: 139 }, // Row 0: Down
            { y: 180, h: 160 }, // Row 1: Left
            { y: 340, h: 170 }, // Row 2: Right
            { y: 510, h: 170 }, // Row 3: Up
            { y: 680, h: 140 }, // Row 4: Attack
            { y: 855, h: 159 }  // Row 5: Death
          ];

          let rIdx = 0; // default down
          if (entity.dir === "left") rIdx = 1;
          else if (entity.dir === "right") rIdx = 2;
          else if (entity.dir === "up") rIdx = 3;

          let cIdx = 0; // idle
          if (entity.isDead) {
            rIdx = 5; // Death Row
            cIdx = Math.min(4, Math.floor((40 - (entity.deathTimer || 0)) / 8));
          } else if (entity.isHit) {
            rIdx = 5;
            cIdx = 0; // hit frame
          } else if (entity.isAttacking) {
            rIdx = 4; // Attack Row
            const elapsed = 40 - (entity.attackTimer || 0);
            cIdx = Math.min(4, Math.floor(elapsed / 8));
          } else if (entity.moving) {
            cIdx = Math.floor(tick / 8) % 5; // walk cycle
          }

          const col = cols[cIdx] || cols[0];
          const row = rows[rIdx] || rows[0];

          const destW = SIZE;
          const destH = Math.round(SIZE * (row.h / col.w));
          const dx = bx - 16;
          const dy = (by + 28) - destH;

          const shouldMirror = (rIdx === 4 || rIdx === 5) && entity.dir === "left";

          if (entity.isHit && !entity.isDead) {
            ctx.save();
            if (shouldMirror) {
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)";
              ctx.fillRect(-destW / 2, -destH / 2, destW, destH);
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)";
              ctx.fillRect(dx, dy, destW, destH);
            }
            ctx.restore();
          } else {
            if (shouldMirror) {
              ctx.save();
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.restore();
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
            }
          }
        } else {
          // Pre-calculated precise pixel coordinates for 1024x1024 slime_sheet.png
          const cols = [
            { x: 40, w: 129 },   // Col 0
            { x: 225, w: 165 },  // Col 1
            { x: 419, w: 186 },  // Col 2
            { x: 634, w: 160 },  // Col 3
            { x: 849, w: 140 }   // Col 4
          ];
          const rows = [
            { y: 35, h: 104 },   // Row 0: Down
            { y: 199, h: 114 },  // Row 1: Left
            { y: 368, h: 114 },  // Row 2: Right
            { y: 527, h: 119 },  // Row 3: Up
            { y: 701, h: 119 },  // Row 4: Attack
            { y: 870, h: 124 }   // Row 5: Death/Vanish
          ];

          let rIdx = 0; // default down
          if (entity.dir === "left") rIdx = 1;
          else if (entity.dir === "right") rIdx = 2;
          else if (entity.dir === "up") rIdx = 3;

          let cIdx = 0; // idle
          if (entity.isDead) {
            rIdx = 5; // Death Row
            cIdx = Math.min(4, Math.floor((entity.deathTimer || 0) / 8));
          } else if (entity.isHit) {
            rIdx = 5;
            cIdx = 0; // hit frame
          } else if (entity.isAttacking) {
            rIdx = 4; // Attack Row
            const elapsed = 40 - (entity.attackTimer || 0);
            cIdx = Math.min(4, Math.floor(elapsed / 8));
          } else if (entity.moving) {
            cIdx = Math.floor(tick / 8) % 5; // walk cycle
          }

          const col = cols[cIdx] || cols[0];
          const row = rows[rIdx] || rows[0];

          const destW = SIZE;
          const destH = Math.round(SIZE * (row.h / col.w));
          const dx = bx - 16;
          const dy = (by + 28) - destH;

          const shouldMirror = (rIdx === 4 || rIdx === 5) && entity.dir === "left";

          if (entity.isHit && !entity.isDead) {
            ctx.save();
            if (shouldMirror) {
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(-destW / 2, -destH / 2, destW, destH);
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
              ctx.globalCompositeOperation = "source-atop";
              ctx.fillStyle = "rgba(239, 68, 68, 0.6)"; // red overlay
              ctx.fillRect(dx, dy, destW, destH);
            }
            ctx.restore();
          } else {
            if (shouldMirror) {
              ctx.save();
              ctx.translate(dx + destW / 2, dy + destH / 2);
              ctx.scale(-1, 1);
              ctx.drawImage(img, col.x, row.y, col.w, row.h, -destW / 2, -destH / 2, destW, destH);
              ctx.restore();
            } else {
              ctx.drawImage(img, col.x, row.y, col.w, row.h, dx, dy, destW, destH);
            }
          }
        }
      } else {
        // Show the full sprite image centred on the tile for other NPCs
        ctx.drawImage(img, bx - 16, by - 16, SIZE, SIZE);
      }
      
      // Name tag on top of sprite
      const nameWidth = 50;
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(bx + TILE / 2 - nameWidth / 2, by - 14, nameWidth, 11);
      ctx.fillStyle = "#e8d44d";
      ctx.font = "bold 7px monospace";
      ctx.textAlign = "center";
      ctx.fillText(entity.name?.split(" ")[0] || "", bx + TILE / 2, by - 5);
      return;
    }
  }

  // ── Fallback procedural ──
  if (entity.id === "guide") {
    ctx.fillStyle = C.npcGuideRobe;
    ctx.fillRect(bx + 7, by + 10, 18, 18);
    ctx.fillStyle = C.npcGuide;
    ctx.fillRect(bx + 9, by + 2, 14, 12);
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(bx + 8, by + 10, 16, 8);
    ctx.fillStyle = "#8b6914";
    ctx.fillRect(bx + 26, by + 4, 3, 26);
    ctx.fillStyle = "#60c0f0";
    ctx.fillRect(bx + 24, by + 2, 7, 5);
  } else if (entity.id === "builder") {
    ctx.fillStyle = C.npcBuilderOverall;
    ctx.fillRect(bx + 7, by + 10, 18, 18);
    ctx.fillStyle = C.npcBuilder;
    ctx.fillRect(bx + 9, by + 2, 14, 12);
    ctx.fillStyle = "#e8d44d";
    ctx.fillRect(bx + 7, by + 2, 18, 5);
  } else if (entity.id === "archivist") {
    ctx.fillStyle = C.npcArchivistRobe;
    ctx.fillRect(bx + 7, by + 10, 18, 18);
    ctx.fillStyle = C.npcArchivist;
    ctx.fillRect(bx + 9, by + 2, 14, 12);
    ctx.fillStyle = "#8b3a3a";
    ctx.fillRect(bx - 4, by + 12, 12, 16);
  } else if (entity.type === "enemy") {
    if (entity.id.startsWith("bugling")) {
      ctx.fillStyle = "#e25822"; // Flame/orange
      ctx.beginPath();
      ctx.ellipse(bx + TILE/2, by + TILE/2 + 2, 10, 8, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = "#b23b0d";
      ctx.beginPath();
      ctx.arc(bx + TILE/2, by + TILE/2 - 4, 5, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bx + TILE/2 - 3, by + TILE/2 - 6, 2, 2);
      ctx.fillRect(bx + TILE/2 + 1, by + TILE/2 - 6, 2, 2);
      ctx.strokeStyle = "#3a1d0b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx + TILE/2 - 8, by + TILE/2 + 2);
      ctx.lineTo(bx + TILE/2 - 13, by + TILE/2 + 4);
      ctx.moveTo(bx + TILE/2 - 8, by + TILE/2 - 1);
      ctx.lineTo(bx + TILE/2 - 12, by + TILE/2 - 1);
      ctx.moveTo(bx + TILE/2 + 8, by + TILE/2 + 2);
      ctx.lineTo(bx + TILE/2 + 13, by + TILE/2 + 4);
      ctx.moveTo(bx + TILE/2 + 8, by + TILE/2 - 1);
      ctx.lineTo(bx + TILE/2 + 12, by + TILE/2 - 1);
      ctx.stroke();
    } else if (entity.id.startsWith("rockimp")) {
      ctx.fillStyle = "#555555";
      ctx.beginPath();
      ctx.ellipse(bx + TILE/2, by + TILE/2 + 2, 11, 10, 0, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.arc(bx + TILE/2, by + TILE/2 - 5, 6, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = "#ffaa00";
      ctx.fillRect(bx + TILE/2 - 4, by + TILE/2 - 7, 2, 2);
      ctx.fillRect(bx + TILE/2 + 2, by + TILE/2 - 7, 2, 2);
    } else if (entity.id.startsWith("cavewarden")) {
      // Stone golem mini-boss fallback
      ctx.fillStyle = "#4a3a2a"; // Dark stone body
      ctx.fillRect(bx + 4, by + 8, 24, 22);
      ctx.fillStyle = "#2e2416"; // Head
      ctx.fillRect(bx + 7, by + 2, 18, 12);
      ctx.fillStyle = "#ff3300"; // Glowing red eyes
      ctx.fillRect(bx + 9, by + 5, 4, 3);
      ctx.fillRect(bx + 19, by + 5, 4, 3);
      // Stone club
      ctx.fillStyle = "#5a4a38";
      ctx.fillRect(bx + 26, by + 6, 6, 18);
      ctx.fillRect(bx + 22, by + 4, 12, 6);
      // Mossy detail
      ctx.fillStyle = "#2d5a1a";
      ctx.fillRect(bx + 5, by + 10, 4, 4);
      ctx.fillRect(bx + 22, by + 18, 4, 4);
    } else {
      ctx.fillStyle = C.waterLight;
      ctx.beginPath();
      ctx.arc(bx + TILE/2, by + TILE/2 + 4, 10, 0, 2*Math.PI);
      ctx.fill();
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(bx + TILE/2 - 4, by + TILE/2, 2, 4);
      ctx.fillRect(bx + TILE/2 + 2, by + TILE/2, 2, 4);
    }
  }
  // Name tag
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.fillRect(bx, by - 10, TILE, 10);
  ctx.fillStyle = "#e8d44d";
  ctx.font = "bold 7px monospace";
  ctx.textAlign = "center";
  ctx.fillText(entity.name?.split(" ")[0] || "", bx + TILE / 2, by - 2);
}

export function drawChest(ctx: CanvasRenderingContext2D, entity: Entity) {
  const px = entity.x * TILE;
  const py = entity.y * TILE;

  ctx.fillStyle = entity.isOpen ? C.chestDark : C.chest;
  ctx.fillRect(px + 4, py + 8, 24, 18);
  ctx.fillStyle = entity.isOpen ? "#6a4a08" : C.chestDark;
  ctx.fillRect(px + 4, py + 8, 24, 6);
  // Lock
  if (!entity.isOpen) {
    ctx.fillStyle = "#888";
    ctx.fillRect(px + 13, py + 16, 6, 5);
    ctx.fillStyle = "#555";
    ctx.fillRect(px + 14, py + 14, 4, 4);
  } else {
    // Open lid
    ctx.fillStyle = "#c8a030";
    ctx.fillRect(px + 4, py + 2, 24, 8);
    // Items inside
    ctx.fillStyle = C.itemKey;
    ctx.fillRect(px + 11, py + 10, 10, 6);
  }
  // Studs
  ctx.fillStyle = "#888";
  ctx.fillRect(px + 6, py + 10, 3, 3);
  ctx.fillRect(px + 23, py + 10, 3, 3);
}

export function drawShrine(ctx: CanvasRenderingContext2D, entity: Entity, tick: number) {
  const px = entity.x * TILE;
  const py = entity.y * TILE;
  const glow = Math.sin(tick * 0.08) * 0.3 + 0.7;

  // Base
  ctx.fillStyle = C.shrineBase;
  ctx.fillRect(px + 2, py + 18, 28, 12);
  // Pillars
  ctx.fillStyle = "#f0e68c";
  ctx.fillRect(px + 4, py + 6, 6, 14);
  ctx.fillRect(px + 22, py + 6, 6, 14);
  // Top
  ctx.fillStyle = C.shrineBase;
  ctx.fillRect(px + 2, py + 4, 28, 6);
  // Glow orb
  ctx.fillStyle = `rgba(255, 248, 220, ${glow})`;
  ctx.fillRect(px + 12, py + 8, 8, 8);
  ctx.fillStyle = `rgba(255, 220, 100, ${glow * 0.7})`;
  ctx.fillRect(px + 10, py + 6, 12, 12);
}

export function drawSign(ctx: CanvasRenderingContext2D, entity: Entity) {
  const px = entity.x * TILE;
  const py = entity.y * TILE;
  ctx.fillStyle = C.signPost;
  ctx.fillRect(px + 14, py + 16, 4, 14);
  ctx.fillStyle = C.sign;
  ctx.fillRect(px + 4, py + 6, 24, 14);
  ctx.fillStyle = "#5a3a0a";
  ctx.fillRect(px + 6, py + 8, 20, 10);
  ctx.fillStyle = "#f0d060";
  ctx.font = "bold 6px monospace";
  ctx.textAlign = "center";
  ctx.fillText("INFO", px + TILE / 2, py + 15);
}

export function drawItem(ctx: CanvasRenderingContext2D, item: string, px: number, py: number) {
  if (item === "forest_key") {
    ctx.fillStyle = C.itemKey;
    ctx.fillRect(px + 4, py + 6, 16, 4);
    ctx.fillRect(px + 16, py + 2, 6, 6);
    ctx.fillRect(px + 18, py + 8, 4, 4);
    ctx.fillStyle = "#c8a000";
    ctx.fillRect(px + 4, py + 7, 14, 2);
  } else if (item === "forest_badge") {
    ctx.fillStyle = C.itemBadge;
    ctx.fillRect(px + 6, py + 4, 20, 20);
    ctx.fillStyle = "#2a80c0";
    ctx.fillRect(px + 8, py + 6, 16, 16);
    ctx.fillStyle = "#f0f0f0";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.fillText("★", px + TILE / 2, py + 18);
  } else if (item === "ancient_fragment") {
    const img = _sprites["ancient_fragment"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 66, 68, 123, 148, px, py, TILE, TILE);
    } else {
      ctx.fillStyle = "#60c0f0";
      ctx.beginPath();
      ctx.moveTo(px + 16, py + 8);
      ctx.lineTo(px + 22, py + 16);
      ctx.lineTo(px + 16, py + 24);
      ctx.lineTo(px + 10, py + 16);
      ctx.closePath();
      ctx.fill();
    }
  } else if (item === "stone_chip") {
    const img = _sprites["stone_chip"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 87, 87, 77, 77, px, py, TILE, TILE);
    } else {
      ctx.fillStyle = "#8a7a6e";
      ctx.fillRect(px + 8, py + 8, 16, 16);
    }
  } else if (item === "copper_bit") {
    const img = _sprites["copper_bit"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 45, 40, 165, 176, px, py, TILE, TILE);
    } else {
      ctx.fillStyle = "#d4521c";
      ctx.fillRect(px + 8, py + 8, 16, 16);
    }
  } else if (item === "glow_crystal") {
    const img = _sprites["glow_crystal"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 81, 81, 94, 165, px, py, TILE, TILE);
    } else {
      ctx.fillStyle = "#5eead4";
      ctx.fillRect(px + 8, py + 8, 16, 16);
    }
  }
}

export function drawCollectible(ctx: CanvasRenderingContext2D, entity: Entity, tick: number) {
  const px = entity.currPixelX !== undefined ? entity.currPixelX : entity.x * TILE;
  const py = entity.currPixelY !== undefined ? entity.currPixelY : entity.y * TILE;
  const bx = Math.round(px);
  const by = Math.round(py);

  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(bx + 8, by + 26, 16, 4);

  if (entity.collectibleType === "stone_chip") {
    const img = _sprites["stone_chip"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;

      // Exact pixel coordinates analyzed from stone_chip_sheet.png
      const anims = [
        // Row 0: Idle/Float
        [
          { x: 87, y: 87, w: 77, h: 77 },
          { x: 342, y: 97, w: 83, h: 83 },
          { x: 599, y: 122, w: 77, h: 78 },
          { x: 855, y: 86, w: 82, h: 78 }
        ],
        // Row 1: Pickup Sparkle (excluding noise glints)
        [
          { x: 87, y: 341, w: 83, h: 79 },
          { x: 331, y: 337, w: 106, h: 90 },
          { x: 587, y: 316, w: 121, h: 126 },
          { x: 828, y: 311, w: 136, h: 141 }
        ],
        // Row 2: Collected
        [
          { x: 86, y: 609, w: 83, h: 83 },
          { x: 342, y: 532, w: 78, h: 170 },
          { x: 583, y: 532, w: 114, h: 154 },
          { x: 860, y: 547, w: 77, h: 140 }
        ],
        // Row 3: Drop/Spawn
        [
          { x: 92, y: 839, w: 72, h: 139 },
          { x: 342, y: 793, w: 83, h: 144 },
          { x: 568, y: 926, w: 144, h: 78 },
          { x: 855, y: 947, w: 82, h: 57 }
        ]
      ];

      let rIdx = 0; // Row 0: Idle
      let cIdx = 0;

      const state = entity.collectibleState || "idle";
      const timer = entity.collectibleTimer || 0;

      if (state === "spawn") {
        rIdx = 3;
        cIdx = Math.min(3, Math.floor(timer / 8));
      } else if (state === "idle") {
        rIdx = 0;
        cIdx = Math.floor(tick / 8) % 4;
      } else if (state === "sparkle") {
        rIdx = 1;
        cIdx = Math.floor(tick / 6) % 4;
      } else if (state === "collected") {
        rIdx = 2;
        cIdx = Math.min(3, Math.floor(timer / 5));
      }

      const frame = anims[rIdx][cIdx] || anims[0][0];

      let dx = bx;
      let dy = by;

      // Bobbing effect for idle and sparkle states
      if (state === "idle" || state === "sparkle") {
        dy += Math.round(Math.sin(tick * 0.1) * 2);
      }

      // Collected floating animation
      if (state === "collected") {
        dy -= Math.round(timer * 0.8);
      }

      ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, dx, dy, TILE, TILE);
      return;
    }
  } else if (entity.collectibleType === "copper_bit") {
    const img = _sprites["copper_bit"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;

      // Exact pixel coordinates analyzed from copper_bit_sheet.png
      const anims = [
        // Row 0: Idle/Float
        [
          { x: 45, y: 40, w: 165, h: 176 },
          { x: 301, y: 30, w: 165, h: 165 },
          { x: 557, y: 40, w: 165, h: 176 },
          { x: 813, y: 61, w: 165, h: 165 }
        ],
        // Row 1: Pickup Sparkle
        [
          { x: 45, y: 285, w: 177, h: 187 },
          { x: 301, y: 285, w: 166, h: 187 },
          { x: 557, y: 296, w: 166, h: 176 },
          { x: 813, y: 296, w: 165, h: 176 }
        ],
        // Row 2: Collected (ignoring noise glints Col 0)
        [
          { x: 45, y: 552, w: 182, h: 176 },
          { x: 291, y: 531, w: 176, h: 197 },
          { x: 557, y: 551, w: 166, h: 168 },
          { x: 824, y: 583, w: 135, h: 135 }
        ],
        // Row 3: Drop/Spawn
        [
          { x: 45, y: 808, w: 166, h: 165 },
          { x: 301, y: 819, w: 165, h: 165 },
          { x: 542, y: 844, w: 181, h: 171 },
          { x: 808, y: 900, w: 176, h: 124 }
        ]
      ];

      let rIdx = 0;
      let cIdx = 0;

      const state = entity.collectibleState || "idle";
      const timer = entity.collectibleTimer || 0;

      if (state === "spawn") {
        rIdx = 3;
        cIdx = Math.min(3, Math.floor(timer / 8));
      } else if (state === "idle") {
        rIdx = 0;
        cIdx = Math.floor(tick / 8) % 4;
      } else if (state === "sparkle") {
        rIdx = 1;
        cIdx = Math.floor(tick / 6) % 4;
      } else if (state === "collected") {
        rIdx = 2;
        cIdx = Math.min(3, Math.floor(timer / 5));
      }

      const frame = anims[rIdx][cIdx] || anims[0][0];

      let dx = bx;
      let dy = by;

      if (state === "idle" || state === "sparkle") {
        dy += Math.round(Math.sin(tick * 0.1) * 2);
      }

      if (state === "collected") {
        dy -= Math.round(timer * 0.8);
      }

      ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, dx, dy, TILE, TILE);
      return;
    }
  } else if (entity.collectibleType === "glow_crystal") {
    const img = _sprites["glow_crystal"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;

      // Exact pixel coordinates analyzed from glow_crystal_sheet.png
      const anims = [
        // Row 0: Idle/Float
        [
          { x: 81, y: 81, w: 94, h: 165 },
          { x: 337, y: 50, w: 94, h: 196 },
          { x: 593, y: 40, w: 94, h: 206 },
          { x: 849, y: 81, w: 94, h: 165 }
        ],
        // Row 1: Pickup Sparkle
        [
          { x: 81, y: 316, w: 94, h: 146 },
          { x: 295, y: 285, w: 178, h: 198 },
          { x: 561, y: 295, w: 168, h: 188 },
          { x: 797, y: 305, w: 198, h: 168 }
        ],
        // Row 2: Collected
        [
          { x: 81, y: 572, w: 94, h: 146 },
          { x: 337, y: 552, w: 94, h: 145 },
          { x: 593, y: 532, w: 94, h: 144 },
          { x: 850, y: 512, w: 92, h: 143 }
        ],
        // Row 3: Drop/Spawn
        [
          { x: 81, y: 808, w: 94, h: 145 },
          { x: 337, y: 828, w: 94, h: 146 },
          { x: 593, y: 849, w: 94, h: 146 },
          { x: 829, y: 880, w: 134, h: 115 }
        ]
      ];

      let rIdx = 0;
      let cIdx = 0;

      const state = entity.collectibleState || "idle";
      const timer = entity.collectibleTimer || 0;

      if (state === "spawn") {
        rIdx = 3;
        cIdx = Math.min(3, Math.floor(timer / 8));
      } else if (state === "idle") {
        rIdx = 0;
        cIdx = Math.floor(tick / 8) % 4;
      } else if (state === "sparkle") {
        rIdx = 1;
        cIdx = Math.floor(tick / 6) % 4;
      } else if (state === "collected") {
        rIdx = 2;
        cIdx = Math.min(3, Math.floor(timer / 5));
      }

      const frame = anims[rIdx][cIdx] || anims[0][0];

      let dx = bx;
      let dy = by;

      if (state === "idle" || state === "sparkle") {
        dy += Math.round(Math.sin(tick * 0.1) * 2);
      }

      if (state === "collected") {
        dy -= Math.round(timer * 0.8);
      }

      ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, dx, dy, TILE, TILE);
      return;
    }
  } else if (entity.collectibleType === "ancient_fragment") {
    const img = _sprites["ancient_fragment"];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;

      // Exact pixel coordinates analyzed from ancient_fragment_sheet.png
      const anims = [
        // Row 0: Idle/Float
        [
          { x: 66, y: 68, w: 123, h: 148 },
          { x: 323, y: 52, w: 123, h: 154 },
          { x: 573, y: 27, w: 136, h: 165 },
          { x: 835, y: 57, w: 123, h: 154 }
        ],
        // Row 1: Pickup Sparkle
        [
          { x: 55, y: 305, w: 152, h: 148 },
          { x: 301, y: 301, w: 172, h: 166 },
          { x: 551, y: 295, w: 165, h: 180 },
          { x: 818, y: 306, w: 156, h: 161 }
        ],
        // Row 2: Collected
        [
          { x: 65, y: 561, w: 127, h: 160 },
          { x: 328, y: 536, w: 126, h: 187 },
          { x: 572, y: 537, w: 135, h: 182 },
          { x: 838, y: 551, w: 131, h: 168 }
        ],
        // Row 3: Drop/Spawn
        [
          { x: 60, y: 844, w: 131, h: 146 },
          { x: 337, y: 808, w: 94, h: 124 },
          { x: 583, y: 813, w: 109, h: 176 },
          { x: 819, y: 875, w: 154, h: 114 }
        ]
      ];

      let rIdx = 0;
      let cIdx = 0;

      const state = entity.collectibleState || "idle";
      const timer = entity.collectibleTimer || 0;

      if (state === "spawn") {
        rIdx = 3;
        cIdx = Math.min(3, Math.floor(timer / 8));
      } else if (state === "idle") {
        rIdx = 0;
        cIdx = Math.floor(tick / 8) % 4;
      } else if (state === "sparkle") {
        rIdx = 1;
        cIdx = Math.floor(tick / 6) % 4;
      } else if (state === "collected") {
        rIdx = 2;
        cIdx = Math.min(3, Math.floor(timer / 5));
      }

      const frame = anims[rIdx][cIdx] || anims[0][0];

      let dx = bx;
      let dy = by;

      if (state === "idle" || state === "sparkle") {
        dy += Math.round(Math.sin(tick * 0.1) * 2);
      }

      if (state === "collected") {
        dy -= Math.round(timer * 0.8);
      }

      ctx.drawImage(img, frame.x, frame.y, frame.w, frame.h, dx, dy, TILE, TILE);
      return;
    }
  }

  // Fallback for other collectibles if any
  const img = _sprites["ancient_fragment"];
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, bx, by + Math.round(Math.sin(tick * 0.1 + entity.x) * 3), TILE, TILE);
  } else {
    // Fallback: floating glowing light-blue fragment / crystal
    const bob = Math.sin(tick * 0.1 + entity.x) * 3;
    const fby = Math.round(by + bob);
    ctx.fillStyle = "#60c0f0";
    ctx.beginPath();
    ctx.moveTo(bx + 16, fby + 6);
    ctx.lineTo(bx + 24, fby + 16);
    ctx.lineTo(bx + 16, fby + 26);
    ctx.lineTo(bx + 8, fby + 16);
    ctx.closePath();
    ctx.fill();

    // inner glow
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(bx + 16, fby + 10);
    ctx.lineTo(bx + 20, fby + 16);
    ctx.lineTo(bx + 16, fby + 22);
    ctx.lineTo(bx + 12, fby + 16);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawMiningNode(ctx: CanvasRenderingContext2D, entity: Entity, tick: number) {
  const px = entity.x * TILE;
  const py = entity.y * TILE;
  const bx = Math.round(px);
  const by = Math.round(py);

  // If node is depleted (HP <= 0), draw a cracked flat base
  if (entity.miningNodeHp !== undefined && entity.miningNodeHp <= 0) {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(bx + 4, by + 24, 24, 4);

    // flat broken stone base
    ctx.fillStyle = "#555555";
    ctx.fillRect(bx + 6, by + 20, 20, 4);
    ctx.fillStyle = "#333333";
    ctx.fillRect(bx + 10, by + 18, 12, 2);
    return;
  }

  // Shadow under the node
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(bx + 4, by + 26, 24, 4);

  // Hit flash effect: briefly draw solid white overlay or red/white color
  const isHit = entity.miningNodeHitTimer !== undefined && entity.miningNodeHitTimer > 0;

  ctx.save();
  
  // Custom draw depending on mining node type
  const type = entity.miningNodeType || "stone";

  if (type === "stone") {
    // Boulder: grey rock
    ctx.fillStyle = isHit ? "#ffffff" : "#7f7f7f";
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 26);
    ctx.lineTo(bx + 4, by + 16);
    ctx.lineTo(bx + 10, by + 6);
    ctx.lineTo(bx + 22, by + 6);
    ctx.lineTo(bx + 28, by + 16);
    ctx.lineTo(bx + 26, by + 26);
    ctx.closePath();
    ctx.fill();

    // Highlights & Cracks
    if (!isHit) {
      ctx.fillStyle = "#a6a6a6"; // Highlight
      ctx.fillRect(bx + 10, by + 8, 8, 4);
      ctx.fillStyle = "#404040"; // Dark cracks
      ctx.fillRect(bx + 10, by + 16, 10, 2);
      ctx.fillRect(bx + 14, by + 12, 2, 8);
    }
  } else if (type === "copper") {
    // Boulder with copper veins
    ctx.fillStyle = isHit ? "#ffffff" : "#696969";
    ctx.beginPath();
    ctx.moveTo(bx + 7, by + 26);
    ctx.lineTo(bx + 4, by + 14);
    ctx.lineTo(bx + 12, by + 6);
    ctx.lineTo(bx + 20, by + 6);
    ctx.lineTo(bx + 28, by + 14);
    ctx.lineTo(bx + 25, by + 26);
    ctx.closePath();
    ctx.fill();

    // Glowing copper veins (sparkle based on ticks)
    if (!isHit) {
      const glow = Math.sin(tick * 0.1) > 0;
      ctx.fillStyle = glow ? "#ff7f27" : "#b97a57";
      // Vein spots
      ctx.fillRect(bx + 8, by + 10, 4, 3);
      ctx.fillRect(bx + 18, by + 16, 5, 3);
      ctx.fillRect(bx + 12, by + 18, 3, 4);
      ctx.fillStyle = "#a6a6a6"; // stone highlight
      ctx.fillRect(bx + 12, by + 8, 4, 2);
    }
  } else if (type === "crystal") {
    // Dark purple stone base with glowing cyan crystal clusters rising up
    ctx.fillStyle = isHit ? "#ffffff" : "#402060"; // Dark base
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 26);
    ctx.lineTo(bx + 8, by + 18);
    ctx.lineTo(bx + 24, by + 18);
    ctx.lineTo(bx + 26, by + 26);
    ctx.closePath();
    ctx.fill();

    // Crystals
    const glowColor = isHit ? "#ffffff" : `hsl(180, 100%, ${60 + Math.sin(tick * 0.08) * 15}%)`;
    ctx.fillStyle = glowColor;

    // Crystal Shard 1 (Left slant)
    ctx.beginPath();
    ctx.moveTo(bx + 8, by + 18);
    ctx.lineTo(bx + 10, by + 6);
    ctx.lineTo(bx + 14, by + 18);
    ctx.closePath();
    ctx.fill();

    // Crystal Shard 2 (Center tall)
    ctx.beginPath();
    ctx.moveTo(bx + 13, by + 18);
    ctx.lineTo(bx + 16, by + 2);
    ctx.lineTo(bx + 20, by + 18);
    ctx.closePath();
    ctx.fill();

    // Crystal Shard 3 (Right slant)
    ctx.beginPath();
    ctx.moveTo(bx + 18, by + 18);
    ctx.lineTo(bx + 23, by + 8);
    ctx.lineTo(bx + 24, by + 18);
    ctx.closePath();
    ctx.fill();

    // Shimmer highlight
    if (!isHit) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(bx + 15, by + 6, 2, 4);
    }
  } else if (type === "ancient") {
    // Gold glowing obelisk/monument
    ctx.fillStyle = isHit ? "#ffffff" : "#b5a642"; // Gold/Brass base
    ctx.beginPath();
    ctx.moveTo(bx + 6, by + 26);
    ctx.lineTo(bx + 8, by + 6);
    ctx.lineTo(bx + 16, by + 1); // Pointy top
    ctx.lineTo(bx + 24, by + 6);
    ctx.lineTo(bx + 26, by + 26);
    ctx.closePath();
    ctx.fill();

    // Cyan glowing runic carvings
    const runeGlow = isHit ? "#ffffff" : `rgba(0, 255, 255, ${0.4 + Math.sin(tick * 0.05) * 0.4})`;
    ctx.fillStyle = runeGlow;
    // Runic line carvings
    ctx.fillRect(bx + 15, by + 8, 2, 12);
    ctx.fillRect(bx + 12, by + 11, 8, 2);
    ctx.fillRect(bx + 12, by + 16, 8, 2);

    if (!isHit) {
      ctx.fillStyle = "#ffe066"; // bright gold accent
      ctx.fillRect(bx + 10, by + 6, 2, 18);
      ctx.fillRect(bx + 20, by + 6, 2, 18);
    }
  }

  ctx.restore();
}

export function drawQuestBoard(ctx: CanvasRenderingContext2D, entity: Entity) {
  const px = entity.x * TILE;
  const py = entity.y * TILE;
  const bx = Math.round(px);
  const by = Math.round(py);

  // Board legs/posts
  ctx.fillStyle = "#5a3a0a"; // Dark brown wood
  ctx.fillRect(bx + 6, by + 16, 4, 16);
  ctx.fillRect(bx + 22, by + 16, 4, 16);

  // Board background
  ctx.fillStyle = "#8b5a2b"; // Lighter brown wood
  ctx.fillRect(bx + 2, by + 4, 28, 16);
  // Board border
  ctx.strokeStyle = "#3e2723";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 2, by + 4, 28, 16);

  // Quest papers pinned to the board
  ctx.fillStyle = "#f5f5dc"; // Beige paper color
  ctx.fillRect(bx + 5, by + 7, 9, 10);
  ctx.fillRect(bx + 18, by + 7, 9, 10);

  // Small gold/brass pins at the top of the papers
  ctx.fillStyle = "#ffd700";
  ctx.fillRect(bx + 9, by + 6, 2, 2);
  ctx.fillRect(bx + 22, by + 6, 2, 2);

  // Scribbled lines on papers
  ctx.fillStyle = "#757575";
  ctx.fillRect(bx + 7, by + 10, 5, 1);
  ctx.fillRect(bx + 7, by + 12, 5, 1);
  ctx.fillRect(bx + 7, by + 14, 4, 1);

  ctx.fillRect(bx + 20, by + 10, 5, 1);
  ctx.fillRect(bx + 20, by + 12, 5, 1);
  ctx.fillRect(bx + 20, by + 14, 3, 1);
}
