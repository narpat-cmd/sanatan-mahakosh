// Sanatan Mahakosh - BookReader FIX
// Problems jo theek kiye:
//  1. BookReader.init() kabhi chalta hi nahi tha (#search-input page par hai hi nahi)
//     -> buttons (next/prev/close/TOC) dead the, chapterCache undefined tha
//  2. Shlok-by-shlok reading nahi thi (verse hamesha null rehta tha -> blank page)
//  3. TOC / title object ko "[object Object]" dikhate the
//  4. Layout (row mein sab kuch) aur invisible close icons
// Yeh file book-reader.js ke BAAD load hoti hai.

(function() {
  'use strict';
  const BR = window.BookReader;
  if (!BR) return;

  const T = (t) => (t && typeof t === 'object') ? (t.hi || t.en || t.sa || '') : (t || '');

  BR.chapterCache = BR.chapterCache || {};
  BR.verseIndex = 0;

  // ---------- 1. init har page par ----------
  const origInit = BR.init;
  BR.init = function() {
    if (this._inited) return;
    this._inited = true;
    try { origInit.call(this); } catch (e) { console.error('BookReader init error', e); }
  };

  // ---------- CSS fix ----------
  const style = document.createElement('style');
  style.textContent = `
    .book-reader-overlay .book-reader-content { flex-direction: column; overflow: auto; }
    .book-reader-overlay .book-language-bar { flex: 0 0 auto; position: static; }
    .book-reader-overlay .book-pages { flex: 1 1 auto; min-height: 0; justify-content: center; }
    .book-reader-overlay .book-controls { flex: 0 0 auto; position: static; border-radius: .75rem; }
    .book-reader-overlay .book-sidebar { flex-direction: row; justify-content: center; flex: 0 0 auto; padding: .25rem; }
    .book-reader-overlay .book-sidebar button { background: #FAF3E0; border: 1px solid #D4AF37; border-radius: .6rem; width: 2.5rem; height: 2.5rem; padding: 0; display: flex; align-items: center; justify-content: center; }
    .book-reader-overlay .toc-item { color: #2C1810; }
    .book-reader-overlay .toc-close { background: none; border: none; font-size: 1.25rem; padding: .75rem; cursor: pointer; color: #6B0F1A; }
    .book-reader-overlay .page-header { background: transparent; }
    .book-reader-overlay .book-name { display: block; font-family: 'Cinzel', serif; color: #6B0F1A; font-size: 1.1rem; font-weight: 700; }
    .book-reader-overlay .chapter-name { display: block; }
    body.dark .book-reader-overlay .book-name { color: #F4D58D; }
    body.dark .book-reader-overlay .page-number, body.dark .book-reader-overlay .chapter-name { color: #E8DCC0; }
    body.dark .book-reader-overlay .toc-item { color: #f5e6d3; }
    body.font-large .verse-sanskrit { font-size: 1.5rem; }
    body.font-large .verse-meaning, body.font-large .verse-hindi-meaning, body.font-large .verse-transliteration { font-size: 1.15rem; }
    body.font-small .verse-sanskrit { font-size: 1rem; }
    body.font-small .verse-meaning, body.font-small .verse-hindi-meaning, body.font-small .verse-transliteration { font-size: .8rem; }
    .book-reader-overlay .verse-sanskrit, .book-reader-overlay .verse-transliteration { white-space: pre-line; }
    .book-reader-overlay .rp-photo { width: 100%; max-height: 52vh; min-height: 8rem; border-radius: .6rem; overflow: hidden; background: rgba(212,175,55,.12); display: flex; align-items: center; justify-content: center; }
    .book-reader-overlay .rp-photo img { width: 100%; max-height: 52vh; object-fit: contain; display: block; }
    .book-reader-overlay .rp-photo-credit { font-size: .7rem; opacity: .7; margin-top: .3rem; text-align: center; }
    @media (max-width: 768px) {
      .book-reader-overlay .left-page { display: none; }
      .book-reader-overlay .book-page { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  // ---------- Gita fallback: chNN.js na mile to internet se ----------
  const origLoad = BR.loadChapter;
  BR.loadChapter = function(bookId, chapterKey) {
    const self = this;
    return origLoad.call(this, bookId, chapterKey).catch(err => {
      if (bookId === 'bhagavad-gita' && window.GitaRemote) {
        const n = parseInt(String(chapterKey).replace(/\D/g, ''), 10);
        return window.GitaRemote.chunk(n).then(chunk => {
          self.chapterCache = self.chapterCache || {};
          self.chapterCache[bookId + ':' + chapterKey] = chunk;
          return chunk;
        });
      }
      throw err;
    });
  };

  // ---------- photo finder (Wikimedia Commons, cache ke saath) ----------
  const imgMem = {};
  function findPhoto(query) {
    if (imgMem[query]) return imgMem[query];
    const key = 'sanatan_bookimg_v1_' + query;
    try { const c = localStorage.getItem(key); if (c) return (imgMem[query] = Promise.resolve(JSON.parse(c))); } catch (e) {}
    const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*' +
      '&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=' + encodeURIComponent(query) +
      '&prop=imageinfo&iiprop=url|mime&iiurlwidth=700';
    imgMem[query] = fetch(url).then(r => r.json()).then(d => {
      const pages = Object.values((d.query && d.query.pages) || {}).sort((a, b) => (a.index || 99) - (b.index || 99));
      const hit = pages.find(p => { const ii = p.imageinfo && p.imageinfo[0]; return ii && /^image\/(jpeg|png)$/.test(ii.mime || ''); });
      if (!hit) return null;
      const ii = hit.imageinfo[0];
      const res = { url: ii.thumburl || ii.url, title: (hit.title || '').replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ') };
      try { localStorage.setItem(key, JSON.stringify(res)); } catch (e) {}
      return res;
    }).catch(() => null);
    return imgMem[query];
  }

  // ---------- 2. openReader ----------
  BR.openReader = function(chapter, verse) {
    this.currentChapter = chapter;
    const vs = (chapter && chapter.verses) || [];
    let idx = 0;
    if (verse) {
      const f = vs.findIndex(v => v.n === verse.n);
      idx = f >= 0 ? f : 0;
    }
    this.verseIndex = idx;

    let overlay = document.getElementById('book-reader-overlay');
    if (!overlay) {
      overlay = this.createReaderOverlay();
      document.body.appendChild(overlay);
      const tc = overlay.querySelector('.toc-close');
      if (tc) tc.textContent = '✕';
    }
    overlay.classList.add('active');
    this.renderPage(chapter);
    this.playPageTurn();
  };

  // ---------- 3. renderPage: shlok-by-shlok ----------
  BR.renderPage = function(chapter) {
    chapter = chapter || this.currentChapter;
    if (!chapter) return;
    const leftPage = document.getElementById('left-page');
    const rightPage = document.getElementById('right-page');
    if (!leftPage || !rightPage) return;

    const book = this.currentBook || {};
    const bookTitle = T(book.title) || 'Scripture';
    const chTitle = T(chapter.title);
    const verses = chapter.verses || [];
    const verse = verses[this.verseIndex] || null;
    this.currentVerse = verse;

    // right header
    const rh = rightPage.querySelector('.page-header');
    if (rh) {
      rh.innerHTML = '<span class="book-name">' + bookTitle + '</span>' +
        (chTitle ? '<span class="chapter-name">' + chTitle + '</span>' : '') +
        '<span class="page-number">' + (verse ? 'Shlok ' + (verse.n || (this.verseIndex + 1)) + ' / ' + verses.length : '') +
        ' &nbsp;|&nbsp; Adhyay ' + ((this.currentIndex || 0) + 1) + ' / ' + (this.totalPages || 1) + '</span>';
    }

    // left page: emblem + chapter info
    const lc = leftPage.querySelector('.page-content');
    if (lc) {
      const emblem = (book.cover && book.cover.emblem) || 'ॐ';
      const bookEn = (book.title && typeof book.title === 'object') ? (book.title.en || '') : '';
      let ck = null;
      try { const ch = (book.chapters || [])[this.currentIndex || 0]; if (ch) ck = (this.chapterCache || {})[book.id + ':' + ch.key] || null; } catch (e) {}
      if (!chapter.imageQuery && ck) { chapter.imageQuery = ck.imageQuery; chapter.summaryHi = ck.summaryHi; chapter.illustrationCaption = chapter.illustrationCaption || ck.illustrationCaption; }
      const q = chapter.imageQuery || book.imageQuery || (bookEn ? bookEn + ' painting' : '');
      lc.innerHTML = '<div style="text-align:center">' +
        '<h3 style="font-family:Cinzel,serif;color:#6B0F1A;margin:0 0 .5rem;font-size:1.15rem">' + chTitle + '</h3>' +
        '<div class="rp-photo" id="rp-photo"><div style="font-size:4rem;color:#6B0F1A;line-height:1;padding:1.5rem">' + emblem + '</div></div>' +
        '<div class="rp-photo-credit" id="rp-photo-credit"></div>' +
        (chapter.illustrationCaption ? '<p style="margin-top:.5rem;font-size:.9rem;opacity:.85;font-style:italic">' + chapter.illustrationCaption + '</p>' : '') +
        (chapter.summaryHi && this.verseIndex === 0 ? '<p style="margin-top:.6rem;font-size:.85rem;text-align:left;line-height:1.6">' + chapter.summaryHi + '</p>' : '') +
        '</div>';
      if (q) {
        const token = q + '|' + chTitle;
        this._photoToken = token;
        findPhoto(q).then(p => {
          if (!p || this._photoToken !== token) return;
          const box = document.getElementById('rp-photo');
          const cr = document.getElementById('rp-photo-credit');
          if (!box) return;
          const im = new Image();
          im.alt = p.title;
          im.onload = function() { box.innerHTML = ''; box.appendChild(im); if (cr) cr.textContent = p.title + ' — Wikimedia Commons'; };
          im.src = p.url;
        });
      }
    }

    const vs = rightPage.querySelector('.verse-sanskrit');
    const vt = rightPage.querySelector('.verse-transliteration');
    const vh = rightPage.querySelector('.verse-hindi-meaning');
    const vm = rightPage.querySelector('.verse-meaning');
    const copyBtn = document.querySelector('.copy-verse');
    const shareBtn = document.querySelector('.share-whatsapp');

    if (verse) {
      if (vs) vs.textContent = verse.sa || verse.sanskrit || '';
      if (vt) vt.textContent = verse.tr || verse.transliteration || '';
      const hi = verse.hi || verse.hindiMeaning || '';
      const en = verse.en || verse.meaning || '';
      if (vh) {
        const show = (this.lang === 'hi' || this.lang === 'all') && hi;
        vh.textContent = hi;
        vh.style.display = show ? 'block' : 'none';
      }
      if (vm) {
        const show = (this.lang === 'en' || this.lang === 'all') && en;
        vm.textContent = en;
        vm.style.display = show ? 'block' : 'none';
      }
      if (copyBtn) copyBtn.style.display = '';
      if (shareBtn) shareBtn.style.display = '';
    } else {
      if (vs) vs.textContent = 'Is adhyay mein koi shlok nahi mila.';
      if (vt) vt.textContent = '';
      if (vh) vh.style.display = 'none';
      if (vm) vm.style.display = 'none';
    }

    // language buttons active state
    document.querySelectorAll('.book-lang-option').forEach(o => {
      o.classList.toggle('active', o.dataset.lang === this.lang);
    });
  };

  // ---------- 4. chapter loader helper ----------
  BR._goChapter = function(idx, verseIdx) {
    const chapters = (this.currentBook && this.currentBook.chapters) || [];
    if (idx < 0 || idx >= chapters.length) return Promise.resolve(false);
    const key = chapters[idx].key;
    return this.loadChapter(this.currentBook.id, key).then(chunk => {
      this.currentIndex = idx;
      this.currentChapter = { title: chunk.title, illustration: chunk.illustration, illustrationCaption: chunk.illustrationCaption, imageQuery: chunk.imageQuery, summaryHi: chunk.summaryHi, verses: chunk.verses || [] };
      this.verseIndex = verseIdx === 'last' ? Math.max(0, this.currentChapter.verses.length - 1) : (verseIdx || 0);
      this.renderPage(this.currentChapter);
      this.playPageTurn();
      return true;
    }).catch(err => {
      console.error('Chapter load failed:', err);
      this.showToast('Adhyay load nahi ho paya');
      return false;
    });
  };

  BR.nextPage = function() {
    if (!this.isOpen() || !this.currentChapter) return;
    const verses = this.currentChapter.verses || [];
    if (this.verseIndex < verses.length - 1) {
      this.verseIndex++;
      this.renderPage(this.currentChapter);
      this.playPageTurn();
      return;
    }
    const total = (this.currentBook.chapters || []).length;
    if (this.currentIndex < total - 1) {
      this._goChapter(this.currentIndex + 1, 0);
    } else {
      this.showToast('Granth ka ant');
    }
  };

  BR.prevPage = function() {
    if (!this.isOpen() || !this.currentChapter) return;
    if (this.verseIndex > 0) {
      this.verseIndex--;
      this.renderPage(this.currentChapter);
      this.playPageTurn();
      return;
    }
    if (this.currentIndex > 0) {
      this._goChapter(this.currentIndex - 1, 'last');
    }
  };

  BR.jumpToChapter = function(idx) {
    const open = document.getElementById('toc-container');
    this._goChapter(idx, 0).then(() => { if (open) open.classList.remove('open'); });
  };

  BR.renderTOC = function() {
    const list = document.getElementById('toc-list');
    if (!list || !this.currentBook || !this.currentBook.chapters) return;
    list.innerHTML = this.currentBook.chapters.map((c, i) =>
      '<div class="toc-item" data-chapter="' + i + '">' + (i + 1) + '. ' + (T(c.title) || ('Adhyay ' + (i + 1))) + '</div>'
    ).join('');
  };

  BR.setLanguage = function(lang) {
    this.lang = lang;
    try { localStorage.setItem('sanatan_lang', lang); } catch (e) {}
    document.documentElement.setAttribute('data-lang', lang);
    if (this.isOpen() && this.currentChapter) this.renderPage(this.currentChapter);
  };

  // ---------- start ----------
  function start() { BR.init(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
