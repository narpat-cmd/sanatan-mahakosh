// Sanatan Dharma Mahakosh - Main Application Controller
// State management, page routing, and dynamic renderers

(function() {
  'use strict';

  class SanatanApp {
    constructor() {
      this.currentPage = this.detectCurrentPage();
      this.init();
    }

    detectCurrentPage() {
      const path = window.location.pathname.split('/').pop();
      if (path === '' || path === 'index.html') return 'index';
      const name = path.replace('.html', '');
      return name || 'index';
    }

    init() {
      // Detect and render for current page
      const page = this.currentPage;

      if (page === 'index') {
        this.populateIndexPage();
      } else if (page === 'scriptures') {
        this.populateScripturesPage();
      } else if (page === 'temples') {
        this.populateTemplesPage();
      } else if (page === 'traditions') {
        this.populateTraditionsPage();
      } else if (page === 'sanskars') {
        this.populateSanskarsPage();
      } else if (page === 'aarti') {
        this.populateAartiPage();
      }

      // Set up event listeners for dynamic content
      this.setupEventListeners();

      // Set language mode
      this.setLanguageMode();
    }

    setLanguageMode() {
      // Get language from localStorage or default to 'hi'
      const lang = localStorage.getItem('sanatan_lang') || 'hi';
      this.currentLang = lang;
      document.documentElement.setAttribute('data-lang', lang);

      // Update language toggle buttons if they exist
      this.updateLanguageToggle();
    }

    updateLanguageToggle() {
      // Update language toggle buttons across all pages
      const langOptions = document.querySelectorAll('.book-lang-option, .page-lang-option');
      langOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.lang === this.currentLang) {
          opt.classList.add('active');
        }
      });
    }

    getCurrentLanguage() {
      return this.currentLang || localStorage.getItem('sanatan_lang') || 'hi';
    }

    setCurrentLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem('sanatan_lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      this.updateLanguageToggle();
    }

    setupEventListeners() {
      const that = this;

      // Event delegation for all dynamic content
      document.addEventListener('click', function(e) {
        // Bookshelf book preview
        const bookshelfBook = e.target.closest('.bookshelf-book');
        if (bookshelfBook) {
          e.preventDefault();
          const bookId = bookshelfBook.dataset.book;
          if (bookId && window.BookReader) {
            window.BookReader.openBook(bookId);
          }
          return;
        }

        // Scripture card / READ button
        const readBtn = e.target.closest('.read-btn, .scripture-card');
        if (readBtn) {
          e.preventDefault();
          const bookId = readBtn.dataset.book || readBtn.dataset.id;
          if (bookId && window.BookReader) {
            window.BookReader.openBook(bookId);
          }
          return;
        }

        // Temple card / DARSHAN button
        const darshanBtn = e.target.closest('.darshan-btn, .temple-card');
        if (darshanBtn) {
          e.preventDefault();
          const templeId = darshanBtn.dataset.id || darshanBtn.dataset.temple;
          if (templeId && window.TempleViewer) {
            window.TempleViewer.loadTemple(templeId);
          }
          return;
        }

        // Tradition card
        const traditionCard = e.target.closest('.tradition-card');
        if (traditionCard) {
          e.preventDefault();
          const traditionId = traditionCard.dataset.id;
          if (traditionId && window.RoyalParchmentReader) {
            window.RoyalParchmentReader.openTradition(traditionId);
          }
          return;
        }

        // Sanskar card
        const sanskarCard = e.target.closest('.sanskar-card');
        if (sanskarCard) {
          e.preventDefault();
          const sanskarId = sanskarCard.dataset.id;
          if (sanskarId && window.RoyalParchmentReader) {
            window.RoyalParchmentReader.openSanskar(sanskarId);
          }
          return;
        }

        // Aarti card
        const aartiCard = e.target.closest('.aarti-card');
        if (aartiCard) {
          e.preventDefault();
          const aartiId = aartiCard.dataset.id;
          if (aartiId && window.RoyalParchmentReader) {
            window.RoyalParchmentReader.openAarti(aartiId);
          }
          return;
        }

        // Category filter buttons
        const filterBtn = e.target.closest('.filter-btn');
        if (filterBtn) {
          e.preventDefault();
          that.filterGrid(filterBtn.dataset.category, filterBtn);
          return;
        }

        // Search icon button
        if (e.target.id === 'openSearch' || e.target.closest('#openSearch')) {
          if (window.SearchEngine) {
            const searchBtn = document.querySelector('[id="global-search-btn"]');
            if (searchBtn) {
              searchBtn.click();
            } else {
              // Find the search input in header
              const header = document.querySelector('header');
              if (header) {
                const searchBtn2 = header.querySelector('[aria-label="Open search"]');
                if (searchBtn2) {
                  searchBtn2.click();
                }
              }
            }
          }
          return;
        }
      });
    }

    filterGrid(category, btn) {
      // Toggle active class
      const container = btn.closest('.filter-tabs')?.parentElement?.querySelector(`#${btn.dataset.target || 'grid'}`);
      if (!container) return;

      // Update active button
      const allBtns = container.parentElement?.querySelectorAll('.filter-btn') || [];
      allBtns.forEach(b => b.classList.remove('bg-gold/20', 'text-gold', 'font-semibold'));
      btn.classList.add('bg-gold/20', 'text-gold', 'font-semibold');

      // Filter cards
      const cards = container.querySelectorAll('.card');
      cards.forEach(card => {
        const cardCategory = card.dataset.category;
        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    populateIndexPage() {
      // Shloka of the Day - uses fallback content since verses are in chunk files
      const dailyShlokaEl = document.getElementById('daily-shloka');
      if (dailyShlokaEl) {
        dailyShlokaEl.innerHTML = `
          <div class="shloka-card">
            <div class="shloka-badge">ॐ Shloka of the Day</div>
            <blockquote class="shloka-sanskrit">कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।<br>मा कर्मफलहेतुर्भूः मा ते सङ्गोऽस्त्वकर्मणि ॥</blockquote>
            <p class="shloka-transliteration">Karmaṇyevādhikāraste mā phaleṣu kadācana | mā karmaphalebhūḥ mā te saṅgoऽstvakarmaṇi ||</p>
            <p class="shloka-meaning">You have a right only to work, never to its fruits. Let not the fruits of action be your motive...</p>
            <div class="shloka-actions">
              <button class="action-btn copy-verse" data-text="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ॥">Copy Verse</button>
              <button class="action-btn share-whatsapp" data-text="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ॥">WhatsApp Share</button>
            </div>
          </div>
        `;
      }

      // Bookshelf preview on index
      const lang = this.currentLang || 'hi';
      const bookshelfEl = document.getElementById('bookshelfGrid');
      if (bookshelfEl && window.SCRIPTURES_DATA) {
        bookshelfEl.innerHTML = window.SCRIPTURES_DATA.slice(0, 6).map(book => {
          const bookTitle = typeof book.title === 'object' ? book.title[lang] || book.title.hi || book.title : book.title;
          return `
          <div class="bookshelf-book" data-book="${book.id}" style="background: ${book.cover?.color || '#6B0F1A'}">
            <span class="book-spine-title" title="${book.id}">${bookTitle}</span>
            <span class="book-view" data-book="${book.id}">View</span>
          </div>
        `;
        }).join('');
      }

      // Temples preview on index
      const templesPreviewEl = document.getElementById('templesGrid');
      if (templesPreviewEl && window.TEMPLES_DATA) {
        templesPreviewEl.innerHTML = window.TEMPLES_DATA.slice(0, 6).map(temple => `
          <div class="temple-preview-card" data-id="${temple.id}">
            <img src="${temple.images?.[0] || ''}" alt="${temple.name}" onerror="this.src=''; this.parentNode.classList.add('no-img'); this.parentNode.innerHTML='<div class=\"no-gallery\">Image not available</div>'">
            <div class="temple-preview-info">
              <span class="temple-cat">${temple.category}</span>
              <h4>${temple.name}</h4>
              <p>${temple.deity}</p>
              <button class="darshan-btn" data-id="${temple.id}">Darshan</button>
            </div>
          </div>
        `).join('');
      }
    }

    populateScripturesPage() {
      const gridEl = document.getElementById('scripturesGrid');
      if (!gridEl || !window.SCRIPTURES_DATA) return;

      gridEl.innerHTML = window.SCRIPTURES_DATA.map(book => {
        const lang = this.currentLang || 'hi';
        const titleObj = typeof book.title === 'object' ? book.title : { hi: book.title, en: book.title, sa: book.title };
        const subtitleObj = typeof book.subtitle === 'object' ? book.subtitle : { hi: book.subtitle || '', en: book.subtitle || '' };

        const titleDisplay = titleObj[lang] || titleObj.hi || book.id;
        let subtitleDisplay = subtitleObj[lang] || subtitleObj.hi || '';
        if (lang === 'en' && subtitleObj.en) {
          subtitleDisplay = subtitleObj.en;
        }

        // Verses are in chunk files, not manifest - show placeholder for now
        const firstVerse = null;

        // Get chapter count from structure
        const chapterCount = (book.structure?.chapters?.length || book.structure?.files?.length || 0);

        return `
          <div class="scripture-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow" data-category="${book.category}" data-book="${book.id}">
            <div class="p-6">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-cinzel text-xl text-maroon">${titleDisplay}</h3>
                <span class="category-badge bg-gold/20 text-gold px-2 py-1 rounded text-xs">${book.category}</span>
              </div>
              <p class="text-sandalwood/70 dark:text-parchment/80 mb-3">${subtitleDisplay}</p>
              <div class="text-sm text-sandalwood/60 dark:text-parchment/70 mb-3">${chapterCount} अध्याय</div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-sandalwood/60 dark:text-parchment/70">${chapterCount} अध्याय ${lang === 'en' ? 'chapters' : ''}</span>
                <button class="read-btn w-8 h-8 bg-gold text-parchment rounded-full flex items-center justify-center hover:bg-saffron transition-colors"
                        data-book="${book.id}" aria-label="Read ${titleDisplay}">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    populateTemplesPage() {
      const lang = this.currentLang || 'hi';
      const gridEl = document.getElementById('templesGrid');
      if (!gridEl || !window.TEMPLES_DATA) return;

      gridEl.innerHTML = window.TEMPLES_DATA.map(temple => {
        const nameDisplay = lang === 'en' ? temple.nameEnglish || temple.name : temple.name;
        const deityDisplay = lang === 'en' ? temple.deityEnglish || temple.deity : temple.deity;
        const descDisplay = lang === 'en' ? temple.descriptionEnglish || temple.description : temple.description;

        return `
          <div class="temple-card group bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow" data-category="${temple.category}" data-id="${temple.id}">
            <div class="relative">
              <img src="${temple.images?.[0] || ''}" alt="${nameDisplay}" class="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                   onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"no-gallery flex items-center justify-center h-48 bg-gold/10\"><svg class=\"w-12 h-12 text-gold/50\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.5\"/><path d=\"M12 8v4l2 2\" stroke=\"currentColor\" stroke-width=\"1.5\" fill=\"none\"/><circle cx=\"12\" cy=\"14\" r=\"1\" fill=\"currentColor\"/></svg></div>'">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 text-parchment">
                <h3 class="font-cinzel text-lg mb-1">${nameDisplay}</h3>
                <p class="text-sm text-gold/80">${deityDisplay}</p>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="category-badge bg-gold/20 text-gold px-2 py-1 rounded text-xs">${temple.category}</span>
              </div>
              <div class="flex items-center justify-between">
                <button class="darshan-btn px-3 py-1 text-sm bg-gold text-parchment rounded-full hover:bg-saffron transition-colors"
                        data-id="${temple.id}">Darshan</button>
              </div>
            </div>
          </div>
        `;
      });
    }

    populateTraditionsPage() {
      const data = window.TRADITIONS_DATA || [];

      // Daily Traditions Grid
      const dailyGrid = document.getElementById('dailyTraditionsGrid');
      if (dailyGrid) {
        const dailyItems = data.filter(item => item.category === 'Daily Ritual');
        dailyGrid.innerHTML = dailyItems.map(item => `
          <div class="tradition-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-category="${item.category}" data-id="${item.id}">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-gold">
                  <path d="M12 2l3.09 6.26L21.5 9.5l-5 4.87 1.5 6.87L12 17.77l-6.5 3.25L6.5 9.5 2.91 8.5z"/>
                </svg>
              </div>
              <div class="flex-1">
                <h4 class="font-cinzel text-maroon mb-1">${item.name}</h4>
                <p class="text-sm text-sandalwood/70 dark:text-parchment/80 mb-2">${item.description || item.significance}</p>
                <p class="text-xs text-saffron">⏰ ${item.timing}</p>
              </div>
            </div>
          </div>
        `).join('');
      }

      // 16 Sanskars Grid
      const sanskarsGrid = document.getElementById('sanskarsGrid');
      if (sanskarsGrid) {
        const sanskarsItems = data.filter(item => item.category === 'Sanskar');
        sanskarsGrid.innerHTML = sanskarsItems.map(item => `
          <div class="sanskar-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-category="${item.category}" data-id="${item.id}">
            <div class="flex items-start gap-3">
              <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="font-bold text-gold text-xl">${item.number || '?'}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-cinzel text-maroon mb-1">${item.name}</h4>
                <p class="text-sm text-sandalwood/70 dark:text-parchment/80 mb-2">${item.significance || item.description}</p>
                <p class="text-xs text-saffron">⏰ ${item.timing}</p>
              </div>
            </div>
          </div>
        `).join('');
      }

      // Navagraha Grid
      const navagrahaGrid = document.getElementById('navagrahaGrid');
      if (navagrahaGrid) {
        const navagrahaItems = data.filter(item => item.category === 'Navagraha');
        if (navagrahaItems.length > 0) {
          navagrahaGrid.innerHTML = navagrahaItems.map(item => `
            <div class="tradition-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-category="${item.category}" data-id="${item.id}">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-gold">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4l2 2"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-cinzel text-maroon mb-1">${item.name}</h4>
                  <p class="text-sm text-sandalwood/70 dark:text-parchment/80 mb-2">${item.description || item.significance}</p>
                </div>
              </div>
            </div>
          `).join('');
        } else {
          navagrahaGrid.innerHTML = '<p class="text-center text-sandalwood/60 dark:text-parchment/60 col-span-4">Navagraha worship practices coming soon...</p>';
        }
      }

      // Philosophy Grid
      const philosophyGrid = document.getElementById('philosophyGrid');
      if (philosophyGrid) {
        const philosophyItems = data.filter(item => item.category === 'Philosophy');
        if (philosophyItems.length > 0) {
          philosophyGrid.innerHTML = philosophyItems.map(item => `
            <div class="tradition-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-category="${item.category}" data-id="${item.id}">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-gold">
                    <path d="M12 2l3.09 6.26L21.5 9.5l-5 4.87 1.5 6.87L12 17.77l-6.5 3.25L6.5 9.5 2.91 8.5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-cinzel text-maroon mb-1">${item.name}</h4>
                  <p class="text-sm text-sandalwood/70 dark:text-parchment/80 mb-2">${item.description || item.significance}</p>
                </div>
              </div>
            </div>
          `).join('');
        } else {
          philosophyGrid.innerHTML = '<p class="text-center text-sandalwood/60 dark:text-parchment/60 col-span-3">Philosophical concepts will be added...</p>';
        }
      }

      // Vrat Kathas Grid
      const vratGrid = document.getElementById('vratGrid');
      if (vratGrid) {
        const vratItems = data.filter(item => item.category === 'Vrat');
        if (vratItems.length > 0) {
          vratGrid.innerHTML = vratItems.map(item => `
            <div class="tradition-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow" data-category="${item.category}" data-id="${item.id}">
              <div class="flex items-start gap-3">
                <div class="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-gold">
                    <path d="M4 12l8 8 8-8"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="font-cinzel text-maroon mb-1">${item.name}</h4>
                  <p class="text-sm text-sandalwood/70 dark:text-parchment/80 mb-2">${item.description || item.significance}</p>
                </div>
              </div>
            </div>
          `).join('');
        } else {
          vratGrid.innerHTML = '<p class="text-center text-sandalwood/60 dark:text-parchment/60 col-span-3">Vrat Kathas will be added...</p>';
        }
      }
    }

    populateSanskarsPage() {
      const lang = this.currentLang || 'hi';
      const gridEl = document.getElementById('sanskarsGrid');
      if (!gridEl || !window.SANSKARS_DATA) return;

      gridEl.innerHTML = window.SANSKARS_DATA.map(sanskar => {
        const nameDisplay = lang === 'en' ? sanskar.nameEnglish || sanskar.name : sanskar.name;
        const meaningDisplay = lang === 'en' ? sanskar.meaningEnglish || sanskar.meaning : sanskar.meaning || sanskar.description;

        return `
          <div class="sanskar-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow" data-category="${sanskar.category}" data-id="${sanskar.id}">
            <div class="p-6">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="font-bold text-gold text-lg">#${sanskar.number}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-cinzel text-xl text-maroon mb-1">${nameDisplay}</h3>
                  ${lang === 'en' ? `<p class="text-sm text-sandalwood/60 dark:text-parchment/70">${sanskar.nameEnglish}</p>` : ''}
                </div>
              </div>
              <p class="text-sandalwood/70 dark:text-parchment/80 mb-4 text-sm">${meaningDisplay}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs text-saffron">⏰ ${sanskar.timing}</span>
                <button class="read-btn px-3 py-1 text-sm bg-gold text-parchment rounded-full hover:bg-saffron transition-colors"
                        data-id="${sanskar.id}" aria-label="Read ${nameDisplay}">
                  Read
                </button>
              </div>
            </div>
          </div>
        `;
      });
    }

    populateAartiPage() {
      const lang = this.currentLang || 'hi';
      const gridEl = document.getElementById('aartiGrid');
      if (!gridEl || !window.AARTI_DATA) return;

      gridEl.innerHTML = window.AARTI_DATA.map(item => {
        const titleDisplay = lang === 'en' ? item.titleEnglish : item.title;
        const significanceDisplay = lang === 'en' ? item.translation : item.significance;

        return `
          <div class="aarti-card bg-parchment-bg dark:bg-sandalwood rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow" data-category="${item.category}" data-id="${item.id}">
            <div class="p-6">
              <div class="flex items-start gap-3 mb-3">
                <div class="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" class="text-gold">
                    <path d="M12 2l3.09 6.26L21.5 9.5l-5 4.87 1.5 6.87L12 17.77l-6.5 3.25L6.5 9.5 2.91 8.5z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-cinzel text-xl text-maroon mb-1">${titleDisplay}</h3>
                  ${lang === 'en' ? `<p class="text-sm text-sandalwood/60 dark:text-parchment/70">${item.titleEnglish}</p>` : ''}
                </div>
              </div>
              <p class="text-sandalwood/70 dark:text-parchment/80 mb-4 text-xs">${item.deity} • ${item.type || 'Aarti'}</p>
              <p class="text-xs text-saffron line-clamp-2 mb-4">${significanceDisplay}</p>
              <button class="read-btn px-3 py-1 text-sm bg-gold text-parchment rounded-full hover:bg-saffron transition-colors"
                      data-id="${item.id}" aria-label="Read ${titleDisplay}">
                Read Aarti
              </button>
            </div>
          </div>
        `;
      });
    }
  }

  // Initialize app when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.sanatanApp = new SanatanApp();
    });
  } else {
    window.sanatanApp = new SanatanApp();
  }

})();