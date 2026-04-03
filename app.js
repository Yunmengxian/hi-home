// ============================================
// 导航页核心逻辑
// ============================================

(function () {
  'use strict';

  // 从 localStorage 获取密钥解锁状态
  // 密钥 base64 解码
  const secretKey = CONFIG.secretKey ? atob(CONFIG.secretKey) : '';
  let secretRevealed = localStorage.getItem('nav-secret') === 'true';
  
  const cardGrid = document.getElementById('cardGrid');
  const refreshTime = document.getElementById('refreshTime');
  const searchInput = document.getElementById('searchInput');

  async function init() {
    updateTime();
    renderCards();
    searchInput.addEventListener('input', debounceSearch);
  }

  function updateTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    refreshTime.textContent = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} 周${days[now.getDay()]} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function renderCards(filter = '') {
    const frag = document.createDocumentFragment();
    const keyword = filter.toLowerCase().trim();
    
    const showHidden = secretRevealed || keyword === secretKey;

    CONFIG.groups.forEach(group => {
      if (CONFIG.hiddenGroups && CONFIG.hiddenGroups.includes(group.name) && !showHidden) {
        return;
      }
      
      const items = keyword && !showHidden
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
        // 验证 URL 格式，防止 javascript: 伪协议
        let url = item.url;
        if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          url = 'https://' + url;
        }
        
        const card = document.createElement('a');
        card.className = 'nav-card';
        card.href = url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        
        // 转义 HTML 防止 XSS
        const name = item.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const desc = item.desc.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        card.innerHTML = `<div class="card-icon" style="background:${item.color}15;color:${item.color}"><i class="${item.icon}"></i></div><div class="card-info"><div class="card-name">${name}</div><div class="card-desc">${desc}</div></div>`;
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

  let timer;
  function debounceSearch() {
    clearTimeout(timer);
    const keyword = searchInput.value.toLowerCase().trim();
    
    if (keyword === secretKey) {
      secretRevealed = true;
      localStorage.setItem('nav-secret', 'true');
      searchInput.value = '';
      renderCards('');
      return;
    }
    
    timer = setTimeout(() => renderCards(searchInput.value), 200);
  }

  document.getElementById('searchForm').addEventListener('submit', function(e) {
    const keyword = searchInput.value.toLowerCase().trim();
    if (keyword === secretKey) {
      e.preventDefault();
      secretRevealed = true;
      localStorage.setItem('nav-secret', 'true');
      searchInput.value = '';
      renderCards('');
    }
  });

  document.addEventListener('DOMContentLoaded', init);
})();