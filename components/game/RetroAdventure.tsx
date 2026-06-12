"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  TILE,
  COLS,
  ROWS,
  MAP_COLS,
  MAP_ROWS_COUNT,
  SPEED,
  INTERACT_RANGE,
  C,
} from "./constants";
import { TileType, Entity, SpriteMap, Quest } from "./types";
import { MAP_ROWS } from "./mapData";
import { INITIAL_ENTITIES } from "./initialEntities";
import {
  drawTile,
  drawPlayer,
  drawNPC,
  drawChest,
  drawShrine,
  drawSign,
  drawItem,
  drawCollectible,
  drawMiningNode,
  drawQuestBoard,
  setSprites,
} from "./drawers";
import { retroAudio } from "./audio";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RetroAdventure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spritesLoadedRef = useRef(false);
  const gameRef = useRef({
    tick: 0,
    gameState: "START" as "START" | "PLAYING" | "PAUSED" | "GAMEOVER" | "GAME_COMPLETED",
    activeModal: "none" as "profile" | "projects" | "skills" | "contact" | "none",
    claimedBadge: false,
    player: { 
      x: 3 * TILE, 
      y: 3 * TILE, 
      dir: "down", 
      moving: false,
      hp: 100,
      maxHp: 100,
      isAttacking: false,
      attackCooldown: 0,
      attackTimer: 0,
      invulnerableTimer: 0,
      pickaxeLevel: 1,
      coins: 0,
      xp: 0,
      level: 1,
      damage: 1
    },
    quests: [
      {
        id: "quest_welcome",
        title: "Welcome to Meki Village",
        description: "Bicaralah dengan Eldrin Sang Tetua Desa.",
        objectives: [{ type: "talk", target: "guide", amount: 1, current: 0 }],
        xpReward: 25,
        coinReward: 10,
        status: "active" as const
      },
      {
        id: "quest_forest_key",
        title: "Find the Forest Key",
        description: "Temukan Forest Key di dalam peti kayu di hutan timur.",
        objectives: [{ type: "collect", target: "forest_key", amount: 1, current: 0 }],
        xpReward: 50,
        coinReward: 20,
        status: "locked" as const
      },
      {
        id: "quest_cave_gate",
        title: "Clear the Cave Gate",
        description: "Kalahkan 2 Slime Byte untuk membersihkan gerbang gua.",
        objectives: [{ type: "defeat", target: "Slime Byte", amount: 2, current: 0 }],
        xpReward: 75,
        coinReward: 30,
        status: "locked" as const
      },
      {
        id: "quest_mine_crystal",
        title: "Mine the Glow Crystal",
        description: "Tambang 3 Batu (Stone Nodes) dan 1 Kristal Bersinar (Crystal Node).",
        objectives: [
          { type: "mine", target: "stone", amount: 3, current: 0 },
          { type: "mine", target: "crystal", amount: 1, current: 0 }
        ],
        xpReward: 100,
        coinReward: 50,
        status: "locked" as const
      },
      {
        id: "quest_activate_shrine",
        title: "Activate the Shrine",
        description: "Bawa Glow Crystal ke Portal Suci di utara desa.",
        objectives: [{ type: "visit", target: "shrine", amount: 1, current: 0 }],
        xpReward: 150,
        coinReward: 100,
        status: "locked" as const
      }
    ] as Quest[],
    keys: new Set<string>(),
    entities: INITIAL_ENTITIES.map(e => ({ ...e })),
    inventory: [] as string[],
    dialogue: null as { entity: Entity; page: number } | null,
    nearEntity: null as Entity | null,
    lastInteracted: null as string | null,
  });

  const [playerHp, setPlayerHp] = useState(100);
  const [pickaxeLevel, setPickaxeLevel] = useState(1);
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerDamage, setPlayerDamage] = useState(1);
  const [questUpdateTick, setQuestUpdateTick] = useState(0);

  const [gameState, setGameStateState] = useState<"START" | "PLAYING" | "PAUSED" | "GAMEOVER" | "GAME_COMPLETED">("START");
  const [activeModal, setActiveModalState] = useState<"profile" | "projects" | "skills" | "contact" | "none">("none");
  const [isMuted, setIsMuted] = useState(false);
  const [claimedBadge, setClaimedBadge] = useState(false);

  const { address } = useAccount();

  const setGameState = useCallback((state: "START" | "PLAYING" | "PAUSED" | "GAMEOVER" | "GAME_COMPLETED") => {
    setGameStateState(state);
    gameRef.current.gameState = state;
  }, []);

  const setActiveModal = useCallback((modal: "profile" | "projects" | "skills" | "contact" | "none") => {
    setActiveModalState(modal);
    gameRef.current.activeModal = modal;
  }, []);

  const [dialogue, setDialogue] = useState<{ name: string; text: string; page: number; total: number } | null>(null);
  const [inventory, setInventory] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animFrameRef = useRef<number>(0);

  const showNotif = useCallback((msg: string) => {
    setNotification(msg);
    if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
    notifTimerRef.current = setTimeout(() => setNotification(null), 3000);
  }, []);

  // ─── Save & Load System ──────────────────────────────────────────────────
  const saveProgress = useCallback(() => {
    if (typeof window === "undefined") return;
    const g = gameRef.current;
    const saveData = {
      player: {
        hp: g.player.hp,
        maxHp: g.player.maxHp,
        pickaxeLevel: g.player.pickaxeLevel,
        coins: g.player.coins,
        xp: g.player.xp,
        level: g.player.level,
        damage: g.player.damage,
        x: g.player.x,
        y: g.player.y
      },
      quests: g.quests.map(q => ({
        id: q.id,
        status: q.status,
        objectives: q.objectives.map(obj => ({
          type: obj.type,
          target: obj.target,
          amount: obj.amount,
          current: obj.current
        }))
      })),
      inventory: g.inventory,
      openedChests: g.entities.filter(e => e.type === "chest" && e.isOpen).map(e => e.id),
      isMuted: retroAudio.getMuted(),
      claimedBadge: g.claimedBadge
    };
    localStorage.setItem("meki_adventure_save", JSON.stringify(saveData));
  }, []);

  const loadProgress = useCallback(() => {
    if (typeof window === "undefined") return false;
    try {
      const raw = localStorage.getItem("meki_adventure_save");
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data) return false;

      const g = gameRef.current;
      if (data.player) {
        g.player.hp = data.player.hp ?? 100;
        g.player.maxHp = data.player.maxHp ?? 100;
        g.player.pickaxeLevel = data.player.pickaxeLevel ?? 1;
        g.player.coins = data.player.coins ?? 0;
        g.player.xp = data.player.xp ?? 0;
        g.player.level = data.player.level ?? 1;
        g.player.damage = data.player.damage ?? 1;
        g.player.x = data.player.x ?? (3 * TILE);
        g.player.y = data.player.y ?? (3 * TILE);

        setPlayerHp(g.player.hp);
        setPickaxeLevel(g.player.pickaxeLevel);
        setCoins(g.player.coins);
        setXp(g.player.xp);
        setLevel(g.player.level);
        setPlayerDamage(g.player.damage);
      }

      if (data.quests && Array.isArray(data.quests)) {
        data.quests.forEach((savedQ: any) => {
          const existingQ = g.quests.find(q => q.id === savedQ.id);
          if (existingQ) {
            existingQ.status = savedQ.status;
            if (savedQ.objectives && Array.isArray(savedQ.objectives)) {
              savedQ.objectives.forEach((savedObj: any, idx: number) => {
                if (existingQ.objectives[idx]) {
                  existingQ.objectives[idx].current = savedObj.current;
                }
              });
            }
          }
        });
        setQuestUpdateTick(t => t + 1);
      }

      if (data.inventory && Array.isArray(data.inventory)) {
        g.inventory = data.inventory;
        setInventory([...g.inventory]);
      }

      if (data.openedChests && Array.isArray(data.openedChests)) {
        g.entities.forEach(e => {
          if (e.type === "chest" && data.openedChests.includes(e.id)) {
            e.isOpen = true;
          }
        });
      }

      if (data.isMuted !== undefined) {
        retroAudio.setMuted(data.isMuted);
        setIsMuted(data.isMuted);
      }

      if (data.claimedBadge !== undefined) {
        g.claimedBadge = data.claimedBadge;
        setClaimedBadge(data.claimedBadge);
      }

      return true;
    } catch (e) {
      console.warn("Load progress error:", e);
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("meki_adventure_save");
      window.location.reload();
    }
  }, []);

  // ─── Stat Modification Helpers ──────────────────────────────────────────
  const addXp = useCallback((amount: number) => {
    const g = gameRef.current;
    const p = g.player;
    p.xp += amount;
    const reqXp = p.level * 100;
    showNotif(`+${amount} XP!`);
    
    if (p.xp >= reqXp) {
      p.xp -= reqXp;
      p.level += 1;
      p.maxHp += 20;
      p.hp = p.maxHp;
      setPlayerHp(p.hp);
      setLevel(p.level);
      showNotif(`🎉 LEVEL UP! Kamu naik ke Level ${p.level}! HP dipulihkan dan meningkat!`);
      retroAudio.playLevelUp();
    }
    setXp(p.xp);
    saveProgress();
  }, [showNotif, saveProgress]);

  const checkQuestCompletion = useCallback((quest: Quest) => {
    const isDone = quest.objectives.every(obj => obj.current >= obj.amount);
    if (isDone && quest.status === "active") {
      quest.status = "completed";
      showNotif(`⭐ QUEST SELESAI: ${quest.title}! Hubungi Papan Quest untuk klaim reward.`);
      retroAudio.playChest();
      saveProgress();
    }
    setQuestUpdateTick(t => t + 1);
  }, [showNotif, saveProgress]);

  const closeDialogue = useCallback(() => {
    setDialogue(null);
    gameRef.current.dialogue = null;
  }, []);

  const advanceDialogue = useCallback(() => {
    const g = gameRef.current;
    if (!g.dialogue) return;
    const entity = g.dialogue.entity;

    // ── MERCHANT TRANSACTION TRIGGERS ──
    if (entity.id === "merchant") {
      const p = g.player as any;
      const stoneChips = g.inventory.filter(item => item === "stone_chip").length;
      const copperBits = g.inventory.filter(item => item === "copper_bit").length;
      const glowCrystals = g.inventory.filter(item => item === "glow_crystal").length;

      const currPage = g.dialogue.page;
      if (currPage === 3) {
        // Buy HP potion
        if (p.coins >= 15) {
          p.coins -= 15;
          p.hp = Math.min(p.maxHp, p.hp + 50);
          setCoins(p.coins);
          setPlayerHp(p.hp);
          retroAudio.playChest();
          showNotif("Beli Ramuan HP sukses! (+50 HP)");
        } else {
          showNotif("Koin tidak cukup! (Butuh 15 Koin)");
        }
      } else if (currPage === 4) {
        // Buy HP upgrade
        if (p.coins >= 50 && stoneChips >= 5) {
          p.coins -= 50;
          p.maxHp += 20;
          p.hp += 20;
          setCoins(p.coins);
          setPlayerHp(p.hp);
          
          let removed = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "stone_chip" && removed < 5) { removed++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playLevelUp();
          showNotif("Peningkatan HP Maks sukses! (+20 HP Maks)");
        } else {
          showNotif("Koin atau Stone Chip tidak cukup!");
        }
      } else if (currPage === 5) {
        // Buy Attack upgrade
        if (p.coins >= 80 && copperBits >= 5) {
          p.coins -= 80;
          p.damage = (p.damage || 1) + 1;
          setCoins(p.coins);
          setPlayerDamage(p.damage);

          let removed = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "copper_bit" && removed < 5) { removed++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playLevelUp();
          showNotif(`Peningkatan Attack sukses! (+1 Damage, Total: ${p.damage})`);
        } else {
          showNotif("Koin atau Copper Bit tidak cukup!");
        }
      } else if (currPage === 6) {
        // Sell 1 Stone Chip
        if (stoneChips >= 1) {
          p.coins += 3;
          setCoins(p.coins);
          let removed = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "stone_chip" && removed < 1) { removed++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playChest();
          showNotif("Berhasil menjual 1 Stone Chip! (+3 Koin)");
        } else {
          showNotif("Kamu tidak memiliki Stone Chip!");
        }
      } else if (currPage === 7) {
        // Sell 1 Copper Bit
        if (copperBits >= 1) {
          p.coins += 6;
          setCoins(p.coins);
          let removed = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "copper_bit" && removed < 1) { removed++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playChest();
          showNotif("Berhasil menjual 1 Copper Bit! (+6 Koin)");
        } else {
          showNotif("Kamu tidak memiliki Copper Bit!");
        }
      } else if (currPage === 8) {
        // Sell 1 Glow Crystal
        if (glowCrystals >= 1) {
          p.coins += 15;
          setCoins(p.coins);
          let removed = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "glow_crystal" && removed < 1) { removed++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playChest();
          showNotif("Berhasil menjual 1 Glow Crystal! (+15 Koin)");
        } else {
          showNotif("Kamu tidak memiliki Glow Crystal!");
        }
      }
      saveProgress();
    }

    const lines = entity.dialogue || [];
    const nextPage = g.dialogue.page + 1;

    if (nextPage >= lines.length) {
      // Handle end of dialogue
      if (entity.type === "chest" && !entity.isOpen) {
        const idx = g.entities.findIndex(e => e.id === entity.id);
        if (idx !== -1) {
          g.entities[idx] = { ...g.entities[idx], isOpen: true };
          if (entity.givesItem) {
            g.inventory = [...g.inventory, entity.givesItem];
            setInventory([...g.inventory]);
            retroAudio.playChest();
            showNotif(`Kamu mendapatkan: ${entity.givesItem === "forest_key" ? "🗝 Forest Key" : entity.givesItem}!`);

            // Track quest objectives for collect
            g.quests.forEach(q => {
              if (q.status === "active") {
                q.objectives.forEach(obj => {
                  if (obj.type === "collect" && obj.target === entity.givesItem) {
                    obj.current = Math.min(obj.amount, obj.current + 1);
                    checkQuestCompletion(q);
                  }
                });
              }
            });
          }
        }
      }
      closeDialogue();
      saveProgress();

      // Trigger modal view or contact/completion screen
      if (entity.action && entity.action !== "none") {
        setActiveModal(entity.action);
        if (entity.action === "contact") {
          setGameState("GAME_COMPLETED");
          retroAudio.playLevelUp();
        }
      }
    } else {
      g.dialogue.page = nextPage;
      setDialogue({
        name: entity.name || "",
        text: lines[nextPage],
        page: nextPage,
        total: lines.length,
      });
    }
  }, [closeDialogue, showNotif, checkQuestCompletion, saveProgress, setActiveModal, setGameState]);

  const interact = useCallback(() => {
    const g = gameRef.current;
    if (g.dialogue) {
      advanceDialogue();
      return;
    }
    if (!g.nearEntity) return;

    const entity = g.nearEntity;

    // ── MINING NODE INTERACTION ──
    if (entity.type === "mining_node") {
      if (entity.miningNodeHp !== undefined && entity.miningNodeHp <= 0) {
        showNotif("Sumber daya ini sedang habis. Menunggu respawn...");
        return;
      }

      const p = g.player as any;
      const currentLvl = p.pickaxeLevel || 1;
      const reqLvl = entity.miningNodeRequiredToolLevel || 1;

      if (currentLvl < reqLvl) {
        let toolName = "Old Pickaxe";
        if (reqLvl === 2) toolName = "Steel Pickaxe";
        if (reqLvl === 3) toolName = "Ancient Pickaxe";
        showNotif(`Butuh ${toolName} (Level ${reqLvl}) untuk menambang ini!`);
        return;
      }

      // Swing pickaxe / weapon
      if (!p.isAttacking && p.attackCooldown === 0) {
        p.isAttacking = true;
        p.attackTimer = 10;
        p.attackCooldown = 15;
        retroAudio.playAttack();
      }

      // Decrement Hp and trigger hit flash
      entity.miningNodeHp = (entity.miningNodeHp ?? 3) - 1;
      entity.miningNodeHitTimer = 8; // flash white for 8 frames
      retroAudio.playHit();

      showNotif(`Menambang ${entity.name}... (HP: ${entity.miningNodeHp}/${entity.miningNodeMaxHp ?? 3})`);

      if (entity.miningNodeHp <= 0) {
        entity.miningNodeRespawnTimer = 600; // 10 seconds respawn cooldown

        // Spawning resource drop collectibles!
        const nodeType = entity.miningNodeType || "stone";
        let dropType: "stone_chip" | "copper_bit" | "glow_crystal" | "ancient_fragment" = "stone_chip";
        let dropName = "Stone Chip";
        let minAmt = 1;
        let maxAmt = 2;

        if (nodeType === "copper") {
          dropType = "copper_bit";
          dropName = "Copper Bit";
        } else if (nodeType === "crystal") {
          dropType = "glow_crystal";
          dropName = "Glow Crystal";
        } else if (nodeType === "ancient") {
          dropType = "ancient_fragment";
          dropName = "Ancient Fragment";
        }

        const dropCount = Math.floor(Math.random() * (maxAmt - minAmt + 1)) + minAmt;
        for (let i = 0; i < dropCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const launchDist = 12 + Math.random() * 16;
          const startX = entity.x * TILE;
          const startY = entity.y * TILE;
          const destX = startX + Math.cos(angle) * launchDist;
          const destY = startY + Math.sin(angle) * launchDist;
          const dropId = `${dropType}_node_${Date.now()}_${Math.random()}`;

          g.entities.push({
            id: dropId,
            x: Math.round(destX / TILE),
            y: Math.round(destY / TILE),
            type: "collectible",
            name: dropName,
            collectibleType: dropType,
            collectibleState: "spawn",
            collectibleTimer: 0,
            currPixelX: startX,
            currPixelY: startY,
            targetX: Math.round(destX / TILE),
            targetY: Math.round(destY / TILE),
            spawnVelX: (destX - startX) / 30,
            spawnVelY: (destY - startY) / 30,
          });
        }
        retroAudio.playDefeat();
        showNotif(`Berhasil menambang ${entity.name}!`);

        // Track quest objective for mine
        g.quests.forEach(q => {
          if (q.status === "active") {
            q.objectives.forEach(obj => {
              if (obj.type === "mine" && obj.target === nodeType) {
                obj.current = Math.min(obj.amount, obj.current + 1);
                checkQuestCompletion(q);
              }
            });
          }
        });
        saveProgress();
      }
      return;
    }

    if (entity.type === "chest" && entity.isOpen) {
      showNotif("Peti ini sudah terbuka.");
      return;
    }
    if (entity.requiresItem && !g.inventory.includes(entity.requiresItem)) {
      let requiredName = entity.requiresItem === "forest_key" ? "🗝 Forest Key" : entity.requiresItem === "glow_crystal" ? "💎 Glow Crystal" : entity.requiresItem;
      showNotif(`Kamu butuh ${requiredName} untuk membuka/mengaktifkan ini.`);
      return;
    }

    // ── QUEST BOARD INTERACTION ──
    if (entity.type === "quest_board") {
      const completedQuest = g.quests.find(q => q.status === "completed");
      if (completedQuest) {
        completedQuest.status = "claimed";
        const p = g.player;
        p.coins += completedQuest.coinReward;
        setCoins(p.coins);
        
        let rewardText = `+${completedQuest.coinReward} Koin, +${completedQuest.xpReward} XP`;
        if (completedQuest.itemReward) {
          g.inventory = [...g.inventory, completedQuest.itemReward];
          setInventory([...g.inventory]);
          rewardText += `, +${completedQuest.itemReward === "stone_chip" ? "🪨 Stone Chip" : completedQuest.itemReward}`;
        }
        
        showNotif(`🏆 KLAIM REWARD: ${completedQuest.title}! (${rewardText})`);
        retroAudio.playLevelUp();
        addXp(completedQuest.xpReward);
        
        const currentIdx = g.quests.findIndex(q => q.id === completedQuest.id);
        if (currentIdx !== -1 && currentIdx + 1 < g.quests.length) {
          const nextQ = g.quests[currentIdx + 1];
          nextQ.status = "active";
          showNotif(`🆕 QUEST BARU: ${nextQ.title}`);
        }
        saveProgress();
        return;
      }
      
      const activeQuest = g.quests.find(q => q.status === "active");
      let boardLines = [];
      if (activeQuest) {
        boardLines = [
          "=== PAPAN QUEST DESA ===",
          `Quest Aktif: ${activeQuest.title}`,
          activeQuest.description,
          "Selesaikan target objektif lalu kembali ke sini untuk mengklaim koin dan XP!"
        ];
      } else {
        const allClaimed = g.quests.every(q => q.status === "claimed");
        if (allClaimed) {
          boardLines = [
            "=== PAPAN QUEST DESA ===",
            "Semua quest utama desa telah diselesaikan!",
            "Terima kasih atas bantuanmu menyelamatkan desa ini.",
            "Bicaralah dengan Portal Suci di utara untuk menyelesaikan petualangan!"
          ];
        } else {
          boardLines = [
            "=== PAPAN QUEST DESA ===",
            "Tidak ada quest aktif. Temuilah Sage Eldrin terlebih dahulu!"
          ];
        }
      }
      
      g.dialogue = { entity, page: 0 };
      setDialogue({
        name: entity.name || "Papan Quest",
        text: boardLines[0],
        page: 0,
        total: boardLines.length,
      });
      return;
    }

    // ── DYNAMIC DIALOGUE UPGRADES FOR MIKO ──
    let lines = entity.dialogue || ["..."];
    if (entity.id === "builder") {
      const p = g.player as any;
      const pickLvl = p.pickaxeLevel || 1;
      const stoneChips = g.inventory.filter(item => item === "stone_chip").length;
      const copperBits = g.inventory.filter(item => item === "copper_bit").length;
      const glowCrystals = g.inventory.filter(item => item === "glow_crystal").length;

      if (pickLvl === 1) {
        if (stoneChips >= 5 && copperBits >= 3) {
          p.pickaxeLevel = 2;
          setPickaxeLevel(2);

          let removedStone = 0, removedCopper = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "stone_chip" && removedStone < 5) { removedStone++; return false; }
            if (item === "copper_bit" && removedCopper < 3) { removedCopper++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playLevelUp();
          showNotif("⚒ Pickaxe upgraded to Level 2!");

          lines = [
            "Halo! Saya Miko si crafter!",
            "Oh! Kamu membawa 5 Stone Chip dan 3 Copper Bit!",
            "Mari kita tempa Old Pickaxe-mu menjadi Steel Pickaxe (Level 2)...",
            "Selesai! Sekarang kamu bisa menambang Glow Crystal!"
          ];
        } else {
          lines = [
            "Halo! Saya Miko si crafter!",
            "Saat ini kamu memiliki Old Pickaxe (Level 1) yang hanya bisa menambang Stone dan Copper.",
            "Bawa 5 Stone Chip dan 3 Copper Bit kemari untuk saya tingkatkan menjadi Steel Pickaxe (Level 2)!",
            `Bahanmu: 🪨 Stone Chip (${stoneChips}/5), 🔸 Copper Bit (${copperBits}/3).`
          ];
        }
      } else if (pickLvl === 2) {
        if (copperBits >= 5 && glowCrystals >= 3) {
          p.pickaxeLevel = 3;
          setPickaxeLevel(3);

          let removedCopper = 0, removedCrystal = 0;
          g.inventory = g.inventory.filter(item => {
            if (item === "copper_bit" && removedCopper < 5) { removedCopper++; return false; }
            if (item === "glow_crystal" && removedCrystal < 3) { removedCrystal++; return false; }
            return true;
          });
          setInventory([...g.inventory]);
          retroAudio.playLevelUp();
          showNotif("⚒ Pickaxe upgraded to Level 3!");

          lines = [
            "Halo lagi! Miko si crafter di sini.",
            "Luar biasa! Kamu membawa 5 Copper Bit dan 3 Glow Crystal!",
            "Mari kita tempa Steel Pickaxe-mu menjadi Ancient Pickaxe (Level 3)...",
            "Sempurna! Dengan Ancient Pickaxe ini, kamu bisa menambang Pilar Kuno di gua!"
          ];
        } else {
          lines = [
            "Halo lagi! Miko si crafter di sini.",
            "Kamu memiliki Steel Pickaxe (Level 2).",
            "Bawa 5 Copper Bit dan 3 Glow Crystal kemari untuk meningkatkannya menjadi Ancient Pickaxe (Level 3)!",
            `Bahanmu: 🔸 Copper Bit (${copperBits}/5), 💎 Glow Crystal (${glowCrystals}/3).`
          ];
        }
      } else {
        lines = [
          "Halo! Senang melihatmu lagi.",
          "Kamu sudah memiliki Ancient Pickaxe (Level 3), pickaxe terkuat yang ada!",
          "Sekarang pergilah dan tambang Pilar Kuno di gua untuk mengumpulkan Ancient Fragment!"
        ];
      }
      entity.dialogue = lines;
      saveProgress();
    }

    // Track quest objectives for talk
    g.quests.forEach(q => {
      if (q.status === "active") {
        q.objectives.forEach(obj => {
          if (obj.type === "talk" && obj.target === entity.id) {
            obj.current = Math.min(obj.amount, obj.current + 1);
            checkQuestCompletion(q);
          }
        });
      }
    });

    // Track quest objectives for shrine visit
    if (entity.id === "shrine") {
      g.quests.forEach(q => {
        if (q.status === "active") {
          q.objectives.forEach(obj => {
            if (obj.type === "visit" && obj.target === "shrine") {
              obj.current = Math.min(obj.amount, obj.current + 1);
              checkQuestCompletion(q);
            }
          });
        }
      });
    }

    g.dialogue = { entity, page: 0 };
    setDialogue({
      name: entity.name || "",
      text: lines[0],
      page: 0,
      total: lines.length,
    });
  }, [advanceDialogue, showNotif, setInventory, setPickaxeLevel, setCoins, addXp, checkQuestCompletion, saveProgress]);

  // ─── Input ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (e.type === "keydown") {
        g.keys.add(e.key.toLowerCase());
        
        if ((e.key === "e" || e.key === "E") && !e.repeat) {
          if (g.gameState === "PLAYING") {
            interact();
          }
        }
        
        if (e.key === "Escape") {
          if (g.dialogue) {
            closeDialogue();
          } else {
            setGameStateState(curr => {
              const nextState = curr === "PLAYING" ? "PAUSED" : curr === "PAUSED" ? "PLAYING" : curr;
              g.gameState = nextState;
              if (nextState === "PAUSED") {
                retroAudio.stopMusic();
              } else if (nextState === "PLAYING" && !isMuted) {
                retroAudio.playMusic();
              }
              return nextState;
            });
          }
        }
        
        if (e.key === " ") {
          e.preventDefault();
          const p = g.player;
          if (g.gameState === "PLAYING" && !g.dialogue && !p.isAttacking && p.attackCooldown === 0 && g.activeModal === "none") {
            p.isAttacking = true;
            p.attackTimer = 10;
            p.attackCooldown = 20;
            retroAudio.playAttack();
          }
        }
      } else {
        g.keys.delete(e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [interact, closeDialogue, isMuted]);

  // ─── Game Loop ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // Preload sprites from /game/sprites/
    if (!spritesLoadedRef.current) {
      spritesLoadedRef.current = true;
      const entries: [string, string][] = [
        ["player",           "/game/sprites/player_sheet.png"],
        ["guide",            "/game/sprites/guide_sheet.png"],
        ["builder",          "/game/sprites/builder_sheet.png"],
        ["archivist",        "/game/sprites/archivist_sheet.png"],
        ["slime",            "/game/sprites/slime_sheet.png"],
        ["bugling",          "/game/sprites/bugling_sheet.png"],
        ["rockimp",          "/game/sprites/rock_imp_sheet.png"],
        ["cavewarden",       "/game/sprites/cave_warden_sheet.png"],
        ["ancient_fragment", "/game/sprites/ancient_fragment_sheet.png"],
        ["stone_chip",       "/game/sprites/stone_chip_sheet.png"],
        ["copper_bit",       "/game/sprites/copper_bit_sheet.png"],
        ["glow_crystal",     "/game/sprites/glow_crystal_sheet.png"],
      ];
      const map: SpriteMap = {};
      entries.forEach(([key, src]) => {
        const img = new Image();
        img.src = src;
        map[key] = img;
      });
      setSprites(map);
    }

    function isBlocked(nx: number, ny: number): boolean {
      const tileX = Math.floor(nx / TILE);
      const tileY = Math.floor(ny / TILE);
      if (tileX < 0 || tileX >= MAP_COLS || tileY < 0 || tileY >= MAP_ROWS_COUNT) return true;
      
      // Dynamic Cave Gate check
      if (tileY === 4 && (tileX === 10 || tileX === 11 || tileX === 12)) {
        const hasKey = gameRef.current.inventory.includes("forest_key");
        if (!hasKey) return true;
        return false;
      }
      
      // Dynamic Shrine Gate check
      if (tileY === 4 && (tileX === 19 || tileX === 20 || tileX === 21)) {
        const hasCrystal = gameRef.current.inventory.includes("glow_crystal");
        if (!hasCrystal) return true;
        return false;
      }

      const tile = MAP_ROWS[tileY]?.[tileX];
      if (tile === "W" || tile === "T" || tile === "~") return true;
      return false;
    }

    function loop() {
      const g = gameRef.current;
      g.tick++;

      // Update player combat timers
      const p = g.player;
      if (p.attackCooldown > 0) p.attackCooldown--;
      if (p.isAttacking) {
        p.attackTimer--;
        if (p.attackTimer <= 0) {
          p.isAttacking = false;
        }
      }
      if (p.invulnerableTimer > 0) p.invulnerableTimer--;

      // Attack hit check (on the first frame of attack)
      if (p.isAttacking && p.attackTimer === 9) {
        const range = TILE * 1.2;
        let ax0 = p.x, ay0 = p.y, ax1 = p.x + TILE, ay1 = p.y + TILE;
        if (p.dir === "left") {
          ax0 = p.x - range;
          ax1 = p.x;
        } else if (p.dir === "right") {
          ax0 = p.x + TILE;
          ax1 = p.x + TILE + range;
        } else if (p.dir === "up") {
          ay0 = p.y - range;
          ay1 = p.y;
        } else if (p.dir === "down") {
          ay0 = p.y + TILE;
          ay1 = p.y + TILE + range;
        }

        g.entities.forEach(entity => {
          if (entity.type === "enemy" && !entity.isDead) {
            const ex = entity.currPixelX !== undefined ? entity.currPixelX : entity.x * TILE;
            const ey = entity.currPixelY !== undefined ? entity.currPixelY : entity.y * TILE;
            const overlapX = Math.max(ax0, ex) < Math.min(ax1, ex + TILE);
            const overlapY = Math.max(ay0, ey) < Math.min(ay1, ey + TILE);
            if (overlapX && overlapY) {
              entity.isHit = true;
              entity.hitTimer = 15;
              entity.isAttacking = false;
              entity.hp = (entity.hp || 3) - (p.damage || 1);
              retroAudio.playHit();

              // Knockback
              const kb = TILE * 0.8;
              let kbx = 0, kby = 0;
              if (p.dir === "left") kbx = -kb;
              else if (p.dir === "right") kbx = kb;
              else if (p.dir === "up") kby = -kb;
              else if (p.dir === "down") kby = kb;

              const nextKbx = (entity.currPixelX || entity.x * TILE) + kbx;
              const nextKby = (entity.currPixelY || entity.y * TILE) + kby;
              if (!isBlocked(nextKbx + TILE/2, nextKby + TILE/2)) {
                entity.currPixelX = nextKbx;
                entity.currPixelY = nextKby;
                entity.x = Math.round(nextKbx / TILE);
                entity.y = Math.round(nextKby / TILE);
              }

              if (entity.hp <= 0) {
                entity.isDead = true;
                entity.deathTimer = 40; // 40 frames death anim
                retroAudio.playDefeat();

                // Add coins and XP to player
                const coinReward = entity.xpReward ? Math.floor(entity.xpReward / 2) + Math.floor(Math.random() * 5) : 3;
                g.player.coins += coinReward;
                setCoins(g.player.coins);
                showNotif(`Kalahkan ${entity.name}! (+${entity.xpReward} XP, +${coinReward} Koin)`);
                addXp(entity.xpReward || 10);

                // Track quest objectives for defeat
                g.quests.forEach(q => {
                  if (q.status === "active") {
                    q.objectives.forEach(obj => {
                      if (obj.type === "defeat" && entity.name && entity.name.startsWith(obj.target)) {
                        obj.current = Math.min(obj.amount, obj.current + 1);
                        checkQuestCompletion(q);
                      }
                    });
                  }
                });
              }
            }
          }
        });
      }

      // Movement (only when game is playing, no dialogues, no active modals)
      if (g.gameState === "PLAYING" && !g.dialogue && g.activeModal === "none") {
        const keys = g.keys;
        let dx = 0, dy = 0;
        if (keys.has("arrowleft") || keys.has("a")) { dx = -SPEED; g.player.dir = "left"; }
        if (keys.has("arrowright") || keys.has("d")) { dx = SPEED; g.player.dir = "right"; }
        if (keys.has("arrowup") || keys.has("w")) { dy = -SPEED; g.player.dir = "up"; }
        if (keys.has("arrowdown") || keys.has("s")) { dy = SPEED; g.player.dir = "down"; }
        g.player.moving = dx !== 0 || dy !== 0;

        if (g.player.moving && g.tick % 22 === 0) {
          retroAudio.playWalk();
        }

        const px = g.player.x;
        const py = g.player.y;
        const margin = 4;

        // Horizontal collision
        if (dx !== 0) {
          const testX = dx > 0 ? px + dx + TILE - margin : px + dx + margin;
          if (!isBlocked(testX, py + margin) && !isBlocked(testX, py + TILE - margin - 4))
            g.player.x += dx;
        }
        // Vertical collision
        if (dy !== 0) {
          const testY = dy > 0 ? py + dy + TILE - margin : py + dy + margin;
          if (!isBlocked(px + margin, testY) && !isBlocked(px + TILE - margin, testY))
            g.player.y += dy;
        }
      } else {
        g.player.moving = false;
      }

      // Update collectibles and check collisions
      g.entities = g.entities.filter(entity => {
        if (entity.type === "collectible") {
          if (
            entity.collectibleType === "stone_chip" ||
            entity.collectibleType === "copper_bit" ||
            entity.collectibleType === "glow_crystal" ||
            entity.collectibleType === "ancient_fragment"
          ) {
            const isCopper = entity.collectibleType === "copper_bit";
            const isCrystal = entity.collectibleType === "glow_crystal";
            const isFragment = entity.collectibleType === "ancient_fragment";
            const itemName = isFragment
              ? "ancient_fragment"
              : isCrystal
              ? "glow_crystal"
              : isCopper
              ? "copper_bit"
              : "stone_chip";
            const itemLabel = isFragment
              ? "💎 Ancient Fragment"
              : isCrystal
              ? "💎 Glow Crystal"
              : isCopper
              ? "🔸 Copper Bit"
              : "🪨 Stone Chip";

            const ex = entity.currPixelX !== undefined ? entity.currPixelX : entity.x * TILE;
            const ey = entity.currPixelY !== undefined ? entity.currPixelY : entity.y * TILE;
            const eCx = ex + TILE / 2;
            const eCy = ey + TILE / 2;
            const pCx = p.x + TILE / 2;
            const pCy = p.y + TILE / 2;
            const dist = Math.hypot(eCx - pCx, eCy - pCy);

            // Increment animation frame timer
            if (entity.collectibleTimer === undefined) entity.collectibleTimer = 0;
            entity.collectibleTimer++;

            const state = entity.collectibleState || "idle";

            if (state === "spawn") {
              // Apply launch velocity
              if (entity.currPixelX !== undefined && entity.spawnVelX !== undefined) {
                entity.currPixelX += entity.spawnVelX;
              }
              if (entity.currPixelY !== undefined && entity.spawnVelY !== undefined) {
                entity.currPixelY += entity.spawnVelY;
              }
              // Stop spawning and settle after 30 frames
              if (entity.collectibleTimer >= 30) {
                entity.collectibleState = "idle";
                entity.collectibleTimer = 0;
                // Snap to tile
                if (entity.currPixelX !== undefined) entity.x = Math.round(entity.currPixelX / TILE);
                if (entity.currPixelY !== undefined) entity.y = Math.round(entity.currPixelY / TILE);
              }
            } else if (state === "idle") {
              // Check distance to player. Sparkle if within 1.5 tiles (48px)
              if (dist < TILE * 1.5) {
                entity.collectibleState = "sparkle";
                entity.collectibleTimer = 0;
              }
            } else if (state === "sparkle") {
              // Sparkle effect when player is near. Transition back if player leaves.
              if (dist >= TILE * 1.5) {
                entity.collectibleState = "idle";
                entity.collectibleTimer = 0;
              }
              // If player collides (within 0.7 tiles), collect it!
              if (dist < TILE * 0.7) {
                entity.collectibleState = "collected";
                entity.collectibleTimer = 0;
                showNotif(`Kamu menemukan: ${itemLabel}!`);
              }
            } else if (state === "collected") {
              // Floating up animation completes after 20 frames
              if (entity.collectibleTimer >= 20) {
                // Add to inventory
                g.inventory = [...g.inventory, itemName];
                setInventory([...g.inventory]);

                // Track quest objectives for collect
                g.quests.forEach(q => {
                  if (q.status === "active") {
                    q.objectives.forEach(obj => {
                      if (obj.type === "collect" && obj.target === itemName) {
                        obj.current = Math.min(obj.amount, obj.current + 1);
                        checkQuestCompletion(q);
                      }
                    });
                  }
                });
                return false; // remove from list
              }
            }
            return true; // keep
          }
        }
        return true; // keep
      });

      // Find nearest interactable entity
      const pcx = g.player.x + TILE / 2;
      const pcy = g.player.y + TILE / 2;
      let nearEnt: Entity | null = null;
      let nearDist = INTERACT_RANGE;
      for (const e of g.entities) {
        if (e.type === "sign") continue; // skip signs for now
        const ex = e.x * TILE + TILE / 2;
        const ey = e.y * TILE + TILE / 2;
        const dist = Math.hypot(ex - pcx, ey - pcy);
        if (dist < nearDist) { nearDist = dist; nearEnt = e; }
      }
      g.nearEntity = nearEnt;

      // Update builder NPC movement & interaction facing direction
      const builderNPC = g.entities.find(e => e.id === "builder");
      if (builderNPC) {
        if (g.dialogue && g.dialogue.entity.id === "builder") {
          builderNPC.moving = false;
          const px = g.player.x;
          const py = g.player.y;
          const bx = builderNPC.currPixelX !== undefined ? builderNPC.currPixelX : builderNPC.x * TILE;
          const by = builderNPC.currPixelY !== undefined ? builderNPC.currPixelY : builderNPC.y * TILE;
          const dx = px - bx;
          const dy = py - by;
          if (Math.abs(dx) > Math.abs(dy)) {
            builderNPC.dir = dx > 0 ? "right" : "left";
          } else {
            builderNPC.dir = dy > 0 ? "down" : "up";
          }
        } else {
          if (builderNPC.currPixelX === undefined) builderNPC.currPixelX = builderNPC.x * TILE;
          if (builderNPC.currPixelY === undefined) builderNPC.currPixelY = builderNPC.y * TILE;
          if (builderNPC.targetX === undefined) builderNPC.targetX = builderNPC.x;
          if (builderNPC.targetY === undefined) builderNPC.targetY = builderNPC.y;
          if (builderNPC.moveCooldown === undefined) builderNPC.moveCooldown = 0;

          const tx = builderNPC.targetX * TILE;
          const ty = builderNPC.targetY * TILE;
          const dist = Math.hypot(tx - builderNPC.currPixelX, ty - builderNPC.currPixelY);

          if (dist < 1) {
            builderNPC.currPixelX = tx;
            builderNPC.currPixelY = ty;
            builderNPC.x = builderNPC.targetX;
            builderNPC.y = builderNPC.targetY;

            if (builderNPC.moving) {
              builderNPC.moving = false;
              builderNPC.moveCooldown = Math.floor(Math.random() * 120) + 60; // pause for 1-3 seconds
            }

            if (builderNPC.moveCooldown > 0) {
              builderNPC.moveCooldown--;
            } else {
              // Decide between horizontal pacing (along row 12) or vertical pacing (along col 22)
              const walkAxis = Math.random() > 0.5 ? "horizontal" : "vertical";
              if (walkAxis === "horizontal") {
                const targets = [18, 19, 20, 21, 22, 23, 24, 25, 26];
                let nextX = builderNPC.x;
                while (nextX === builderNPC.x) {
                  nextX = targets[Math.floor(Math.random() * targets.length)];
                }
                builderNPC.targetX = nextX;
                builderNPC.targetY = 12; // Snap to row 12
                builderNPC.moving = true;
                builderNPC.dir = nextX > builderNPC.x ? "right" : "left";
              } else {
                const targets = [10, 11, 12, 13, 14];
                let nextY = builderNPC.y;
                while (nextY === builderNPC.y) {
                  nextY = targets[Math.floor(Math.random() * targets.length)];
                }
                builderNPC.targetX = 22; // Snap to col 22
                builderNPC.targetY = nextY;
                builderNPC.moving = true;
                builderNPC.dir = nextY > builderNPC.y ? "down" : "up";
              }
            }
          } else {
            const step = 0.8; // walking speed for NPC Miko
            // Move along X axis if not there
            if (Math.abs(tx - builderNPC.currPixelX) > 0.5) {
              if (builderNPC.currPixelX < tx) {
                builderNPC.currPixelX = Math.min(tx, builderNPC.currPixelX + step);
                builderNPC.dir = "right";
              } else {
                builderNPC.currPixelX = Math.max(tx, builderNPC.currPixelX - step);
                builderNPC.dir = "left";
              }
              builderNPC.moving = true;
            }
            // Move along Y axis if not there
            else if (Math.abs(ty - builderNPC.currPixelY) > 0.5) {
              if (builderNPC.currPixelY < ty) {
                builderNPC.currPixelY = Math.min(ty, builderNPC.currPixelY + step);
                builderNPC.dir = "down";
              } else {
                builderNPC.currPixelY = Math.max(ty, builderNPC.currPixelY - step);
                builderNPC.dir = "up";
              }
              builderNPC.moving = true;
            }
          }
        }
      }

      // Update archivist NPC movement & interaction facing direction
      const archivistNPC = g.entities.find(e => e.id === "archivist");
      if (archivistNPC) {
        if (g.dialogue && g.dialogue.entity.id === "archivist") {
          archivistNPC.moving = false;
          const px = g.player.x;
          const py = g.player.y;
          const bx = archivistNPC.currPixelX !== undefined ? archivistNPC.currPixelX : archivistNPC.x * TILE;
          const by = archivistNPC.currPixelY !== undefined ? archivistNPC.currPixelY : archivistNPC.y * TILE;
          const dx = px - bx;
          const dy = py - by;
          if (Math.abs(dx) > Math.abs(dy)) {
            archivistNPC.dir = dx > 0 ? "right" : "left";
          } else {
            archivistNPC.dir = dy > 0 ? "down" : "up";
          }
        } else {
          if (archivistNPC.currPixelX === undefined) archivistNPC.currPixelX = archivistNPC.x * TILE;
          if (archivistNPC.currPixelY === undefined) archivistNPC.currPixelY = archivistNPC.y * TILE;
          if (archivistNPC.targetX === undefined) archivistNPC.targetX = archivistNPC.x;
          if (archivistNPC.targetY === undefined) archivistNPC.targetY = archivistNPC.y;
          if (archivistNPC.moveCooldown === undefined) archivistNPC.moveCooldown = 0;

          const tx = archivistNPC.targetX * TILE;
          const ty = archivistNPC.targetY * TILE;
          const dist = Math.hypot(tx - archivistNPC.currPixelX, ty - archivistNPC.currPixelY);

          if (dist < 1) {
            archivistNPC.currPixelX = tx;
            archivistNPC.currPixelY = ty;
            archivistNPC.x = archivistNPC.targetX;
            archivistNPC.y = archivistNPC.targetY;

            if (archivistNPC.moving) {
              archivistNPC.moving = false;
              archivistNPC.moveCooldown = Math.floor(Math.random() * 120) + 60; // pause for 1-3 seconds
            }

            if (archivistNPC.moveCooldown > 0) {
              archivistNPC.moveCooldown--;
            } else {
              // Lyra paces horizontally (along row 23) or vertically (along col 10)
              const walkAxis = Math.random() > 0.5 ? "horizontal" : "vertical";
              if (walkAxis === "horizontal") {
                const targets = [6, 7, 8, 9, 10, 11, 12, 13, 14];
                let nextX = archivistNPC.x;
                while (nextX === archivistNPC.x) {
                  nextX = targets[Math.floor(Math.random() * targets.length)];
                }
                archivistNPC.targetX = nextX;
                archivistNPC.targetY = 23; // Snap to row 23
                archivistNPC.moving = true;
                archivistNPC.dir = nextX > archivistNPC.x ? "right" : "left";
              } else {
                const targets = [20, 21, 22, 23, 24, 25];
                let nextY = archivistNPC.y;
                while (nextY === archivistNPC.y) {
                  nextY = targets[Math.floor(Math.random() * targets.length)];
                }
                archivistNPC.targetX = 10; // Snap to col 10
                archivistNPC.targetY = nextY;
                archivistNPC.moving = true;
                archivistNPC.dir = nextY > archivistNPC.y ? "down" : "up";
              }
            }
          } else {
            const step = 0.8; // walking speed for NPC Lyra
            // Move along X axis if not there
            if (Math.abs(tx - archivistNPC.currPixelX) > 0.5) {
              if (archivistNPC.currPixelX < tx) {
                archivistNPC.currPixelX = Math.min(tx, archivistNPC.currPixelX + step);
                archivistNPC.dir = "right";
              } else {
                archivistNPC.currPixelX = Math.max(tx, archivistNPC.currPixelX - step);
                archivistNPC.dir = "left";
              }
              archivistNPC.moving = true;
            }
            // Move along Y axis if not there
            else if (Math.abs(ty - archivistNPC.currPixelY) > 0.5) {
              if (archivistNPC.currPixelY < ty) {
                archivistNPC.currPixelY = Math.min(ty, archivistNPC.currPixelY + step);
                archivistNPC.dir = "down";
              } else {
                archivistNPC.currPixelY = Math.max(ty, archivistNPC.currPixelY - step);
                archivistNPC.dir = "up";
              }
              archivistNPC.moving = true;
            }
          }
        }
      }

      // Update guide NPC interaction facing direction
      const guideNPC = g.entities.find(e => e.id === "guide");
      if (guideNPC) {
        if (g.dialogue && g.dialogue.entity.id === "guide") {
          guideNPC.moving = false;
          const px = g.player.x;
          const py = g.player.y;
          const gx = guideNPC.currPixelX !== undefined ? guideNPC.currPixelX : guideNPC.x * TILE;
          const gy = guideNPC.currPixelY !== undefined ? guideNPC.currPixelY : guideNPC.y * TILE;
          const dx = px - gx;
          const dy = py - gy;
          if (Math.abs(dx) > Math.abs(dy)) {
            guideNPC.dir = dx > 0 ? "right" : "left";
          } else {
            guideNPC.dir = dy > 0 ? "down" : "up";
          }
        } else {
          guideNPC.dir = "down";
        }
      }

      // Update enemy AI & damage (behavior-dispatch system)
      g.entities.forEach((entity) => {
        if (entity.type === "enemy" && !entity.isDead) {
          // Shared pixel-center positions
          const ex = entity.currPixelX ?? entity.x * TILE;
          const ey = entity.currPixelY ?? entity.y * TILE;
          const eCx = ex + TILE / 2;
          const eCy = ey + TILE / 2;
          const pCx = p.x + TILE / 2;
          const pCy = p.y + TILE / 2;
          const distToPlayer = Math.hypot(eCx - pCx, eCy - pCy);
          const dmg = entity.damage ?? 10;
          const atkRange = (entity.attackRange ?? 1.3) * TILE;

          // Cooldown update
          if (entity.attackCooldown && entity.attackCooldown > 0) {
            entity.attackCooldown--;
          }

          // Attack animation
          if (entity.isAttacking) {
            if (entity.attackTimer && entity.attackTimer > 0) {
              entity.attackTimer--;
              if (entity.attackTimer === 20 && p.invulnerableTimer === 0 && distToPlayer < atkRange) {
                p.hp = Math.max(0, p.hp - dmg);
                p.invulnerableTimer = 60;
                setPlayerHp(p.hp);
                retroAudio.playDamage();
                showNotif(`Aduh! Kamu terkena serangan ${entity.name}! (-${dmg} HP)`);
                if (p.hp <= 0) {
                  p.hp = 100; setPlayerHp(100);
                  p.x = 3 * TILE; p.y = 3 * TILE;
                  showNotif("Kamu pingsan! Kembali ke awal desa.");
                  saveProgress();
                }
              }
              if (entity.attackTimer <= 0) entity.isAttacking = false;
            }
          } else {
            // Trigger attack when player is within range
            if (distToPlayer < atkRange && (!entity.attackCooldown || entity.attackCooldown === 0)) {
              entity.isAttacking = true;
              entity.attackTimer = 40;
              entity.attackCooldown = 80;
              entity.moving = false;
              const dx = pCx - eCx; const dy = pCy - eCy;
              entity.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
            }
          }

          // Contact damage fallback (player runs into enemy)
          if (!entity.isAttacking && p.invulnerableTimer === 0 && distToPlayer < TILE * 0.7) {
            entity.isAttacking = true;
            entity.attackTimer = 40;
            entity.attackCooldown = 80;
            entity.moving = false;
            p.hp = Math.max(0, p.hp - dmg);
            p.invulnerableTimer = 60;
            setPlayerHp(p.hp);
            retroAudio.playDamage();
            showNotif(`Aduh! Kamu menabrak ${entity.name}! (-${dmg} HP)`);
            if (p.hp <= 0) {
              p.hp = 100; setPlayerHp(100);
              p.x = 3 * TILE; p.y = 3 * TILE;
              showNotif("Kamu pingsan! Kembali ke awal desa.");
              saveProgress();
            }
          }

          // Flinch timer
          if (entity.isHit && entity.hitTimer !== undefined && entity.hitTimer > 0) {
            entity.hitTimer--;
            if (entity.hitTimer <= 0) entity.isHit = false;
          }

          // ── Movement AI (behavior dispatch) ─────────────────────────────────
          if (!entity.isAttacking) {
            if (entity.currPixelX === undefined) entity.currPixelX = entity.x * TILE;
            if (entity.currPixelY === undefined) entity.currPixelY = entity.y * TILE;
            if (entity.targetX === undefined) entity.targetX = entity.x;
            if (entity.targetY === undefined) entity.targetY = entity.y;
            if (entity.moveCooldown === undefined) entity.moveCooldown = 0;

            const speed = entity.speed ?? 0.4;
            const behavior = entity.behavior ?? "wander";
            const txPx = entity.targetX * TILE;
            const tyPx = entity.targetY * TILE;
            const distToTarget = Math.hypot(txPx - entity.currPixelX, tyPx - entity.currPixelY);
            const atTarget = distToTarget < 1;

            // Helper: slide entity toward a pixel coordinate
            const moveToward = (toX: number, toY: number) => {
              const ddx = toX - entity.currPixelX!;
              const ddy = toY - entity.currPixelY!;
              if (Math.abs(ddx) > 0.5) {
                entity.currPixelX = ddx > 0 ? Math.min(toX, entity.currPixelX! + speed) : Math.max(toX, entity.currPixelX! - speed);
                entity.dir = ddx > 0 ? "right" : "left";
                entity.moving = true;
              } else if (Math.abs(ddy) > 0.5) {
                entity.currPixelY = ddy > 0 ? Math.min(toY, entity.currPixelY! + speed) : Math.max(toY, entity.currPixelY! - speed);
                entity.dir = ddy > 0 ? "down" : "up";
                entity.moving = true;
              }
            };

            if (behavior === "patrol") {
              // ── PATROL: bounce between patrolMin..patrolMax on one axis ────
              const axis = entity.patrolAxis ?? "horizontal";
              const pMin = entity.patrolMin ?? 0;
              const pMax = entity.patrolMax ?? 10;
              const pFixed = entity.patrolFixed ?? 0;
              if (atTarget) {
                entity.currPixelX = txPx; entity.currPixelY = tyPx;
                entity.x = entity.targetX; entity.y = entity.targetY;
                if (axis === "horizontal") {
                  entity.targetX = entity.x <= pMin ? pMax : pMin;
                  entity.targetY = pFixed;
                  entity.dir = entity.targetX > entity.x ? "right" : "left";
                } else {
                  entity.targetX = pFixed;
                  entity.targetY = entity.y <= pMin ? pMax : pMin;
                  entity.dir = entity.targetY > entity.y ? "down" : "up";
                }
                entity.moving = true;
              } else {
                moveToward(txPx, tyPx);
              }

            } else if (behavior === "wander") {
              // ── WANDER: random walk around patrolHome ──────────────────────
              if (atTarget) {
                entity.currPixelX = txPx; entity.currPixelY = tyPx;
                entity.x = entity.targetX; entity.y = entity.targetY;
                if (entity.moving) { entity.moving = false; entity.moveCooldown = Math.floor(Math.random() * 120) + 60; }
                if (entity.moveCooldown! > 0) { entity.moveCooldown!--; }
                else {
                  const hx = entity.patrolHomeX ?? entity.x;
                  const hy = entity.patrolHomeY ?? entity.y;
                  const ndx = Math.floor(Math.random() * 5) - 2;
                  const ndy = Math.floor(Math.random() * 5) - 2;
                  const nx = hx + ndx; const ny = hy + ndy;
                  if (nx >= 0 && nx < MAP_COLS && ny >= 0 && ny < MAP_ROWS_COUNT) {
                    const tile = MAP_ROWS[ny]?.[nx];
                    if (tile !== "W" && tile !== "T" && tile !== "~") {
                      entity.targetX = nx; entity.targetY = ny; entity.moving = true;
                      entity.dir = Math.abs(ndx) > Math.abs(ndy) ? (ndx > 0 ? "right" : "left") : (ndy > 0 ? "down" : "up");
                    }
                  }
                }
              } else { moveToward(txPx, tyPx); }

            } else if (behavior === "guard") {
              // ── GUARD: wander near home, chase if player enters detectRadius
              const detectR = (entity.detectRadius ?? 4) * TILE;
              const chaseR = (entity.chaseRadius ?? 6) * TILE;
              if (distToPlayer < detectR) {
                entity.isChasing = true;
                moveToward(pCx - TILE / 2, pCy - TILE / 2);
              } else if (entity.isChasing && distToPlayer > chaseR) {
                entity.isChasing = false;
                entity.targetX = entity.patrolHomeX ?? entity.startX ?? entity.x;
                entity.targetY = entity.patrolHomeY ?? entity.startY ?? entity.y;
                moveToward(entity.targetX * TILE, entity.targetY * TILE);
              } else if (!entity.isChasing) {
                // Wander near home
                if (atTarget) {
                  entity.currPixelX = txPx; entity.currPixelY = tyPx;
                  entity.x = entity.targetX; entity.y = entity.targetY;
                  if (entity.moving) { entity.moving = false; entity.moveCooldown = Math.floor(Math.random() * 150) + 80; }
                  if (entity.moveCooldown! > 0) { entity.moveCooldown!--; }
                  else {
                    const hx = entity.patrolHomeX ?? entity.x;
                    const hy = entity.patrolHomeY ?? entity.y;
                    const ndx = Math.floor(Math.random() * 3) - 1;
                    const ndy = Math.floor(Math.random() * 3) - 1;
                    const nx = hx + ndx; const ny = hy + ndy;
                    if (nx >= 0 && nx < MAP_COLS && ny >= 0 && ny < MAP_ROWS_COUNT) {
                      const tile = MAP_ROWS[ny]?.[nx];
                      if (tile !== "W" && tile !== "T" && tile !== "~") {
                        entity.targetX = nx; entity.targetY = ny; entity.moving = true;
                        entity.dir = Math.abs(ndx) > Math.abs(ndy) ? (ndx > 0 ? "right" : "left") : (ndy > 0 ? "down" : "up");
                      }
                    }
                  }
                } else { moveToward(txPx, tyPx); }
              } else {
                moveToward(txPx, tyPx);
              }

            } else if (behavior === "chase") {
              // ── CHASE: aggressive pursuit, large radius ────────────────────
              const detectR = (entity.detectRadius ?? 7) * TILE;
              const chaseR = (entity.chaseRadius ?? 10) * TILE;
              if (distToPlayer < detectR || entity.isChasing) {
                entity.isChasing = distToPlayer < chaseR;
                if (entity.isChasing) {
                  moveToward(pCx - TILE / 2, pCy - TILE / 2);
                } else {
                  // Player escaped — return to patrol home
                  const hxPx = (entity.patrolHomeX ?? entity.startX ?? entity.x) * TILE;
                  const hyPx = (entity.patrolHomeY ?? entity.startY ?? entity.y) * TILE;
                  const dHome = Math.hypot(hxPx - entity.currPixelX!, hyPx - entity.currPixelY!);
                  if (dHome > 2) { moveToward(hxPx, hyPx); }
                  else { entity.moving = false; entity.isChasing = false; }
                }
              } else {
                entity.moving = false;
              }

            } else {
              // ── IDLE: stay still ───────────────────────────────────────────
              entity.moving = false;
            }
          }
        }
      });

      // Update dead enemies' death animation and respawn timers
      g.entities.forEach(entity => {
        if (entity.type === "enemy" && entity.isDead) {
          if (entity.deathTimer !== undefined && entity.deathTimer > 0) {
            entity.deathTimer--;
            if (entity.deathTimer === 0) {
              // Decide what item to drop
              let dropType: "stone_chip" | "copper_bit" | "glow_crystal" | "ancient_fragment" = "stone_chip";
              let dropName = "Stone Chip";
              const rand = Math.random();
              
              if (entity.id.startsWith("rockimp")) {
                if (rand < 0.02) { dropType = "ancient_fragment"; dropName = "Ancient Fragment"; }
                else if (rand < 0.12) { dropType = "glow_crystal"; dropName = "Glow Crystal"; }
                else if (rand < 0.82) { dropType = "copper_bit"; dropName = "Copper Bit"; }
              } else if (entity.id.startsWith("cavewarden")) {
                if (rand < 0.50) { dropType = "ancient_fragment"; dropName = "Ancient Fragment"; }
                else if (rand < 0.80) { dropType = "glow_crystal"; dropName = "Glow Crystal"; }
                else { dropType = "copper_bit"; dropName = "Copper Bit"; }
              } else if (entity.id.startsWith("bugling")) {
                if (rand < 0.03) { dropType = "glow_crystal"; dropName = "Glow Crystal"; }
                else if (rand < 0.40) { dropType = "copper_bit"; dropName = "Copper Bit"; }
              } else { // slimes
                if (rand < 0.02) { dropType = "glow_crystal"; dropName = "Glow Crystal"; }
                else if (rand < 0.30) { dropType = "copper_bit"; dropName = "Copper Bit"; }
              }

              // Spawn collectible at enemy location
              const chipId = `${dropType}_${Date.now()}_${Math.random()}`;
              const angle = Math.random() * Math.PI * 2;
              const launchDist = 16 + Math.random() * 16;
              const targetPixelX = (entity.currPixelX ?? entity.x * TILE) + Math.cos(angle) * launchDist;
              const targetPixelY = (entity.currPixelY ?? entity.y * TILE) + Math.sin(angle) * launchDist;

              g.entities.push({
                id: chipId,
                x: Math.round(targetPixelX / TILE),
                y: Math.round(targetPixelY / TILE),
                type: "collectible",
                name: dropName,
                collectibleType: dropType,
                collectibleState: "spawn",
                collectibleTimer: 0,
                currPixelX: entity.currPixelX ?? entity.x * TILE,
                currPixelY: entity.currPixelY ?? entity.y * TILE,
                targetX: Math.round(targetPixelX / TILE),
                targetY: Math.round(targetPixelY / TILE),
                spawnVelX: (targetPixelX - (entity.currPixelX ?? entity.x * TILE)) / 30,
                spawnVelY: (targetPixelY - (entity.currPixelY ?? entity.y * TILE)) / 30,
              });
            }
          } else {
            // Decrement respawn timer
            if (entity.respawnTimer === undefined) {
              entity.respawnTimer = Math.floor(Math.random() * 300) + 300; // 300 to 600 frames (5 to 10 seconds)
            }
            
            entity.respawnTimer--;
            
            if (entity.respawnTimer <= 0) {
              // Respawn!
              const homeX = entity.startX !== undefined ? entity.startX : entity.x;
              const homeY = entity.startY !== undefined ? entity.startY : entity.y;
              let spawnX = homeX;
              let spawnY = homeY;

              if (entity.id === "bugling1") {
                spawnX = Math.floor(Math.random() * 9) + 6; // Column 6 to 14
                spawnY = 16;
              } else if (entity.id === "bugling2") {
                spawnX = Math.floor(Math.random() * 11) + 22; // Column 22 to 32
                spawnY = 16;
              } else if (entity.id === "bugling3") {
                spawnX = 36;
                spawnY = Math.floor(Math.random() * 6) + 17; // Row 17 to 22
              } else {
                // Find a random valid unblocked tile within a 7x7 grid centered at starting location
                for (let attempt = 0; attempt < 20; attempt++) {
                  const rx = homeX + Math.floor(Math.random() * 7) - 3;
                  const ry = homeY + Math.floor(Math.random() * 7) - 3;
                  if (rx >= 0 && rx < MAP_COLS && ry >= 0 && ry < MAP_ROWS_COUNT) {
                    const tile = MAP_ROWS[ry]?.[rx];
                    if (tile !== "W" && tile !== "T" && tile !== "~") {
                      if (!isBlocked(rx * TILE + TILE/2, ry * TILE + TILE/2)) {
                        spawnX = rx;
                        spawnY = ry;
                        break;
                      }
                    }
                  }
                }
              }

              entity.isDead = false;
              entity.hp = entity.maxHp;
              entity.isHit = false;
              entity.isAttacking = false;
              entity.x = spawnX;
              entity.y = spawnY;
              entity.currPixelX = spawnX * TILE;
              entity.currPixelY = spawnY * TILE;
              entity.targetX = spawnX;
              entity.targetY = spawnY;
              entity.moving = entity.id.startsWith("bugling");
              entity.respawnTimer = undefined;
            }
          }
        }
      });

      // Update mining nodes respawn and hit flash timers
      g.entities.forEach(entity => {
        if (entity.type === "mining_node") {
          if (entity.miningNodeHitTimer !== undefined && entity.miningNodeHitTimer > 0) {
            entity.miningNodeHitTimer--;
          }
          if (entity.miningNodeHp !== undefined && entity.miningNodeHp <= 0) {
            if (entity.miningNodeRespawnTimer !== undefined && entity.miningNodeRespawnTimer > 0) {
              entity.miningNodeRespawnTimer--;
              if (entity.miningNodeRespawnTimer === 0) {
                entity.miningNodeHp = entity.miningNodeMaxHp ?? 3;
                entity.miningNodeHitTimer = 0;
              }
            }
          }
        }
      });

      // ─── Draw ───────────────────────────────────────────────────────────
      ctx.fillStyle = C.sky;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Calculate camera scrolling offsets to keep player centered
      const camX = Math.round(g.player.x + TILE / 2 - (COLS * TILE) / 2);
      const camY = Math.round(g.player.y + TILE / 2 - (ROWS * TILE) / 2);
      const maxCamX = (MAP_COLS - COLS) * TILE;
      const maxCamY = (MAP_ROWS_COUNT - ROWS) * TILE;
      const clampedCamX = Math.max(0, Math.min(maxCamX, camX));
      const clampedCamY = Math.max(0, Math.min(maxCamY, camY));

      // Limit drawing loop to only visible tiles inside camera view
      const startCol = Math.max(0, Math.floor(clampedCamX / TILE));
      const endCol = Math.min(MAP_COLS, Math.ceil((clampedCamX + COLS * TILE) / TILE));
      const startRow = Math.max(0, Math.floor(clampedCamY / TILE));
      const endRow = Math.min(MAP_ROWS_COUNT, Math.ceil((clampedCamY + ROWS * TILE) / TILE));

      ctx.save();
      ctx.translate(-clampedCamX, -clampedCamY);

      // Tiles
      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          let tileType = MAP_ROWS[row][col];
          // Visually open cave gate if key is held
          if (row === 4 && (col === 10 || col === 11 || col === 12)) {
            const hasKey = g.inventory.includes("forest_key");
            if (hasKey) tileType = "."; // Draw as path
          }
          // Visually open shrine gate if crystal is held
          if (row === 4 && (col === 19 || col === 20 || col === 21)) {
            const hasCrystal = g.inventory.includes("glow_crystal");
            if (hasCrystal) tileType = "."; // Draw as path
          }
          drawTile(ctx, tileType, col, row, g.tick);
        }
      }

      // Entities
      for (const entity of g.entities) {
        if (entity.type === "npc" || entity.type === "enemy") drawNPC(ctx, entity, g.tick);
        else if (entity.type === "chest") drawChest(ctx, entity);
        else if (entity.type === "shrine") drawShrine(ctx, entity, g.tick);
        else if (entity.type === "sign") drawSign(ctx, entity);
        else if (entity.type === "collectible") drawCollectible(ctx, entity, g.tick);
        else if (entity.type === "mining_node") drawMiningNode(ctx, entity, g.tick);
        else if (entity.type === "quest_board") drawQuestBoard(ctx, entity);
      }

      // Player (with damage invulnerability blink effect)
      let shouldDrawPlayer = true;
      if (g.player.invulnerableTimer > 0) {
        if (Math.floor(g.tick / 6) % 2 === 0) {
          shouldDrawPlayer = false;
        }
      }
      if (shouldDrawPlayer) {
        drawPlayer(ctx, g.player.x, g.player.y, g.player.dir, g.tick, g.player.moving);
      }

      // Sword slash visual effect
      if (g.player.isAttacking) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.fillStyle = "rgba(232, 212, 77, 0.2)";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";

        const px = g.player.x + TILE / 2;
        const py = g.player.y + TILE / 2;
        
        ctx.beginPath();
        if (g.player.dir === "left") {
          ctx.arc(px - 10, py, 18, 0.5 * Math.PI, 1.5 * Math.PI);
        } else if (g.player.dir === "right") {
          ctx.arc(px + 10, py, 18, 1.5 * Math.PI, 0.5 * Math.PI);
        } else if (g.player.dir === "up") {
          ctx.arc(px, py - 10, 18, 1.0 * Math.PI, 2.0 * Math.PI);
        } else if (g.player.dir === "down") {
          ctx.arc(px, py + 10, 18, 0.0 * Math.PI, 1.0 * Math.PI);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Interact prompt
      if (nearEnt && !g.dialogue) {
        const ex = nearEnt.x * TILE;
        const ey = nearEnt.y * TILE;
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(ex - 2, ey - 16, 36, 14);
        ctx.fillStyle = C.prompt;
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "left";
        ctx.fillText("[E] Interact", ex, ey - 5);
      }

      ctx.restore();

      // Inventory items floating HUD (fixed on viewport)
      if (g.inventory.length > 0) {
        g.inventory.forEach((item, i) => {
          drawItem(ctx, item, 8 + i * 38, 8);
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    }

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  // Load progress and beforeunload handler
  useEffect(() => {
    const loaded = loadProgress();
    if (loaded) {
      showNotif("💾 Progres game dimuat!");
    }
  }, [loadProgress, showNotif]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveProgress]);

  // Audio browser policy activation on first interaction
  const startAudioOnInteraction = useCallback(() => {
    if (!isMuted && gameRef.current.gameState === "PLAYING") {
      retroAudio.playMusic();
    }
    window.removeEventListener("click", startAudioOnInteraction);
    window.removeEventListener("keydown", startAudioOnInteraction);
  }, [isMuted]);

  useEffect(() => {
    window.addEventListener("click", startAudioOnInteraction);
    window.addEventListener("keydown", startAudioOnInteraction);
    return () => {
      window.removeEventListener("click", startAudioOnInteraction);
      window.removeEventListener("keydown", startAudioOnInteraction);
    };
  }, [startAudioOnInteraction]);

  // ─── Mobile Controls ─────────────────────────────────────────────────────
  const handleDpad = useCallback((dir: string, active: boolean) => {
    const g = gameRef.current;
    const dirMap: Record<string, string> = {
      up: "arrowup", down: "arrowdown", left: "arrowleft", right: "arrowright",
    };
    if (active) g.keys.add(dirMap[dir]);
    else g.keys.delete(dirMap[dir]);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black select-none">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={COLS * TILE}
        height={ROWS * TILE}
        style={{ imageRendering: "pixelated", display: "block", maxWidth: "100%", maxHeight: "100%" }}
        className="border-2 border-yellow-500/40 shadow-[0_0_40px_rgba(232,212,77,0.15)]"
      />

      {/* Dialogue Box */}
      {dialogue && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[600px] cursor-pointer z-30"
          onClick={advanceDialogue}
          style={{ userSelect: "none" }}
        >
          <div
            className="relative rounded border-2 p-4"
            style={{
              background: "rgba(10,10,30,0.97)",
              borderColor: C.dialogBorder,
              boxShadow: `0 0 20px rgba(232,212,77,0.3)`,
              fontFamily: "monospace",
            }}
          >
            {/* Name tab */}
            <div
              className="absolute -top-4 left-4 px-3 py-0.5 text-xs font-bold rounded-sm"
              style={{ background: C.dialogBorder, color: "#1a1a2e" }}
            >
              {dialogue.name}
            </div>
            <p className="text-sm leading-relaxed mt-1" style={{ color: C.dialogText }}>
              {dialogue.text}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs opacity-50" style={{ color: C.dialogText }}>
                {dialogue.page + 1} / {dialogue.total}
              </span>
              <span className="text-xs animate-pulse" style={{ color: C.prompt }}>
                {dialogue.page + 1 < dialogue.total ? "[ E / Klik → Lanjut ]" : "[ E / Klik → Tutup ]"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded text-sm font-mono font-bold z-40"
          style={{
            background: "rgba(10,10,30,0.95)",
            border: `1px solid ${C.dialogBorder}`,
            color: C.dialogBorder,
            boxShadow: `0 0 14px rgba(232,212,77,0.3)`,
          }}
        >
          {notification}
        </div>
      )}

      {/* Player Stats & Inventory HUD */}
      <div
        className="absolute top-3 left-3 flex flex-col gap-2 p-2 rounded font-mono border text-xs z-20"
        style={{ 
          background: "rgba(10,10,30,0.9)", 
          borderColor: C.uiBorder, 
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          minWidth: "150px"
        }}
      >
        {/* HP Bar */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="font-bold text-red-400 flex items-center gap-1">❤️ HP</span>
            <span className="text-white font-bold">{playerHp} / {gameRef.current.player ? (gameRef.current.player as any).maxHp : 100}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div 
              className="bg-red-500 h-full transition-all duration-150"
              style={{ width: `${(playerHp / (gameRef.current.player ? (gameRef.current.player as any).maxHp : 100)) * 100}%` }}
            />
          </div>
        </div>

        {/* XP & Level */}
        <div className="flex flex-col gap-1 border-t border-slate-700/50 pt-1">
          <div className="flex justify-between items-center text-[9px]">
            <span className="font-bold text-purple-400">⭐ Lvl {level}</span>
            <span className="text-slate-400 font-bold">{xp} / {level * 100} XP</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div 
              className="bg-purple-500 h-full transition-all duration-150"
              style={{ width: `${Math.min(100, (xp / (level * 100)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Coins & Damage */}
        <div className="text-[10px] text-slate-300 font-bold border-t border-slate-700/50 pt-1 flex flex-col gap-0.5">
          <div className="flex justify-between">
            <span>🪙 Coins:</span>
            <span className="text-yellow-300">{coins}</span>
          </div>
          <div className="flex justify-between">
            <span>⚔ Damage:</span>
            <span className="text-red-400">{playerDamage}</span>
          </div>
        </div>

        {/* Tool Level */}
        <div className="text-[10px] text-slate-300 font-bold border-t border-slate-700/50 pt-1 flex justify-between">
          <span>⚒ Tool:</span>
          <span className="text-yellow-400">
            {pickaxeLevel === 3
              ? "Ancient Pickaxe"
              : pickaxeLevel === 2
              ? "Steel Pickaxe"
              : "Old Pickaxe"}
          </span>
        </div>

        {/* Inventory */}
        {inventory.length > 0 && (
          <div className="border-t border-slate-700/50 pt-1 flex flex-col gap-1">
            <span className="text-[9px] opacity-50 text-white">INVENTORY:</span>
            <div className="flex gap-1 flex-wrap">
              {inventory.map((item, idx) => (
                <span 
                  key={`${item}-${idx}`} 
                  className="px-1 py-0.5 rounded text-[9px] font-bold bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                >
                  {item === "forest_key" ? "🗝 Key" : item === "ancient_fragment" ? "💎 Fragment" : item === "stone_chip" ? "🪨 Stone Chip" : item === "copper_bit" ? "🔸 Copper Bit" : item === "glow_crystal" ? "💎 Glow Crystal" : item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Quest Tracker HUD */}
      {(() => {
        const activeQ = gameRef.current.quests?.find(q => q.status === "active" || q.status === "completed");
        if (!activeQ) return null;
        return (
          <div
            className="absolute top-[180px] left-3 flex flex-col gap-1.5 p-2 rounded font-mono border text-[10px] z-20"
            style={{ 
              background: "rgba(10,10,30,0.9)", 
              borderColor: C.uiBorder, 
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              minWidth: "150px",
              maxWidth: "200px"
            }}
          >
            <div className="font-bold text-yellow-400 border-b border-slate-700/50 pb-0.5 flex justify-between">
              <span>📋 QUEST AKTIF:</span>
              {activeQ.status === "completed" && <span className="text-green-400 animate-pulse">SELESAI!</span>}
            </div>
            <div className="font-bold text-white text-[11px]">{activeQ.title}</div>
            <p className="text-slate-400 text-[9px] leading-tight">{activeQ.description}</p>
            <div className="flex flex-col gap-0.5 mt-0.5 border-t border-slate-800 pt-1">
              {activeQ.objectives.map((obj, idx) => {
                let label = "Objective";
                if (obj.type === "talk") label = "Bicara dengan Eldrin";
                if (obj.type === "collect") label = `Kumpulkan ${obj.target === "forest_key" ? "Forest Key" : obj.target}`;
                if (obj.type === "defeat") label = `Kalahkan ${obj.target}`;
                if (obj.type === "mine") label = `Tambang ${obj.target === "stone" ? "Batu" : obj.target}`;
                if (obj.type === "visit") label = "Aktifkan Shrine";
                
                const isObjDone = obj.current >= obj.amount;
                return (
                  <div key={idx} className={`flex justify-between ${isObjDone ? "text-green-400 line-through opacity-70" : "text-slate-300"}`}>
                    <span>{label}</span>
                    <span className="font-bold">{obj.current} / {obj.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Controls HUD */}
      <div
        className="absolute top-3 right-3 text-xs font-mono opacity-60 text-right hidden sm:block z-20"
        style={{ color: C.dialogText }}
      >
        <div>WASD / ↑↓←→ Gerak</div>
        <div>E Interaksi | SPACE Serang</div>
        <div>ESC Menu Jeda</div>
      </div>

      {/* Mobile Controls */}
      <div className="absolute bottom-20 left-4 grid grid-cols-3 gap-1 sm:hidden z-20">
        {[
          ["", "up", ""],
          ["left", "down", "right"],
        ].map((row, ri) =>
          row.map((dir, ci) =>
            dir ? (
              <button
                key={`${ri}-${ci}`}
                onPointerDown={() => handleDpad(dir, true)}
                onPointerUp={() => handleDpad(dir, false)}
                onPointerLeave={() => handleDpad(dir, false)}
                className="w-10 h-10 rounded flex items-center justify-center text-lg active:opacity-70"
                style={{ background: "rgba(232,212,77,0.2)", border: `1px solid ${C.dialogBorder}`, color: C.dialogBorder }}
              >
                {dir === "up" ? "▲" : dir === "down" ? "▼" : dir === "left" ? "◀" : "▶"}
              </button>
            ) : (
              <div key={`${ri}-${ci}`} className="w-10 h-10" />
            )
          )
        )}
      </div>

      <button
        className="absolute bottom-20 right-20 w-12 h-12 rounded-full text-lg font-mono font-bold sm:hidden active:opacity-70 flex items-center justify-center z-20"
        style={{ background: "rgba(220, 38, 38, 0.3)", border: `2px solid #ef4444`, color: "#ef4444" }}
        onPointerDown={() => {
          const g = gameRef.current;
          const p = g.player;
          if (g.gameState === "PLAYING" && !g.dialogue && !p.isAttacking && p.attackCooldown === 0 && g.activeModal === "none") {
            p.isAttacking = true;
            p.attackTimer = 10;
            p.attackCooldown = 20;
            retroAudio.playAttack();
          }
        }}
      >
        ⚔
      </button>

      <button
        className="absolute bottom-20 right-4 w-12 h-12 rounded-full text-sm font-mono font-bold sm:hidden active:opacity-70 z-20"
        style={{ background: "rgba(232,212,77,0.3)", border: `2px solid ${C.dialogBorder}`, color: C.dialogBorder }}
        onPointerDown={interact}
      >
        E
      </button>

      {/* Start Screen Overlay */}
      {gameState === "START" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#0a0a20]/95 font-mono text-[#fff4c4] border-4 border-yellow-600 shadow-inner">
          <div className="text-center animate-bounce mb-8">
            <h1 className="text-4xl sm:text-5xl font-black tracking-widest uppercase text-yellow-400 drop-shadow-[4px_4px_0_rgba(0,0,0,0.8)]">
              MEKI ADVENTURE
            </h1>
            <p className="text-xs tracking-widest opacity-75 mt-2">Milestone 0-10 Complete Edition</p>
          </div>
          
          <div className="flex flex-col gap-4 w-64 items-center">
            <button
              onClick={() => {
                setGameState("PLAYING");
                if (!isMuted) {
                  retroAudio.playMusic();
                }
                retroAudio.playChest();
              }}
              className="w-full px-6 py-3 border-4 border-yellow-500 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-[1px_1px_0_#000] transition-all cursor-pointer"
            >
              🕹 Mulai Petualangan
            </button>
            
            <div className="flex justify-center border-t border-slate-700/50 pt-4 w-full">
              <ConnectButton />
            </div>
          </div>
          
          {address && (
            <div className="mt-4 text-[10px] text-green-400 bg-green-500/10 px-3 py-1 border border-green-500/30 rounded font-bold">
              Connected: {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}

          <div className="mt-12 text-center text-[10px] text-slate-400 leading-relaxed max-w-xs border border-slate-800 p-3 bg-black/40">
            <div className="font-bold text-slate-300 mb-1">🎮 KONTROL GAME:</div>
            <div>WASD / Arrow Keys : Gerak</div>
            <div>E Key / Tap Screen : Interaksi</div>
            <div>SPACEBAR / Tap ⚔ : Serang</div>
            <div>ESC : Jeda / Menu</div>
          </div>
        </div>
      )}

      {/* Pause Screen Overlay */}
      {gameState === "PAUSED" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 font-mono text-[#fff4c4]">
          <div className="w-[90%] max-w-[400px] border-4 border-yellow-600 bg-[#0a0a20]/98 p-5 shadow-[8px_8px_0_#000]">
            <h2 className="text-xl font-bold uppercase text-center text-yellow-400 border-b-2 border-yellow-600 pb-2 mb-4">
              Jeda Game
            </h2>
            
            <div className="flex flex-col gap-2 mb-4 text-xs">
              <div className="flex justify-between">
                <span>❤️ HP Maks:</span>
                <span className="text-white font-bold">{gameRef.current.player.hp} / {gameRef.current.player.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span>⭐ Level Karakter:</span>
                <span className="text-purple-400 font-bold">{level} (XP: {xp}/{level*100})</span>
              </div>
              <div className="flex justify-between">
                <span>⚔ Attack Damage:</span>
                <span className="text-red-400 font-bold">{playerDamage}</span>
              </div>
              <div className="flex justify-between">
                <span>🪙 Dompet Koin:</span>
                <span className="text-yellow-300 font-bold">{coins}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2 mb-1">
                <span>⚒ Alat Tambang:</span>
                <span className="text-yellow-400 font-bold">Lvl {pickaxeLevel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-2 border border-slate-800 bg-black/30 text-xs cursor-pointer hover:bg-black/50">
                <span>🔇 Bisukan Suara</span>
                <input
                  type="checkbox"
                  checked={isMuted}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsMuted(checked);
                    retroAudio.setMuted(checked);
                    saveProgress();
                  }}
                  className="w-4 h-4 cursor-pointer accent-yellow-500"
                />
              </label>

              <div className="flex justify-center my-1">
                <ConnectButton />
              </div>

              <button
                onClick={() => {
                  saveProgress();
                  showNotif("💾 Game berhasil disimpan!");
                }}
                className="py-2 border-2 border-yellow-600 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000] cursor-pointer"
              >
                💾 Simpan Progress
              </button>

              <button
                onClick={() => {
                  setGameState("PLAYING");
                  if (!isMuted) {
                    retroAudio.playMusic();
                  }
                }}
                className="py-2 border-2 border-yellow-500 bg-green-700 hover:bg-green-600 text-white font-bold text-xs uppercase shadow-[2px_2px_0_#000] active:translate-y-0.5 active:shadow-[1px_1px_0_#000] cursor-pointer"
              >
                🕹 Lanjutkan
              </button>

              <button
                onClick={() => {
                  if (confirm("Apakah kamu yakin ingin mengulang dari awal? Seluruh progres akan dihapus.")) {
                    resetProgress();
                  }
                }}
                className="py-1.5 mt-2 border-2 border-red-700 bg-red-800/20 hover:bg-red-700/40 text-red-400 font-bold text-[10px] uppercase cursor-pointer"
              >
                🚨 Reset Game (Hapus Save)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {activeModal === "profile" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono text-[#fff4c4]">
          <div className="w-[95%] max-w-[500px] border-4 border-yellow-600 bg-[#0a0a20]/98 p-5 shadow-[8px_8px_0_#000]">
            <h2 className="text-lg font-bold uppercase text-center text-yellow-400 border-b-2 border-yellow-600 pb-2 mb-4">
              📜 Profil Sang Sage
            </h2>
            
            <div className="flex gap-4 items-center mb-4 border-b border-slate-800 pb-4">
              <div className="w-16 h-16 border-2 border-yellow-500 bg-slate-800 p-1 flex items-center justify-center [image-rendering:pixelated]">
                <img src="/game/sprites/guide.png" className="w-full h-full object-contain" alt="Sage Eldrin" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">Eldrin Sang Penjaga Desa</div>
                <div className="text-[10px] text-yellow-500">Pemandu Utama & Penjaga Lembaran Kuno</div>
                <div className="text-[10px] text-slate-400 mt-1">"Hidup adalah petualangan coding yang tak pernah usai."</div>
              </div>
            </div>
            
            <div className="text-xs text-slate-300 leading-relaxed mb-6 space-y-2">
              <p><strong>Misi:</strong> Membantu para petualang baru menemukan jalan mereka dalam dunia Web3 dan smart contracts.</p>
              <p><strong>Keahlian Utama:</strong> Merangkai sistem game retro, memvalidasi data off-chain secara terenkripsi, dan mengintegrasikan ekosistem on-chain.</p>
              <p><strong>Pencapaian:</strong> Telah memandu puluhan petualang menyelesaikan Quest Suci di Meki Village.</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 border-2 border-yellow-500 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase cursor-pointer"
              >
                [ Tutup Lembaran ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Modal */}
      {activeModal === "projects" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono text-[#fff4c4]">
          <div className="w-[95%] max-w-[500px] max-h-[90%] border-4 border-yellow-600 bg-[#0a0a20]/98 p-5 shadow-[8px_8px_0_#000] flex flex-col">
            <h2 className="text-lg font-bold uppercase text-center text-yellow-400 border-b-2 border-yellow-600 pb-2 mb-4 shrink-0">
              🛠 Galeri Proyek Miko
            </h2>
            
            <div className="overflow-y-auto pr-1 flex-1 space-y-3 mb-4 max-h-[350px]">
              {[
                { name: "Bankr DeFi Platform", desc: "Aplikasi keuangan terdesentralisasi (DeFi) untuk staking & yield farming.", tags: ["Solidity", "Next.js", "Viem"] },
                { name: "Meki Adventure Engine", desc: "Mesin visual game RPG retro 2D yang berjalan mulus dengan canvas HTML5.", tags: ["TypeScript", "HTML5", "CSS"] },
                { name: "Genomics Variant Tool", desc: "Alat visualisasi data klinis bio-medis terintegrasi API dbSNP/GTEx.", tags: ["React", "D3.js", "Science API"] },
                { name: "Supabase Vault Store", desc: "Penyimpanan log dan file data aman off-chain dengan otentikasi role.", tags: ["Node.js", "Postgres", "SQL"] }
              ].map((proj, idx) => (
                <div key={idx} className="p-3 border-2 border-slate-800 bg-black/40 hover:border-yellow-500/50 transition-all text-left">
                  <div className="font-bold text-white text-xs">{proj.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-normal">{proj.desc}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {proj.tags.map(t => (
                      <span key={t} className="px-1 text-[8px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end shrink-0">
              <button
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 border-2 border-yellow-500 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase cursor-pointer"
              >
                [ Selesai Melihat ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills Modal */}
      {activeModal === "skills" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono text-[#fff4c4]">
          <div className="w-[95%] max-w-[500px] border-4 border-yellow-600 bg-[#0a0a20]/98 p-5 shadow-[8px_8px_0_#000]">
            <h2 className="text-lg font-bold uppercase text-center text-yellow-400 border-b-2 border-yellow-600 pb-2 mb-4">
              📚 Repositori Keahlian Lyra
            </h2>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { name: "TypeScript/JS", val: 95, color: "bg-blue-500" },
                { name: "React / Next.js", val: 90, color: "bg-cyan-500" },
                { name: "Solidity / Web3", val: 80, color: "bg-purple-500" },
                { name: "HTML5 Canvas", val: 85, color: "bg-orange-500" },
                { name: "Tailwind CSS", val: 88, color: "bg-teal-500" },
                { name: "PostgreSQL / DB", val: 75, color: "bg-indigo-500" }
              ].map((skill, idx) => (
                <div key={idx} className="p-2 border border-slate-800 bg-black/30 text-left">
                  <div className="flex justify-between text-[10px] font-bold text-white mb-1">
                    <span>{skill.name}</span>
                    <span className="text-yellow-400">{skill.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 overflow-hidden rounded">
                    <div className={`${skill.color} h-full`} style={{ width: `${skill.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveModal("none")}
                className="px-4 py-2 border-2 border-yellow-500 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase cursor-pointer"
              >
                [ Tutup Lembaran ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Completed Victory Screen */}
      {gameState === "GAME_COMPLETED" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a20]/95 font-mono text-[#fff4c4]">
          <div className="w-[95%] max-w-[450px] border-4 border-yellow-400 p-5 shadow-[0_0_30px_rgba(255,215,0,0.3)] bg-gradient-to-b from-[#101030] to-[#050515] text-center">
            <h2 className="text-2xl font-black uppercase text-yellow-400 drop-shadow-md mb-2 animate-pulse">
              🎉 KEMENANGAN BESAR! 🎉
            </h2>
            <p className="text-[10px] text-slate-400 mb-4">Kamu telah mengaktifkan Portal Suci & menyelesaikan semua Quest Utama!</p>

            {/* Reward Claim Segment */}
            <div className="my-4 p-4 border-2 border-yellow-500 bg-[#ffd700]/5 flex flex-col items-center gap-3 w-full">
              <div className="text-xs font-bold text-yellow-300">🏅 Web3 Reward: Genesis Badge NFT</div>
              
              {!address ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[9px] text-slate-400">Hubungkan dompetmu untuk mengklaim badge on-chain!</span>
                  <ConnectButton />
                </div>
              ) : claimedBadge ? (
                <div className="text-xs text-green-400 font-bold bg-green-500/10 px-3 py-2 border border-green-500/40 w-full rounded">
                  ✅ GENESIS BADGE BERHASIL DIKLAIM!
                  <div className="text-[8px] text-slate-400 mt-1">Transaction Hash: 0x4fb9c2a6134... (Mock Base Chain)</div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setClaimedBadge(true);
                    gameRef.current.claimedBadge = true;
                    retroAudio.playLevelUp();
                    showNotif("🏆 Genesis Badge NFT diklaim di jaringan Base!");
                    saveProgress();
                  }}
                  className="w-full py-2 border-2 border-green-500 bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase shadow-[2px_2px_0_#000] active:translate-y-0.5 cursor-pointer"
                >
                  Claim Genesis Badge NFT
                </button>
              )}
            </div>

            <div className="text-xs border-t border-slate-800 pt-4 mt-2 mb-4 w-full">
              <div className="font-bold text-slate-300 mb-2">📬 HUBUNGI SANG KREATOR:</div>
              <div className="flex justify-center gap-3 text-[10px] flex-wrap">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border border-slate-700 hover:border-yellow-500 bg-slate-900">GitHub</a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border border-slate-700 hover:border-yellow-500 bg-slate-900">Twitter (X)</a>
                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border border-slate-700 hover:border-yellow-500 bg-slate-900">Discord</a>
              </div>
            </div>

            <div className="flex gap-2 w-full">
              <button
                onClick={() => {
                  setGameState("PLAYING");
                  setActiveModal("none");
                }}
                className="flex-1 py-2 border-2 border-yellow-500 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-xs uppercase cursor-pointer"
              >
                Kembali ke Desa
              </button>
              <button
                onClick={resetProgress}
                className="py-2 px-3 border-2 border-red-600 bg-red-700 text-white font-bold text-xs uppercase hover:bg-red-600 cursor-pointer"
              >
                Reset Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
