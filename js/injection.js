/* ============================================================
   GAMEROCK — injection.js
   Injects header, drawer, footer into every page automatically.
   Edit once → updates everywhere.

   Load this on every page, right before main.js:
     <script src="../../js/injection.js"></script>
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Path depth from root ---------- */
  function rootPrefix() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length && parts[parts.length - 1].includes('.')) parts.pop();
    return parts.length ? '../'.repeat(parts.length) : '';
  }
  const PRE = rootPrefix();

  /* ---------- Which nav link is "current" ---------- */
  const currentPage = document.body.dataset.page || '';
  function active(page) {
    return currentPage === page ? ' active' : '';
  }

  /* ---------- Header + Drawer ---------- */
  const headerHTML = `
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${PRE}index.html" aria-label="GameRock — home">
      <img class="logo" src="${PRE}images/gr-logo-1.png">
      <span class="brand-text"><b>GAME</b><i>ROCK</i></span>
    </a>

    <form class="header-search" role="search" action="${PRE}search.html" method="get" autocomplete="off">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <input type="search" name="q" placeholder="Search games, apps, tags…" aria-label="Search">
      <kbd>/</kbd>
    </form>

    <nav class="nav" aria-label="Primary">
      <a class="nav-link${active('home')}" href="${PRE}index.html">Home</a>

      <div class="has-drop">
        <button class="nav-link" type="button">
          Games <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="drop" role="menu">
          <a role="menuitem" href="${PRE}games/games.html">All Games</a>
          <a role="menuitem" href="${PRE}games/action/action.html">Action</a>
          <a role="menuitem" href="${PRE}games/racing/racing.html">Racing</a>
          <a role="menuitem" href="${PRE}games/simulation/simulation.html">Simulation</a>
        </div>
      </div>

      <div class="has-drop">
        <button class="nav-link" type="button">
          Apps <i class="fa-solid fa-chevron-down"></i>
        </button>
        <div class="drop" role="menu">
          <a role="menuitem" href="${PRE}apps/apps.html">All Apps</a>
          <a role="menuitem" href="${PRE}apps/game-tools/game-tools.html">Tools</a>
          <a role="menuitem" href="${PRE}apps/media/media.html">Media</a>
        </div>
      </div>

      <a class="nav-link" href="#support-toggle">Support</a>

      <div class="theme-picker" id="theme-picker">
        <button class="icon-btn theme-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Change theme">
          <i class="fa-solid fa-palette"></i>
        </button>
        <div class="theme-menu" role="listbox" aria-label="Choose theme">
          <button type="button" role="option" data-theme-set="cyberdeck" class="theme-opt">
            <span class="swatch sw-cyberdeck"><i class="fa-solid fa-check"></i></span>
            <span class="name">Cyberdeck</span>
            <span class="desc">Neon cyan · deep space</span>
          </button>
          <button type="button" role="option" data-theme-set="daylight" class="theme-opt">
            <span class="swatch sw-daylight"><i class="fa-solid fa-check"></i></span>
            <span class="name">Daylight</span>
            <span class="desc">Clean light · corporate</span>
          </button>
          <button type="button" role="option" data-theme-set="synthwave" class="theme-opt">
            <span class="swatch sw-synthwave"><i class="fa-solid fa-check"></i></span>
            <span class="name">Synthwave</span>
            <span class="desc">80s magenta · retro</span>
          </button>
          <button type="button" role="option" data-theme-set="voltage" class="theme-opt">
            <span class="swatch sw-voltage"><i class="fa-solid fa-check"></i></span>
            <span class="name">Voltage</span>
            <span class="desc">Acid lime · code rain</span>
          </button>
          <button type="button" role="option" data-theme-set="electric" class="theme-opt">
            <span class="swatch sw-electric"><i class="fa-solid fa-check"></i></span>
            <span class="name">Electric</span>
            <span class="desc">Volt yellow · cyan spark</span>
          </button>
        </div>
      </div>

      <button class="icon-btn menu-toggle" type="button" aria-label="Open menu" aria-controls="drawer">
        <i class="fa-solid fa-bars"></i>
      </button>
    </nav>
  </div>
</header>

<aside class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer-inner">
    <form class="drawer-search" role="search" action="${PRE}search.html" method="get">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" name="q" placeholder="Search…" aria-label="Search">
    </form>

    <div class="drawer-group">
      <span class="drawer-label">// Navigate</span>
      <a href="${PRE}index.html">Home</a>
      <a href="${PRE}search.html">Blog</a>
      <a href="#support-toggle">Support</a>
      <a href="#contact">Contact</a>
    </div>

    <div class="drawer-group">
      <span class="drawer-label">// Games</span>
      <a href="${PRE}games/games.html">All Games</a>
      <a href="${PRE}games/action/action.html">Action</a>
      <a href="${PRE}games/racing/racing.html">Racing</a>
      <a href="${PRE}games/simulation/simulation.html">Simulation</a>
    </div>

    <div class="drawer-group">
      <span class="drawer-label">// Apps</span>
      <a href="${PRE}apps/apps.html">All Apps</a>
      <a href="${PRE}apps/game-tools/game-tools.html">Tools</a>
      <a href="${PRE}apps/media/media.html">Media</a>
    </div>
  </div>
</aside>
<div class="drawer-backdrop" id="drawer-backdrop" hidden></div>`;

  /* ---------- Footer ---------- */
  const footerHTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="brand" href="${PRE}index.html">
          <img class="logo" src="${PRE}images/gr-logo-1.png" alt="GameRock">
          <span class="brand-text"><b>GAME</b><i>ROCK</i></span>
        </a>
        <p>The pride rock for all games, apps and modding tools. Built for gamers, by gamers.</p>
      </div>

      <div>
        <h4>Games</h4>
        <a href="${PRE}games/action/action.html">Action</a>
        <a href="${PRE}games/racing/racing.html">Racing</a>
        <a href="${PRE}games/simulation/simulation.html">Simulation</a>
        <a href="${PRE}games/games.html">All Games</a>
      </div>

      <div>
        <h4>Apps</h4>
        <a href="${PRE}apps/game-tools/game-tools.html">Tools</a>
        <a href="${PRE}apps/media/media.html">Media</a>
        <a href="${PRE}apps/apps.html">All Apps</a>
        <a href="${PRE}search.html">Search</a>
      </div>

      <div>
        <h4>Company</h4>
        <a href="#support-toggle">Support Us</a>
        <a href="${PRE}privacy.html">Privacy Policy</a>
        <a href="${PRE}terms.html">Terms of Service</a>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <span data-year>2026</span> GAMEROCK — ALL RIGHTS RESERVED</span>
      <div id="contact">
        <h4>Contact</h4>
        <div class="socials">
          <a href="https://www.facebook.com/profile.php?id=100063468581803" aria-label="Facebook" rel="noopener" target="_blank"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://wa.me/+2349035427684" aria-label="WhatsApp" rel="noopener" target="_blank"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="#" aria-label="X" target="_blank" rel="noopener" class="disabled-link"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="TikTok" target="_blank" rel="noopener" class="disabled-link"><i class="fa-brands fa-tiktok"></i></a>
          <a href="mailto:otomee357@gmail.com" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
        </div>
      </div>
    </div>

    <div class="footer-attribution">
      Designed and developed by <a href="https://akthomee.com.ng/" target="_blank" rel="noopener">Akthomee</a>
    </div>
  </div>
</footer>`;

/* ---------- Radial Menu ---------- */
const radialHTML = `
<div class="radial-menu">
  <input type="checkbox" id="radial-toggle" hidden />

  <label for="radial-toggle" class="radial-trigger" aria-label="Open quick menu">
    <i class="fa-solid fa-plus"></i>
  </label>

  <nav class="radial-nav" style="--n: 6;">
    <a href="#main" class="radial-item tip-bottom" style="--i: 0;" title="back to top"><i class="fa-solid fa-arrow-up"></i></a>
    <a href="https://wa.me/+2349035427684" class="radial-item tip-bottom" style="--i: 1;" title="whatsapp"><i class="fa-brands fa-whatsapp"></i></a>
    <a href="mailto:otomee357@gmail.com" class="radial-item tip-bottom" style="--i: 2;" title="feedback"><i class="fa-solid fa-comment-dots"></i></a>
    <a href="#support-toggle" class="radial-item tip-bottom disabled-link" style="--i: 3;" title="support us"><i class="fa-solid fa-heart"></i></a>
    <a href="${PRE}faqs.html" class="radial-item tip-bottom" style="--i: 4;" title="FAQs"><i class="fa-solid fa-circle-question"></i></a>
    <a href="#search" class="radial-item tip-bottom" style="--i: 5;" title="Search"><i class="fa-solid fa-magnifying-glass"></i></a>
  </nav>
</div>`;

/* ---------- Support Modal ---------- */
const modalHTML = `
<input type="checkbox" id="support-toggle" hidden />

<div class="modal-overlay" id="support-modal">
  <label for="support-toggle" class="modal-close" aria-label="Close"></label>

  <div class="modal-panel" role="dialog" aria-labelledby="support-title">
    <label for="support-toggle" class="modal-x" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </label>

    <span class="kicker">// Support Us</span>
    <h2 id="support-title">Keep the Rock Alive</h2>
    <p class="modal-lede">Every download, share and donation keeps GameRock running. Pick whichever way suits you.</p>

    <div class="support-section">
      <h3><i class="fa-solid fa-share-nodes"></i> Follow &amp; Share</h3>
      <div class="support-socials">
        <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="https://www.facebook.com/profile.php?id=100063468581803" aria-label="Facebook" rel="noopener"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="https://wa.me/+2349035427684" aria-label="WhatsApp" rel="noopener"><i class="fa-brands fa-whatsapp"></i></a>
      </div>
    </div>

    <div class="support-section">
      <h3><i class="fa-solid fa-coins"></i> Donate with TON</h3>
      <p>Copy our wallet address and send any amount:</p>
      <code class="ton-address">UQAZtKzrroqz5m9LIdr1KZySRnr3Z5vVpMstlr9TlBE8q5j-</code>
    </div>

    <div class="support-section">
      <h3><i class="fa-solid fa-naira-sign"></i> Donate in Naira</h3>
      <p>Send any amount to our Nigerian account:</p>
      <div class="bank-card">
        <div class="bank-row">
          <span class="bank-label">Bank</span>
          <span class="bank-value">POCKETAPP</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Account Name</span>
          <span class="bank-value">PIGGYVEST/AKPOTOME ALLEN OGADJE</span>
        </div>
        <div class="bank-row">
          <span class="bank-label">Account Number</span>
          <span class="bank-value bank-number">9696110446</span>
        </div>
      </div>
    </div>

    <div class="support-notice">
      <i class="fa-solid fa-circle-info"></i>
      <p>Wish to donate with something different? Kindly <a href="#contact" class="notice-link">contact us</a> below</p>
    </div>
  </div>
</div>`;

  /* ---------- Inject into the page ---------- */
 function inject() {
  if (!document.querySelector('.site-header')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }
  if (!document.querySelector('.site-footer')) {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
  if (!document.querySelector('.radial-menu')) {
    document.body.insertAdjacentHTML('beforeend', radialHTML);
  }
  if (!document.querySelector('#support-modal')) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  bindDrawer();
  bindThemePicker();
  bindRadial();
  bindSupportModal();
}

  /* ---------- Drawer open/close ---------- */
  function bindDrawer() {
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const toggle = document.querySelector('.menu-toggle');
    if (!drawer || !toggle) return;

    function open() {
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      if (backdrop) {
        backdrop.hidden = false;
        requestAnimationFrame(() => backdrop.classList.add('open'));
      }
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      if (backdrop) {
        backdrop.classList.remove('open');
        setTimeout(() => { backdrop.hidden = true; }, 300);
      }
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      drawer.classList.contains('open') ? close() : open();
    });
    if (backdrop) backdrop.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
  }

  /* ---------- Theme picker ---------- */
  function bindThemePicker() {
    const picker = document.getElementById('theme-picker');
    const btn = picker && picker.querySelector('.theme-btn');
    if (!picker || !btn) return;

    // Mark currently active theme
    const saved = document.documentElement.getAttribute('data-theme') || 'cyberdeck';
    picker.querySelectorAll('.theme-opt').forEach(o => {
      o.classList.toggle('active', o.dataset.themeSet === saved);
    });

    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = picker.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    picker.querySelectorAll('[data-theme-set]').forEach(opt => {
      opt.addEventListener('click', () => {
        const theme = opt.dataset.themeSet;
        document.documentElement.setAttribute('data-theme', theme);
        try { localStorage.setItem('gr-theme', theme); } catch (err) {}

        picker.querySelectorAll('.theme-opt').forEach(o =>
          o.classList.toggle('active', o === opt)
        );
        picker.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');

        // Update the hero badge text if present on the current page
        const labels = {
          cyberdeck: '// v2.0 — CYBERDECK ONLINE',
          daylight:  '// v2.0 — DAYLIGHT MODE',
          synthwave: '// v2.0 — SYNTHWAVE LINKED',
          voltage:   '// v2.0 — VOLTAGE SURGE',
          electric:  '// v2.0 — HIGH VOLTAGE'
        };
        const badge = document.querySelector('[data-theme-text]');
        if (badge && labels[theme]) badge.textContent = labels[theme];

        // Update meta theme-color
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
          const colors = {
            cyberdeck: '#05060a',
            daylight:  '#eef2fa',
            synthwave: '#0a0518',
            voltage:   '#020704',
            electric:  '#050810'
          };
          meta.setAttribute('content', colors[theme] || '#05060a');
        }
      });
    });

    document.addEventListener('click', e => {
      if (!picker.contains(e.target)) {
        picker.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Bind Radial ---------- */
  function bindRadial() {
  const toggle = document.getElementById('radial-toggle');
  const trigger = document.querySelector('.radial-trigger');
  if (!toggle || !trigger) return;

  // The checkbox hack handles the visual state.
  // Close the menu when a link inside it is clicked or the user clicks outside.
  document.querySelectorAll('.radial-item').forEach(item => {
    item.addEventListener('click', () => {
      toggle.checked = false;
    });
  });

  document.addEventListener('click', e => {
    if (toggle.checked && !e.target.closest('.radial-menu')) {
      toggle.checked = false;
    }
  });
}

/* ---------- Support Modal ---------- */
function bindSupportModal() {
  const toggle = document.getElementById('support-toggle');
  if (!toggle) return;

  // Every link that should OPEN the modal
  document.querySelectorAll('a[href="#support-toggle"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      toggle.checked = true;
      document.body.style.overflow = 'hidden';
    });
  });

  // When the modal closes, unlock body scroll
  toggle.addEventListener('change', () => {
    if (!toggle.checked) document.body.style.overflow = '';
  });

  // "Contact us" link inside the modal closes it before jumping
  document.querySelectorAll('.notice-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.checked = false;
      document.body.style.overflow = '';
    });
  });
}

  /* ---------- Run on DOM ready ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();