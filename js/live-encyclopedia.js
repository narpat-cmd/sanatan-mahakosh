// Sanatan Dharma Mahakosh - In-App Live Encyclopedia Engine
// Background Wikipedia/Wikisource API fetcher with Royal Parchment Reader Modal
// NO EXTERNAL REDIRECTS - All content rendered inside own modal
// Supports trilingual modes: hi (Hindi/Sanskrit via hi.*), en (English), all (both)

(function() {
  'use strict';

  const LiveEncyclopedia = {
    currentResult: null,
    currentContent: null,
    isModalOpen: false,
    isLoading: false,
    lang: 'hi',

    // API endpoints (CORS-enabled) - using language-specific domains
    API_ENDPOINTS: {
      // English Wikipedia endpoints
      wikipediaSearchEn: 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json&origin=*',
      wikipediaExtractEn: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&titles={title}&exintro=false&explaintext=true&exsectionformat=wiki&format=json&origin=*',

      // Hindi Wikipedia endpoints
      wikipediaSearchHi: 'https://hi.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json&origin=*',
      wikipediaExtractHi: 'https://hi.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&titles={title}&exintro=false&explaintext=true&exsectionformat=wiki&format=json&origin=*',

      // English Wikisource endpoints
      wikisourceSearchEn: 'https://en.wikisource.org/w/api.php?action=query&list=search&srsearch={query}&srnamespace=0&format=json&origin=*',
      wikisourceTextEn: 'https://en.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=true&titles={title}&format=json&origin=*',

      // Hindi Wikisource endpoints
      wikisourceSearchHi: 'https://hi.wikisource.org/w/api.php?action=query&list=search&srsearch={query}&srnamespace=0&format=json&origin=*',
      wikisourceTextHi: 'https://hi.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=true&titles={title}&format=json&origin=*'
    },

    /**
     * Initialize the live encyclopedia engine
     */
    init: function() {
      this.lang = localStorage.getItem('sanatan_lang') || 'hi';
      document.documentElement.setAttribute('data-lang', this.lang);
      this.bindEvents();
      this.checkUrlParams();
    },

    /**
     * Check URL params for live fetch requests
     */
    checkUrlParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const fetchContent = urlParams.get('fetch');
      const fetchId = urlParams.get('id');

      if (fetchContent) {
        this.fetchAndOpen(fetchContent);
      } else if (fetchId) {
        this.fetchByName(fetchId);
      }
    },

    /**
     * Set language mode
     */
    setLanguage: function(lang) {
      this.lang = lang;
      localStorage.setItem('sanatan_lang', lang);
      document.documentElement.setAttribute('data-lang', lang);

      if (this.isModalOpen && this.currentResult) {
        this.refreshContent(lang);
      }
    },

    /**
     * Toggle language mode
     */
    toggleLanguage: function() {
      const options = ['hi', 'en', 'all'];
      const currentIndex = options.indexOf(this.lang);
      const nextIndex = (currentIndex + 1) % options.length;
      this.setLanguage(options[nextIndex]);
    },

    /**
     * Refresh content based on language
     */
    refreshContent: function(lang) {
      if (!this.currentResult) return;

      const title = this.currentResult.title;
      const source = this.currentResult.source;

      if (lang === 'en') {
        // Fetch English version
        this.fetchSingleLanguage(title, 'en').then(content => {
          this.openModal({ title, extract: content, source: 'English ' + source }, title, source);
        });
      } else if (lang === 'hi') {
        // Fetch Hindi version
        this.fetchSingleLanguage(title, 'hi').then(content => {
          this.openModal({ title, extract: content, source: 'Hindi ' + source }, title, source);
        });
      } else {
        // Fetch both and show combined
        Promise.all([
          this.fetchSingleLanguage(title, 'en'),
          this.fetchSingleLanguage(title, 'hi')
        ]).then(([enContent, hiContent]) => {
          const combined = this.combineContent(title, enContent, hiContent, source);
          this.openModal(combined, title, source);
        });
      }
    },

    /**
     * Combine English and Hindi content for 'all' mode
     */
    combineContent: function(title, enContent, hiContent, source) {
      return {
        title: title,
        extract: `<div class="content-hindi"><h3>हिंदी / Sanskrit</h3>${hiContent || 'नहीं मिला'}</div><div class="content-english"><h3>English</h3>${enContent || 'Not found'}</div>`,
        source: source,
        combined: true
      };
    },

    /**
     * Fetch single language content
     */
    fetchSingleLanguage: async function(title, lang) {
      if (lang === 'en') {
        const result = await this.fetchFromWikipedia(title, 'en');
        if (result) return result.extract;

        const wsResult = await this.fetchFromWikisource(title, 'en');
        if (wsResult) return wsResult.extract;
      } else if (lang === 'hi') {
        const result = await this.fetchFromWikipedia(title, 'hi');
        if (result) return result.extract;

        const wsResult = await this.fetchFromWikisource(title, 'hi');
        if (wsResult) return wsResult.extract;
      }
      return null;
    },

    /**
     * Bind event listeners
     */
    bindEvents: function() {
      const that = this;

      // Fetch content button
      document.addEventListener('click', function(e) {
        const fetchBtn = e.target.closest('.live-fetch-btn');
        if (fetchBtn) {
          e.preventDefault();
          const query = fetchBtn.dataset.query || fetchBtn.dataset.title;
          if (query) {
            that.fetchContent(query);
          }
        }

        // Modal close
        const modalClose = e.target.closest('.live-reader-close');
        if (modalClose) {
          that.closeModal();
        }

        // Font size controls
        const fontSizeInc = e.target.closest('.font-size-inc');
        if (fontSizeInc) {
          that.adjustFontSize(1);
        }

        const fontSizeDec = e.target.closest('.font-size-dec');
        if (fontSizeDec) {
          that.adjustFontSize(-1);
        }

        // Copy text
        const copyBtn = e.target.closest('.live-copy-btn');
        if (copyBtn) {
          that.copyContent();
        }

        // WhatsApp share
        const shareBtn = e.target.closest('.live-share-btn');
        if (shareBtn) {
          that.shareWhatsApp();
        }

        // Search from live reader
        const searchLink = e.target.closest('.live-search-link');
        if (searchLink) {
          e.preventDefault();
          const query = searchLink.dataset.query;
          that.searchGlobal(query);
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
    },

    /**
     * Fetch content from Wikipedia/Wikisource by title
     */
    fetchByName: async function(title) {
      if (!title) return;

      this.showLoading(true);

      try {
        // First fetch English version for display
        const result = await this.fetchFromWikipedia(title, 'en');
        if (result) {
          this.openModal(result, title, 'Wikipedia/English');
          return;
        }

        // Fallback to Hindi Wikipedia
        const hiResult = await this.fetchFromWikipedia(title, 'hi');
        if (hiResult) {
          this.openModal(hiResult, title, 'Wikipedia/Hindi');
          return;
        }

        // Try Wikisource (English first)
        const wsResult = await this.fetchFromWikisource(title, 'en');
        if (wsResult) {
          this.openModal(wsResult, title, 'Wikisource');
          return;
        }

        // Try Hindi Wikisource
        const wsHiResult = await this.fetchFromWikisource(title, 'hi');
        if (wsHiResult) {
          this.openModal(wsHiResult, title, 'Wikisource/Hindi');
          return;
        }

        // Not found
        this.showError('Content not found in Wikipedia or Wikisource');
      } catch (error) {
        console.error('Fetch error:', error);
        this.showError('Failed to fetch content. Please check your connection.');
      } finally {
        this.showLoading(false);
      }
    },

    /**
     * Fetch content by search query
     */
    fetchContent: async function(query) {
      if (!query) return;

      this.showLoading(true);

      try {
        // Determine language endpoint
        const searchUrl = this.lang === 'hi'
          ? this.API_ENDPOINTS.wikipediaSearchHi.replace('{query}', encodeURIComponent(query))
          : this.API_ENDPOINTS.wikipediaSearchEn.replace('{query}', encodeURIComponent(query));

        const response = await fetch(searchUrl);
        const data = await response.json();

        const searchResults = data.query?.search?.slice(0, 5) || [];

        if (searchResults && searchResults.length > 0) {
          const article = searchResults[0];

          if (this.lang === 'hi') {
            // Fetch from Hindi Wikipedia
            const hiResult = await this.fetchFromWikipedia(article.title, 'hi');
            if (hiResult) {
              hiResult.source = 'Wikipedia (Hindi)';
              this.openModal(hiResult, article.title, 'Wikipedia (Hindi)', article.thumbnail);
              return;
            }

            // Fallback to Hindi Wikisource
            const wsResult = await this.fetchFromWikisource(article.title, 'hi');
            if (wsResult) {
              wsResult.source = 'Wikisource (Hindi)';
              this.openModal(wsResult, article.title, 'Wikisource (Hindi)');
              return;
            }
          }

          // English fallback
          const articleEn = searchResults[0];
          const extract = await this.fetchExtract(articleEn.title, 'en');

          if (extract) {
            this.openModal(extract, articleEn.title, 'Wikipedia', article.thumbnail);
            return;
          }
        }

        this.showError(`"${query}" not found. Try a different search term.`);
      } catch (error) {
        console.error('Fetch error:', error);
        this.showError('Failed to fetch content. Please check your connection.');
      } finally {
        this.showLoading(false);
      }
    },

    /**
     * Fetch from Wikipedia with language support
     */
    fetchFromWikipedia: async function(title, lang = 'en') {
      const baseUrl = lang === 'hi' ? this.API_ENDPOINTS.wikipediaExtractHi : this.API_ENDPOINTS.wikipediaExtractEn;
      const url = baseUrl.replace('{title}', encodeURIComponent(title));

      const response = await fetch(url);
      const data = await response.json();

      const pages = data.query?.pages;
      if (!pages) return null;

      for (const pageId in pages) {
        const page = pages[pageId];
        if (page.extract && !page.missing) {
          return {
            title: page.title,
            extract: page.extract,
            thumbnail: page.thumbnail?.source
          };
        }
      }

      return null;
    },

    /**
     * Fetch extract from Wikipedia with language support
     */
    fetchExtract: async function(title, lang = 'en') {
      const baseUrl = lang === 'hi' ? this.API_ENDPOINTS.wikipediaExtractHi : this.API_ENDPOINTS.wikipediaExtractEn;
      const url = baseUrl.replace('{title}', encodeURIComponent(title));

      const response = await fetch(url);
      const data = await response.json();

      const pages = data.query?.pages;
      if (!pages) return null;

      for (const pageId in pages) {
        const page = pages[pageId];
        if (page.extract && !page.missing) {
          return {
            title: page.title,
            extract: page.extract,
            thumbnail: page.thumbnail?.source
          };
        }
      }

      return null;
    },

    /**
     * Search Wikipedia with language support
     */
    searchWikipedia: async function(query, lang = 'en') {
      const baseUrl = lang === 'hi' ? this.API_ENDPOINTS.wikipediaSearchHi : this.API_ENDPOINTS.wikipediaSearchEn;
      const url = baseUrl.replace('{query}', encodeURIComponent(query));

      const response = await fetch(url);
      const data = await response.json();

      return data.query?.search?.slice(0, 5) || [];
    },

    /**
     * Fetch from Wikisource with language support
     */
    fetchFromWikisource: async function(title, lang = 'en') {
      if (lang === 'hi') {
        // Hindi Wikisource
        const searchUrl = this.API_ENDPOINTS.wikisourceSearchHi
          .replace('{query}', encodeURIComponent(title));

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.query?.search?.length > 0) {
          const firstResult = data.query.search[0];
          // Fetch the actual content
          const textUrl = this.API_ENDPOINTS.wikisourceTextHi
            .replace('{title}', firstResult.title);

          const textResponse = await fetch(textUrl);
          const textData = await textResponse.json();

          const pages = textData.query?.pages;
          if (pages) {
            for (const pageId in pages) {
              const page = pages[pageId];
              if (page.extract) {
                return {
                  title: page.title,
                  extract: page.extract,
                  thumbnail: null
                };
              }
            }
          }
        }
      } else {
        // English Wikisource
        const searchUrl = this.API_ENDPOINTS.wikisourceSearchEn
          .replace('{query}', encodeURIComponent(title));

        const response = await fetch(searchUrl);
        const data = await response.json();

        const pages = data.query?.pages;
        if (!pages) return null;

        for (const pageId in pages) {
          const page = pages[pageId];
          if (page.extract) {
            return {
              title: page.title,
              extract: page.extract,
              thumbnail: null
            };
          }
        }
      }

      return null;
    },

    /**
     * Open the Royal Parchment Reader Modal
     */
    openModal: function(content, title, source, thumbnail = null) {
      this.currentContent = content;
      this.currentResult = { title, source };
      this.isModalOpen = true;

      let modal = document.getElementById('live-reader-modal');
      if (!modal) {
        modal = this.createModal();
        document.body.appendChild(modal);
      }

      // Update content
      const modalTitle = modal.querySelector('.live-reader-title');
      const modalSource = modal.querySelector('.live-reader-source');
      const modalContentEl = modal.querySelector('.live-reader-content');
      const modalThumbnail = modal.querySelector('.live-reader-thumbnail');
      const langToggle = modal.querySelector('.book-lang-toggle');

      if (modalTitle) modalTitle.textContent = title;
      if (modalSource) modalSource.textContent = `Source: ${source}`;
      if (thumbnail && modalThumbnail) {
        modalThumbnail.src = thumbnail;
        modalThumbnail.style.display = 'block';
      } else if (modalThumbnail) {
        modalThumbnail.style.display = 'none';
      }

      // Update language toggle active state
      if (langToggle) {
        const options = langToggle.querySelectorAll('.book-lang-option');
        options.forEach(opt => opt.classList.remove('active'));
        const activeOpt = langToggle.querySelector(`.book-lang-option[data-lang="${this.lang}"]`);
        if (activeOpt) activeOpt.classList.add('active');
      }

      // Parse content (handle newlines and basic formatting)
      if (modalContentEl && content.extract) {
        modalContentEl.innerHTML = this.formatContent(content.extract);
      }

      modal.classList.add('active');

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('modal', 'live');
      url.searchParams.set('title', encodeURIComponent(title));
      window.history.pushState({}, '', url);
    },

    /**
     * Create the modal element
     */
    createModal: function() {
      const modal = document.createElement('div');
      modal.id = 'live-reader-modal';
      modal.className = 'live-reader-modal';
      modal.innerHTML = `
        <div class="live-reader-overlay" role="dialog" aria-modal="true">
          <div class="live-reader-container">
            <!-- Header -->
            <div class="live-reader-header glassmorphic">
              <h2 class="live-reader-title font-cinzel"></h2>
              <span class="live-reader-source text-sm opacity-80"></span>
              <div class="live-language-lang-bar">
                <div class="book-lang-toggle">
                  <span class="book-lang-option ${this.lang === 'hi' ? 'active' : ''}" data-lang="hi">HI</span>
                  <span class="book-lang-option ${this.lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                  <span class="book-lang-option ${this.lang === 'all' ? 'active' : ''}" data-lang="all">ALL</span>
                </div>
              </div>
              <button class="live-reader-close font-size-dec touch-target" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.36 6.64l-10.72 10.72M5.64 6.44l10.72 10.72"/>
                </svg>
              </button>
            </div>

            <!-- Thumbnail (if available) -->
            <img class="live-reader-thumbnail w-full object-cover max-h-48 mb-4 rounded-lg"
                 src="" alt="Content thumbnail" style="display: none;">

            <!-- Content -->
            <div class="live-reader-content p-6 sm:p-8 overflow-y-auto max-h-96">
              <!-- Content rendered here -->
            </div>

            <!-- Footer Controls -->
            <div class="live-reader-footer glassmorphic flex items-center justify-between p-4">
              <div class="controls-group">
                <button class="font-size-btn font-size-dec touch-target" aria-label="Decrease Font Size">A-</button>
                <button class="font-size-btn font-size-inc touch-target" aria-label="Increase Font Size">A+</button>
              </div>

              <div class="controls-group flex gap-2">
                <button class="live-copy-btn touch-target" aria-label="Copy Content">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M16 1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                  </svg>
                </button>
                <button class="live-share-btn touch-target" aria-label="Share on WhatsApp">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7.3 13.7l-.8-.5-3.5 1.3 1.1-1.2 3.1-1.2 3.1 3.1-1.6 3.1-3.5-1.3 2.9-2.8-1.5-3.1-3.1 3.1z"/>
                  </svg>
                </button>
                <button class="live-reader-close font-size-inc touch-target" aria-label="Close">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading overlay -->
          <div class="live-loading-overlay hidden">
            <div class="loading-spinner"></div>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .live-reader-modal {
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
        .live-reader-modal.active {
          opacity: 1;
          visibility: visible;
        }
        .live-reader-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .live-reader-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem;
        }
        .live-reader-header {
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .live-reader-title {
          flex: 1;
          margin: 0;
          font-size: 1.25rem;
          color: var(--maroon, #6B0F1A);
        }
        .live-reader-source {
          font-size: 0.875rem;
          background: rgba(212, 173, 55, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
        }
        .live-language-lang-bar button {
          background: none;
          border: none;
          padding: 0;
          width: auto;
          height: auto;
          min-width: auto;
          font-size: 0.75rem;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          margin-left: 0.5rem;
        }
        .live-reader-close {
          background: none;
          border: none;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .live-reader-close:hover {
          background: rgba(107, 15, 26, 0.1);
        }
        .live-reader-content {
          font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--sandalwood, #2C1810);
          text-align: justify;
        }
        body.dark .live-reader-content {
          color: #f5e6d3;
        }
        .live-reader-content h2, .live-reader-content h3, .live-reader-content h4 {
          color: var(--maroon, #6B0F1A);
          font-family: 'Cinzel', serif;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .live-reader-content p {
          margin: 0.75em 0;
        }
        .live-reader-content blockquote {
          background: var(--parchment, #FAF3E0);
          border-left: 4px solid var(--gold, #D4AF37);
          padding: 1rem;
          margin: 1em 0;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        body.dark .live-reader-content blockquote {
          background: var(--bhojpatra, #2d1f12);
        }
        .live-reader-footer {
          position: sticky;
          bottom: 0;
          z-index: 10;
          padding: 1rem 1.5rem;
        }
        .live-reader-thumbnail {
          max-height: 200px;
          object-fit: cover;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }
        .controls-group button {
          background: var(--parchment, #FAF3E0);
          border: 1px solid var(--gold, #D4AF37);
          border-radius: 0.5rem;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
          color: var(--maroon, #6B0F1A);
        }
        .controls-group button:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .controls-group button {
          background: var(--bhojpatra, #2d1f12);
          color: #f5e6d3;
        }
        .live-loading-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(212, 173, 55, 0.3);
          border-top-color: var(--gold, #D4AF37);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .book-lang-option {
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 500;
          color: var(--maroon, #6B0F1A);
          background: transparent;
          transition: all 0.2s;
        }
        .book-lang-option.active {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        .content-hindi {
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding-bottom: 1rem;
        }
        .content-hindi h3 {
          color: var(--maroon, #6B0F1A);
        }
        .content-english h3 {
          color: var(--maroon, #6B0F1A);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      return modal;
    },

    /**
     * Format raw Wikipedia text into HTML
     */
    formatContent: function(rawText) {
      if (!rawText) return '';

      let html = rawText;

      // Convert line breaks
      html = html.replace(/\n\n+/g, '</p><p>');
      html = html.replace(/\n/g, '<br>');

      // Extract headings
      html = html.replace(/^(={1,6})\s*(.+?)\s*\1/gm, '<h3>$2</h3>');

      // Handle bold/italic markers (Wikipedia uses ''')
      html = html.replace(/'''([^']+)'''/g, '<strong>$1</strong>');
      html = html.replace(/''([^']+)''/g, '<em>$1</em>');

      // Handle Hindi content styling
      if (html.includes('content-hindi')) {
        html = html.replace(/<div class="content-hindi">/g, '<div class="content-hindi"><div class="verse-sanskrit">');
        html = html.replace(/<div class="content-english">/g, '<div class="content-english"><div class="verse-meaning">');
      }

      // Wrap in paragraphs
      if (!html.includes('<p>') && !html.includes('content-hindi')) {
        html = '<p>' + html + '</p>';
      }

      return html;
    },

    /**
     * Close the modal
     */
    closeModal: function() {
      const modal = document.getElementById('live-reader-modal');
      if (modal) {
        modal.classList.remove('active');
      }
      this.isModalOpen = false;

      // Update URL
      const url = new URL(window.location);
      url.searchParams.delete('modal');
      url.searchParams.delete('title');
      url.searchParams.delete('fetch');
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);
    },

    /**
     * Toggle font size
     */
    adjustFontSize: function(delta) {
      const content = document.querySelector('.live-reader-content');
      if (!content) return;

      const currentSize = parseInt(content.style.fontSize) || 18;
      const newSize = Math.max(12, Math.min(28, currentSize + delta * 2));
      content.style.fontSize = newSize + 'px';
    },

    /**
     * Show loading state
     */
    showLoading: function(show) {
      this.isLoading = show;
      const overlay = document.querySelector('.live-loading-overlay');
      if (overlay) {
        overlay.classList.toggle('hidden', !show);
      }
    },

    /**
     * Show error message
     */
    showError: function(message) {
      const toast = document.createElement('div');
      toast.className = 'live-error-toast fixed bottom-20 right-4 bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-sm z-50';
      toast.textContent = message;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => toast.remove(), 300);
      }, 5000);
    },

    /**
     * Copy content to clipboard
     */
    copyContent: async function() {
      if (!this.currentContent || !this.currentContent.extract) return;

      try {
        await navigator.clipboard.writeText(this.currentContent.extract);
        this.showToast('Content copied to clipboard');
      } catch (e) {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = this.currentContent.extract;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.showToast('Content copied to clipboard');
      }
    },

    /**
     * Share via WhatsApp
     */
    shareWhatsApp: function() {
      if (!this.currentContent || !this.currentContent.extract) return;

      const text = this.currentContent.extract.substring(0, 500) +
                     (this.currentContent.extract.length > 500 ? '...' : '');
      const title = this.currentResult?.title || 'Sanatan Dharma';
      const url = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${text}`)}`;

      window.open(url, '_blank');
    },

    /**
     * Search globally
     */
    searchGlobal: function(query) {
      const closeBtn = document.querySelector('.live-reader-close');
      if (closeBtn) {
        closeBtn.click();
      }

      const input = document.getElementById('search-input');
      if (input) {
        input.value = query;
        input.focus();
      }

      const searchWrapper = document.querySelector('.search-container');
      if (searchWrapper) {
        searchWrapper.classList.add('active');
      }
    },

    /**
     * Show toast notification
     */
    showToast: function(message) {
      let toast = document.getElementById('live-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'live-toast';
        toast.className = 'fixed top-4 right-4 glassmorphic px-4 py-3 rounded-lg shadow-lg z-50';
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.style.opacity = '1';

      setTimeout(() => {
        toast.style.opacity = '0';
      }, 3000);
    },

    /**
     * Fetch from Wikipedia search
     */
    fetchAndOpen: async function(query) {
      this.showLoading(true);

      try {
        const lang = this.lang === 'hi' ? 'hi' : 'en';
        const results = await this.searchWikipedia(query, lang);
        if (results && results.length > 0) {
          const article = results[0];
          const extract = await this.fetchExtract(article.title, lang);
          if (extract) {
            this.openModal(extract, article.title, lang === 'hi' ? 'Wikipedia (Hindi)' : 'Wikipedia');
          } else {
            this.showError('Could not retrieve article content');
          }
        } else {
          this.showError(`"${query}" not found`);
        }
      } catch (error) {
        this.showError('Failed to fetch content');
      } finally {
        this.showLoading(false);
      }
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.LiveEncyclopedia = LiveEncyclopedia;
      LiveEncyclopedia.init();
    });
  } else {
    window.LiveEncyclopedia = LiveEncyclopedia;
    LiveEncyclopedia.init();
  }

  // Expose globally
  window.LiveEncyclopedia = LiveEncyclopedia;

})();