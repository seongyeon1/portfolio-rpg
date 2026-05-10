import { rectShape } from './helpers.js?v=8';
import { state }     from './state.js?v=8';
import { spawnDust, spawnHeart } from './world/particles.js?v=8';

const CELEB_DURATION    = 0.9;
const CELEB_STYLES      = ['spin', 'cartwheel', 'doubleJump'];
const IDLE_SLEEP_AFTER  = 30;
const IDLE_EVENT_MIN    = 4;
const IDLE_EVENT_MAX    = 7;

/* ============================================================ *
 *  Entity factory                                                *
 * ============================================================ */
export function createPlayer(C, spawn) {
  const player = add([
    pos(spawn),
    rectShape(-14, -10, 28, 22),
    body(),
    anchor("center"),
    z(50),
    "player",
    {
      speed: 200,
      facing: vec2(0, 1),
      moving: false,
      viewDir: 'front',           // 'front' | 'back' | 'left' | 'right'
      excited: false,
      celebrating: 0,
      celebStyle: 'spin',
      // Idle state machine
      lastMoveTime: 0,
      idleAction: 'stand',        // 'stand' | 'lookAround' | 'stretch' | 'sleep'
      idleStart: 0,
      nextIdleEvent: 0,
      // Particle timing
      lastFootStep: 0,
      lastHeart: 0,
      // Trigger a randomized celebration. Called by main.js on quest clear.
      startCelebration() {
        this.celebrating = time() + CELEB_DURATION;
        this.celebStyle = CELEB_STYLES[Math.floor(Math.random() * CELEB_STYLES.length)];
      },
    },
  ]);

  player.lastMoveTime = time();
  player.nextIdleEvent = time() + 5;

  // Per-frame: particle spawning + idle state advancement.
  player.onUpdate(() => {
    if (state.dialogOpen || state.modalOpen || state.statusOpen) return;
    const t = time();

    // Footstep dust while walking — drop slightly behind
    if (player.moving && t - player.lastFootStep > 0.18) {
      const dx = player.facing.x;
      const dy = player.facing.y;
      const offX = -dx * 6;
      const offY = 14 - Math.abs(dy) * 4;
      spawnDust(C, player.pos.x + offX, player.pos.y + offY);
      player.lastFootStep = t;
    }

    // Heart bubbles while excited (near unsigned quest)
    if (player.excited && t - player.lastHeart > 0.55) {
      spawnHeart(C, player.pos.x + (Math.random() - 0.5) * 14, player.pos.y - 28);
      player.lastHeart = t;
    }

    updateIdle(player, t);
  });

  player.onDraw(() => drawPlayer(C, player));

  return player;
}

/* ============================================================ *
 *  Idle state machine                                            *
 * ============================================================ */
function updateIdle(player, t) {
  // Any movement or excitement resets idle
  if (player.moving || player.excited) {
    player.lastMoveTime = t;
    if (player.idleAction !== 'stand') player.idleAction = 'stand';
    player.nextIdleEvent = t + rand(IDLE_EVENT_MIN, IDLE_EVENT_MAX);
    return;
  }

  const idleFor = t - player.lastMoveTime;

  // Sleep after long idle
  if (idleFor > IDLE_SLEEP_AFTER && player.idleAction !== 'sleep') {
    player.idleAction = 'sleep';
    player.idleStart = t;
    return;
  }

  // Random micro-actions while standing
  if (player.idleAction === 'stand' && t > player.nextIdleEvent && idleFor < IDLE_SLEEP_AFTER) {
    player.idleAction = Math.random() < 0.55 ? 'lookAround' : 'stretch';
    player.idleStart = t;
    player.nextIdleEvent = t + rand(IDLE_EVENT_MIN, IDLE_EVENT_MAX);
    return;
  }

  // Action expiry
  const elapsed = t - player.idleStart;
  if (player.idleAction === 'lookAround' && elapsed > 1.4) player.idleAction = 'stand';
  else if (player.idleAction === 'stretch' && elapsed > 1.0) player.idleAction = 'stand';
}

/* ============================================================ *
 *  Main draw dispatcher                                          *
 * ============================================================ */
function drawPlayer(C, player) {
  const t = time();

  if (player.idleAction === 'sleep') {
    drawSleeping(C, player, t);
    return;
  }

  const moving = player.moving;
  const stepFreq = 13;
  const step = moving ? Math.sin(t * stepFreq) : 0;
  const stepAbs = Math.abs(step);

  // Idle modulators
  const idleAction = player.idleAction;
  const idleElapsed = t - player.idleStart;

  let stretchMod = 1;
  if (idleAction === 'stretch') {
    const phase = Math.min(idleElapsed / 1.0, 1);
    stretchMod = 1 + Math.sin(phase * Math.PI) * 0.18;
  }
  const armRaise = idleAction === 'stretch'
    ? -Math.sin(Math.min(idleElapsed / 1.0, 1) * Math.PI) * 14
    : 0;

  let lookEyeOffset = 0;
  if (idleAction === 'lookAround') {
    const phase = idleElapsed / 1.4;
    if      (phase < 0.4)  lookEyeOffset = -3 * (phase / 0.4);
    else if (phase < 0.5)  lookEyeOffset = -3 + 6 * ((phase - 0.4) / 0.1);
    else if (phase < 0.85) lookEyeOffset = 3;
    else                   lookEyeOffset = 3 * (1 - (phase - 0.85) / 0.15);
  }

  // Core motion
  const bounce = moving ? (1 - stepAbs) * 4.5 : Math.sin(t * 2) * 0.8;
  const cheekPuff = !moving ? (Math.sin(t * 1.4) + 1) / 2 : 0;
  let sX = moving ? 1 + stepAbs * 0.06 : 1 + Math.sin(t * 1.6) * 0.018;
  let sY = moving ? 1 - stepAbs * 0.07 : 1 - Math.sin(t * 1.6) * 0.018;
  if (idleAction === 'stretch') { sX /= stretchMod; sY *= stretchMod; }

  // Eyes / blink
  const blinkPhase = (t % 3.4) / 3.4;
  const blinking = blinkPhase > 0.965;
  const eyeRY = blinking ? 0.5 : 4;

  const armSwing = moving ? step * 3 : 0;

  // Celebration timing
  const celebTime = ((player.celebrating || 0) - t);
  const celebActive = celebTime > 0 && celebTime < CELEB_DURATION;
  const celebProgress = celebActive ? (CELEB_DURATION - celebTime) / CELEB_DURATION : 0;

  const eager = (player.excited && !celebActive) ? Math.sin(t * 8) * 1.2 : 0;

  const lFootY = moving ? (step < 0 ? 12 - stepAbs * 5 : 12) : 12;
  const rFootY = moving ? (step > 0 ? 12 - stepAbs * 5 : 12) : 12;

  pushTransform();
  if (celebActive) applyCelebration(player.celebStyle, celebProgress);

  // Ground shadow (smaller while airborne)
  const shadowR = celebActive ? 8 : 16 - bounce * 0.35;
  drawEllipse({ pos: vec2(0, 18), radiusX: shadowR, radiusY: 3, color: C.inkDark, opacity: 0.2 });

  // Celebration particles
  if (celebActive) drawCelebParticles(C, player.celebStyle, celebProgress);

  // Arms (behind body)
  drawArms(C, player.viewDir, armSwing, armRaise, bounce);

  // Feet
  drawFeet(C, player.viewDir, lFootY, rFootY);

  // Body + face (with bounce/squash)
  pushTransform();
  pushTranslate(0, -bounce - eager);
  pushScale(sX, sY);
  drawBodyAndFace(C, player.viewDir, t, blinking, eyeRY, lookEyeOffset, cheekPuff, moving, stepAbs, celebActive);
  popTransform();

  popTransform();
}

/* ============================================================ *
 *  Celebration variants                                          *
 * ============================================================ */
function applyCelebration(style, progress) {
  if (style === 'spin') {
    pushTranslate(0, -Math.sin(progress * Math.PI) * 32);
    pushRotate(progress * 720);
  } else if (style === 'cartwheel') {
    pushTranslate(Math.sin(progress * Math.PI * 2) * 18, -Math.sin(progress * Math.PI) * 14);
    pushRotate(progress * 1080);
  } else if (style === 'doubleJump') {
    let h = 0;
    if (progress < 0.5) h = -Math.sin((progress * 2) * Math.PI) * 14;
    else                h = -Math.sin(((progress - 0.5) * 2) * Math.PI) * 24;
    pushTranslate(0, h);
  }
}

function drawCelebParticles(C, style, progress) {
  const flash = Math.sin(progress * Math.PI);

  if (style === 'spin') {
    for (let k = 0; k < 4; k++) {
      const ang = progress * 12 + k * Math.PI / 2;
      const r = 28 + flash * 8;
      drawCircle({
        pos: vec2(Math.cos(ang) * r, Math.sin(ang) * r - 8),
        radius: 2 + flash * 1.5,
        color: C.warpYellow,
        opacity: 0.9,
      });
    }
  } else if (style === 'cartwheel') {
    // Trailing sparkle stream
    for (let k = 0; k < 5; k++) {
      const trail = progress - k * 0.04;
      if (trail < 0 || trail > 1) continue;
      const x = Math.sin(trail * Math.PI * 2) * 18;
      const y = -Math.sin(trail * Math.PI) * 14;
      drawCircle({
        pos: vec2(x, y),
        radius: Math.max(0.5, 2 - k * 0.3),
        color: C.warpYellow,
        opacity: Math.max(0, 0.55 - k * 0.1),
      });
    }
  } else if (style === 'doubleJump') {
    // Star burst at second-jump peak
    const burstPhase = progress > 0.6 ? Math.min((progress - 0.6) / 0.3, 1) : 0;
    if (burstPhase > 0) {
      const burstFade = 1 - burstPhase;
      for (let k = 0; k < 8; k++) {
        const ang = (k / 8) * Math.PI * 2;
        const r = burstPhase * 38;
        drawCircle({
          pos: vec2(Math.cos(ang) * r, Math.sin(ang) * r - 10),
          radius: 3 * burstFade + 1,
          color: C.warpYellow,
          opacity: burstFade,
        });
      }
    }
  }
}

/* ============================================================ *
 *  Pose drawing helpers (front / back / side)                    *
 * ============================================================ */
function drawArms(C, viewDir, armSwing, armRaise, bounce) {
  const baseY = -2 + armRaise - bounce * 0.3;
  if (viewDir === 'back') {
    // Slightly tucked, darker tone (back of arms)
    drawCircle({ pos: vec2(-15, baseY), radius: 6, color: C.kirbyShadow });
    drawCircle({ pos: vec2( 15, baseY), radius: 6, color: C.kirbyShadow });
  } else if (viewDir === 'front') {
    drawCircle({ pos: vec2(-18 + armSwing * 0.4, baseY), radius: 6, color: C.kirbyPink });
    drawCircle({ pos: vec2( 18 - armSwing * 0.4, baseY), radius: 6, color: C.kirbyPink });
  } else {
    const flip = viewDir === 'left' ? -1 : 1;
    drawCircle({ pos: vec2(-18 * flip + armSwing, baseY), radius: 6, color: C.kirbyPink });
    drawCircle({ pos: vec2( 18 * flip - armSwing, baseY), radius: 6, color: C.kirbyPink });
  }
}

function drawFeet(C, viewDir, lFootY, rFootY) {
  const tone = viewDir === 'back' ? C.kirbyShadow : C.kirbyFeet;
  drawEllipse({ pos: vec2(-7, lFootY), radiusX: 7, radiusY: 5, color: tone });
  drawEllipse({ pos: vec2( 7, rFootY), radiusX: 7, radiusY: 5, color: tone });
}

function drawBodyAndFace(C, viewDir, t, blinking, eyeRY, lookEyeOffset, cheekPuff, moving, stepAbs, celebActive) {
  // Body
  drawCircle({ pos: vec2(0, 0), radius: 18, color: C.kirbyPink });
  drawEllipse({ pos: vec2(0, 6), radiusX: 16, radiusY: 6, color: C.kirbyShadow, opacity: 0.35 });

  if (viewDir === 'back') {
    drawEllipse({ pos: vec2(0, -8), radiusX: 14, radiusY: 5, color: C.kirbyShadow, opacity: 0.25 });
    return;
  }

  const mouthRY = celebActive ? 2.5 : (moving ? 1.6 + stepAbs * 0.4 : 1.4);

  if (viewDir === 'front') {
    const eyeShift = lookEyeOffset;
    drawCircle({ pos: vec2(-9, 2), radius: 2.5 + cheekPuff * 0.4, color: C.kirbyShadow, opacity: 0.7 });
    drawCircle({ pos: vec2( 9, 2), radius: 2.5 + cheekPuff * 0.4, color: C.kirbyShadow, opacity: 0.7 });
    drawEllipse({ pos: vec2(-5 + eyeShift, -4), radiusX: 1.8, radiusY: eyeRY, color: C.kirbyEye });
    drawEllipse({ pos: vec2( 5 + eyeShift, -4), radiusX: 1.8, radiusY: eyeRY, color: C.kirbyEye });
    if (!blinking) {
      drawCircle({ pos: vec2(-5 + eyeShift, -6), radius: 0.9, color: C.cloudWhite });
      drawCircle({ pos: vec2( 5 + eyeShift, -6), radius: 0.9, color: C.cloudWhite });
    }
    drawEllipse({ pos: vec2(0, 1), radiusX: 1.4, radiusY: mouthRY, color: C.kirbyEye });
    return;
  }

  // Side view (left or right)
  const flip = viewDir === 'left' ? -1 : 1;
  const eyeDX = flip * 1.0 + lookEyeOffset * flip;
  drawCircle({ pos: vec2(-9 * flip, 2), radius: 2.5 + cheekPuff * 0.4, color: C.kirbyShadow, opacity: 0.7 });
  drawCircle({ pos: vec2( 9 * flip, 2), radius: 2.5 + cheekPuff * 0.4, color: C.kirbyShadow, opacity: 0.7 });
  drawEllipse({ pos: vec2(-5 * flip + eyeDX, -4), radiusX: 1.8, radiusY: eyeRY, color: C.kirbyEye });
  drawEllipse({ pos: vec2( 5 * flip + eyeDX, -4), radiusX: 1.8, radiusY: eyeRY, color: C.kirbyEye });
  if (!blinking) {
    drawCircle({ pos: vec2(-5 * flip + eyeDX, -6), radius: 0.9, color: C.cloudWhite });
    drawCircle({ pos: vec2( 5 * flip + eyeDX, -6), radius: 0.9, color: C.cloudWhite });
  }
  drawEllipse({ pos: vec2(0, 1), radiusX: 1.4, radiusY: mouthRY, color: C.kirbyEye });
}

/* ============================================================ *
 *  Sleep pose — sit + closed eyes + drifting Z's                  *
 * ============================================================ */
function drawSleeping(C, player, t) {
  const breath = Math.sin(t * 1.5) * 1.2;

  pushTransform();
  pushTranslate(0, 4); // sit slightly lower

  drawEllipse({ pos: vec2(0, 14), radiusX: 14, radiusY: 3, color: C.inkDark, opacity: 0.2 });

  pushTransform();
  pushScale(1.1, 0.85);
  drawCircle({ pos: vec2(0, breath), radius: 18, color: C.kirbyPink });
  drawEllipse({ pos: vec2(0, 6 + breath), radiusX: 16, radiusY: 6, color: C.kirbyShadow, opacity: 0.35 });
  drawCircle({ pos: vec2(-9, 2 + breath), radius: 2.6, color: C.kirbyShadow, opacity: 0.7 });
  drawCircle({ pos: vec2( 9, 2 + breath), radius: 2.6, color: C.kirbyShadow, opacity: 0.7 });
  // Closed eyes (curved arcs as small flat ellipses)
  drawEllipse({ pos: vec2(-5, -3 + breath), radiusX: 2.5, radiusY: 0.6, color: C.kirbyEye });
  drawEllipse({ pos: vec2( 5, -3 + breath), radiusX: 2.5, radiusY: 0.6, color: C.kirbyEye });
  drawEllipse({ pos: vec2(0, 2 + breath), radiusX: 1, radiusY: 0.7, color: C.kirbyEye });
  popTransform();

  // Drifting Z's
  const zPhase = (t * 0.6) % 1;
  for (let i = 0; i < 3; i++) {
    const phase = (zPhase + i / 3) % 1;
    const zX = 18 + Math.sin(phase * Math.PI) * 6;
    const zY = -8 - phase * 30;
    const opacity = phase < 0.7 ? 1 : (1 - phase) / 0.3;
    drawText({
      text: 'Z',
      pos: vec2(zX, zY),
      size: 8 + i * 2,
      color: C.cloudWhite,
      opacity: opacity * 0.85,
      anchor: 'center',
    });
  }
  popTransform();
}
