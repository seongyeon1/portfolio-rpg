import { state } from '../state.js?v=8';

// Wire title screen start, ending replay, and HUD show/hide.
// Caller passes the player so replay can reset its position.
export function wireOverlays(player) {
  const titleEl   = document.getElementById('titleOverlay');
  const startBtn  = document.getElementById('startBtn');
  const replayBtn = document.getElementById('replayBtn');
  const hudEl     = document.getElementById('hud');
  const endingEl  = document.getElementById('ending');
  const counterEl = document.getElementById('questCounter');

  function startGame() {
    titleEl.classList.add('hide');
    hudEl.classList.add('show');
    state.started = true;
  }

  startBtn.addEventListener('click', startGame);
  document.addEventListener('keydown', (e) => {
    if (!state.started && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      startGame();
    }
  });

  replayBtn.addEventListener('click', () => {
    endingEl.classList.remove('show');
    state.cleared.clear();
    counterEl.textContent = '0';
    get('quest').forEach(q => { q.cleared = false; });
    player.pos = state.spawn.clone();
    camPos(player.pos);
  });

  return {
    showEnding: () => endingEl.classList.add('show'),
  };
}
