// Sanatan Mahakosh - Temple photo loader
// Wikipedia / Wikimedia Commons se ASLI photos laata hai (galat/banaye hue URL nahi).
// Har photo localStorage mein cache hoti hai taaki baar-baar internet na lage.
// Photos ka license: Wikimedia Commons (CC / public domain). Credit: Wikimedia Commons.

(function() {
  'use strict';

  const CACHE_PREFIX = 'sanatan_img_v1_';
  const memory = {};

  function cacheGet(key) {
    try {
      const v = localStorage.getItem(CACHE_PREFIX + key);
      return v ? JSON.parse(v) : null;
    } catch (e) { return null; }
  }
  function cacheSet(key, val) {
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(val)); } catch (e) {}
  }

  function queryFor(temple) {
    return (temple.wikiQuery || temple.nameEnglish || temple.name || '').replace(/\s*\(.*?\)\s*/g, ' ').trim();
  }

  // Ek main photo (card ke liye)
  function main(temple) {
    const key = 'main_' + temple.id;
    if (memory[key]) return memory[key];
    const cached = cacheGet(key);
    if (cached && cached.url) return (memory[key] = Promise.resolve(cached.url));

    const q = encodeURIComponent(queryFor(temple));
    const url = 'https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*' +
      '&generator=search&gsrsearch=' + q + '&gsrlimit=4&prop=pageimages&piprop=thumbnail&pithumbsize=800&pilimit=4';

    memory[key] = fetch(url)
      .then(r => r.json())
      .then(d => {
        const pages = Object.values((d.query && d.query.pages) || {})
          .sort((a, b) => (a.index || 99) - (b.index || 99));
        const hit = pages.find(p => p.thumbnail && p.thumbnail.source);
        const found = hit ? hit.thumbnail.source : '';
        if (found) cacheSet(key, { url: found });
        return found;
      })
      .catch(() => '');
    return memory[key];
  }

  // Gallery (modal ke liye): Commons se kai photos
  function gallery(temple) {
    const key = 'gal_' + temple.id;
    if (memory[key]) return memory[key];
    const cached = cacheGet(key);
    if (cached && cached.list && cached.list.length) return (memory[key] = Promise.resolve(cached.list));

    const q = encodeURIComponent(queryFor(temple));
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
      '&generator=search&gsrnamespace=6&gsrsearch=' + q + '&gsrlimit=12' +
      '&prop=imageinfo&iiprop=url|mime&iiurlwidth=900';

    memory[key] = fetch(url)
      .then(r => r.json())
      .then(d => {
        const pages = Object.values((d.query && d.query.pages) || {})
          .sort((a, b) => (a.index || 99) - (b.index || 99));
        const list = [];
        pages.forEach(p => {
          const ii = p.imageinfo && p.imageinfo[0];
          if (!ii || !/^image\/(jpeg|png)$/.test(ii.mime || '')) return;
          list.push({
            url: ii.thumburl || ii.url,
            thumb: ii.thumburl || ii.url,
            caption: (p.title || '').replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ') + ' - Wikimedia Commons'
          });
        });
        if (list.length) cacheSet(key, { list: list });
        return list;
      })
      .catch(() => []);
    return memory[key];
  }

  // Cards par photos lagao (scroll karte hi, taaki saari API call ek saath na jaye)
  function hydrateCards() {
    const cards = document.querySelectorAll('.temple-card, .temple-preview-card');
    if (!cards.length) return;
    const temples = window.TEMPLES_DATA || [];

    const apply = (card) => {
      const id = card.dataset.id;
      const temple = temples.find(t => t.id === id);
      if (!temple) return;
      main(temple).then(src => {
        if (!src) return;
        const img = card.querySelector('img');
        if (!img) return;
        const ph = card.querySelector('.no-gallery');
        if (ph) ph.remove();
        img.onerror = function() { this.onerror = null; this.style.display = 'none'; };
        img.style.display = '';
        img.src = src;
      });
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) { io.unobserve(en.target); apply(en.target); }
        });
      }, { rootMargin: '300px' });
      cards.forEach(c => io.observe(c));
    } else {
      cards.forEach(apply);
    }
  }

  window.TempleImages = { main: main, gallery: gallery, hydrate: hydrateCards };

  function start() { setTimeout(hydrateCards, 0); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
