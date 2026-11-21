// Sanatan Dharma Mahakosh - In-App Live Encyclopedia Engine
// Background Wikipedia/Wikisource API fetcher with Royal Parchment Reader Modal
// NO EXTERNAL REDIRECTS - All content rendered inside own modal

(function() {
  'use strict';

  const LiveEncyclopedia = {
    currentResult: null,
    currentContent: null,
    isModalOpen: false,
    isLoading: false,

    // API endpoints (CORS-enabled)
    API_ENDPOINTS: {
      wikipediaSearch: 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={query}&format=json&origin=*',
      wikipediaExtract: 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&titles={title}&exintro=false&explaintext=true&exsectionformat=wiki&format=json&origin=*',
      wikisourceSearch: 'https://en.wikisource.org/w/api.php?action=query&list=search&srsearch={query}&srnamespace=0&format=json&origin=*',
      wikisourceText: 'https://en.wikisource.org/w/api.php?action=query&prop=extracts&explaintext=true&titles={title}&format=json&origin=*'
    },

    /**
     * Initialize the live encyclopedia engine
     */
    init: function() {
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
      });
    },

    /**
     * Fetch content from Wikipedia/Wikisource by title
     */
    fetchByName: async function(title) {
      if (!title) return;

      this.showLoading(true);

      try {
        // Try Wikipedia first
        const result = await this.fetchFromWikipedia(title);
        if (result) {
          this.openModal(result, title, 'Wikipedia');
          return;
        }

        // Fallback to Wikisource
        const wsResult = await this.fetchFromWikisource(title);
        if (wsResult) {
          this.openModal(wsResult, title, 'Wikisource');
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
        // First, search to find the exact article
        const searchResults = await this.searchWikipedia(query);

        if (searchResults && searchResults.length > 0) {
          const article = searchResults[0];
          const extract = await this.fetchExtract(article.title);

          if (extract) {
            this.openModal(extract, article.title, 'Wikipedia', article.thumbnail);
            return;
          }
        }

        // Try direct fetch
        const extract = await this.fetchExtract(query);
        if (extract) {
          this.openModal(extract, query, 'Wikipedia');
        } else {
          this.showError(`"${query}" not found. Try a different search term.`);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        this.showError('Failed to fetch content. Please check your connection.');
      } finally {
        this.showLoading(false);
      }
    },

    /**
     * Fetch from Wikipedia search API
     */
    fetchFromWikipedia: async function(title) {
      const url = this.API_ENDPOINTS.wikipediaExtract
        .replace('{title}', encodeURIComponent(title));

      const response = await fetch(url);
      const data = await response.json();

      const pages = data.query?.pages;
      if (!pages) return null;

      for (const pageId in pages) {
        const page = pages[pageId];
        if (page.extract) {
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
     * Fetch extract from Wikipedia
     */
    fetchExtract: async function(title) {
      const url = this.API_ENDPOINTS.wikipediaExtract
        .replace('{title}', encodeURIComponent(title));

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
     * Search Wikipedia
     */
    searchWikipedia: async function(query) {
      const url = this.API_ENDPOINTS.wikipediaSearch
        .replace('{query}', encodeURIComponent(query));

      const response = await fetch(url);
      const data = await response.json();

      return data.query?.search?.slice(0, 5) || [];
    },

    /**
     * Fetch from Wikisource
     */
    fetchFromWikisource: async function(title) {
      const url = this.API_ENDPOINTS.wikisourceSearch
        .replace('{query}', encodeURIComponent(title));

      const response = await fetch(url);
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

      return null;
    },

    /**
     * Open the Royal Parchment Reader Modal
     */
    openModal: function(content, title, source, thumbnail = null) {
      this.currentContent = content;
      this.currentResult = { title, source };

      let modal = document.getElementById('live-reader-modal');
      if (!modal) {
        modal = this.createModal();
        document.body.appendChild(modal);
      }

      // Update content
      const modalTitle = modal.querySelector('.live-reader-title');
      const modalSource = modal.querySelector('.live-reader-source');
      const modalContent = modal.querySelector('.live-reader-content');
      const modalThumbnail = modal.querySelector('.live-reader-thumbnail');

      if (modalTitle) modalTitle.textContent = title;
      if (modalSource) modalSource.textContent = `Source: ${source}`;
      if (thumbnail && modalThumbnail) {
        modalThumbnail.src = thumbnail;
        modalThumbnail.style.display = 'block';
      } else if (modalThumbnail) {
        modalThumbnail.style.display = 'none';
      }

      // Parse content (handle newlines and basic formatting)
      if (modalContent && content.extract) {
        modalContent.innerHTML = this.formatContent(content.extract);
      }

      modal.classList.add('active');
      this.isModalOpen = true;

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
              <button class="live-reader-close font-size-dec touch-target" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.36 6.64l-10.72 10.72M5.64 6.64l10.72 10.72"/>
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

      // Wrap in paragraphs
      if (!html.includes('<p>')) {
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
        const results = await this.searchWikipedia(query);
        if (results && results.length > 0) {
          const article = results[0];
          const extract = await this.fetchExtract(article.title);
          if (extract) {
            this.openModal(extract, article.title, 'Wikipedia');
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