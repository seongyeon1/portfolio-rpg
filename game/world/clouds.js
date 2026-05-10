// Spawn 8 decorative clouds that drift left-to-right across the map.
export function spawnClouds(C, mapWidth, mapHeight) {
  for (let i = 0; i < 8; i++) {
    const cloud = add([
      pos(rand(0, mapWidth), rand(-40, mapHeight - 200)),
      anchor("center"),
      z(20),
      "cloud",
      { speed: rand(8, 18) },
    ]);
    cloud.onDraw(() => {
      drawCircle({ pos: vec2(0, 0),    radius: 18, color: C.cloudWhite, opacity: 0.85 });
      drawCircle({ pos: vec2(-22, 6),  radius: 14, color: C.cloudWhite, opacity: 0.85 });
      drawCircle({ pos: vec2(22, 6),   radius: 14, color: C.cloudWhite, opacity: 0.85 });
      drawCircle({ pos: vec2(-12, -8), radius: 12, color: C.cloudWhite, opacity: 0.85 });
      drawCircle({ pos: vec2(14, -10), radius: 12, color: C.cloudWhite, opacity: 0.85 });
    });
    cloud.onUpdate(() => {
      cloud.pos.x += cloud.speed * dt();
      if (cloud.pos.x > mapWidth + 60) cloud.pos.x = -60;
    });
  }
}
