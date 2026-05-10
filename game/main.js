/* =========================================================
   SEONGYEON KIM — KIRBY'S QUEST PORTFOLIO (Kaboom RPG)
   Entry point: wires modules together.
   ========================================================= */
import { state }              from './state.js?v=8';
import { wireErrorToast }     from './error-toast.js?v=8';
import { createPalette }      from './palette.js?v=8';
import { QUEST_LABELS, QUESTS } from './data/quests.js?v=8';
import { PROJECTS }           from './data/projects.js?v=8';
import { MAP, TILE }          from './data/map.js?v=8';
import { buildTiles }         from './world/tiles.js?v=8';
import { buildSigns }         from './world/signs.js?v=8';
import { buildStones }        from './world/stones.js?v=8';
import { spawnClouds }        from './world/clouds.js?v=8';
import { createPlayer }       from './player.js?v=8';
import { createDialogSystem } from './ui/dialog.js?v=8';
import { createProjectModal } from './ui/projectModal.js?v=8';
import { createStatusPanel }  from './ui/statusPanel.js?v=8';
import { wireOverlays }       from './ui/overlays.js?v=8';

wireErrorToast();

// 0. Kaboom init — must come before any rgb()/vec2() use.
kaboom({
  width:  window.innerWidth,
  height: window.innerHeight,
  canvas: document.getElementById('game'),
  background: [251, 225, 236],
  crisp: false,
  stretch: false,
  letterbox: false,
  global: true,
});

setGravity(0);
const C = createPalette();

window.addEventListener('resize', () => {
  document.getElementById('game').width  = window.innerWidth;
  document.getElementById('game').height = window.innerHeight;
});

// 1. World — tiles, decorations, signs, stones, clouds.
buildTiles(C, MAP, TILE);
buildSigns(C, MAP, TILE, QUEST_LABELS);
buildStones(C, MAP, TILE, QUESTS);

const mapWidth  = MAP[0].length * TILE;
const mapHeight = MAP.length    * TILE;
state.mapWidth  = mapWidth;
state.mapHeight = mapHeight;

spawnClouds(C, mapWidth, mapHeight);

// 2. Player — spawn at @ marker.
let spawn = vec2(mapWidth / 2, mapHeight / 2);
for (let y = 0; y < MAP.length; y++) {
  for (let x = 0; x < MAP[y].length; x++) {
    if (MAP[y][x] === '@') spawn = vec2(x * TILE + TILE / 2, y * TILE + TILE / 2);
  }
}
state.spawn = spawn;
const player = createPlayer(C, spawn);

// 3. Camera follow.
camPos(player.pos);
onUpdate(() => {
  const target = player.pos;
  const cam = camPos();
  camPos(cam.lerp(target, 0.12));
});

// 4. Movement loop — paused while dialog, modal, or status panel is open.
function isInteractionOpen() {
  return state.dialogOpen || state.modalOpen || state.statusOpen;
}

function movePlayer(dx, dy) {
  if (isInteractionOpen()) return;
  if (dx !== 0) player.facing.x = dx;
  if (dy !== 0) player.facing.y = dy;
  // Update viewDir — vertical input takes priority for back/front pose
  if (dy !== 0)      player.viewDir = dy < 0 ? 'back' : 'front';
  else if (dx !== 0) player.viewDir = dx < 0 ? 'left' : 'right';
  const speed = player.speed;
  const len = Math.hypot(dx, dy) || 1;
  player.move(dx / len * speed, dy / len * speed);
  player.moving = true;
}

onUpdate("player", () => {
  if (!state.started || isInteractionOpen()) {
    player.moving = false;
    return;
  }
  let dx = 0, dy = 0;
  if (isKeyDown("left"))  dx -= 1;
  if (isKeyDown("right")) dx += 1;
  if (isKeyDown("up"))    dy -= 1;
  if (isKeyDown("down"))  dy += 1;
  if (dx === 0 && dy === 0) {
    player.moving = false;
  } else {
    movePlayer(dx, dy);
  }
  player.pos.x = Math.max(TILE * 0.5, Math.min(mapWidth  - TILE * 0.5, player.pos.x));
  player.pos.y = Math.max(TILE * 0.5, Math.min(mapHeight - TILE * 0.5, player.pos.y));
});

// 5. Quest detection — track nearest sign OR stone, prefer the closer one.
const promptEl     = document.getElementById('prompt');
const promptTextEl = document.getElementById('promptText');
const counterEl    = document.getElementById('questCounter');
const DETECT_R     = 56;

onUpdate(() => {
  if (isInteractionOpen()) return;

  let nearestSign = null,  nearestSignDist = DETECT_R;
  let nearestStone = null, nearestStoneDist = DETECT_R;

  for (const q of get('quest')) {
    q.hovered = false;
    const d = player.pos.dist(q.pos);
    if (d < nearestSignDist) { nearestSign = q; nearestSignDist = d; }
  }
  for (const s of get('projectStone')) {
    s.hovered = false;
    const d = player.pos.dist(s.pos);
    if (d < nearestStoneDist) { nearestStone = s; nearestStoneDist = d; }
  }

  // Pick the nearer one when both are in range.
  let activeType = null, activeEntity = null;
  if (nearestSign && nearestStone) {
    if (nearestSignDist <= nearestStoneDist) { activeType = 'sign';  activeEntity = nearestSign; }
    else                                     { activeType = 'stone'; activeEntity = nearestStone; }
  } else if (nearestSign)  { activeType = 'sign';  activeEntity = nearestSign;  }
  else if (nearestStone)   { activeType = 'stone'; activeEntity = nearestStone; }

  state.activeQuest = activeType === 'sign'  ? activeEntity : null;
  state.activeStone = activeType === 'stone' ? activeEntity : null;

  if (activeEntity) {
    activeEntity.hovered = true;
    player.excited = activeType === 'sign' && !activeEntity.cleared;
    promptEl.classList.add('show');
    if (activeType === 'sign') {
      promptTextEl.textContent = activeEntity.cleared
        ? '다시 보기'
        : '★ ' + QUEST_LABELS[activeEntity.questId - 1] + ' 받기';
    } else {
      promptTextEl.textContent = '▶ ' + QUEST_LABELS[activeEntity.questId - 1] + ' 프로젝트 보기';
    }
  } else {
    player.excited = false;
    promptEl.classList.remove('show');
  }
});

// 6. Title / replay overlays — wire start button + replay.
const overlays = wireOverlays(player);

// 6b. Status panel — TAB key opens RPG character sheet (skills/edu/certs/awards).
createStatusPanel();

// 7. Modal + Dialog setup.
const modal = createProjectModal();

const dialog = createDialogSystem(QUESTS, {
  onCleared: (questId) => {
    state.cleared.add(questId);
    counterEl.textContent = state.cleared.size;
    player.startCelebration();
    if (state.cleared.size === 6) {
      setTimeout(overlays.showEnding, 1000);
    }
  },
});

// Helper: get QUESTS data by sign/stone entity (uses .questId).
function questDataFor(entity) {
  if (!entity) return null;
  return QUESTS.find(q => q.id === entity.questId) || null;
}

// 8. Key handlers.
onKeyPress("space", () => {
  if (!state.started || state.modalOpen || state.statusOpen) return;
  if (state.dialogOpen) {
    dialog.nextPage();
  } else if (state.activeStone) {
    // B-path: walk to stone → SPACE → modal directly.
    const q = questDataFor(state.activeStone);
    if (q) modal.open(q);
  } else if (state.activeQuest) {
    // A-path: walk to sign → SPACE → text dialog.
    dialog.open(state.activeQuest);
  }
});
onKeyPress("enter", () => {
  if (!state.started || state.modalOpen || state.statusOpen) return;
  if (state.dialogOpen) dialog.nextPage();
  else if (state.activeStone) { const q = questDataFor(state.activeStone); if (q) modal.open(q); }
  else if (state.activeQuest) dialog.open(state.activeQuest);
});

// E during dialog → close + clear, then open modal (A-path bridge).
onKeyPress("e", () => {
  if (!state.started || state.modalOpen || state.statusOpen) return;
  if (state.dialogOpen && state.activeQuest && dialog.hasVisibleProjects()) {
    const sign = state.activeQuest;
    dialog.forceClose(true);
    const q = questDataFor(sign);
    if (q) modal.open(q);
  }
});

// 9. Prevent arrow / space from scrolling the page.
window.addEventListener('keydown', (e) => {
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) {
    e.preventDefault();
  }
}, false);
