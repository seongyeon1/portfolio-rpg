// Build the color palette. Must be called AFTER kaboom() init since rgb() is
// a Kaboom global created by that call.
export function createPalette() {
  return {
    skyPink:        rgb(251, 225, 236),
    skyPink2:       rgb(255, 209, 220),
    cloudWhite:     rgb(255, 253, 248),
    grass:          rgb(184, 224, 182),
    grassDark:      rgb(143, 204, 146),
    path:           rgb(245, 220, 200),
    flower:         rgb(255, 197, 220),
    kirbyPink:      rgb(255, 166, 196),
    kirbyShadow:    rgb(233, 136, 166),
    kirbyFeet:      rgb(200, 38, 79),
    kirbyEye:       rgb(61, 42, 110),
    warpYellow:     rgb(255, 228, 94),
    warpOrange:     rgb(255, 177, 59),
    inkDark:        rgb(42, 31, 61),
    inkMid:         rgb(107, 94, 133),
    treeTrunk:      rgb(120, 80, 70),
    treeLeaf:       rgb(70, 160, 100),
    treeLeafDark:   rgb(45, 120, 75),
    waterBlue:      rgb(120, 185, 220),
    waterDark:      rgb(80, 150, 195),
    wallBase:       rgb(95, 150, 105),
    starGlow:       rgb(255, 235, 130),
  };
}
