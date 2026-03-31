// ============================================
// 导航页核心逻辑（性能优化版）
// ============================================

(function () {
  'use strict';

  let currentMode = CONFIG.defaultMode;
  const cardGrid = document.getElementById('cardGrid');
  const modeBtn = document.getElementById('modeBtn');
  const currentModeEl = document.getElementById('currentMode');
  const refreshTime = document.getElementById('refreshTime');
  const searchInput = document.getElementById('searchInput');

  // 使用 DocumentFragment 批量渲染，减少重排
  async function init() {
    updateTime();
    detectNetwork();
    renderCards();
    updateModeUI();
    modeBtn.addEventListener('click', toggleMode);
    searchInput.addEventListener('input', debounceSearch);
  }

  function updateTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    refreshTime.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} 周${days[now.getDay()]} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  async function detectNetwork() {
    if (CONFIG.detectMode === 'manual') return;

    if (CONFIG.detectMode === 'ip') {
      try {
        const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
        const data = await res.json();
        const isInternal = CONFIG.internalIPs.some(p => data.ip.startsWith(p));
        currentMode = isInternal ? 'internal' : 'external';
      } catch {
        currentMode = CONFIG.defaultMode;
      }
    }

    if (CONFIG.detectMode === 'ping') {
      const ctrl = new AbortController();
      const tid = setTimeout(() => ctrl.abort(), 2000);
      fetch(CONFIG.pingTarget, { mode: 'no-cors', signal: ctrl.signal })
        .then(() => { clearTimeout(tid); currentMode = 'internal'; })
        .catch(() => { clearTimeout(tid); currentMode = 'external'; })
        .finally(() => updateModeUI());
    }
  }

  function renderCards(filter = '') {
    const frag = document.createDocumentFragment();
    const keyword = filter.toLowerCase().trim();

    CONFIG.groups.forEach(group => {
      const items = keyword
        ? group.items.filter(i => i.name.toLowerCase().includes(keyword) || i.desc.toLowerCase().includes(keyword))
        : group.items;
      if (!items.length) return;

      const section = document.createElement('div');
      section.className = 'group-section';

      const title = document.createElement('div');
      title.className = 'group-title';
      title.innerHTML = `<i class="${group.icon}"></i> ${group.name}`;
      section.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'card-row';

      items.forEach(item => {
        const url = item.isExternalOnly ? item.external : (currentMode === 'internal' ? item.internal : item.external);
        const card = document.createElement('a');
        card.className = 'nav-card';
        card.href = url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.style.setProperty('--c', item.color);

        card.innerHTML = `<div class="card-icon" style="background:${item.color}15;color:${item.color}"><i class="${item.icon}"></i></div><div class="card-info"><div class="card-name">${item.name}</div><div class="card-desc">${item.desc}</div></div>`;
        grid.appendChild(card);
      });

      section.appendChild(grid);
      frag.appendChild(section);
    });

    cardGrid.innerHTML = '';
    if (frag.children.length) {
      cardGrid.appendChild(frag);
    } else {
      cardGrid.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:60px 0;font-size:14px">没有找到匹配的应用</div>';
    }
  }

  function toggleMode() {
    currentMode = currentMode === 'internal' ? 'external' : 'internal';
    updateModeUI();
    renderCards(searchInput.value);
  }

  function updateModeUI() {
    currentModeEl.textContent = currentMode === 'internal' ? '内网模式' : '外网模式';
    currentModeEl.className = 'status-badge ' + (currentMode === 'internal' ? 'status-internal' : 'status-external');
  }

  // 防抖
  let timer;
  function debounceSearch() {
    clearTimeout(timer);
    timer = setTimeout(() => renderCards(searchInput.value), 200);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
