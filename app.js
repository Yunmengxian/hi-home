// 导航页核心逻辑
(function () {
  'use strict';
  var secretKey = CONFIG.secretKey ? atob(CONFIG.secretKey) : '';
  var secretRevealed = localStorage.getItem('nav-secret') === 'true';
  var cardGrid = document.getElementById('cardGrid');
  var refreshTime = document.getElementById('refreshTime');
  var searchInput = document.getElementById('searchInput');

  function updateTime() {
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var days = ['日', '一', '二', '三', '四', '五', '六'];
    refreshTime.textContent = now.getFullYear() + '.' + pad(now.getMonth() + 1) + '.' + pad(now.getDate()) + ' 周' + days[now.getDay()] + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes());
  }

  function renderCards(filter) {
    filter = filter || '';
    var frag = document.createDocumentFragment();
    var keyword = filter.toLowerCase().trim();
    var showHidden = secretRevealed || keyword === secretKey;

    CONFIG.groups.forEach(function (group) {
      if (CONFIG.hiddenGroups && CONFIG.hiddenGroups.indexOf(group.name) !== -1 && !showHidden) { return; }
      var items = keyword && !showHidden ? group.items.filter(function (item) { return item.name.toLowerCase().indexOf(keyword) !== -1 || item.desc.toLowerCase().indexOf(keyword) !== -1; }) : group.items;
      if (!items.length) { return; }

      var section = document.createElement('div');
      section.className = 'group-section';
      var title = document.createElement('div');
      title.className = 'group-title';
      title.innerHTML = '<i class="' + group.icon + '"></i> ' + group.name;
      section.appendChild(title);

      var grid = document.createElement('div');
      grid.className = 'card-row';

      items.forEach(function (item) {
        var url = item.url;
        if (url && url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0 && url.indexOf('/') !== 0) { url = 'https://' + url; }
        var card = document.createElement('a');
        card.className = 'nav-card';
        card.href = url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        var name = item.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var desc = item.desc.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        var iconHtml = item.icon.indexOf('http') === 0 || item.icon.indexOf('//') === 0 ? '<img src="' + item.icon + '" style="width:60%;height:60%;object-fit:contain">' : '<i class="' + item.icon + '"></i>';
        card.innerHTML = '<div class="card-icon" style="background:' + item.color + '15;color:' + item.color + '">' + iconHtml + '</div><div class="card-info"><div class="card-name">' + name + '</div><div class="card-desc">' + desc + '</div></div>';
        grid.appendChild(card);
      });

      section.appendChild(grid);
      frag.appendChild(section);
    });

    cardGrid.innerHTML = '';
    if (frag.children.length) { cardGrid.appendChild(frag); } 
    else { cardGrid.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:60px 0;font-size:14px">没有找到匹配的应用</div>'; }
  }

  var timer;
  function debounceSearch() {
    clearTimeout(timer);
    var keyword = searchInput.value.toLowerCase().trim();
    if (keyword === secretKey) { secretRevealed = true; localStorage.setItem('nav-secret', 'true'); searchInput.value = ''; renderCards(''); return; }
    timer = setTimeout(function () { renderCards(searchInput.value); }, 200);
  }

  document.getElementById('searchForm').addEventListener('submit', function (e) {
    var keyword = searchInput.value.toLowerCase().trim();
    if (keyword === secretKey) { e.preventDefault(); secretRevealed = true; localStorage.setItem('nav-secret', 'true'); searchInput.value = ''; renderCards(''); }
  });

  searchInput.addEventListener('input', debounceSearch);

  // 修复 iOS Safari 输入框缩放后无法复原
  searchInput.addEventListener('blur', function () {
    setTimeout(function () {
      if (document.activeElement !== searchInput) {
        document.documentElement.style.zoom = '';
        var scrollY = window.scrollY;
        window.scrollTo(0, scrollY);
      }
    }, 100);
  });

  document.addEventListener('DOMContentLoaded', function () { updateTime(); renderCards(''); });
})();