/* ============================================================
   GAMEROCK — injection-sections.js
   Reusable page sections. Any element with a [data-section]
   attribute is replaced with the matching section template.

   Usage on any page:
     <section data-section="categories" data-scope="games"></section>
     <section data-section="latest" data-limit="4"></section>
     <section data-section="related-reads"></section>
     <section data-section="cta"></section>
     <section data-section="stats"></section>

   Depends on: data.js (window.GAMEROCK)
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Root prefix based on page depth ---------- */
  function rootPrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length && parts[parts.length - 1].includes('.')) parts.pop();
    return parts.length ? '../'.repeat(parts.length) : '';
  }
  const PRE = rootPrefix();

  /* ---------- Card template (shared by latest + related reads) ---------- */
  function cardHTML(item, kindLabel) {
    const tags = (item.tags || []).slice(0, 3)
      .map(t => `<span class="tag-chip">${t}</span>`).join('');
    return `
      <article class="card reveal">
        <a class="card-link" href="${PRE}${item.url}">
          <div class="thumb">
            <img src="${PRE}${item.image}" alt="${item.title}" loading="lazy">
            <span class="badge">${kindLabel}</span>
          </div>
          <div class="body">
            <h3 class="title">${item.title}</h3>
            <p class="desc">${item.desc}</p>
            <div class="tag-row">${tags}</div>
            <div class="meta">
              <span>${item.version}</span>
              <span class="ver">${item.price}</span>
            </div>
          </div>
        </a>
      </article>`;
  }

  /* ---------- Section templates ---------- */
  const SECTIONS = {

    /* ===== Explore Categories ===== */
    categories(el) {
      const scope = el.dataset.scope || 'all';

      const gameTiles = [
        { name: 'Action',     desc: 'FPS · Shooters · War',  icon: 'crosshairs',      href: `${PRE}games/action/action.html` },
        { name: 'Racing',     desc: 'Drift · Open World',    icon: 'flag-checkered',  href: `${PRE}games/racing/racing.html` },
        { name: 'Simulation', desc: 'Sandbox · Survival',    icon: 'cubes',           href: `${PRE}games/simulation/simulation.html` },
        { name: 'All Games',  desc: 'Full catalog',          icon: 'gamepad',         href: `${PRE}games/games.html` }
      ];

      const appTiles = [
        { name: 'Tools',    desc: 'Modding · Utilities',  icon: 'screwdriver-wrench', href: `${PRE}apps/game-tools/game-tools.html` },
        { name: 'Media',    desc: 'Music · Movies · TV',  icon: 'photo-film',         href: `${PRE}apps/media/media.html` },
        { name: 'All Apps', desc: 'Full catalog',         icon: 'layer-group',        href: `${PRE}apps/apps.html` }
      ];

      const tiles = scope === 'games' ? gameTiles
                  : scope === 'apps'  ? appTiles
                  : [...gameTiles.slice(0, 3), ...appTiles.slice(0, 3)];

      return `
        <section class="wrap">
          <header class="section-head">
            <div>
              <span class="kicker">// Browse Games</span>
              <h2>Explore Categories</h2>
            </div>
          </header>
          <div class="hud-grid">
            ${tiles.map(t => `
              <div class="hud-tile reveal">
                <span class="hud-ic"><i class="fa-solid fa-${t.icon}"></i></span>
                <h3>${t.name}</h3><p>${t.desc}</p>
                <span class="hud-arrow"><a href="${t.href}">visit <i class="fa-solid fa-arrow-up-right-from-square"></i></a></span>
              </div>
            `).join('')}
          </div>
        </section>`;
    },

    /* ===== Latest Additions ===== */
latest(el) {
  const G = window.GAMEROCK;
  const limit  = parseInt(el.dataset.limit, 10) || 4;
  const scope  = el.dataset.scope || 'all';      // 'games' | 'apps' | 'all'
  const filter = el.dataset.filter;              // 'action' | 'racing' | 'tools' | ...

  // 1. Pick the pool based on scope
  let pool = scope === 'games' ? G.games.slice()
           : scope === 'apps'  ? G.apps.slice()
           : [...G.games, ...G.apps];

  // 2. Narrow by category if requested
  if (filter && filter !== 'all') {
    pool = pool.filter(item => item.category === filter);
  }

  // 3. Newest first, then cap at limit
  const items = pool
    .sort((a, b) => (b.added || '').localeCompare(a.added || ''))
    .slice(0, limit);

  // 4. Where the "See all" link points
  const seeAllHref = filter === 'action'     ? `${PRE}games/action/action.html`
                   : filter === 'racing'     ? `${PRE}games/racing/racing.html`
                   : filter === 'simulation' ? `${PRE}games/simulation/simulation.html`
                   : filter === 'tools'      ? `${PRE}apps/game-tools/game-tools.html`
                   : filter === 'media'      ? `${PRE}apps/media/media.html`
                   : scope === 'games'       ? `${PRE}games/games.html`
                   : scope === 'apps'        ? `${PRE}apps/apps.html`
                   : `${PRE}games/games.html`;

  // 5. Title adjusts to what's being shown
  const title = filter === 'action'     ? 'Latest in Action'
              : filter === 'racing'     ? 'Latest in Racing'
              : filter === 'simulation' ? 'Latest in Simulation'
              : filter === 'tools'      ? 'Latest Tools'
              : filter === 'media'      ? 'Latest Media'
              : scope === 'games'       ? 'Fresh Games'
              : scope === 'apps'        ? 'Fresh Apps'
              : 'Fresh on the Rock';

  return `
    <section class="wrap">
      <header class="section-head">
        <div>
          <span class="kicker">// Latest</span>
          <h2>${title}</h2>
        </div>
        <a class="view-all" href="${seeAllHref}">See all <i class="fa-solid fa-arrow-right"></i></a>
      </header>
      <div class="grid grid-3 parent-cool-border scroll-x">
        ${items.map(i => cardHTML(i, i.kind === 'game' ? 'Game' : 'App')).join('')}
      </div>
    </section>`;
},

    /* ===== Related Reads (blog) ===== */
    'related-reads'(el) {
  const scope = el.dataset.scope || 'all';   // 'games' | 'apps' | 'all'
  const tag   = el.dataset.tag;              // e.g. 'gameloft' — optional

  const ALL_POSTS = [
    {
      url: 'blog/nova2-install-guide.html',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=375&fit=crop&q=80',
      title: 'How to install N.O.V.A 2 on Android 12',
      desc: 'The full step-by-step walkthrough — APK, OBB, virtual machine setup, and the exact folder structure you need.',
      badge: 'Guide', tags: ['tutorial', 'nova', 'gameloft'],
      meta: '5 min read', date: 'Jan 2026'
    },
    {
      url: 'blog/best-modding-tools.html',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=375&fit=crop&q=80',
      title: '5 best Android modding tools in 2026',
      desc: 'GameGuardian, MT Manager, F1 VM, IL2CppDumper and more — what they do, when to use each, and how to combine them.',
      badge: 'Roundup', tags: ['modding', 'tools', 'hacking'],
      meta: '8 min read', date: 'Jan 2026'
    },
    {
      url: 'blog/gameloft-decline.html',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=375&fit=crop&q=80',
      title: 'What happened to Gameloft?',
      desc: 'From N.O.V.A and Asphalt to a shell of its former self — the studio that once ruled mobile gaming, and what went wrong.',
      badge: 'Opinion', tags: ['gameloft', 'industry', 'opinion'],
      meta: '7 min read', date: 'Jan 2026'
    },
    {
      url: 'blog/carx-drift-tips.html',
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=375&fit=crop&q=80',
      title: 'CarX Street: 7 drift tips that work',
      desc: 'Tune your suspension, master the handbrake, and stop losing momentum mid-corner. From rookie to podium.',
      badge: 'Tips', tags: ['racing', 'carx', 'drift'],
      meta: '6 min read', date: 'Dec 2025'
    }
  ];

  // Filter if the page requested a scope or tag
  let posts = ALL_POSTS;
  if (scope === 'games') posts = posts.filter(p => !p.tags.includes('tools') && !p.tags.includes('downloader') && !p.tags.includes('media'));
  if (scope === 'apps')  posts = posts.filter(p => p.tags.includes('tools') || p.tags.includes('downloader') || p.tags.includes('media'));
  if (tag) posts = posts.filter(p => p.tags.includes(tag));

  // Fallback: if nothing matched, show the first 3
  if (!posts.length) posts = ALL_POSTS.slice(0, 3);

  posts = posts.slice(0, 3);

  return `
    <section class="wrap">
      <header class="section-head">
        <div>
          <span class="kicker">// Related Reads</span>
          <h2>From the blog</h2>
        </div>
        <a class="view-all" href="${PRE}blog.html">All articles <i class="fa-solid fa-arrow-right"></i></a>
      </header>
      <div class="grid grid-3 parent-cool-border scroll-x">
        ${posts.map(p => `
          <article class="card reveal">
            <a class="card-link" href="${PRE}${p.url}">
              <div class="thumb">
                <img src="${p.image}" alt="${p.title}" loading="lazy">
                <span class="badge">${p.badge}</span>
              </div>
              <div class="body">
                <h3 class="title">${p.title}</h3>
                <p class="desc">${p.desc}</p>
                <div class="tag-row">
                  ${p.tags.map(t => `<span class="tag-chip">${t}</span>`).join('')}
                </div>
                <div class="meta">
                  <span>${p.meta}</span>
                  <span class="ver">${p.date}</span>
                </div>
              </div>
            </a>
          </article>
        `).join('')}
      </div>
    </section>`;
},

/* ===== Also Try ===== */
'also-try'(el) {
  const G = window.GAMEROCK;
  const limit  = parseInt(el.dataset.limit, 10) || 3;
  const filter = el.dataset.filter;           // e.g. 'action', 'gameloft'
  const scope  = el.dataset.scope || 'games';
  const exclude = el.dataset.exclude;         // slug to hide (e.g. current game)

  // Pool: games or apps
  let pool = scope === 'apps'  ? G.apps.slice()
           : scope === 'games' ? G.games.slice()
           : [...G.games, ...G.apps];

  // Filter by category OR tag
  if (filter && filter !== 'all') {
    pool = pool.filter(item => {
      if (item.category === filter) return true;
      if ((item.tags || []).includes(filter)) return true;
      return false;
    });
  }

  // Exclude the current page's own game (if provided)
  if (exclude) pool = pool.filter(item => item.slug !== exclude);

  // Prefer featured items first, then newest, then title A–Z
  pool.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return (b.added || '').localeCompare(a.added || '');
  });

  const items = pool.slice(0, limit);

  // Optional heading override
  const heading = el.dataset.heading || 'Also try';
  const subheading = el.dataset.subheading || 'More like this';
  const seeAll = el.dataset.seeAll || `${PRE}games/games.html`;

  if (!items.length) return '';

  return `
    <section class="wrap">
      <header class="section-head">
        <div>
          <span class="kicker">// ${heading}</span>
          <h2>${subheading}</h2>
        </div>
        <a class="view-all" href="${seeAll}">See all <i class="fa-solid fa-arrow-right"></i></a>
      </header>
      <div class="grid grid-3 parent-cool-border">
        ${items.map(i => cardHTML(i, i.kind === 'game' ? 'Game' : 'App')).join('')}
      </div>
    </section>`;
},

    /* ===== CTA Panel ===== */
    cta(el) {
      const heading = el.dataset.heading || 'Keep the Rock Alive';
      const text    = el.dataset.text || 'Every download, share and donation keeps GameRock running.<br>You can support us how it fits you and follow our socials.';
      return `
        <section class="wrap">
          <div class="cta-panel reveal">
            <span class="kicker">// Support Us</span>
            <h2>${heading}</h2>
            <p>${text}</p>
            <div class="cta-actions">
              <a class="btn btn-primary" href="#support-toggle">Support Us</a>
              <a class="btn btn-ghost" href="#contact">Contact</a>
            </div>
          </div>
        </section>`;
    },

    /* ===== Stats strip ===== */
    stats() {
      const G = window.GAMEROCK;
      return `
        <div class="hero-stats">
          <div class="hs"><b>${G.games.length}</b><span>Games</span></div>
          <div class="hs"><b>${G.apps.length}</b><span>Apps</span></div>
          <div class="hs"><b>${G.apps.filter(a => a.category === 'tools').length}</b><span>Tools</span></div>
          <div class="hs"><b>100<i>%</i></b><span>Free</span></div>
        </div>`;
    }

  };

  /* ---------- Run injections ---------- */
  function run() {
    if (!window.GAMEROCK) {
      // Data not loaded yet — wait for it
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
      } else {
        setTimeout(run, 0);
      }
      return;
    }

    document.querySelectorAll('[data-section]').forEach(el => {
      const fn = SECTIONS[el.dataset.section];
      if (typeof fn === 'function') {
        el.outerHTML = fn(el);
      } else {
        console.warn('Unknown section:', el.dataset.section);
      }
    });

    // Reveal freshly injected elements
    if (typeof window.GAMEROCK_reveal === 'function') {
      window.GAMEROCK_reveal();
    } else {
      document.querySelectorAll('.reveal:not(.in)').forEach(e => e.classList.add('in'));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();