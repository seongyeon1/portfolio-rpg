import { state } from '../state.js?v=8';
import { PROJECTS } from '../data/projects.js?v=8';

// Build the typewriter dialog system. Returns { open, nextPage, forceClose,
// hasProjects } that main.js wires to SPACE/ENTER/E. The onCleared callback
// fires when the user finishes a quest dialog for the first time.
export function createDialogSystem(QUESTS, { onCleared }) {
  const dialogEl    = document.getElementById('dialog');
  const dlgSpeaker  = document.getElementById('dlgSpeaker');
  const dlgPeriod   = document.getElementById('dlgPeriod');
  const dlgText     = document.getElementById('dlgText');
  const dlgProgress = document.getElementById('dlgProgress');
  const detailHint  = document.getElementById('dlgDetailHint');
  const promptEl    = document.getElementById('prompt');

  let currentQuestData = null;
  let currentPage      = 0;
  let typingTimer      = null;
  let typingDone       = true;

  // Split HTML into text + tag chunks so we can type character-by-character
  // without breaking tags.
  function parseHtmlToChunks(html) {
    const out = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        if (end === -1) { out.push({ type: 'text', content: html.slice(i) }); break; }
        out.push({ type: 'tag', content: html.slice(i, end + 1) });
        i = end + 1;
      } else {
        const next = html.indexOf('<', i);
        const stop = next === -1 ? html.length : next;
        out.push({ type: 'text', content: html.slice(i, stop) });
        i = stop;
      }
    }
    return out;
  }

  function typeWriter(html) {
    typingDone = false;
    dlgText.innerHTML = '';
    const chunks = parseHtmlToChunks(html);
    let ci = 0, charIdx = 0;
    function step() {
      if (ci >= chunks.length) { typingDone = true; return; }
      const c = chunks[ci];
      if (c.type === 'tag') {
        dlgText.innerHTML += c.content;
        ci++; charIdx = 0;
        typingTimer = setTimeout(step, 4);
      } else {
        if (charIdx < c.content.length) {
          dlgText.innerHTML += c.content[charIdx];
          charIdx++;
          typingTimer = setTimeout(step, 18);
        } else {
          ci++; charIdx = 0;
          typingTimer = setTimeout(step, 4);
        }
      }
    }
    step();
  }

  function renderPage() {
    if (!currentQuestData) return;
    dlgSpeaker.textContent = currentQuestData.speaker;
    dlgPeriod.textContent  = currentQuestData.period;
    dlgProgress.textContent = (currentPage + 1) + '/' + currentQuestData.pages.length;
    if (typingTimer) clearTimeout(typingTimer);
    typeWriter(currentQuestData.pages[currentPage]);
  }

  function open(quest) {
    state.dialogOpen = true;
    currentQuestData = QUESTS[quest.questId - 1];
    currentPage = 0;
    promptEl.classList.remove('show');
    dialogEl.classList.add('show');
    // Show "[E] DETAIL" hint when this quest has at least one filled project
    const hasVisible = (currentQuestData.projectIds || []).some(id => PROJECTS[id]);
    detailHint.style.display = hasVisible ? '' : 'none';
    renderPage();
  }

  function close(markCleared) {
    state.dialogOpen = false;
    dialogEl.classList.remove('show');
    detailHint.style.display = 'none';
    if (markCleared && state.activeQuest && !state.activeQuest.cleared) {
      state.activeQuest.cleared = true;
      onCleared?.(state.activeQuest.questId);
    }
    currentQuestData = null;
  }

  function nextPage() {
    if (!typingDone) {
      if (typingTimer) clearTimeout(typingTimer);
      dlgText.innerHTML = currentQuestData.pages[currentPage];
      typingDone = true;
      return;
    }
    if (currentPage + 1 < currentQuestData.pages.length) {
      currentPage++;
      renderPage();
    } else {
      close(true);
    }
  }

  function hasVisibleProjects() {
    if (!currentQuestData) return false;
    return (currentQuestData.projectIds || []).some(id => PROJECTS[id]);
  }

  return {
    open,
    nextPage,
    forceClose: (markCleared) => close(markCleared),
    hasVisibleProjects,
  };
}
