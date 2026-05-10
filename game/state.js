// Shared mutable game state. Modules read/write through this single object
// so the wiring in main.js stays explicit.
export const state = {
  started: false,
  dialogOpen: false,
  modalOpen: false,
  statusOpen: false,
  activeQuest: null,
  activeStone: null,
  cleared: new Set(),
  spawn: null,
  mapWidth: 0,
  mapHeight: 0,
};
