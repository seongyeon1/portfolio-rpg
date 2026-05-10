// Build an area-shape rectangle. Resolved lazily because Rect is a Kaboom
// global that only exists after kaboom() runs in main.js.
let RectCls = null;
export function rectShape(offsetX, offsetY, w, h) {
  if (!RectCls) RectCls = (typeof Rect === 'function') ? Rect : null;
  return area({ shape: new RectCls(vec2(offsetX, offsetY), w, h) });
}
