// Sanatan Dharma Mahakosh - 3D Page-Flip Book Reader Engine
// Supports trilingual modes: hi (Sanskrit+Hindi), en (English), all (three languages)

(function() {
  'use strict';

  const BookReader = {
    currentBook: null,
    currentChapter: null,
    currentVerse: null,
    currentIndex: 0,
    chapters: [],
    totalPages: 0,
    isMobile: window.innerWidth < 768,
    lang: 'hi',

    init: function() {
      this.lang = localStorage.getItem('sanatan_lang') || 'hi';
      document.documentElement.setAttribute('data-lang', this.lang);
      this.checkUrlParams();
      this.bindEvents();
      this.initAudio();
    },

    checkUrlParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const bookId = urlParams.get('book');
      const chapter = urlParams.get('ch');
      const verse = urlParams.get('v');

      if (bookId || chapter || verse) {
        this.openBook(bookId || 'bhagavad-gita', parseInt(chapter) || null, parseInt(verse) || null);
      }
    },

    bindEvents: function() {
      const that = this;

      // Event delegation for all reader controls
      document.addEventListener('click', function(e) {
        const nextBtn = e.target.closest('.book-next');
        if (nextBtn) {
          that.nextPage();
          return;
        }

        const prevBtn = e.target.closest('.book-prev');
        if (prevBtn) {
          that.prevPage();
          return;
        }

        const closeBtn = e.target.closest('.book-close');
        if (closeBtn) {
          that.closeBook();
          return;
        }

        const tocToggle = e.target.closest('.toc-toggle');
        if (tocToggle) {
          that.toggleTOC();
          return;
        }

        const tocClose = e.target.closest('.toc-close');
        if (tocClose) {
          that.toggleTOC();
          return;
        }

        const tocItem = e.target.closest('.toc-item');
        if (tocItem) {
          const chapterIdx = parseInt(tocItem.dataset.chapter);
          that.jumpToChapter(chapterIdx);
          return;
        }

        const fontSizeInc = e.target.closest('.font-size-inc');
        if (fontSizeInc) {
          that.adjustFontSize(1);
          return;
        }

        const fontSizeDec = e.target.closest('.font-size-dec');
        if (fontSizeDec) {
          that.adjustFontSize(-1);
          return;
        }

        const copyBtn = e.target.closest('.copy-verse');
        if (copyBtn) {
          that.copyVerse();
          return;
        }

        const shareBtn = e.target.closest('.share-whatsapp');
        if (shareBtn) {
          that.shareWhatsApp();
          return;
        }

        // Language toggle
        const langToggle = e.target.closest('.book-lang-toggle');
        if (langToggle) {
          that.toggleLanguage();
          return;
        }

        const langOption = e.target.closest('.book-lang-option');
        if (langOption) {
          that.setLanguage(langOption.dataset.lang);
          return;
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (!that.isOpen()) return;

        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            that.prevPage();
            break;
          case 'ArrowRight':
            e.preventDefault();
            that.nextPage();
            break;
          case 'Escape':
            e.preventDefault();
            that.closeBook();
            break;
        }
      });

      // Swipe gestures for mobile
      let startX = 0;
      let endX = 0;

      document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      }, { passive: true });

      document.addEventListener('touchend', function(e) {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            that.nextPage();
          } else {
            that.prevPage();
          }
        }
      }, { passive: true });
    },

    setLanguage: function(lang) {
      this.lang = lang;
      localStorage.setItem('sanatan_lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      if (this.isOpen() && this.currentVerse) {
        this.renderPage(this.currentChapter, this.currentVerse);
      }
    },

    toggleLanguage: function() {
      const options = ['hi', 'en', 'all'];
      const currentIndex = options.indexOf(this.lang);
      const nextIndex = (currentIndex + 1) % options.length;
      this.setLanguage(options[nextIndex]);
    },

    openBook: function(bookId, chapterNum, verseNum) {
      // Find the book
      const books = window.SCRIPTURES_DATA || [];
      this.currentBook = books.find(b => (b.id || b.title) === bookId) || books[0];

      if (!this.currentBook) return;

      // Build chapters array
      this.chapters = [];

      // Add main chapters if they exist as separate objects
      if (this.currentBook.chapters) {
        this.chapters = this.currentBook.chapters.map(ch => ({ type: 'chapter', data: ch }));
      }

      // Add verses if they exist
      if (this.currentBook.verses) {
        this.chapters.push({ type: 'verse', data: this.currentBook.verses });
      }

      // If we have chapter structure
      if (this.currentBook.chapters || this.currentBook.verses) {
        // Handle chapter number from URL
        if (chapterNum && this.currentBook.chapters) {
          const chapterData = this.currentBook.chapters.find(c => c.chapterNumber === chapterNum);
          if (chapterData) {
            this.currentChapter = chapterData;
            this.currentIndex = chapterNum - 1;
            this.totalPages = this.currentBook.chapters.length;

            // Handle verse number
            if (verseNum && chapterData.verses) {
              const verse = chapterData.verses.find(v => v.verseNumber === verseNum);
              if (verse) {
                this.currentVerse = verse;
                this.openReader(chapterData, verse);
                return;
              }
            }

            this.openReader(chapterData);
            return;
          }
        }
      }

      // Fallback for simple structure
      this.totalPages = 1;
      this.openReader(this.currentBook);
    },

    openReader: function(chapter, verse) {
      this.currentChapter = chapter;
      this.currentVerse = verse;

      // Create overlay
      let overlay = document.getElementById('book-reader-overlay');
      if (!overlay) {
        overlay = this.createReaderOverlay();
        document.body.appendChild(overlay);
      }

      overlay.classList.add('active');

      // Update content
      this.renderPage(chapter, verse);

      // Play page turn sound
      this.playPageTurn();
    },

    createReaderOverlay: function() {
      const overlay = document.createElement('div');
      overlay.id = 'book-reader-overlay';
      overlay.className = 'book-reader-overlay';
      overlay.innerHTML = `
        <div class="book-reader-modal" role="dialog" aria-modal="true">
          <div class="book-reader-content">
            <div class="book-language-bar">
              <span class="book-lang-label">भाषा / Language:</span>
              <div class="book-lang-toggle">
                <span class="book-lang-option ${this.lang === 'hi' ? 'active' : ''}" data-lang="hi">HI</span>
                <span class="book-lang-option ${this.lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                <span class="book-lang-option ${this.lang === 'all' ? 'active' : ''}" data-lang="all">ALL</span>
              </div>
            </div>
            <div class="book-pages">
              <div class="book-page left-page" id="left-page">
                <div class="page-content">
                  <div class="page-header"></div>
                  <div class="page-artwork"></div>
                  <img src="" alt="" class="page-image" onerror="this.style.display='none'">
                </div>
                <div class="page-folio"></div>
              </div>
              <div class="book-page right-page" id="right-page">
                <div class="page-content">
                  <div class="page-header">
                    <span class="page-title"></span>
                    <span class="page-number"></span>
                  </div>
                  <div class="verse-sanskrit"></div>
                  <div class="verse-transliteration"></div>
                  <div class="verse-hindi-meaning"></div>
                  <div class="verse-meaning"></div>
                </div>
                <div class="page-folio"></div>
              </div>
            </div>

            <div class="book-controls">
              <button class="book-prev" aria-label="Previous Page">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 12H3l4-4z"/>
                </svg>
              </button>

              <div class="book-nav">
                <button class="font-size-btn font-size-dec" aria-label="Decrease Font Size">A-</button>
                <button class="font-size-btn font-size-inc" aria-label="Increase Font Size">A+</button>
              </div>

              <button class="book-next" aria-label="Next Page">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M4 12h13l-4 4z"/>
                </svg>
              </button>
            </div>

            <div class="book-sidebar">
              <button class="toc-toggle" aria-label="Table of Contents">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
              </button>

              <button class="copy-verse" aria-label="Copy Verse">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16 1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                </svg>
              </button>

              <button class="share-whatsapp" aria-label="Share on WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7.3 13.7l-.8-.5-3.5 1.3 1.1-1.2 3.1-1.2 3.1 3.1-1.6 3.1-3.5-1.3 2.9-2.8-1.5-3.1-3.1 3.1z"/>
                </svg>
              </button>

              <button class="book-close" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="toc-container" id="toc-container">
            <button class="toc-close" aria-label="Close TOC">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M18.36 6.64l-10.72 10.72M5.64 6.64l10.72 10.72"/>
              </svg>
            </button>
            <h3>Table of Contents</h3>
            <div class="toc-list" id="toc-list"></div>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .book-reader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s;
        }
        .book-reader-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .book-reader-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .book-language-bar {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid rgba(107, 15, 26, 0.1);
          font-size: 0.75rem;
        }
        body.dark .book-language-bar {
          background: rgba(45, 31, 18, 0.95);
        }
        .book-lang-label {
          color: var(--sandalwood, #2C1810);
          font-weight: 500;
        }
        .book-lang-toggle {
          display: inline-flex;
          gap: 0.125rem;
          background: var(--parchment, #FAF3E0);
          border: 1px solid var(--gold, #D4AF37);
          border-radius: 9999px;
          padding: 0.125rem;
        }
        .book-lang-option {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.65rem;
          font-weight: 500;
          color: var(--maroon, #6B0F1A);
          background: transparent;
          transition: all 0.2s;
        }
        .book-lang-option.active,
        .book-lang-option:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .book-lang-option {
          color: var(--maroon, #6B0F1A);
        }
        .book-reader-content {
          flex: 1;
          display: flex;
          gap: 1rem;
          padding: 1rem;
          overflow: hidden;
        }
        .book-pages {
          flex: 1;
          display: flex;
          gap: 1rem;
          overflow: hidden;
        }
        .book-page {
          width: 45%;
          background: var(--parchment, #FAF3E0);
          border-radius: 0.75rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          position: relative;
        }
        body.dark .book-page {
          background: var(--bhojpatra, #2d1f12);
        }
        .left-page {
          order: 1;
        }
        .right-page {
          order: 2;
        }
        .page-content {
          padding: 1.5rem;
          height: 100%;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        .page-header {
          position: sticky;
          top: 0;
          z-index: 5;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(5px);
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          margin-bottom: 1rem;
        }
        .page-title {
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          color: var(--maroon, #6B0F1A);
          margin: 0 0 0.5rem 0;
        }
        .chapter-name {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--sandalwood, #2C1810);
          margin: 0;
          opacity: 0.8;
        }
        .page-number {
          font-size: 0.85rem;
          color: var(--sandalwood, #6B0F10);
          opacity: 0.6;
        }
        .page-artwork {
          text-align: center;
          margin-bottom: 1rem;
        }
        .page-image {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          border-radius: 0.5rem;
        }
        .verse-sanskrit {
          font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
          font-size: 1.2rem;
          line-height: 1.7;
          color: var(--maroon, #6B0F1A);
          text-align: center;
          margin-bottom: 1rem;
          font-weight: 500;
        }
        body.dark .verse-sanskrit {
          color: #e8d4b0;
        }
        .verse-transliteration {
          font-family: 'Tiro Devanagari Sanskrit', 'Noto Sans', sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--sandalwood, #2C1810);
          text-align: center;
          font-style: italic;
          margin-bottom: 1rem;
          opacity: 0.9;
        }
        .verse-hindi-meaning {
          font-family: 'Noto Serif Devanagari', sans-serif;
          font-size: 1rem;
          line-height: 1.7;
          color: #6B0F1A;
          text-align: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: var(--gold, #D4AF37);
          background: linear-gradient(135deg, var(--gold, #D4AF37) 0%, #C5AE00 100%);
          border-radius: 0.75rem;
        }
        body.dark .verse-hindi-meaning {
          color: var(--parchment, #FAF3E0);
        }
        .verse-meaning {
          font-family: 'Noto Sans', Arial, sans-serif;
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--sandalwood, #2C1810);
          text-align: justify;
        }
        body.dark .verse-meaning {
          color: #f5e6d3;
        }
        .book-controls {
          position: sticky;
          bottom: 0;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        body.dark .book-controls {
          background: rgba(45, 31, 18, 0.95);
        }
        .book-controls button {
          background: var(--parchment, #FAF3E0);
          border: 1px solid var(--gold, #D4AF37);
          border-radius: 0.75rem;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .book-controls button:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .book-controls button {
          background: var(--bhojpatra, #2d1f12);
        }
        .book-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .font-size-btn {
          width: 2rem;
          height: 2rem;
          font-weight: bold;
        }
        .book-sidebar {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
        }
        .book-sidebar button {
          width: auto;
          height: auto;
          padding: 0.5rem;
          background: none;
          border: none;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          font-size: 1.25rem;
        }
        .book-sidebar button:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
          border-radius: 50%;
        }
        .toc-container {
          position: absolute;
          top: 0;
          right: -300px;
          width: 300px;
          height: 100%;
          background: var(--parchment, #FAF3E0);
          box-shadow: -10px 0 20px rgba(0, 0, 0, 0.2);
          transition: right 0.3s ease;
          z-index: 49;
          overflow-y: auto;
        }
        .toc-container.open {
          right: 0;
        }
        body.dark .toc-container {
          background: var(--bhojpatra, #2d1f12);
        }
        .toc-container h3 {
          font-family: 'Cinzel', serif;
          padding: 1rem;
          margin: 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          color: var(--maroon, #6B0F1A);
        }
        .toc-list {
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .toc-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
          font-size: 0.9rem;
        }
        .toc-item:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        @media (max-width: 768px) {
          .book-page {
            width: 48%;
          }
          .book-language-bar {
            padding: 0.5rem 0.75rem;
          }
        }
      `;
      document.head.appendChild(style);

      return overlay;
    },

    renderPage: function(chapter, verse) {
      if (!chapter) return;

      const leftPage = document.getElementById('left-page');
      const rightPage = document.getElementById('right-page');

      if (!leftPage || !rightPage) return;

      // Update header
      const pageHeader = rightPage.querySelector('.page-header');
      const pageTitle = rightPage.querySelector('.page-title');
      const pageNumber = rightPage.querySelector('.page-number');
      const chapterName = rightPage.querySelector('.chapter-name');

      if (pageTitle) {
        pageTitle.textContent = this.currentBook?.title || 'Scripture';
      }
      if (chapterName) {
        chapterName.textContent = chapter.title || '';
      }
      if (pageHeader) {
        pageHeader.innerHTML = `
          <span class="book-name">${this.currentBook?.title || 'Scriptures'}</span>
          ${chapter.title ? `<span class="chapter-name">${chapter.title}</span>` : ''}
        `;
      }
      if (pageNumber) {
        pageNumber.textContent = this.currentIndex + 1;
      }

      // Left page - artwork/illustration
      const leftContent = leftPage.querySelector('.page-content');
      if (leftContent) {
        leftContent.innerHTML = `
          <div class="page-header"></div>
          <div class="page-artwork">
            <img src="${chapter.illustration || ''}" alt="${chapter.title || 'Illustration'}" class="page-image" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"no-image\">No illustration available</div>'">
          </div>
          <img src="" alt="" class="page-image" style="display:none">
        `;
      }

      // Right page - verse content with trilingual support
      const verseSanskrit = rightPage.querySelector('.verse-sanskrit');
      const verseTrans = rightPage.querySelector('.verse-transliteration');
      const verseHindi = rightPage.querySelector('.verse-hindi-meaning');
      const verseMeaning = rightPage.querySelector('.verse-meaning');

      if (verse) {
        // Sanskrit always shown
        if (verseSanskrit) {
          verseSanskrit.textContent = verse.sanskrit || '';
        }

        // Transliteration always shown
        if (verseTrans) {
          verseTrans.textContent = verse.transliteration || '';
        }

        // Hindi meaning shown in hi mode, or all mode (with styling)
        if (verseHindi) {
          if (this.lang === 'hi' || this.lang === 'all') {
            verseHindi.textContent = verse.hindiMeaning || verse.meaning || '';
            verseHindi.style.display = 'block';
          } else {
            verseHindi.style.display = 'none';
          }
        }

        // English meaning shown in en mode, or all mode (with styling)
        if (verseMeaning) {
          if (this.lang === 'en' || this.lang === 'all') {
            verseMeaning.textContent = verse.meaning || '';
            verseMeaning.style.display = 'block';
          } else {
            verseMeaning.style.display = 'none';
          }
        }

        // Show copy/share buttons
        const copyBtn = document.querySelector('.copy-verse');
        const shareBtn = document.querySelector('.share-whatsapp');
        if (copyBtn) copyBtn.style.display = 'block';
        if (shareBtn) shareBtn.style.display = 'block';
      } else {
        if (verseSanskrit) verseSanskrit.textContent = '';
        if (verseTrans) verseTrans.textContent = '';
        if (verseHindi) verseHindi.style.display = 'none';
        if (verseMeaning) verseMeaning.style.display = 'none';
        const copyBtn = document.querySelector('.copy-verse');
        const shareBtn = document.querySelector('.share-whatsapp');
        if (copyBtn) copyBtn.style.display = 'none';
        if (shareBtn) shareBtn.style.display = 'none';
      }
    },

    nextPage: function() {
      if (!this.isOpen()) return;

      this.currentIndex++;

      if (this.currentIndex < this.totalPages) {
        const nextChapter = this.chapters[this.currentIndex];
        if (nextChapter) {
          if (nextChapter.type === 'verse') {
            // Find next chapter with verses
            this.renderPage(nextChapter.data[0] || nextChapter.data);
          } else {
            this.renderPage(nextChapter.data);
          }
        }
        this.playPageTurn();
      } else {
        this.closeBook();
      }
    },

    prevPage: function() {
      if (!this.isOpen()) return;

      if (this.currentIndex > 0) {
        this.currentIndex--;
        const prevChapter = this.chapters[this.currentIndex];
        if (prevChapter) {
          if (prevChapter.type === 'verse') {
            this.renderPage(prevChapter.data[0] || prevChapter.data);
          } else {
            this.renderPage(prevChapter.data);
          }
        }
        this.playPageTurn();
      }
    },

    jumpToChapter: function(chapterIdx) {
      if (chapterIdx >= 0 && chapterIdx < this.totalPages) {
        this.currentIndex = chapterIdx;
        const chapter = this.chapters[chapterIdx];
        if (chapter) {
          if (chapter.type === 'verse') {
            this.renderPage(chapter.data[0]);
          } else {
            this.renderPage(chapter.data);
          }
        }
        this.toggleTOC();
        this.playPageTurn();
      }
    },

    toggleTOC: function() {
      const tocContainer = document.getElementById('toc-container');
      if (tocContainer) {
        tocContainer.classList.toggle('open');

        if (tocContainer.classList.contains('open')) {
          this.renderTOC();
        }
      }
    },

    renderTOC: function() {
      const tocList = document.getElementById('toc-list');
      if (!tocList || !this.currentBook || !this.currentBook.chapters) return;

      let html = '';
      this.currentBook.chapters.forEach((chapter, idx) => {
        html += `<div class="toc-item" data-chapter="${idx}">${chapter.title || `Chapter ${idx + 1}`}</div>`;
      });

      tocList.innerHTML = html;
    },

    adjustFontSize: function(delta) {
      const body = document.body;
      const oldSize = body.classList.contains('font-small') ? -1 :
                      body.classList.contains('font-large') ? 1 : 0;
      const newSize = oldSize + delta;

      body.classList.remove('font-small', 'font-medium', 'font-large');

      if (newSize < 0) {
        body.classList.add('font-small');
      } else if (newSize > 0) {
        body.classList.add('font-large');
      } else {
        body.classList.add('font-medium');
      }
    },

    copyVerse: function() {
      if (!this.currentVerse) return;

      const text = `${this.currentVerse.sanskrit}\n${this.currentVerse.transliteration}\n${this.currentVerse.meaning}`;

      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Verse copied to clipboard');
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('Verse copied to clipboard');
      });
    },

    shareWhatsApp: function() {
      if (!this.currentBook || !this.currentVerse) return;

      const text = `${this.currentBook.title}:${this.currentVerse.sanskrit}\n${this.currentVerse.transliteration}\n${this.currentVerse.meaning}`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    },

    showToast: function(message) {
      let toast = document.getElementById('book-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'book-toast';
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.className = 'toast-show';

      setTimeout(() => {
        toast.className = '';
      }, 3000);
    },

    isOpen: function() {
      const overlay = document.getElementById('book-reader-overlay');
      return overlay && overlay.classList.contains('active');
    },

    closeBook: function() {
      const overlay = document.getElementById('book-reader-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      this.currentItem = null;
      this.currentChapter = null;
      this.currentVerse = null;

      // Clean up URL
      const url = new URL(window.location);
      url.searchParams.delete('book');
      url.searchParams.delete('ch');
      url.searchParams.delete('v');
      window.history.pushState({}, '', url);
    },

    initAudio: function() {
      // Initialize audio context for page turn sounds
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not available');
      }
    },

    playPageTurn: function() {
      if (!this.audioContext) return;

      // Create a simple page turn sound
      const duration = 0.1;
      const sampleRate = this.audioContext.sampleRate;
      const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);

      // Create a paper rustle-like sound
      for (let i = 0; i < sampleRate * duration; i++) {
        const t = i / sampleRate;
        data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 20) * 0.1;
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(this.audioContext.destination);
      source.start(0);
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('search-input')) {
        BookReader.init();
      }
    });
  } else {
    if (document.getElementById('search-input')) {
      BookReader.init();
    }
  }

  // Expose globally
  window.BookReader = BookReader;

})();