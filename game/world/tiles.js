// Build the tile level + tree/flower/water decoration entities.
export function buildTiles(C, MAP, TILE) {
  addLevel(MAP, {
    tileWidth:  TILE,
    tileHeight: TILE,
    pos: vec2(0, 0),
    tiles: {
      '.': () => [ rect(TILE, TILE), color(C.grass) ],
      ',': () => [ rect(TILE, TILE), color(C.grass), 'flowerTile' ],
      '+': () => [ rect(TILE, TILE), color(C.path) ],
      '#': () => [ rect(TILE, TILE), color(C.wallBase), outline(2, C.inkDark), area(), body({ isStatic: true }), 'wall', 'treeTile' ],
      '~': () => [ rect(TILE, TILE), color(C.waterDark), outline(2, C.inkDark), area(), body({ isStatic: true }), 'wall', 'waterTile' ],
      '@': () => [ rect(TILE, TILE), color(C.grass), 'spawn' ],
      '1': () => [ rect(TILE, TILE), color(C.grass) ],
      '2': () => [ rect(TILE, TILE), color(C.grass) ],
      '3': () => [ rect(TILE, TILE), color(C.grass) ],
      '4': () => [ rect(TILE, TILE), color(C.grass) ],
      '5': () => [ rect(TILE, TILE), color(C.grass) ],
      '6': () => [ rect(TILE, TILE), color(C.grass) ],
    },
  });

  // Trees: shadow + trunk + dark/light leaf layers for depth
  get('treeTile').forEach((tile) => {
    const cx = tile.pos.x + TILE / 2;
    const cy = tile.pos.y + TILE / 2;
    add([
      pos(cx, cy), anchor("center"), z(2), "deco",
      {
        draw() {
          drawEllipse({ pos: vec2(2, 22), radiusX: 16, radiusY: 4, color: C.inkDark, opacity: 0.22 });
          drawRect({ pos: vec2(-5, 4), width: 10, height: 18, color: C.treeTrunk });
          drawCircle({ pos: vec2(-12, -4), radius: 15, color: C.treeLeafDark });
          drawCircle({ pos: vec2(12, -4),  radius: 15, color: C.treeLeafDark });
          drawCircle({ pos: vec2(0, -14),  radius: 17, color: C.treeLeafDark });
          drawCircle({ pos: vec2(-9, -6),  radius: 11, color: C.treeLeaf });
          drawCircle({ pos: vec2(11, -6),  radius: 11, color: C.treeLeaf });
          drawCircle({ pos: vec2(0, -16),  radius: 13, color: C.treeLeaf });
        },
      },
    ]);
  });

  // Flowers
  get('flowerTile').forEach((tile) => {
    const cx = tile.pos.x + TILE / 2;
    const cy = tile.pos.y + TILE / 2;
    add([
      pos(cx, cy), anchor("center"), z(2), "deco",
      {
        draw() {
          drawCircle({ pos: vec2(-8, -6), radius: 4, color: C.flower });
          drawCircle({ pos: vec2(-8, -6), radius: 1.5, color: C.warpYellow });
          drawCircle({ pos: vec2(10, 8), radius: 3, color: C.cloudWhite });
          drawCircle({ pos: vec2(10, 8), radius: 1, color: C.warpYellow });
        },
      },
    ]);
  });

  // Water ripples
  get('waterTile').forEach((tile) => {
    const cx = tile.pos.x + TILE / 2;
    const cy = tile.pos.y + TILE / 2;
    const phase = (cx * 0.05) % (Math.PI * 2);
    add([
      pos(cx, cy), anchor("center"), z(2), "deco",
      {
        draw() {
          const off = Math.sin(time() * 2 + phase) * 2;
          drawRect({ pos: vec2(-22, -8 + off), width: 44, height: 2, color: C.cloudWhite, opacity: 0.6 });
          drawRect({ pos: vec2(-18, 8 - off),  width: 36, height: 2, color: C.cloudWhite, opacity: 0.4 });
        },
      },
    ]);
  });
}
