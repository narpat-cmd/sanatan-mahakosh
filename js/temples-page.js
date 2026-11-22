// Sanatan Mahakosh - Temples page: category tabs + All Temples + search + cards
// Data: window.TEMPLES_DATA, window.TEMPLE_CATEGORIES (data/temples.js, data/temples-more.js)
// Card par click / Darshan button ko app.js sambhalta hai (TempleViewer.loadTemple).
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function init() {
    var grid = document.getElementById('templesGrid');
    var temples = window.TEMPLES_DATA || [];
    var cats = window.TEMPLE_CATEGORIES || [];
    if (!grid || !temples.length || !cats.length) return;

    var state = { cat: 'all', q: '' };
    try {
      var qc = new URLSearchParams(location.search).get('cat');
      if (qc && cats.some(function (c) { return c.id === qc; })) state.cat = qc;
    } catch (e) {}

    function inCat(t, id) {
      if (id === 'all') return true;
      return (t.categories || []).indexOf(id) !== -1;
    }

    // ---- filter bar ----
    var old = document.querySelector('[aria-label="Temple categories"]');
    var bar = document.createElement('div');
    bar.id = 'templeFilterBar';
    bar.className = 'mb-8';
    bar.innerHTML =
      '<div class="flex flex-wrap justify-center gap-2 mb-5" role="group" aria-label="Temple categories" id="templeTabs"></div>' +
      '<div class="max-w-xl mx-auto"><input id="templeSearch" type="search" autocomplete="off" ' +
      'placeholder="मंदिर या स्थान खोजें... (Kedarnath, Ujjain, Shiva)" ' +
      'class="w-full px-5 py-3 rounded-full border border-gold/40 bg-white/70 text-sandalwood focus:outline-none focus:ring-2 focus:ring-gold" aria-label="Search temples">' +
      '<p id="templeCount" class="text-center text-sm mt-3 text-sandalwood/70"></p></div>';
    if (old && old.parentNode) old.parentNode.replaceChild(bar, old);
    else grid.parentNode.insertBefore(bar, grid);

    var tabs = document.getElementById('templeTabs');
    var input = document.getElementById('templeSearch');
    var count = document.getElementById('templeCount');

    function renderTabs() {
      tabs.innerHTML = cats.map(function (c) {
        var n = temples.filter(function (t) { return inCat(t, c.id); }).length;
        if (c.id !== 'all' && !n) return '';
        var on = c.id === state.cat;
        return '<button type="button" data-cat="' + c.id + '" aria-pressed="' + on + '" ' +
          'class="tfilter-btn px-4 py-2 rounded-full text-sm font-medium border transition-colors ' +
          (on ? 'bg-maroon text-parchment border-gold' : 'text-maroon bg-gold/20 border-gold/30 hover:bg-gold/30') + '">' +
          esc(c.hi) + ' <span class="opacity-70">(' + n + ')</span></button>';
      }).join('');
    }

    function norm(s) { return String(s || '').toLowerCase(); }

    function matches(t) {
      if (!inCat(t, state.cat)) return false;
      if (!state.q) return true;
      var hay = norm([t.name, t.nameEnglish, t.deity, t.place, t.state, t.location, t.id].join(' '));
      return state.q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
    }

    function card(t) {
      var badges = (t.categories || []).slice(0, 3).map(function (id) {
        return '<span class="px-2 py-0.5 rounded-full text-xs bg-gold/25 text-maroon">' +
          esc(window.TEMPLE_CAT_LABEL[id] || id) + '</span>';
      }).join(' ');
      return '<div class="temple-card group rounded-xl shadow-lg overflow-hidden bg-white/70 hover:shadow-2xl transition-shadow cursor-pointer" ' +
        'data-id="' + esc(t.id) + '" data-category="' + esc((t.categories || []).join(' ')) + '" role="listitem">' +
        '<div class="relative">' +
        '<img src="" alt="' + esc(t.nameEnglish || t.name) + '" loading="lazy" class="w-full h-48 object-cover" style="display:none">' +
        '<div class="no-gallery flex items-center justify-center h-48 bg-gold/10 text-5xl">🛕</div>' +
        '</div>' +
        '<div class="p-4">' +
        '<h3 class="font-cinzel text-lg text-maroon font-bold leading-snug">' + esc(t.name) + '</h3>' +
        '<p class="text-xs text-sandalwood/60 mb-1">' + esc(t.nameEnglish) + '</p>' +
        '<p class="text-sm text-sandalwood/80 mb-1">📍 ' + esc(t.location) + '</p>' +
        '<p class="text-sm text-saffron mb-2">' + esc(t.deity) + '</p>' +
        '<div class="flex flex-wrap gap-1 mb-3">' + badges + '</div>' +
        '<button type="button" class="darshan-btn w-full px-4 py-2 rounded-lg bg-maroon text-parchment text-sm font-medium hover:bg-saffron transition-colors" data-id="' + esc(t.id) + '">दर्शन / Darshan</button>' +
        '</div></div>';
    }

    function renderGrid() {
      var list = temples.filter(matches);
      count.textContent = list.length + ' / ' + temples.length + ' मंदिर';
      grid.innerHTML = list.length
        ? list.map(card).join('')
        : '<p class="col-span-full text-center text-sandalwood/70 py-10">कोई मंदिर नहीं मिला। दूसरा शब्द या "सभी मंदिर" आज़माएँ।</p>';
      if (window.TempleImages) window.TempleImages.hydrate();
    }

    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('.tfilter-btn');
      if (!b) return;
      state.cat = b.dataset.cat;
      renderTabs();
      renderGrid();
    });
    input.addEventListener('input', function () {
      state.q = norm(input.value).trim();
      renderGrid();
    });

    renderTabs();
    renderGrid();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
  else setTimeout(init, 0);
})();
