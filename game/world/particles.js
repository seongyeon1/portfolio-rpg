// Lightweight particle entities — auto-destroyed when ttl elapses.

// Walking dust — small grey dots that puff out behind the player's feet.
export function spawnDust(C, x, y) {
  const vx = (Math.random() - 0.5) * 14;
  const vy = -Math.random() * 8 - 2;
  add([
    pos(x, y),
    anchor("center"),
    z(40),
    'particle',
    {
      ttl: 0.4,
      born: time(),
      vx, vy,
      r: 1 + Math.random() * 0.8,
      update() {
        const life = (time() - this.born) / this.ttl;
        if (life >= 1) { destroy(this); return; }
        this.pos.x += this.vx * dt();
        this.pos.y += this.vy * dt();
        this.vy += 24 * dt();
      },
      draw() {
        const life = (time() - this.born) / this.ttl;
        if (life >= 1) return;
        drawCircle({
          pos: vec2(0, 0),
          radius: this.r * (1 - life * 0.5),
          color: rgb(180, 170, 150),
          opacity: (1 - life) * 0.55,
        });
      },
    },
  ]);
}

// Heart particle — drifts upward when player is near an unsigned quest.
export function spawnHeart(C, x, y) {
  add([
    pos(x, y),
    anchor("center"),
    z(55),
    'particle',
    {
      ttl: 1.0,
      born: time(),
      vx: (Math.random() - 0.5) * 8,
      vy: -22,
      update() {
        const life = (time() - this.born) / this.ttl;
        if (life >= 1) { destroy(this); return; }
        this.pos.x += this.vx * dt();
        this.pos.y += this.vy * dt();
        this.vy += 4 * dt();
      },
      draw() {
        const life = (time() - this.born) / this.ttl;
        if (life >= 1) return;
        const scale = 0.6 + Math.sin(life * Math.PI) * 0.4;
        const opacity = life < 0.25 ? life / 0.25 : 1 - (life - 0.25) / 0.75;
        const hc = C.kirbyFeet;
        drawCircle({ pos: vec2(-2 * scale, -1 * scale), radius: 2.4 * scale, color: hc, opacity });
        drawCircle({ pos: vec2( 2 * scale, -1 * scale), radius: 2.4 * scale, color: hc, opacity });
        drawPolygon({
          pts: [
            vec2(-3.2 * scale, 0.5 * scale),
            vec2(0, 4 * scale),
            vec2( 3.2 * scale, 0.5 * scale),
          ],
          color: hc,
          opacity,
        });
      },
    },
  ]);
}
