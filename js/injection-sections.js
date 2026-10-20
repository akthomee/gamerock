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
    const tags = (item.tags || [])
      .map(t => `<span class="tag-chip">${t}</span>`).join('');
    return `
      <article class="card reveal">
        <a class="card-link" href="${PRE}${item.url}">
          <div class="thumb">
            <img src="${item.image.startsWith('http') ? item.image : PRE + item.image}" alt="${item.title}" loading="lazy">
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
        { name: 'Game-Tools',    desc: 'Modding · Utilities',  icon: 'screwdriver-wrench', href: `${PRE}apps/game-tools/game-tools.html` },
        { name: 'Media',    desc: 'Music · Movies · TV',  icon: 'photo-film',         href: `${PRE}apps/media/media.html` },
        { name: 'All Apps', desc: 'Full catalog',         icon: 'layer-group',        href: `${PRE}apps/apps.html` }
      ];

      const tiles = scope === 'games' ? gameTiles
                  : scope === 'apps'  ? appTiles
                  : [...gameTiles, ...appTiles];

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
      url: 'blog/what-kind-of-game-is-minecraft.html',
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&h=375&fit=crop&q=80',
      title: 'What Kind of Game is Minecraft? (And Why is it So Addictive?)',
      desc: 'It has no quests, no objective, and looks like Lego. So why do people lose thousands of hours to Minecraft? We break down the psychology of the sandbox.',
      badge: 'Analysis', tags: ['minecraft', 'sandbox', 'survival', 'psychology', 'game-design', 'mojang', 'opinion', 'addictive'],
      meta: '7 min read', date: '26-10-19'
    },
    {
      url: 'blog/nova-saga-comparison.html',
      image: 'images/nova3-image-1.jpg',
      title: 'N.O.V.A. 3 vs 2 vs Legacy: Which One Should You Play?',
      desc: 'A deep dive comparing N.O.V.A. 3, N.O.V.A. 2, and N.O.V.A. Legacy. We break down the pros and cons of each game to help you decide which to play first.',
      badge: 'Comparison', tags: ['nova', 'gameloft', 'fps', 'sci-fi', 'review', 'comparison', 'action', 'shooter'],
      meta: '7 min read', date: '26-10-19'
    },
    {
      url: 'blog/what-is-an-obb-file-android.html',
      image: 'https://images.unsplash.com/photo-1618044733300-9472054094ee?w=600&h=375&fit=crop&q=80',
      title: 'What is an OBB File? (And Why Android Games Need Them)',
      desc: 'If you have ever tried to install an APK and got stuck looking for an OBB, this guide is for you. We explain what OBB files are, how to extract them, and where to place them.',
      badge: 'Guide', tags: ['tutorial', 'android', 'tools', 'obb', 'apk', 'file-management', 'modding', 'guide'],
      meta: '5 min read', date: '26-10-20'
    },
    {
      url: 'blog/forgotten-offline-games-android.html',
      image: 'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600&h=375&fit=crop&q=80',
      title: '5 Forgotten Offline Games You Can Still Play on Android',
      desc: 'No internet? No problem. These 5 classic single-player games were removed from the Play Store, but you can still play them today with zero ads.',
      badge: 'Roundup', tags: ['games', 'offline', 'retro', 'classic', 'android', 'roundup', 'nostalgia', 'preservation'],
      meta: '6 min read', date: '26-10-20'
    },
    {
      url: 'blog/best-game-hacking-tools-2026.html',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=375&fit=crop&q=80',
      title: '5 Best Game Hacking Tools for Android in 2026',
      desc: 'From memory editors to virtual machines. We rank the absolute best tools for modding Android games right now, and explain what each one is used for.',
      badge: 'Roundup', tags: ['modding', 'tools', 'hacking', 'gameguardian', 'vphoneos', 'root', 'android', 'roundup', 'cheats'],
      meta: '8 min read', date: '26-10-20'
    },
    {
      url: 'blog/old-gameloft-games-hit-different.html',
      image: 'https://media.pocketgamer.biz/images/65205/66698/vivendi-gameloft_s470.jpg',
      title: 'Why Old Gameloft Games Hit Different',
      desc: 'Nostalgia, console-level ambition, and no microtransactions. An editorial on why the classic Gameloft era still feels better than modern games.',
      badge: 'Editorial', tags: ['gameloft', 'industry', 'opinion', 'nostalgia', 'editorial', 'classic', 'mobile-gaming', 'retro'],
      meta: '5 min read', date: '26-10-19'
    },
    {
      url: 'blog/fix-app-not-installed-android-14.html',
      image: 'images/gg-image-1.jpg',
      title: "Fixing 'App Not Installed' on Android 14 & 15",
      desc: 'Getting the "App not installed" error when trying to run older games? Here is why Android 14+ blocks 32-bit apps, and the exact way to bypass it.',
      badge: 'Guide', tags: ['tutorial', 'android', 'tools', 'troubleshooting', '32-bit', 'vphoneos', 'emulator', 'fix'],
      meta: '6 min read', date: '26-10-20'
    },
    {
      url: 'blog/top-5-offline-fps-android.html',
      image: 'images/nova3-image-1.jpg',
      title: 'Top 5 Offline FPS Games for Android (No Wi-Fi Required)',
      desc: 'Tired of lag and ads? Here are the 5 best first-person shooters you can play completely offline on Android, no internet required.',
      badge: 'Roundup', tags: ['fps', 'offline', 'action', 'shooter', 'nova', 'gameloft', 'roundup', 'single-player'],
      meta: '7 min read', date: '26-10-19'
    },
    {
      url: 'blog/gameloft-google-play-asset-delivery.html',
      image: 'https://developer.android.com/static/images/cards/distribute/stories/gameloft-asphalt8.jpg',
      title: 'Gameloft acquires 10% more new users with Google Play Asset Delivery',
      desc: 'How Gameloft used PAD to ditch the old APK + OBB system, cut CDN costs, and boost user retention by 10% across Asphalt 8 and Minion Rush.',
      badge: 'Industry', tags: ['gameloft', 'google', 'industry', 'asset-delivery', 'obb', 'news', 'android', 'development'],
      meta: '6 min read', date: '26-10-19'
    },
    {
      url: 'blog/nova3-install-guide.html',
      image: 'images/nova3-image-1.jpg',
      title: 'How to install N.O.V.A 3 on Android 12',
      desc: 'The complete walkthrough — APK download, virtual machine setup, and the automatic 2 GB asset fetch explained step by step.',
      badge: 'Guide', tags: ['tutorial', 'nova', 'gameloft', 'install', 'android', 'fps', 'vphoneos', 'guide', 'action'],
      meta: '7 min read', date: '2026-01-20'
    },
    {
      url: 'blog/nova2-install-guide.html',
      image: 'images/nova2-image-1.jpg',
      title: 'How to install N.O.V.A 2 on Android 12',
      desc: 'The full step-by-step walkthrough — APK, OBB, virtual machine setup, and the exact folder structure you need.',
      badge: 'Guide', tags: ['tutorial', 'nova', 'gameloft', 'install', 'android', 'fps', 'obb', 'guide', 'action'],
      meta: '5 min read', date: '2026-01-18'
    },
    {
      url: 'blog/best-modding-tools.html',
      image: 'https://androidayuda.com/wp-content/uploads/2025/12/Modding-de-juegos-en-Android-guia-completa-herramientas-y-riesgos-1.jpg',
      title: '5 best Android modding tools in 2026',
      desc: 'GameGuardian, MT Manager, F1 VM, IL2CppDumper and more — what they do, when to use each, and how to combine them.',
      badge: 'Roundup', tags: ['modding', 'tools', 'hacking', 'gameguardian', 'mt-manager', 'f1vm', 'android', 'roundup'],
      meta: '8 min read', date: '2026-01-15'
    },
    {
      url: 'blog/gameloft-decline.html',
      image: 'https://media.pocketgamer.biz/images/65205/66698/vivendi-gameloft_s470.jpg',
      title: 'What happened to Gameloft?',
      desc: 'From N.O.V.A and Asphalt to a shell of its former self — the studio that once ruled mobile gaming, and what went wrong.',
      badge: 'Opinion', tags: ['gameloft', 'industry', 'opinion', 'history', 'mobile-gaming', 'vivendi', 'editorial', 'decline'],
      meta: '7 min read', date: '2026-01-12'
    },
    {
      url: 'blog/carx-drift-tips.html',
      image: 'https://play-lh.googleusercontent.com/qB69goUYYHNjsxajVE7VmbQrNY0GMRqgYGfsbBn03u91GOylKSJulwlBPSjU9bxKQgfxbm9L6I3B02J6mIEgaAM=w526-h296-rw',
      title: 'CarX Street: 7 drift tips that work',
      desc: 'Tune your suspension, master the handbrake, and stop losing momentum mid-corner. From rookie to podium.',
      badge: 'Tips', tags: ['racing', 'carx', 'drift', 'tips', 'tutorial', 'android', 'carx-street', 'guide'],
      meta: '6 min read', date: '2025-12-28'
    }
  ];

  // Filter if the page requested a scope or tag
  let posts = ALL_POSTS;

  // Custom override for scope="all"
  if (scope === 'all') {
      return `
    <section class="wrap">
      <header class="section-head">
        <div>
          <span class="kicker">// All posts</span>
          <h2>From the blog</h2>
        </div>
        <a class="view-all" href="${PRE}blog/blog.html">See all <i class="fa-solid fa-arrow-right"></i></a>
      </header>
      <div class="grid grid-3 parent-cool-border scroll-x">
        ${posts.map(p => `
          <article class="card reveal">
            <a class="card-link" href="${PRE}${p.url}">
              <div class="thumb">
                <img src="${p.image.startsWith('http') ? p.image : PRE + p.image}" alt="${p.title}" loading="lazy">
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
  }

  if (scope === 'games') posts = posts.filter(p => !p.tags.includes('tools') && !p.tags.includes('downloader') && !p.tags.includes('media'));
  if (scope === 'apps')  posts = posts.filter(p => p.tags.includes('tools') || p.tags.includes('downloader') || p.tags.includes('media'));
  if (tag) posts = posts.filter(p => p.tags.includes(tag));

  // Fallback: if nothing matched, show the first 3
  if (!posts.length) posts = ALL_POSTS.slice(0, 3);

  posts = posts.slice().sort(() => Math.random() - 0.5).slice(0, 3);

  return `
    <section class="wrap">
      <header class="section-head">
        <div>
          <span class="kicker">// Related Reads</span>
          <h2>From the blog</h2>
        </div>
        <a class="view-all" href="${PRE}blog/blog.html">All articles <i class="fa-solid fa-arrow-right"></i></a>
      </header>
      <div class="grid grid-3 parent-cool-border scroll-x">
        ${posts.map(p => `
          <article class="card reveal">
            <a class="card-link" href="${PRE}${p.url}">
              <div class="thumb">
                <img src="${p.image.startsWith('http') ? p.image : PRE + p.image}" alt="${p.title}" loading="lazy">
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

  // 1. Shuffle the entire pool FIRST
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

       // Filter by multiple categories AND tags (requires at least 70% match)
  if (filter && filter !== 'all') {
    const filters = filter.split(',').map(f => f.trim());
    
    pool = pool.filter(item => {
      let matchCount = 0;
      
      // Count how many filters this game matches
      filters.forEach(f => {
        if (item.category === f || (item.tags || []).includes(f)) {
          matchCount++;
        }
      });
      
      // Calculate percentage (e.g., 2 out of 3 = 66%)
      const matchPercentage = matchCount / filters.length;
      
      // Keep the game if it matches at least 70%
      return matchPercentage >= 0.7;
    });

    
  }

  // Exclude the current page's own game (if provided)
  if (exclude) pool = pool.filter(item => item.slug !== exclude);

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
          <div class="hs"><b>${G.apps.filter(a => a.category === 'tools').length}</b><span>Game-Tools</span></div>
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