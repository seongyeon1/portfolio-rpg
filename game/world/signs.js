import { rectShape } from '../helpers.js?v=8';

// 5-point star polygon points around origin.
function starPoly(radius) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? radius : radius * 0.45;
    pts.push(vec2(Math.cos(ang) * r, Math.sin(ang) * r));
  }
  return pts;
}

// Place quest signs (banner + floating star) at MAP positions 1..6.
// Returns the position vec2 for each quest id so callers can wire camera/etc.
export function buildSigns(C, MAP, TILE, QUEST_LABELS) {
  const questPositions = {};

  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[y].length; x++) {
      const ch = MAP[y][x];
      const idx = parseInt(ch, 10);
      if (idx >= 1 && idx <= 6) {
        const px = x * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;
        const sign = add([
          pos(px, py),
          rectShape(-45, -56, 90, 90),
          anchor("center"),
          z(3),
          'quest',
          { questId: idx, hovered: false, cleared: false, label: QUEST_LABELS[idx - 1] },
        ]);
        sign.add([
          pos(0, 0),
          anchor("center"),
          {
            draw() {
              const t = time();
              drawRect({ pos: vec2(-2, 6), width: 4, height: 22, color: C.treeTrunk });
              drawRect({ pos: vec2(-46, -10), width: 92, height: 28, color: C.inkDark, opacity: 0.25 });
              drawRect({
                pos: vec2(-44, -12),
                width: 90, height: 26,
                color: sign.cleared ? C.grassDark : C.cloudWhite,
                outline: { color: C.inkDark, width: 3 },
              });
              drawText({
                text: sign.label,
                pos: vec2(0, 1),
                size: 9,
                color: sign.cleared ? C.cloudWhite : C.inkDark,
                anchor: "center",
              });

              if (!sign.cleared) {
                const bob = Math.sin(t * 2.5 + idx) * 4;
                const pulse = (Math.sin(t * 3.5 + idx) + 1) / 2;
                const glowR = 18 + pulse * 6;
                const starY = -44 + bob;

                drawCircle({ pos: vec2(0, starY), radius: glowR, color: C.starGlow, opacity: 0.18 + pulse * 0.18 });
                drawCircle({ pos: vec2(0, starY), radius: glowR * 0.7, color: C.starGlow, opacity: 0.25 });

                drawPolygon({
                  pts: starPoly(13),
                  pos: vec2(0, starY),
                  color: C.warpYellow,
                  outline: { color: C.warpOrange, width: 2 },
                });

                drawCircle({
                  pos: vec2(-3, starY - 4),
                  radius: 1.6,
                  color: C.cloudWhite,
                  opacity: 0.85,
                });

                if (sign.hovered) {
                  drawCircle({
                    pos: vec2(0, starY),
                    radius: 22 + pulse * 3,
                    color: C.warpYellow,
                    opacity: 0,
                    outline: { color: C.warpOrange, width: 2 },
                  });
                }
              } else {
                drawText({ text: "+", pos: vec2(38, 1), size: 14, color: C.warpYellow, anchor: "center" });
                drawPolygon({
                  pts: starPoly(7),
                  pos: vec2(0, -34),
                  color: C.warpYellow,
                  opacity: 0.4,
                });
              }
            },
          },
        ]);
        questPositions[idx] = vec2(px, py);
      }
    }
  }

  return { questPositions };
}
