// Sanatan Dharma Mahakosh - Cross-Page Universal Search Engine

(function() {
  'use strict';

  const SearchEngine = {
    searchQuery: '',
    isSearchOpen: false,
    results: [],

    init: function() {
      this.bindEvents();
      this.initGlobalSearch();
    },

    bindEvents: function() {
      this.bindOverlayEvents();
      const that = this;

      // Search input events
      document.addEventListener('input', function(e) {
        if (e.target && (e.target.id === 'search-input' || e.target.closest('#search-input'))) {
          const query = e.target.value.trim();
          if (query.length > 0) {
            that.performSearch(query);
            that.displayResults(query);
          } else {
            that.clearResults();
          }
        }
      });

      // Handle clicks on search results (event delegation)
      document.addEventListener('click', function(e) {
        const resultItem = e.target.closest('.search-result-item');
        if (resultItem) {
          e.preventDefault();
          const page = resultItem.dataset.page;
          const url = resultItem.dataset.url;

          if (url) {
            window.location.href = url;
          }
        }

        // Search suggestions
        const suggestion = e.target.closest('.search-suggestion');
        if (suggestion) {
          e.preventDefault();
          const query = suggestion.dataset.query;
          that.searchGlobal(query);
        }
      });

      // Escape key closes search
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          that.closeSearch();
        }
      });
    },

    // FIX: pages ka apna #openSearch / #searchOverlay / #universalSearch ab asli mein juda hai
    bindOverlayEvents: function() {
      const that = this;
      const overlay = () => document.getElementById('searchOverlay');
      const box = () => document.getElementById('searchResults');
      const input = () => document.getElementById('universalSearch');

      const open = () => {
        const o = overlay();
        if (!o) return;
        o.classList.remove('hidden');
        const i = input();
        if (i) setTimeout(() => i.focus(), 50);
      };
      const close = () => {
        const o = overlay();
        if (!o) return;
        o.classList.add('hidden');
        const i = input();
        if (i) i.value = '';
        const b = box();
        if (b) { b.innerHTML = ''; b.classList.add('hidden'); }
      };
      this.openOverlay = open;
      this.closeOverlay = close;

      document.addEventListener('click', function(e) {
        if (e.target.closest('#openSearch')) { open(); return; }
        if (e.target.closest('#closeSearch')) { close(); return; }
        const o = overlay();
        if (o && !o.classList.contains('hidden') && e.target.closest('#searchOverlay') && !e.target.closest('.glassmorphic')) {
          close();
        }
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') { close(); return; }
        const tag = (document.activeElement && document.activeElement.tagName) || '';
        if (e.key === '/' && !/INPUT|TEXTAREA/.test(tag)) { e.preventDefault(); open(); }
      });

      document.addEventListener('input', function(e) {
        if (!e.target || e.target.id !== 'universalSearch') return;
        const q = e.target.value.trim();
        const b = box();
        if (!b) return;
        if (!q) { b.innerHTML = ''; b.classList.add('hidden'); return; }
        that.performSearch(q);
        b.classList.remove('hidden');
        that.renderInto(b, q);
      });
    },

    renderInto: function(container, query) {
      const fixUrl = (r) => {
        let u = r.url;
        if (r.page === 'aarti') u = u.replace('?id=', '?modal=aarti&id=');
        else if (r.page === 'sanskars') u = u.replace('?id=', '?modal=sanskar&id=');
        else if (r.page === 'traditions') u = u.replace('?id=', '?modal=tradition&id=');
        else if (r.page === 'temples') u = u.replace('?id=', '?temple=');
        return u;
      };
      // duplicate hatao
      const seen = new Set();
      const list = this.results.filter(r => {
        const k = r.url + '|' + r.title;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      }).slice(0, 30);

      if (list.length === 0) {
        container.innerHTML = '<div style="padding:16px;text-align:center;opacity:.7">No results found</div>';
        return;
      }
      container.innerHTML = list.map(r => `
        <a href="${fixUrl(r)}" class="search-result-item" data-page="${r.page}" data-url="${fixUrl(r)}"
           style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;cursor:pointer;text-decoration:none;color:inherit;border-bottom:1px solid rgba(212,175,55,.2)">
          <span>${this.escapeHtml(r.title)}</span>
          <span style="font-size:12px;color:#D4AF37">${r.category}</span>
        </a>`).join('');
    },

    initGlobalSearch: function() {
      // Create global search UI if not exists (for pages without it)
      if (!document.getElementById('global-search')) {
        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper';
        searchWrapper.innerHTML = `
          <div class="search-container" id="global-search">
            <input type="text" id="search-input" placeholder="Search Sanatan Dharma..." autocomplete="off" />
            <div class="search-results" id="search-results"></div>
            <div class="search-suggestions" id="search-suggestions">
              <div class="search-suggestion" data-query="Gita 2.47">Gita 2.47</div>
              <div class="search-suggestion" data-query="Kedarnath">Kedarnath Temple</div>
              <div class="search-suggestion" data-query="Tilak">Tilak Types</div>
              <div class="search-suggestion" data-query="Rudraksha">Rudraksha Guide</div>
              <div class="search-suggestion" data-query="Hanuman Chalisa">Hanuman Chalisa</div>
            </div>
          </div>
        `;

        // Try to add to header if it exists
        const headerControls = document.querySelector('.header-controls');
        if (headerControls) {
          const searchBtn = document.createElement('button');
          searchBtn.className = 'global-search-btn';
          searchBtn.id = 'global-search-btn';
          searchBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 6.42 13.58 4 10.5 4S5 6.42 5 9.5 7.42 15 10.5 15c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z"/></svg>';
          headerControls.insertBefore(searchBtn, headerControls.firstChild);
        }

        this.bindGlobalSearchEvents();
      }
    },

    bindGlobalSearchEvents: function() {
      const that = this;
      const searchBtn = document.getElementById('global-search-btn');

      if (searchBtn) {
        searchBtn.addEventListener('click', function() {
          that.toggleSearch(true);
          document.getElementById('search-input')?.focus();
        });
      }
    },

    performSearch: function(query) {
      this.searchQuery = query.toLowerCase();
      this.results = [];

      // Helper to get searchable title strings from multilingual title object
      const getTitleStrings = (titleObj) => {
        if (!titleObj) return [];
        if (typeof titleObj === 'string') return [titleObj];
        return Object.values(titleObj).filter(Boolean);
      };

      // Search in scriptures
      const scriptures = window.SCRIPTURES_DATA || [];
      for (const book of scriptures) {
        const bookTitleStrings = getTitleStrings(book.title);
        const primaryTitle = bookTitleStrings[0] || book.id || 'Scripture';

        // Check if any title variant matches
        const titleMatch = bookTitleStrings.some(t => t && t.toLowerCase().includes(this.searchQuery));
        if (titleMatch) {
          this.results.push({
            title: primaryTitle,
            category: 'Scriptures',
            page: 'scriptures',
            url: `./scriptures.html?book=${book.id || 'bhagavad-gita'}`,
            matchType: 'book'
          });
        }

        // Check for chapter-level matches (from structure.chapters or structure.files)
        const chapters = book.structure?.chapters || book.structure?.files || [];
        if (chapters && chapters.length > 0) {
          for (const chapter of chapters) {
            const chapterTitle = typeof chapter.title === 'object'
              ? chapter.title.hi || chapter.title.en || chapter.title.sa
              : chapter.title;
            if (chapterTitle && chapterTitle.toLowerCase().includes(this.searchQuery)) {
              this.results.push({
                title: `${primaryTitle} - ${chapterTitle}`,
                category: 'Scriptures',
                page: 'scriptures',
                url: `./scriptures.html?book=${book.id}&ch=${chapter.key}`,
                matchType: 'chapter'
              });
            }
          }
        }
      }

      // Search in temples
      const temples = window.TEMPLES_DATA || [];
      for (const temple of temples) {
        if (temple.name && temple.name.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: temple.name,
            category: 'Temples',
            page: 'temples',
            url: `./temples.html?id=${temple.id}`,
            matchType: 'temple'
          });
        }
        if (temple.nameEnglish && temple.nameEnglish.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: temple.nameEnglish,
            category: 'Temples',
            page: 'temples',
            url: `./temples.html?id=${temple.id}`,
            matchType: 'temple'
          });
        }
        if (temple.deity && temple.deity.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: `${temple.name} - ${temple.deity}`,
            category: 'Temples',
            page: 'temples',
            url: `./temples.html?id=${temple.id}`,
            matchType: 'temple'
          });
        }
      }

      // Search in traditions - recursively search nested objects/arrays
      const traditions = window.TRADITIONS_DATA || [];
      const searchTraditionsItem = (item, basePath = '') => {
        if (!item || typeof item !== 'object') return;

        // Check if this item has name fields (leaf node)
        if (item.name && item.name.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: item.name,
            category: 'Traditions',
            page: 'traditions',
            url: `./traditions.html?id=${item.id || basePath}`,
            matchType: 'tradition'
          });
        }
        if (item.nameEnglish && item.nameEnglish.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: item.nameEnglish,
            category: 'Traditions',
            page: 'traditions',
            url: `./traditions.html?id=${item.id || basePath}`,
            matchType: 'tradition'
          });
        }

        // Recursively check nested properties
        for (const key in item) {
          const value = item[key];
          if (Array.isArray(value)) {
            value.forEach((subItem, idx) => searchTraditionsItem(subItem, `${basePath}/${key}/${idx}`));
          } else if (typeof value === 'object' && value !== null) {
            searchTraditionsItem(value, `${basePath}/${key}`);
          }
        }
      };

      // Iterate through all top-level items in traditions array
      traditions.forEach((item, idx) => searchTraditionsItem(item, String(idx)));

      // Search in sanskars
      const sanskars = window.SANSKARS_DATA || [];
      for (const sanskar of sanskars) {
        if (sanskar.name && sanskar.name.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: sanskar.name,
            category: 'Sanskars',
            page: 'sanskars',
            url: `./sanskars.html?id=${sanskar.id}`,
            matchType: 'sanskar'
          });
        }
        if (sanskar.nameEnglish && sanskar.nameEnglish.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: sanskar.nameEnglish,
            category: 'Sanskars',
            page: 'sanskars',
            url: `./sanskars.html?id=${sanskar.id}`,
            matchType: 'sanskar'
          });
        }
      }

      // Search in aarti
      const aarti = window.AARTI_DATA || [];
      for (const item of aarti) {
        if (item.title && item.title.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: item.title,
            category: 'Aarti',
            page: 'aarti',
            url: `./aarti.html?id=${item.id}`,
            matchType: 'aarti'
          });
        }
        if (item.titleEnglish && item.titleEnglish.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: item.titleEnglish,
            category: 'Aarti',
            page: 'aarti',
            url: `./aarti.html?id=${item.id}`,
            matchType: 'aarti'
          });
        }
        if (item.deity && item.deity.toLowerCase().includes(this.searchQuery)) {
          this.results.push({
            title: `${item.title} - ${item.deity}`,
            category: 'Aarti',
            page: 'aarti',
            url: `./aarti.html?id=${item.id}`,
            matchType: 'aarti'
          });
        }
      }

      // Handle special search patterns like "Gita 2.47"
      const gitaMatch = this.searchQuery.match(/gita(?:\s+)?(\d+)\.(\d+)/i);
      if (gitaMatch) {
        const ch = parseInt(gitaMatch[1]);
        const v = parseInt(gitaMatch[2]);
        this.results.unshift({
          title: `Bhagavad Gita ${ch}.${v}`,
          category: 'Scriptures',
          page: 'scriptures',
          url: `./scriptures.html?book=bhagavad-gita&ch=${ch}&v=${v}`,
          matchType: 'verse'
        });
      }
    },

    searchGlobal: function(query) {
      this.searchQuery = query.toLowerCase();
      this.results = [];
      this.performSearch(query);

      // Open search and focus input
      this.toggleSearch(true);
      const input = document.getElementById('search-input');
      if (input) {
        input.value = query;
        input.focus();
      }
    },

    displayResults: function(query) {
      const resultsContainer = document.getElementById('search-results');
      if (!resultsContainer) {
        // Create results container if it doesn't exist
        const searchContainer = document.querySelector('.search-results');
        if (searchContainer) {
          resultsContainer = searchContainer;
        }
      }

      if (!resultsContainer) return;

      // Limit results for performance
      const displayResults = this.results.slice(0, 10);

      if (displayResults.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }

      let html = '<div class="results-header">Results for "' + query + '":</div>';

      for (const result of displayResults) {
        html += `
          <div class="search-result-item" data-page="${result.page}" data-url="${result.url}" tabindex="0">
            <div class="result-title">${this.escapeHtml(result.title)}</div>
            <div class="result-category">${result.category}</div>
            <svg viewBox="0 0 24 24" class="result-icon" width="16" height="16" fill="currentColor">
              <path d="M5 12.5L13.5 21 20.5 14 17 11 8.5 3 5 6.5z"/>
            </svg>
          </div>
        `;
      }

      resultsContainer.innerHTML = html;
    },

    clearResults: function() {
      const resultsContainer = document.getElementById('search-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
      }
    },

    toggleSearch: function(open) {
      const searchWrap = document.querySelector('.search-container');
      if (searchWrap) {
        if (open) {
          searchWrap.classList.add('active');
          this.isSearchOpen = true;
        } else {
          searchWrap.classList.remove('active');
          this.isSearchOpen = false;
        }
      }
    },

    closeSearch: function() {
      const input = document.getElementById('search-input');
      if (input) {
        input.value = '';
      }
      this.clearResults();
      this.toggleSearch(false);
    },

    escapeHtml: function(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  // Initialize search engine when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      SearchEngine.init();
    });
  } else {
    SearchEngine.init();
  }

  // Expose globally
  window.SearchEngine = SearchEngine;

})();