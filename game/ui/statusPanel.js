import { state } from '../state.js?v=8';
import { PROFILE } from '../data/profile.js?v=8';

// Status panel — RPG character sheet with 4 tabs.
//   STATUS  — identity, summary, specialty tags, targets, skills bars
//   EDU     — schools / degrees timeline
//   CERTS   — certifications grid
//   AWARDS  — trophy list with tier coloring
//
// Toggle with TAB key (also via #hudStatusBtn click). ESC closes.
// 1-4 number keys jump to specific tab; ←/→ cycle.
export function createStatusPanel() {
  const panelEl = document.getElementById('statusPanel');
  const closeBtn = document.getElementById('statusClose');
  const tabsEl = document.getElementById('statusTabs');
  const contentEl = document.getElementById('statusContent');
  const bannerEl = document.getElementById('statusBanner');
  const aboutBtn = document.getElementById('aboutMeBtn');
  const tipEl    = document.getElementById('statusTip');

  const TABS = [
    { id: 'status',   label: 'STATUS' },
    { id: 'timeline', label: 'TIMELINE', count: PROFILE.timeline.length },
    { id: 'certs',    label: 'CERTS',    count: PROFILE.certifications.length },
    { id: 'awards',   label: 'AWARDS',   count: PROFILE.awards.length },
  ];

  let active = 'status';
  let opened = false;
  let tipDismissed = false;
  let tipShown = false;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderBanner() {
    const { name, nameEn, level, class: cls, company, title, location, specialty } = PROFILE.identity;
    bannerEl.innerHTML = `
      <div class="status-avatar">★</div>
      <div class="status-headline">
        <div class="status-name">
          ${escapeHtml(name)}<span class="name-en">${escapeHtml(nameEn)}</span>
        </div>
        <div class="status-meta">
          <span>${escapeHtml(cls)}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(company)}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(title)}</span>
          ${location ? `<span class="dot">·</span><span>${escapeHtml(location)}</span>` : ''}
        </div>
      </div>
      <div class="status-level">
        LV.${level}
        <small>${escapeHtml(specialty.slice(0, 3).join(' / '))}</small>
      </div>
    `;
  }

  function renderTabs() {
    tabsEl.innerHTML = TABS.map(t => {
      const cls = t.id === active ? 'status-tab active' : 'status-tab';
      const count = t.count != null ? `<span class="tab-count">${t.count}</span>` : '';
      return `<button class="${cls}" data-tab="${t.id}">${t.label}${count}</button>`;
    }).join('');
    tabsEl.querySelectorAll('.status-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        active = btn.dataset.tab;
        renderTabs();
        renderContent();
      });
    });
  }

  function renderContent() {
    if      (active === 'status')   renderStatus();
    else if (active === 'timeline') renderTimeline();
    else if (active === 'certs')    renderCerts();
    else if (active === 'awards')   renderAwards();
    panelEl.scrollTop = 0;
  }

  function renderStatus() {
    const id = PROFILE.identity;

    const skills = PROFILE.skills.map(s => `
      <div class="skill-row">
        <div class="skill-name">${escapeHtml(s.name)}<span class="group-tag">${escapeHtml(s.group)}</span></div>
        <div class="skill-bar"><div class="skill-fill" style="width: ${s.level}%"></div></div>
        <div class="skill-level">${s.level}</div>
      </div>
    `).join('');

    const capabilities = (id.capabilities || []).map(c =>
      `<li>${escapeHtml(c)}</li>`
    ).join('');

    const stackGroups = Object.entries(PROFILE.techStack || {}).map(([label, items]) => `
      <div class="stack-group">
        <span class="stack-group-label">${escapeHtml(label)}</span>
        <div class="stack-group-chips">
          ${items.map(s => `<span class="stack-chip">${escapeHtml(s)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    contentEl.innerHTML = `
      <h3 class="section-h">◆ SUMMARY</h3>
      <div class="status-summary">${escapeHtml(id.summary).replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>')}</div>

      <h3 class="section-h">◆ SPECIALTY</h3>
      <div class="specialty-row">
        ${id.specialty.map(t => `<span class="specialty-tag">${escapeHtml(t)}</span>`).join('')}
      </div>

      ${capabilities ? `
        <h3 class="section-h">◆ CORE CAPABILITIES — 주요 역량</h3>
        <ul class="targets">${capabilities}</ul>
      ` : ''}

      ${id.strengths ? `
        <h3 class="section-h">◆ STRENGTHS — 강점·성장 포인트</h3>
        <div class="status-summary">${escapeHtml(id.strengths)}</div>
      ` : ''}

      <h3 class="section-h">◆ TARGETS — 앞으로의 목표</h3>
      <ul class="targets">
        ${id.targets.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
      </ul>

      <h3 class="section-h">◆ KEY SKILLS</h3>
      <div class="skills-grid">${skills}</div>

      ${stackGroups ? `
        <h3 class="section-h">◆ TECH STACK</h3>
        <div class="stack-list">${stackGroups}</div>
      ` : ''}
    `;
  }

  function renderTimeline() {
    const cards = PROFILE.timeline.map(t => {
      const detailsHtml = t.details && t.details.length
        ? `<ul class="detail-list">${t.details.map(d => `<li>${escapeHtml(d)}</li>`).join('')}</ul>`
        : '';
      const typeCls = (t.type || 'EDU').toLowerCase();
      return `
        <div class="edu-card timeline-${typeCls}">
          <div class="period">
            <span class="type-tag tag-${typeCls}">${escapeHtml(t.type || 'EDU')}</span>
            <span class="period-text">${escapeHtml(t.period)}</span>
          </div>
          <div>
            <div class="institution">${escapeHtml(t.org || '')}</div>
            <div class="degree">${escapeHtml(t.role || '')}</div>
            ${detailsHtml}
          </div>
        </div>
      `;
    }).join('');
    contentEl.innerHTML = `
      <h3 class="section-h">◆ TIMELINE — 시간순 경력</h3>
      <div class="edu-list">${cards}</div>
    `;
  }

  function renderCerts() {
    const cards = PROFILE.certifications.map(c => `
      <div class="cert-card">
        <div class="cert-name">${escapeHtml(c.name)}</div>
        <div class="cert-meta">
          <span>${escapeHtml(c.date)}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(c.issuer)}</span>
        </div>
      </div>
    `).join('');
    contentEl.innerHTML = `
      <h3 class="section-h">◆ CERTIFICATIONS — ${PROFILE.certifications.length}건</h3>
      <div class="cert-grid">${cards}</div>
    `;
  }

  function renderAwards() {
    const cards = PROFILE.awards.map(a => `
      <div class="award-card tier-${a.tier}">
        <span class="award-tier">${a.tier}</span>
        <div class="award-title">${escapeHtml(a.title)}</div>
        <div class="award-meta">
          <span>${escapeHtml(a.date)}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(a.org)}</span>
        </div>
        ${a.project ? `<div class="award-project">▸ ${escapeHtml(a.project)}</div>` : ''}
        ${a.description ? `<div class="award-desc">${escapeHtml(a.description)}</div>` : ''}
      </div>
    `).join('');
    contentEl.innerHTML = `
      <h3 class="section-h">◆ AWARDS — ${PROFILE.awards.length}건</h3>
      <div class="awards-list">${cards}</div>
    `;
  }

  /* ---------------- LIFECYCLE ---------------- */
  function dismissTip() {
    if (tipDismissed || !tipEl) return;
    tipDismissed = true;
    if (tipShown) {
      tipEl.classList.add('fade-out');
      setTimeout(() => { tipEl.classList.remove('show', 'fade-out'); }, 280);
    }
  }

  function open(tabId) {
    if (tabId) active = tabId;
    opened = true;
    state.statusOpen = true;
    panelEl.classList.add('show');
    if (aboutBtn) aboutBtn.style.display = 'none';
    dismissTip();
    renderBanner();
    renderTabs();
    renderContent();
  }

  function close() {
    opened = false;
    state.statusOpen = false;
    panelEl.classList.remove('show');
    if (aboutBtn) aboutBtn.style.display = '';
  }

  function toggle() {
    if (opened) close();
    else open();
  }

  function cycleTab(dir) {
    const idx = TABS.findIndex(t => t.id === active);
    const nextIdx = (idx + dir + TABS.length) % TABS.length;
    active = TABS[nextIdx].id;
    renderTabs();
    renderContent();
  }

  /* ---------------- WIRING ---------------- */
  closeBtn.addEventListener('click', close);
  if (aboutBtn) aboutBtn.addEventListener('click', toggle);

  // Show tip 5s after the game starts (once player is in the world).
  // Dismissed on first open or after 12s of being shown.
  const tipPoll = setInterval(() => {
    if (state.started) {
      clearInterval(tipPoll);
      setTimeout(() => {
        if (tipDismissed || opened || !tipEl) return;
        tipEl.classList.add('show');
        tipShown = true;
        // Auto-fade after 12s if user still hasn't pressed
        setTimeout(() => {
          if (!tipDismissed && tipShown) dismissTip();
        }, 12000);
      }, 5000);
    }
  }, 250);

  document.addEventListener('keydown', (e) => {
    // TAB toggles the panel — works on title screen too so users can preview
    // the about-me content before starting the game.
    if (e.key === 'Tab') {
      if (state.dialogOpen || state.modalOpen) return;
      e.preventDefault();
      toggle();
      return;
    }
    if (!opened) return;
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowRight') {
      cycleTab(1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      cycleTab(-1);
      e.preventDefault();
    } else if (['1','2','3','4'].includes(e.key)) {
      const idx = parseInt(e.key, 10) - 1;
      if (TABS[idx]) {
        active = TABS[idx].id;
        renderTabs();
        renderContent();
      }
    }
  });

  return { open, close, toggle, isOpen: () => opened };
}
