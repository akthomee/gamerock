/* ============================================================
   GAMEROCK 2.0 — main.js
   Theme, nav, drawer, typing, reveal, count-up, card rendering.
   ============================================================ */

(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- THEME ---------- */
  const THEMES = ['cyberdeck', 'daylight', 'synthwave', 'voltage', 'electric'];
  const THEME_TEXT = {
    cyberdeck: '// v2.0 — CYBERDECK ONLINE',
    daylight:  '// v2.0 — DAYLIGHT MODE',
    synthwave: '// v2.0 — SYNTHWAVE LINKED',
    voltage:   '// v2.0 — VOLTAGE SURGE',
    electric: '// v2.0 — HIGH VOLTAGE'
  };
  const THEME_COLORS = {
    cyberdeck: '#05060a',
    daylight:  '#eef2fa',
    synthwave: '#0a0518',
    voltage:   '#020704',
    electric: '#050810'
  };

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'cyberdeck';
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('gr-theme', theme); } catch (e) {}

    $$('[data-theme-set]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeSet === theme);
    });

    const t = $('[data-theme-text]');
    if (t && THEME_TEXT[theme]) t.textContent = THEME_TEXT[theme];

    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLORS[theme] || '#05060a');
  }

  let saved = 'cyberdeck';
  try { saved = localStorage.getItem('gr-theme') || 'cyberdeck'; } catch (e) {}
  applyTheme(saved);

  const picker = $('#theme-picker');
  const themeBtn = picker && $('.theme-btn', picker);
  if (picker && themeBtn) {
    themeBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = picker.classList.toggle('open');
      themeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('[data-theme-set]').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTheme(btn.dataset.themeSet);
        picker.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', e => {
      if (!picker.contains(e.target)) {
        picker.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        picker.classList.remove('open');
        themeBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- DRAWER ---------- */
  const drawer = $('#drawer');
  const backdrop = $('#drawer-backdrop');
  const menuToggle = $('.menu-toggle');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) { backdrop.hidden = false; requestAnimationFrame(() => backdrop.classList.add('open')); }
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) { backdrop.classList.remove('open'); setTimeout(() => { backdrop.hidden = true; }, 300); }
    document.body.style.overflow = '';
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
  });

  /* ---------- HEADER SEARCH REDIRECT ---------- */
  const headerSearch = $('.header-search');
  if (headerSearch) {
    const input = $('input', headerSearch);
    input && input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q) { e.preventDefault(); location.href = 'search.html?q=' + encodeURIComponent(q); }
      }
    });
  }

  /* ---------- "/" FOCUSES SEARCH ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      const input = $('.header-search input') || $('.search-hero input');
      if (input) { e.preventDefault(); input.focus(); }
    }
  });

  /* ---------- TYPING ---------- */
  const typedEl = $('[data-typed]');
  if (typedEl) {
    try {
      const words = JSON.parse(typedEl.dataset.typed);
      if (Array.isArray(words) && words.length) {
        const target = $('.type-text', typedEl) || typedEl;
        let w = 0, c = 0, deleting = false;
        const SPEED = 65, PAUSE = 1500, ERASE = 32;
        (function tick() {
          const word = words[w];
          target.textContent = word.slice(0, c);
          if (!deleting && c < word.length) { c++; setTimeout(tick, SPEED); }
          else if (deleting && c > 0) { c--; setTimeout(tick, ERASE); }
          else if (!deleting) { deleting = true; setTimeout(tick, PAUSE); }
          else { deleting = false; w = (w + 1) % words.length; setTimeout(tick, 250); }
        })();
      }
    } catch (e) {}
  }

  /* ---------- REVEAL ---------- */
  const revealAll = () => {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal:not(.in)').forEach(el => io.observe(el));
  };
  revealAll();

  /* ---------- COUNT-UP ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const dur = 900;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + '+';
        })(start);
        cio.unobserve(el);
      });
    }, { threshold: .5 });
    counters.forEach(c => cio.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  /* ---------- YEAR ---------- */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- MOTES ---------- */
  const motesWrap = $('#bg-motes');
  if (motesWrap && document.documentElement.getAttribute('data-theme') !== 'daylight') {
    const count = window.innerWidth < 720 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDuration = (12 + Math.random() * 14) + 's';
      s.style.animationDelay = (-Math.random() * 20) + 's';
      s.style.opacity = (0.15 + Math.random() * 0.5).toFixed(2);
      const size = 1 + Math.random() * 2;
      s.style.width = s.style.height = size + 'px';
      motesWrap.appendChild(s);
    }
  }

  /* ---------- CODE RAIN ---------- */
  const rainWrap = $('#bg-rain');
  if (rainWrap) {
    const CHARS = '01アカサタナハマヤラワｱｲｳｴｵ<>{}[]/\\=+*&%$#@!';
    const cols = Math.max(20, Math.floor(window.innerWidth / 28));
    const rows = Math.max(20, Math.floor(window.innerHeight / 22));
    let text = '';
    for (let r = 0; r < rows; r++) {
      let line = '';
      for (let c = 0; c < cols; c++) line += CHARS[Math.floor(Math.random() * CHARS.length)];
      text += line + '\n';
    }
    rainWrap.textContent = text;
    let y = 0;
    (function fall() {
      y = (y + 0.35) % 22;
      rainWrap.style.transform = 'translateY(' + y + 'px)';
      if (document.documentElement.getAttribute('data-theme') === 'voltage') requestAnimationFrame(fall);
    })();
  }

  /* ---------- CARD RENDERING ---------- */
  const D = window.GAMEROCK_DATA;
  if (!D) return;

  function cardHTML(item) {
    const tags = (item.tags || []).slice(0, 3).map(t => `<span class="tag-chip">${t}</span>`).join('');
    return `
      <a class="card reveal" href="${item.url}">
        <div class="thumb">
          <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.style.opacity='0'">
          <span class="badge">${item.kind === 'game' ? 'Game' : 'App'}</span>
        </div>
        <div class="body">
          <h3 class="title">${item.title}</h3>
          <p class="desc">${item.description}</p>
          <div class="tag-row">${tags}</div>
          <div class="meta">
            <span>v${item.version}</span>
            <span class="ver">${item.price}</span>
          </div>
        </div>
      </a>`;
  }

  const featuredGrid = $('#featured-grid');
  if (featuredGrid) {
    featuredGrid.innerHTML = D.games.filter(g => g.featured).slice(0, 6).map(cardHTML).join('');
  }
  const toolsGrid = $('#tools-grid');
  if (toolsGrid) {
    toolsGrid.innerHTML = D.apps.filter(a => a.category === 'tools').slice(0, 4).map(cardHTML).join('');
  }
  const appsGrid = $('#apps-grid');
  if (appsGrid) {
    appsGrid.innerHTML = D.apps.filter(a => a.category === 'media').slice(0, 4).map(cardHTML).join('');
  }

  revealAll();
})();



document.querySelectorAll('.notice-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('support-toggle').checked = false;
    document.body.style.overflow = '';
  });
});

/* ---------- ISOTOPE FILTER (games.html) ---------- */
function bindIsotopeFilter() {
  const filterPills = document.querySelectorAll('.filter-pills .pill');
  const gamesGrid = document.getElementById('gamesGrid');
  const filterSearch = document.getElementById('filterSearch');
  const filterCount = document.getElementById('filterCount');
  const filterEmpty = document.getElementById('filterEmpty');
  const filterReset = document.getElementById('filterReset');

  if (!gamesGrid || !filterPills.length) return;

  const cards = Array.from(gamesGrid.querySelectorAll('.card'));
  let activeCat = 'all';
  let activeQuery = '';

  function applyFilter() {
    const q = activeQuery.toLowerCase().trim();
    let visible = 0;
    cards.forEach(card => {
      const cat = card.dataset.category || '';
      const name = (card.dataset.name || '').toLowerCase();
      const show = (activeCat === 'all' || cat === activeCat) && (!q || name.includes(q));
      card.hidden = !show;
      if (show) visible++;
    });
    const noun = document.body.dataset.page === 'apps' ||
             document.body.dataset.page === 'game-tools' ||
             document.body.dataset.page === 'media'
  ? 'apps' : 'games';
if (filterCount) filterCount.textContent = `Showing ${visible} of ${cards.length} ${noun}`;
    if (filterEmpty) filterEmpty.hidden = visible > 0;
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');
      activeCat = pill.dataset.filter || 'all';
      applyFilter();
    });
  });

  if (filterSearch) {
    filterSearch.addEventListener('input', e => { activeQuery = e.target.value; applyFilter(); });
  }
  if (filterReset) {
    filterReset.addEventListener('click', () => {
      activeCat = 'all'; activeQuery = '';
      if (filterSearch) filterSearch.value = '';
      filterPills.forEach(p => {
        p.classList.toggle('active', p.dataset.filter === 'all');
        p.setAttribute('aria-selected', p.dataset.filter === 'all' ? 'true' : 'false');
      });
      applyFilter();
    });
  }

  function applyFilter() {
  let visible = 0;
  cards.forEach(card => {
    const cat = card.dataset.category || '';
    const haystack = card.dataset.name || '';   // name + tags from render.js
    const catMatch = activeCat === 'all' || cat === activeCat;
    const queryMatch = grFuzzyMatch(activeQuery, haystack);
    const show = catMatch && queryMatch;
    card.hidden = !show;
    if (show) visible++;
  });

  const noun = document.body.dataset.page === 'games' ||
               document.body.dataset.page === 'action' ||
               document.body.dataset.page === 'racing' ||
               document.body.dataset.page === 'simulation' ? 'games' : 'apps';
  if (filterCount) filterCount.textContent = `Showing ${visible} of ${cards.length} ${noun}`;
  if (filterEmpty) filterEmpty.hidden = visible > 0;
}
}

/* Fuzzy match helpers */
function grNormalize(str) {
  return (str || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');
}
function grIsSubsequence(needle, haystack) {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) i++;
  }
  return i === needle.length;
}
function grFuzzyMatch(query, haystack) {
  const q = grNormalize(query);
  const h = grNormalize(haystack);
  if (!q) return true;
  if (h.includes(q)) return true;
  if (q.length >= 4 && grIsSubsequence(q, h)) return true;
  return false;
}

bindIsotopeFilter();
document.addEventListener('gamerock:rendered', bindIsotopeFilter);

  /* ---------- CATEGORY JUMP (scroll to filter + select pill) ---------- */
const jumpTiles = document.querySelectorAll('[data-jump-filter]');
const catalogSection = document.getElementById('catalog');

if (jumpTiles.length && catalogSection && filterPills.length) {
  jumpTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const target = tile.dataset.jumpFilter;

      // 1. Find the matching pill and simulate a click
      const matchingPill = Array.from(filterPills).find(p => p.dataset.filter === target);
      if (matchingPill) matchingPill.click();

      // 2. Scroll the catalog section into view, accounting for the sticky header
      const headerOffset = 80;
      const top = catalogSection.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
