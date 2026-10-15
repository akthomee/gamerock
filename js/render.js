/* ============================================================
   GAMEROCK — render.js
   Reads window.GAMEROCK (from data.js) and fills any element
   with a [data-render] attribute with matching cards.

   Usage on any page:
     <div class="grid grid-3" data-render="games"></div>
     <div class="grid grid-3" data-render="games" data-filter="action"></div>
     <div class="grid grid-3" data-render="all"   data-limit="6"></div>
     <div class="grid grid-3" data-render="featured"></div>

   Prefixes image and url paths based on the page's depth from
   root, so the same data works from any page.
   ============================================================ */

(function () {
  'use strict';

  if (!window.GAMEROCK) {
    console.warn('render.js: data.js not loaded');
    return;
  }

  /* ---------- Determine how deep this page is from root ---------- */
  /* pages at root → '' ; pages in games/ → '../' ; games/action/ → '../../' */
  function rootPrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length && parts[parts.length - 1].includes('.')) parts.pop();
    return parts.length ? '../'.repeat(parts.length) : '';
  }
  const PRE = rootPrefix();

  /* ---------- Build one card's HTML ---------- */
function cardHTML(item) {
  const tags = (item.tags || []).slice(0, 3)
    .map(t => `<span class="tag-chip">${t}</span>`).join('');
  const kindLabel = item.kind === 'game' ? 'Game' : 'App';

  // Fuzzy-search haystack: title + full tag list + category, all lowercased.
  // Spaces are preserved so word-boundary matches work for multi-word titles.
  const haystack = [
    item.title,
    (item.tags || []).join(' '),
    item.category
  ].join(' ').toLowerCase();

  return `
    <article class="card reveal"
             data-category="${item.category}"
             data-name="${haystack}">
      <a class="card-link" href="${PRE}${item.url}">
        <div class="thumb">
          <img src="${PRE}${item.image}" alt="${item.title}" loading="lazy" />
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

  /* ---------- Figure out which items to show for a given element ---------- */
  function pickItems(el) {
    const G = window.GAMEROCK;
    const kind   = el.dataset.render;        // 'games' | 'apps' | 'all' | 'featured'
    const filter = el.dataset.filter;        // category slug or undefined
    const limit  = parseInt(el.dataset.limit, 10) || 999;

    let list;

    if (kind === 'all') {
      list = [...G.games, ...G.apps];
    } else if (kind === 'featured') {
      list = [...G.games, ...G.apps].filter(i => i.featured);
    } else if (kind === 'games') {
      list = G.games.slice();
    } else if (kind === 'apps') {
      list = G.apps.slice();
    } else {
      list = [];
    }

    if (filter && filter !== 'all') {
      list = list.filter(i => i.category === filter);
    }

    // newest first when the "latest" flag is set
    if (el.dataset.sort === 'newest') {
      list.sort((a, b) => (b.added || '').localeCompare(a.added || ''));
    }

    return list.slice(0, limit);
  }

  /* ---------- Render all [data-render] elements on the page ---------- */
  function renderAll() {
    document.querySelectorAll('[data-render]').forEach(el => {
      const items = pickItems(el);
      el.innerHTML = items.map(cardHTML).join('');
    });

    // Re-run reveal observer if main.js exposes it
    if (typeof window.GAMEROCK_reveal === 'function') {
      window.GAMEROCK_reveal();
    } else {
      // Fallback: just show them
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    }

    // Notify the page that cards have been injected
document.dispatchEvent(new CustomEvent('gamerock:rendered'));
  }

  /* ---------- Auto-run on DOM ready ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }

  /* Auto-update the page-head-stat number based on the current page */
(function updateHeadCounts() {
  const G = window.GAMEROCK;
  if (!G) return;

  const page = document.body.dataset.page || '';
  const gamesByCat = c => G.games.filter(g => g.category === c).length;
  const appsByCat  = c => G.apps.filter(a => a.category === c).length;

  const counts = {
    'home':         G.games.length,
    'games':        G.games.length,
    'action':       gamesByCat('action'),
    'racing':       gamesByCat('racing'),
    'simulation':   gamesByCat('simulation'),
    'apps':         G.apps.length,
    'game-tools':   appsByCat('tools'),
    'media':        appsByCat('media')
  };

  const number = document.querySelector('.page-head-stat b');
  if (!number || !(page in counts)) return;

  number.textContent = counts[page];
})();

  /* ---------- Expose for use by search page etc. ---------- */
  window.GAMEROCK_render = renderAll;
  window.GAMEROCK_cardHTML = cardHTML;
})();