// Sanatan Dharma Mahakosh - Temple Darshan Modal
// Supports trilingual modes: hi (Sanskrit+Hindi), en (English), all (three languages)

(function() {
  'use strict';

  const TempleViewer = {
    currentTemple: null,
    currentGallery: null,
    currentPhotoIndex: 0,
    galleryPhotos: [],
    lang: 'hi',

    init: function() {
      this.lang = localStorage.getItem('sanatan_lang') || 'hi';
      document.documentElement.setAttribute('data-lang', this.lang);
      this.bindEvents();
    },

    bindEvents: function() {
      if (this._bound) return;
      this._bound = true;
      document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') this.closeViewer(); });
      const that = this;

      document.addEventListener('click', function(e) {
        if (e.target.closest('.temple-close, .temple-close-section')) { that.closeViewer(); return; }
        const langOpt = e.target.closest('#temple-viewer-overlay .book-lang-option');
        if (langOpt) { that.setLanguage(langOpt.dataset.lang); document.querySelectorAll('#temple-viewer-overlay .book-lang-option').forEach(o => o.classList.toggle('active', o === langOpt)); return; }
        if (e.target.id === 'temple-viewer-overlay') { that.closeViewer(); return; }
        const darshanBtn = null; // darshan click app.js handle karta hai
        if (darshanBtn) {
          const templeId = darshanBtn.dataset.temple;
          that.loadTemple(templeId);
          return;
        }

        const galleryImg = e.target.closest('.gallery-img');
        if (galleryImg) {
          const idx = parseInt(galleryImg.dataset.idx);
          that.openGallery(idx);
          return;
        }

        const galleryPrev = e.target.closest('.gallery-prev');
        if (galleryPrev) {
          that.prevGallery();
          return;
        }

        const galleryNext = e.target.closest('.gallery-next');
        if (galleryNext) {
          that.nextGallery();
          return;
        }

        const galleryClose = e.target.closest('.gallery-close');
        if (galleryClose) {
          that.closeGallery();
          return;
        }

        const galleryThumbnail = e.target.closest('.gallery-thumbnail');
        if (galleryThumbnail) {
          const idx = parseInt(galleryThumbnail.dataset.idx);
          that.showGalleryPhoto(idx);
          return;
        }
      });
    },

    setLanguage: function(lang) {
      this.lang = lang;
      localStorage.setItem('sanatan_lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      if (this.isOpen() && this.currentTemple) {
        this.renderTemple(this.currentTemple);
      }
    },

    toggleLanguage: function() {
      const options = ['hi', 'en', 'all'];
      const currentIndex = options.indexOf(this.lang);
      const nextIndex = (currentIndex + 1) % options.length;
      this.setLanguage(options[nextIndex]);
    },

    loadTemple: function(templeId) {
      this.bindEvents();
      const temples = window.TEMPLES_DATA || [];
      this.currentTemple = temples.find(t => t.id === templeId) || temples[0];

      if (!this.currentTemple) return;

      this.renderTemple(this.currentTemple);
      this.playOpeningBell();

      // asli photos Wikimedia Commons se lao (cache ke saath)
      const cur = this.currentTemple;
      if (window.TempleImages && cur) {
        window.TempleImages.gallery(cur).then(g => {
          if (g && g.length && this.currentTemple === cur) {
            cur.gallery = g;
            this.renderGallery(g);
          } else if (g && !g.length && this.currentTemple === cur) {
            const c = document.querySelector('#temple-viewer-overlay .gallery-caption');
            if (c) c.textContent = '📷 इस मंदिर की फ़ोटो अभी नहीं मिलीं (या इंटरनेट बंद है)।';
          }
        });
      }
    },

    renderTemple: function(temple) {
      // Create overlay
      let overlay = document.getElementById('temple-viewer-overlay');
      if (!overlay) {
        overlay = this.createViewerOverlay();
        document.body.appendChild(overlay);
      }

      overlay.classList.add('active');

      const modalTitle = overlay.querySelector('.temple-modal-title');
      const modalDeity = overlay.querySelector('.temple-modal-deity');
      const modalLocation = overlay.querySelector('.temple-modal-location');
      const modalDescription = overlay.querySelector('.temple-modal-description');
      const galleryContainer = overlay.querySelector('.temple-gallery-container');

      if (modalTitle) {
        modalTitle.textContent = (temple.name || temple.nameEnglish || 'Temple') + (temple.nameEnglish && temple.name !== temple.nameEnglish ? ' | ' + temple.nameEnglish : '');
      }

      if (modalDeity) {
        if (this.lang === 'en' || this.lang === 'all') {
          modalDeity.textContent = temple.deityEnglish || temple.deity || '';
        } else {
          modalDeity.textContent = temple.deity || '';
        }
      }

      if (modalLocation) {
        modalLocation.textContent = temple.location || '';
      }

      if (modalDescription) {
        modalDescription.innerHTML = this.buildDetails(temple);
      }

      // Render gallery
      if (temple.gallery && temple.gallery.length > 0) {
        this.renderGallery(temple.gallery);
      } else {
        const cap = overlay.querySelector('.gallery-caption');
        const mi = overlay.querySelector('.gallery-main-img');
        const th = overlay.querySelector('.gallery-thumbnails');
        if (th) th.innerHTML = '';
        if (mi) { mi.removeAttribute('src'); mi.style.display = 'none'; }
        if (cap) cap.textContent = '📷 फ़ोटो लोड हो रही हैं... (इंटरनेट चाहिए, स्रोत: Wikimedia Commons)';
      }
    },

    esc: function(s) {
      return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    },

    buildDetails: function(t) {
      const e = this.esc.bind(this);
      const en = this.lang === 'en';
      const both = this.lang === 'all';
      const sec = (title, body) => body ? '<div style="margin-bottom:1rem"><h4 style="font-family:Cinzel,serif;color:#6B0F1A;font-weight:700;margin:0 0 .35rem">' + title + '</h4>' + body + '</div>' : '';
      const cats = (t.categories || []).map(id => '<span style="display:inline-block;margin:0 .3rem .3rem 0;padding:.1rem .6rem;border-radius:999px;background:rgba(212,175,55,.25);font-size:.8rem">' + e((window.TEMPLE_CAT_LABEL || {})[id] || id) + '</span>').join('');
      const where = '<p style="margin:0">' + e(t.location || '') + '</p>' +
        (t.mapUrl ? '<p style="margin:.4rem 0 0"><a href="' + e(t.mapUrl) + '" target="_blank" rel="noopener" style="color:#E85D04;text-decoration:underline">🗺 Google Maps पर देखें</a></p>' : '');
      let html = '';
      html += sec('📍 ' + (en ? 'Where is it' : 'कहाँ है'), where + (cats ? '<p style="margin:.5rem 0 0">' + cats + '</p>' : ''));
      if (en || both) html += sec('About', '<p style="margin:0">' + e(t.descriptionEnglish || t.description || '') + '</p>');
      if (!en) html += sec('🪔 कथा / इतिहास', '<p style="margin:0">' + e(t.originStory || t.description || '') + '</p>');
      if (t.localBeliefs && t.localBeliefs.length) {
        html += sec('🙏 ' + (en ? 'Beliefs (Manyata)' : 'मान्यताएँ'), '<ul style="margin:0;padding-left:1.2rem;list-style:disc">' + t.localBeliefs.map(b => '<li style="margin-bottom:.25rem">' + e(b) + '</li>').join('') + '</ul>');
      }
      const times = [];
      if (t.bestSeason) times.push((en ? 'Best time: ' : 'सर्वोत्तम समय: ') + e(t.bestSeason));
      if (t.festivals) times.push((en ? 'Festivals: ' : 'प्रमुख उत्सव: ') + e(t.festivals));
      if (t.timings) times.push((en ? 'Timings: ' : 'समय: ') + e(t.timings));
      if (t.worshipRules) times.push(e(t.worshipRules));
      if (times.length) html += sec('🗓 ' + (en ? 'Visit & Festivals' : 'यात्रा और उत्सव'), times.map(x => '<p style="margin:0 0 .25rem">' + x + '</p>').join(''));
      html += '<p style="margin:.75rem 0 0;font-size:.8rem;opacity:.75">ℹ️ संक्षिप्त जानकारी। समय, कपाट और नियम आधिकारिक वेबसाइट या स्थानीय पुजारी से पुष्टि करें। फ़ोटो: Wikimedia Commons (लाइसेंस अनुसार)।</p>';
      return html;
    },

    renderGallery: function(gallery) {
      const galleryContainer = document.querySelector('.temple-gallery-container');
      if (!galleryContainer) return;

      // Set up main gallery image
      if (gallery.length > 0) {
        const mainImg = galleryContainer.querySelector('.gallery-main-img');
        if (mainImg) {
          const photo = gallery[0];
          mainImg.src = photo.url || photo.thumb || '';
          mainImg.alt = photo.caption || 'Temple Photo';
          mainImg.dataset.idx = '0';
          mainImg.style.display = '';
          mainImg.onerror = function() { this.style.display = 'none'; };
        }
        const capEl = galleryContainer.querySelector('.gallery-caption');
        if (capEl) capEl.textContent = gallery[0].caption || '';
        this.currentPhotoIndex = 0;
        this.galleryPhotos = gallery;
      }

      // Render thumbnails
      const thumbContainer = galleryContainer.querySelector('.gallery-thumbnails');
      if (thumbContainer) {
        let html = '';
        gallery.forEach((photo, idx) => {
          html += `
            <div class="gallery-thumbnail" data-idx="${idx}">
              <img src="${photo.thumb || photo.url || ''}" alt="Photo ${idx + 1}" class="thumb-img">
            </div>
          `;
        });
        thumbContainer.innerHTML = html;
      }

      // Highlight active thumbnail
      const thumbnails = galleryContainer.querySelectorAll('.gallery-thumbnail');
      thumbnails.forEach((thumb, idx) => {
        thumb.classList.toggle('active', idx === 0);
      });
    },

    openGallery: function(startIndex) {
      let galleryOverlay = document.getElementById('gallery-overlay');
      if (!galleryOverlay) {
        galleryOverlay = this.createGalleryOverlay();
        document.body.appendChild(galleryOverlay);
      }

      galleryOverlay.classList.add('active');

      if (this.currentTemple && this.currentTemple.gallery && this.currentTemple.gallery.length > 0) {
        this.galleryPhotos = this.currentTemple.gallery;
        this.showGalleryPhoto(startIndex);
      }
    },

    showGalleryPhoto: function(idx) {
      if (!this.galleryPhotos || idx < 0 || idx >= this.galleryPhotos.length) return;

      this.currentPhotoIndex = idx;

      const mainImg = document.querySelector('.gallery-main-img');
      const photoCaption = document.querySelector('.gallery-caption');

      if (mainImg && this.galleryPhotos[idx]) {
        const photo = this.galleryPhotos[idx];
        mainImg.src = photo.url || photo.thumb || '';
        mainImg.alt = photo.caption || 'Temple Photo';
        mainImg.dataset.idx = idx;

        if (photoCaption) {
          photoCaption.textContent = photo.caption || '';
        }
      }

      // Update thumbnail active state
      const thumbnails = document.querySelectorAll('.gallery-thumbnail');
      thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === idx);
      });
    },

    nextGallery: function() {
      if (!this.galleryPhotos || this.galleryPhotos.length === 0) return;

      const nextIdx = (this.currentPhotoIndex + 1) % this.galleryPhotos.length;
      this.showGalleryPhoto(nextIdx);
      this.playGalleryTransition();
    },

    prevGallery: function() {
      if (!this.galleryPhotos || this.galleryPhotos.length === 0) return;

      const prevIdx = this.currentPhotoIndex === 0 ? this.galleryPhotos.length - 1 : this.currentPhotoIndex - 1;
      this.showGalleryPhoto(prevIdx);
      this.playGalleryTransition();
    },

    closeGallery: function() {
      const galleryOverlay = document.getElementById('gallery-overlay');
      if (galleryOverlay) {
        galleryOverlay.classList.remove('active');
      }
    },

    isOpen: function() {
      const overlay = document.getElementById('temple-viewer-overlay');
      return overlay && overlay.classList.contains('active');
    },

    closeViewer: function() {
      const overlay = document.getElementById('temple-viewer-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }
      this.currentTemple = null;
      this.galleryPhotos = [];
      this.currentPhotoIndex = 0;

      // Clean up URL
      const url = new URL(window.location);
      url.searchParams.delete('temple');
      window.history.pushState({}, '', url);
    },

    createViewerOverlay: function() {
      const overlay = document.createElement('div');
      overlay.id = 'temple-viewer-overlay';
      overlay.className = 'temple-viewer-overlay';
      overlay.innerHTML = `
        <div class="temple-viewer-modal" role="dialog" aria-modal="true">
          <div class="temple-viewer-header">
            <h2 class="temple-modal-title"></h2>
            <button class="temple-close" aria-label="Close">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div class="temple-viewer-content">
            <div class="temple-info-section">
              <div class="temple-deity temple-modal-deity"></div>
              <div class="temple-location temple-modal-location"></div>
              <div class=" temple-language-selector">
                <div class="book-lang-toggle">
                  <span class="book-lang-option ${this.lang === 'hi' ? 'active' : ''}" data-lang="hi">HI</span>
                  <span class="book-lang-option ${this.lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                  <span class="book-lang-option ${this.lang === 'all' ? 'active' : ''}" data-lang="all">ALL</span>
                </div>
              </div>
            </div>

            <div class="temple-gallery-container">
              <div class="gallery-main-wrapper">
                <img src="" alt="" class="gallery-main-img">
                <div class="gallery-prev">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M15.41 7l-6.58 6.58L15.41 20.41L19.59 16.23 15.41 7z"/>
                  </svg>
                </div>
                <div class="gallery-next">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M8.59 16.59L14.17 11l-5.58-5.59L12 4l8 8z"/>
                  </svg>
                </div>
              </div>
              <div class="gallery-caption"></div>
              <div class="gallery-thumbnails"></div>
            </div>

            <div class="temple-description-section">
              <h3 class="description-title">${this.lang === 'en' ? 'About the Temple' : 'मंदिर के बारे में'}</h3>
              <div class="temple-modal-description"></div>
            </div>
          </div>

          <button class="temple-close-section" aria-label="Close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .temple-viewer-overlay {
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
        .temple-viewer-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .temple-viewer-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .temple-viewer-header {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        .temple-modal-title {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: var(--maroon, #6B0F1A);
          margin: 0;
        }
        .temple-close {
          background: none;
          border: none;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .temple-close:hover {
          background: var(--gold, #D4AF37);
          border-radius: 50%;
          color: var(--parchment, #FAF3E0);
        }
        .temple-viewer-content {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 1rem;
          padding: 1rem;
          overflow-y: auto;
        }
        @media (max-width: 1024px) {
          .temple-viewer-content {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .temple-viewer-content {
            padding: 0.75rem;
          }
          .temple-modal-title {
            font-size: 1.25rem;
          }
        }
        .temple-info-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .temple-deity {
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          color: var(--maroon, #6B0F1A);
          margin: 0;
        }
        .temple-info-section .temple-deity { color: #F4D58D !important; }
        .temple-info-section .temple-location { color: #E8DCC0 !important; }
        .temple-location {
          font-family: 'Noto Serif', sans-serif;
          font-size: 0.95rem;
          color: var(--sandalwood, #2C1810);
          margin: 0;
        }
        .gallery-main-wrapper {
          position: relative;
          background: var(--parchment, #FAF3E0);
          border-radius: 0.75rem;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        body.dark .gallery-main-wrapper {
          background: var(--bhojpatra, #2d1f12);
        }
        .gallery-main-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }
        .gallery-prev, .gallery-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gallery-prev:hover, .gallery-next:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .gallery-prev, body.dark .gallery-next {
          background: rgba(45, 31, 18, 0.9);
        }
        .gallery-prev { left: 10px; }
        .gallery-next { right: 10px; }
        .gallery-caption {
          text-align: center;
          font-family: 'Noto Serif', sans-serif;
          font-size: 0.9rem;
          color: #F4D58D;
          padding: 0.5rem;
        }
        .gallery-thumbnails {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: none;
        }
        .gallery-thumbnails::-webkit-scrollbar {
          display: none;
        }
        .gallery-thumbnail {
          flex-shrink: 0;
          width: 60px;
          height: 60px;
          border: 2px solid var(--parchment, #FAF3E0);
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gallery-thumbnail:hover {
          border-color: var(--gold, #D4AF37);
        }
        .gallery-thumbnail.active {
          border-color: var(--gold, #D4AF37);
        }
        .thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .temple-description-section {
          padding: 1rem;
          background: var(--parchment, #FAF3E0);
          border-radius: 0.75rem;
          margin: 1rem 0;
        }
        body.dark .temple-description-section {
          background: var(--bhojpatra, #2d1f12);
        }
        .description-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: var(--maroon, #6B0F1A);
          margin: 0 0 0.5rem 0;
        }
        .temple-modal-description {
          font-family: 'Noto Serif', sans-serif;
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--sandalwood, #2C1810);
          margin: 0;
          text-align: justify;
        }
        body.dark .temple-modal-description {
          color: #f5e6d3;
        }
        .temple-close-section {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: none;
          border: none;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .temple-close-section:hover {
          background: var(--gold, #D4AF37);
          border-radius: 50%;
          color: var(--parchment, #FAF3E0);
        }
        .no-gallery {
          text-align: center;
          padding: 2rem;
          color: var(--sandalwood, #2C1810);
          font-style: italic;
        }
      `;
      document.head.appendChild(style);

      return overlay;
    },

    createGalleryOverlay: function() {
      const overlay = document.createElement('div');
      overlay.id = 'gallery-overlay';
      overlay.className = 'gallery-overlay';
      overlay.innerHTML = `
        <div class="gallery-modal" role="dialog" aria-modal="true">
          <img src="" alt="" class="gallery-main-img">
          <div class="gallery-caption"></div>
          <button class="gallery-prev" aria-label="Previous Photo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M15.41 7l-6.58 6.58L15.41 20.41L19.59 16.23 15.41 7z"/>
            </svg>
          </button>
          <button class="gallery-next" aria-label="Next Photo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M8.59 16.59L14.17 11l-5.58-5.59L12 4l8 8z"/>
            </svg>
          </button>
          <button class="gallery-close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .gallery-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 51;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease, visibility 0.3s;
        }
        .gallery-overlay.active {
          opacity: 1;
          visibility: visible;
        }
        .gallery-modal {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          box-sizing: border-box;
        }
        .gallery-main-img {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 0.75rem;
        }
        .gallery-caption {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-family: 'Noto Serif', sans-serif;
          background: rgba(0, 0, 0, 0.5);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-align: center;
          max-width: 90%;
        }
        .gallery-prev, .gallery-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .gallery-prev:hover, .gallery-next:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        .gallery-prev { left: 20px; }
        .gallery-next { right: 20px; }
        .gallery-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .gallery-close:hover {
          color: var(--gold, #D4AF37);
        }
      `;
      document.head.appendChild(style);

      return overlay;
    },

    playOpeningBell: function() {
      // Optional: play temple opening bell sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (e) {
        // Audio not available
      }
    },

    playGalleryTransition: function() {
      // Optional: play gallery transition sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (e) {
        // Audio not available
      }
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.querySelector('.darshan-btn')) {
        TempleViewer.init();
      }
    });
  } else {
    if (document.querySelector('.darshan-btn')) {
      TempleViewer.init();
    }
  }

  // Expose globally
  window.TempleViewer = TempleViewer;

})();