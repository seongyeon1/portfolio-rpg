import { rectShape } from '../helpers.js?v=8';

// Place a Project Stone (lore book on pedestal) one tile to the right of each
// quest sign that has at least one project. Walking near it shows a SPACE
// prompt that opens the project modal directly.
export function buildStones(C, MAP, TILE, quests) {
  const stoneByQuestId = {};

  for (let y = 0; y < MAP.length; y++) {
    for (let x = 0; x < MAP[y].length; x++) {
      const ch = MAP[y][x];
      const idx = parseInt(ch, 10);
      if (idx >= 1 && idx <= 6) {
        const quest = quests.find(q => q.id === idx);
        if (!quest || !quest.projectIds || quest.projectIds.length === 0) continue;

        // Place stone one tile to the right of the sign.
        const px = (x + 1) * TILE + TILE / 2;
        const py = y * TILE + TILE / 2;

        const stone = add([
          pos(px, py),
          rectShape(-18, -8, 36, 28),
          anchor("center"),
          z(3),
          'projectStone',
          { questId: idx, hovered: false },
        ]);

        stone.add([
          pos(0, 0),
          anchor("center"),
          {
            draw() {
              const t = time();
              const bob = Math.sin(t * 1.5 + idx) * 1.2;

              // Pedestal shadow
              drawEllipse({ pos: vec2(2, 18), radiusX: 16, radiusY: 4, color: C.inkDark, opacity: 0.22 });

              // Stone pedestal (two-tone)
              drawRect({
                pos: vec2(-14, -2), width: 28, height: 18,
                color: rgb(168, 156, 144),
                outline: { color: C.inkDark, width: 2 },
              });
              drawRect({ pos: vec2(-12, -4), width: 24, height: 4, color: rgb(196, 184, 172) });

              // Glow when player is nearby
              if (stone.hovered) {
                const pulse = (Math.sin(t * 4) + 1) / 2;
                drawCircle({
                  pos: vec2(0, -16 + bob),
                  radius: 16 + pulse * 5,
                  color: C.warpYellow,
                  opacity: 0.18 + pulse * 0.18,
                });
              }

              // Open book
              drawRect({
                pos: vec2(-11, -22 + bob), width: 22, height: 14,
                color: rgb(136, 84, 72),
                outline: { color: C.inkDark, width: 2 },
              });
              drawRect({ pos: vec2(-9, -20 + bob), width: 18, height: 10, color: C.cloudWhite });
              // Spine + page lines
              drawRect({ pos: vec2(0, -20 + bob), width: 0.8, height: 10, color: C.inkDark, opacity: 0.5 });
              drawRect({ pos: vec2(-7, -18 + bob), width: 5, height: 0.8, color: C.inkMid, opacity: 0.6 });
              drawRect({ pos: vec2(-7, -16 + bob), width: 4, height: 0.8, color: C.inkMid, opacity: 0.6 });
              drawRect({ pos: vec2(2,  -18 + bob), width: 5, height: 0.8, color: C.inkMid, opacity: 0.6 });
              drawRect({ pos: vec2(2,  -16 + bob), width: 4, height: 0.8, color: C.inkMid, opacity: 0.6 });

              // Floating "i" info indicator above book
              const iY = -36 + bob * 2;
              drawCircle({
                pos: vec2(0, iY), radius: 7,
                color: C.cloudWhite,
                outline: { color: C.inkDark, width: 2 },
              });
              drawText({
                text: 'i', pos: vec2(0, iY + 1), size: 10,
                color: C.inkDark, anchor: 'center',
              });
            },
          },
        ]);

        stoneByQuestId[idx] = stone;
      }
    }
  }

  return { stoneByQuestId };
}
