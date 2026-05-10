import { state } from '../state.js?v=8';
import { PROJECTS } from '../data/projects.js?v=8';

// Two-view modal:
//   'grid'   — landing card grid for the current quest
//   'detail' — single project page with tab strip + pager
//
// Keyboard:
//   ESC       — close (or close lightbox if open)
//   ←/→       — prev/next project (detail view only)
//   Backspace — back to grid (detail view only)
export function createProjectModal() {
  const modalEl        = document.getElementById('projectModal');
  const contentEl      = document.getElementById('modalContent');
  const gridHeaderEl   = document.getElementById('modalGridHeader');
  const detailHeaderEl = document.getElementById('modalDetailHeader');
  const gridTitleEl    = document.getElementById('gridTitle');
  const tabsEl         = document.getElementById('modalTabs');
  const counterEl      = document.getElementById('modalCounter');
  const prevBtn        = document.getElementById('modalPrev');
  const nextBtn        = document.getElementById('modalNext');
  const backBtn        = document.getElementById('backToGrid');
  const closeBtn       = document.getElementById('modalClose');
  const lightboxEl     = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightboxImg');

  let visibleIds  = [];      // project ids that exist in PROJECTS for current quest
  let cursor      = 0;       // index in visibleIds (detail view)
  let questLabel  = '';
  let view        = 'grid';  // 'grid' | 'detail'
  let opened      = false;
  let mermaidCounter = 0;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ----------------- GRID VIEW ----------------- */
  function renderGrid() {
    gridHeaderEl.style.display   = '';
    detailHeaderEl.style.display = 'none';
    gridTitleEl.textContent = `★ ${questLabel}  ·  ${visibleIds.length} PROJECT${visibleIds.length === 1 ? '' : 'S'}`;

    contentEl.innerHTML = `
      <div class="proj-card-grid">
        ${visibleIds.map((id, i) => {
          const p = PROJECTS[id];
          if (!p) return '';
          const primaryKpi = (p.kpis && p.kpis[0]) || null;
          return `
            <button class="proj-card" data-idx="${i}">
              <span class="proj-card-code">${escapeHtml(p.code)}</span>
              <span class="proj-card-title">${escapeHtml(p.title)}</span>
              ${p.summary ? `<span class="proj-card-summary">${escapeHtml(p.summary)}</span>` : ''}
              ${primaryKpi ? `<span class="proj-card-kpi">${escapeHtml(primaryKpi.label)} <b>${escapeHtml(primaryKpi.value)}</b></span>` : ''}
              <span class="proj-card-period">${escapeHtml(p.period || '')}</span>
              <span class="proj-card-go">VIEW DETAIL ›</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    contentEl.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('click', () => {
        cursor = parseInt(card.dataset.idx, 10);
        view = 'detail';
        render();
      });
    });

    modalEl.scrollTop = 0;
  }

  /* ----------------- DETAIL VIEW ----------------- */
  function renderTabs() {
    tabsEl.innerHTML = visibleIds.map((id, i) => {
      const p = PROJECTS[id];
      const cls = i === cursor ? 'proj-tab active' : 'proj-tab';
      const label = p ? p.code : id;
      const tip = p ? `${p.code} — ${p.title}` : id;
      return `<button class="${cls}" data-idx="${i}" title="${escapeHtml(tip)}">${escapeHtml(label)}</button>`;
    }).join('');
    tabsEl.querySelectorAll('.proj-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        cursor = parseInt(tab.dataset.idx, 10);
        renderDetail();
      });
    });

    // Scroll active tab into view (when there are many tabs)
    const active = tabsEl.querySelector('.proj-tab.active');
    if (active && active.scrollIntoView) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function renderDetail() {
    gridHeaderEl.style.display   = 'none';
    detailHeaderEl.style.display = '';

    // Hide back button when only one project (no list to go back to)
    backBtn.style.visibility = visibleIds.length > 1 ? 'visible' : 'hidden';

    renderTabs();

    counterEl.textContent = `${cursor + 1} / ${visibleIds.length}`;
    prevBtn.disabled = cursor === 0;
    nextBtn.disabled = cursor === visibleIds.length - 1;

    const id = visibleIds[cursor];
    const p  = PROJECTS[id];
    if (!p) {
      contentEl.innerHTML = '<p style="font-family:Galmuri11; padding:40px; text-align:center;">상세 자료가 아직 준비되지 않았어요.</p>';
      return;
    }

    const kpis = (p.kpis || []).map(k => `
      <div class="proj-kpi">
        <span class="v">${escapeHtml(k.value)}</span>
        <span class="l">${escapeHtml(k.label)}</span>
        ${k.hint ? `<span class="h">${escapeHtml(k.hint)}</span>` : ''}
      </div>`).join('');

    const stack = (p.stack || []).map(s =>
      `<span class="badge">${escapeHtml(s)}</span>`
    ).join('');

    const sections = (p.sections || []).map(s => `
      <div class="proj-section">
        <h3>${escapeHtml(s.heading)}</h3>
        <p>${escapeHtml(s.body).replace(/\n/g, '<br>')}</p>
      </div>`).join('');

    const gallery = (p.images || []).length === 0 ? '' : `
      <h4 class="proj-h">◆ SCREENSHOTS</h4>
      <div class="proj-gallery">
        ${p.images.map(img => `
          <figure>
            <img src="${encodeURI(img.src)}" alt="${escapeHtml(img.caption || '')}" loading="lazy" data-zoom>
            <figcaption>${escapeHtml(img.caption || '')}</figcaption>
          </figure>`).join('')}
      </div>`;

    const mermaidId = `mer-${++mermaidCounter}`;
    const mermaidBlock = p.mermaid ? `
      <div class="proj-mermaid">
        <pre class="mermaid" id="${mermaidId}">${escapeHtml(p.mermaid)}</pre>
      </div>` : '';

    const links = (p.links || []).length === 0 ? '' : `
      <h4 class="proj-h">◆ LINKS</h4>
      <div class="proj-stack">
        ${p.links.map(l => `<a class="badge" href="${encodeURI(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)} ↗</a>`).join('')}
      </div>`;

    contentEl.innerHTML = `
      <header class="proj-hero">
        <span class="proj-code">${escapeHtml(p.code)}</span>
        <h2 class="proj-title">${escapeHtml(p.title)}</h2>
        <div class="proj-meta">
          <span>${escapeHtml(p.company || '')}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(p.period || '')}</span>
          ${p.role ? `<span class="dot">·</span><span>${escapeHtml(p.role)}</span>` : ''}
        </div>
        ${p.summary ? `<p class="proj-summary">${escapeHtml(p.summary)}</p>` : ''}
      </header>

      ${kpis ? `<div class="proj-kpis">${kpis}</div>` : ''}

      ${stack ? `<h4 class="proj-h">◆ TECH STACK</h4><div class="proj-stack">${stack}</div>` : ''}

      ${sections ? `<h4 class="proj-h">◆ DETAILS</h4><div class="proj-sections">${sections}</div>` : ''}

      ${mermaidBlock}

      ${gallery}

      ${links}
    `;

    if (p.mermaid && window.mermaid) {
      try {
        window.mermaid.run({ querySelector: `#${mermaidId}` });
      } catch (e) {
        console.warn('mermaid render failed', e);
      }
    }

    contentEl.querySelectorAll('img[data-zoom]').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxEl.classList.add('show');
      });
    });

    modalEl.scrollTop = 0;
  }

  function render() {
    if (view === 'grid') renderGrid();
    else renderDetail();
  }

  /* ----------------- LIFECYCLE ----------------- */
  function open(quest) {
    if (!quest || !quest.projectIds) return;
    visibleIds = quest.projectIds.filter(id => PROJECTS[id]);
    if (visibleIds.length === 0) return;
    cursor = 0;
    questLabel = quest.key || '';
    // Single project? Skip grid landing.
    view = visibleIds.length === 1 ? 'detail' : 'grid';
    opened = true;
    state.modalOpen = true;
    modalEl.classList.add('show');
    render();
  }

  function close() {
    opened = false;
    state.modalOpen = false;
    modalEl.classList.remove('show');
    lightboxEl.classList.remove('show');
  }

  function next() {
    if (view !== 'detail') return;
    if (cursor < visibleIds.length - 1) { cursor++; renderDetail(); }
  }
  function prev() {
    if (view !== 'detail') return;
    if (cursor > 0) { cursor--; renderDetail(); }
  }
  function goToGrid() {
    if (visibleIds.length <= 1) return;
    view = 'grid';
    renderGrid();
  }

  /* ----------------- WIRING ----------------- */
  closeBtn.addEventListener('click', close);
  backBtn.addEventListener('click', goToGrid);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (!opened) return;
    if (e.key === 'Escape') {
      if (lightboxEl.classList.contains('show')) {
        lightboxEl.classList.remove('show');
      } else {
        close();
      }
      return;
    }
    if (view === 'detail') {
      if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
      else if (e.key === 'ArrowLeft')  { prev(); e.preventDefault(); }
      else if (e.key === 'Backspace')  { goToGrid(); e.preventDefault(); }
    }
  });

  lightboxEl.addEventListener('click', () => lightboxEl.classList.remove('show'));

  return { open, close, isOpen: () => opened };
}
