/* ============================================================
   GAMEROCK — search.js
   Reads URL params and renders matching cards. No HTML changes
   required — creates its own container inside <main id="main">.
   ============================================================ */

(function () {
  'use strict';

  if (!window.GAMEROCK) {
    console.warn('search.js: data.js not loaded');
    return;
  }

  /* ---------- Path depth from root ---------- */
  function rootPrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length && parts[parts.length - 1].includes('.')) parts.pop();
    return parts.length ? '../'.repeat(parts.length) : '';
  }
  const PRE = rootPrefix();

  /* ---------- Read query params ---------- */
  const params = new URLSearchParams(location.search);
  const query = (params.get('q') || '').trim();
  const mode  = (params.get('mode') || 'name').toLowerCase();   // 'name' | 'tag'
  const scope = (params.get('scope') || 'all').toLowerCase();   // 'all' | 'games' | 'apps'

  /* ---------- Score an item against a query ---------- */
  /* ---------- Normalize ---------- */
function normalize(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');  // keep only letters + digits
}

/* ---------- Subsequence check (letters appear in order somewhere) ---------- */
function isSubsequence(needle, haystack) {
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (haystack[j] === needle[i]) i++;
  }
  return i === needle.length;
}

/* ---------- Score an item against a query ---------- */
function score(item, rawQuery) {
  if (!rawQuery) return 0;

  const q = normalize(rawQuery);
  if (!q) return 0;

  const title = normalize(item.title);
  const tags  = (item.tags || []).map(normalize);
  const desc  = normalize(item.desc);
  const cat   = normalize(item.category);

  let total = 0;

  /* ----- TAG MODE: match tags first ----- */
  if (mode === 'tag') {
    tags.forEach(t => {
      if (t === q) total += 120;
      else if (t.startsWith(q)) total += 80;
      else if (t.includes(q)) total += 40;
    });
    if (cat.includes(q)) total += 25;
    if (title.includes(q)) total += 15;
    return total;
  }

  /* ----- NAME MODE: match against title (then tags as tiebreaker) ----- */

  // 1. Exact title match
  if (title === q) total += 200;

  // 2. Title starts with query
  else if (title.startsWith(q)) total += 120;

  // 3. Word-boundary match: query matches the start of any "word" in the title
  //    Word boundaries in normalized form are hard to detect without spaces,
  //    so we do a heuristic: match against the original title split by
  //    non-letter characters.
  const words = (item.title || '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  if (words.some(w => w.startsWith(q))) total += 100;

  // 4. Substring anywhere in title
  else if (title.includes(q)) total += 60;

  // 5. Subsequence match — letters of query appear in order inside title
  else if (isSubsequence(q, title)) total += 25;

  // 6. Tags boost
  if (tags.some(t => t.includes(q))) total += 20;

  // 7. Description mention (weakest)
  if (desc.includes(q)) total += 5;

  // 8. Category mention (weakest)
  if (cat.includes(q)) total += 3;

  return total;
}

  /* ---------- Run the search ---------- */
  let pool = window.GAMEROCK.all;
  if (scope === 'games') pool = pool.filter(i => i.kind === 'game');
  if (scope === 'apps')  pool = pool.filter(i => i.kind === 'app');

  let results = pool;
  if (query) {
    results = pool
      .map(i => ({ item: i, s: score(i, query) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map(x => x.item);
  }

  /* ---------- Build card HTML (mirrors render.js) ---------- */
  function cardHTML(item) {
    const tags = (item.tags || []).slice(0, 3)
      .map(t => `<span class="tag-chip">${t}</span>`).join('');
    const label = item.kind === 'game' ? 'Game' : 'App';
    return `
      <article class="card reveal" data-category="${item.category}">
        <a class="card-link" href="${PRE}${item.url}">
          <div class="thumb">
            <img src="${PRE}${item.image}" alt="${item.title}" loading="lazy" />
            <span class="badge">${label}</span>
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

  /* ---------- Inject results into the page ---------- */
  function render() {
    const main = document.getElementById('main');
    if (!main) return;

    // Heading text
    const scopeLabel = scope === 'games' ? 'games' : scope === 'apps' ? 'apps' : 'items';
    const modeLabel  = mode === 'tag' ? 'tag' : 'name';

    let title;
    if (!query) {
      title = `Search ${scopeLabel}`;
    } else {
      title = `"${query}" — ${results.length} result${results.length === 1 ? '' : 's'}`;
    }

    const subtitle = query
      ? `Matched by ${modeLabel} in ${scopeLabel}.`
      : `Type a query in the search bar to filter ${scopeLabel} by ${modeLabel}.`;

    // Results section
    const resultsHTML = results.length
      ? `<div class="grid grid-3 parent-cool-border">${results.map(cardHTML).join('')}</div>`
      : `
        <div class="filter-empty">
          <i class="fa-solid fa-ghost"></i>
          <p>No matches for "${query}".</p>
          <a class="btn btn-ghost" href="${PRE}index.html">Back to home</a>
        </div>`;

    // Build the block, inject after the header
    const block = `
      <section class="page-head">
        <div class="wrap">
          <nav class="crumbs" aria-label="Breadcrumb">
            <a href="${PRE}index.html">Home</a>
            <span class="sep">/</span>
            <span>Search</span>
          </nav>
          <div class="page-head-row">
            <div>
              <span class="kicker">// Search</span>
              <h1 class="page-title">${title}</h1>
              <p class="page-lede">${subtitle}</p>
            </div>
            <div class="page-head-stat">
              <b>${results.length}</b>
              <span>Result${results.length === 1 ? '' : 's'}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="wrap">
        ${resultsHTML}
      </section>`;

    // Remove any previously rendered block (in case of re-run)
    const existing = document.getElementById('search-results-block');
    if (existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.id = 'search-results-block';
    wrapper.innerHTML = block;

    // Insert as first child of main (above everything else)
    main.insertBefore(wrapper, main.firstChild);

    // Reveal animation
    if (typeof window.GAMEROCK_reveal === 'function') {
      window.GAMEROCK_reveal();
    } else {
      document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
    }
  }

  /* ---------- Sync search form inputs to the query ---------- */
  function syncForms() {
    document.querySelectorAll('form[action$="search.html"]').forEach(form => {
      const qInput = form.querySelector('input[name="q"]');
      if (qInput) qInput.value = query;

      const scopeSel = form.querySelector('select[name="scope"]');
      if (scopeSel) scopeSel.value = scope;

      const modeSel = form.querySelector('select[name="mode"]');
      if (modeSel) modeSel.value = mode;
    });
  }

  /* ---------- Run ---------- */
  function init() {
    render();
    syncForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();