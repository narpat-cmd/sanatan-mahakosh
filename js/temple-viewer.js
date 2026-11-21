// Sanatan Dharma Mahakosh - Temple Darshan Modal & Lightbox Gallery Engine

(function() {
  'use strict';

  const TempleViewer = {
    currentTemple: null,
    currentGalleryIndex: 0,
    galleryImages: [],

    init: function() {
      this.checkUrlParams();
      this.bindEvents();
    },

    checkUrlParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const templeId = urlParams.get('id');

      if (templeId) {
        this.loadTemple(templeId);
      }
    },

    bindEvents: function() {
      const that = this;

      // Event delegation for all interactions
      document.addEventListener('click', function(e) {
        const viewBtn = e.target.closest('.temple-view-btn');
        if (viewBtn) {
          e.preventDefault();
          const templeId = viewBtn.dataset.id || viewBtn.closest('.temple-card')?.dataset.id;
          if (templeId) {
            that.loadTemple(templeId);
          }
          return;
        }

        const galleryImg = e.target.closest('.gallery-image');
        if (galleryImg) {
          const idx = parseInt(galleryImg.dataset.index);
          that.openGallery(idx);
          return;
        }

        const galleryClose = e.target.closest('.gallery-close');
        if (galleryClose) {
          that.closeGallery();
          return;
        }

        const galleryPrev = e.target.closest('.gallery-prev');
        if (galleryPrev) {
          that.prevGalleryImage();
          return;
        }

        const galleryNext = e.target.closest('.gallery-next');
        if (galleryNext) {
          that.nextGalleryImage();
          return;
        }

        const modalClose = e.target.closest('.temple-modal-close');
        if (modalClose) {
          that.closeTemple();
          return;
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', function(e) {
        if (!that.isGalleryOpen()) return;

        switch(e.key) {
          case 'Escape':
            e.preventDefault();
            that.closeGallery();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            that.prevGalleryImage();
            break;
          case 'ArrowRight':
            e.preventDefault();
            that.nextGalleryImage();
            break;
        }
      });
    },

    loadTemple: function(templeId) {
      const temples = window.TEMPLES_DATA || [];
      this.currentTemple = temples.find(t => t.id === templeId || t.name === templeId);

      if (!this.currentTemple) {
        console.warn(`Temple not found: ${templeId}`);
        return;
      }

      this.galleryImages = this.currentTemple.gallery || [];

      // Create overlay
      let overlay = document.getElementById('temple-viewer-overlay');
      if (!overlay) {
        overlay = this.createTempleOverlay();
        document.body.appendChild(overlay);
      }

      overlay.classList.add('active');

      // Render content
      this.renderTemple();

      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('id', templeId);
      window.history.pushState({}, '', url);
    },

    createTempleOverlay: function() {
      const overlay = document.createElement('div');
      overlay.id = 'temple-viewer-overlay';
      overlay.className = 'temple-viewer-overlay';
      overlay.innerHTML = `
        <div class="temple-modal" role="dialog" aria-modal="true">
          <button class="temple-modal-close" aria-label="Close">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M18.36 6.64l-10.72 10.72M5.64 6.64l10.72 10.72"/>
            </svg>
          </button>

          <div class="temple-sidebar">
            <div class="temple-info">
              <span class="temple-badge">${this.currentTemple?.category || ''}</span>
              <h2 class="temple-name">${this.currentTemple?.name || ''}</h2>
              <p class="temple-deity">${this.currentTemple?.deity || ''}</p>
              <div class="temple-location">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                </svg>
                ${this.currentTemple?.location?.address || ''}
              </div>
            </div>
          </div>

          <div class="temple-main">
            <div class="temple-hero">
              <img src="${this.currentTemple?.images?.[0] || ''}" alt="${this.currentTemple?.name || ''} - Main Temple" class="temple-hero-img" onerror="this.src=''; this.parentNode.innerHTML='<div class=\"no-hero\">No image available</div>'">
            </div>

            <div class="temple-content">
              <div class="temple-section">
                <h3>Destination Guide</h3>
                <p><strong>Nearest Railway Station:</strong> ${this.currentTemple?.location?.railwayStation || 'N/A'}</p>
                <p><strong>Nearest Airport:</strong> ${this.currentTemple?.location?.airport || 'N/A'}</p>
                <p><strong>Best Season:</strong> ${this.currentTemple?.bestSeason || 'Year-round'}</p>
                <p><strong>Daily Darshan:</strong> ${this.currentTemple?.darshanTimings?.main || 'N/A'}</p>
                <p><strong>Aarti Timings:</strong> ${this.currentTemple?.darshanTimings?.aarti || 'N/A'}</p>
                ${this.currentTemple?.location?.mapsUrl ? `<a href="${this.currentTemple.location.mapsUrl}" target="_blank" class="maps-link">View on Google Maps</a>` : ''}
              </div>

              <div class="temple-section">
                <h3>Puranic History & Beliefs</h3>
                <p>${this.currentTemple?.history?.origin || 'Sacred temple with ancient blessings.'}</p>
                ${this.currentTemple?.beliefs ? `<p><strong>Local Beliefs:</strong> ${this.currentTemple.beliefs}</p>` : ''}

                ${this.currentTemple?.specialWorship ? `
                <div class="special-worship">
                  <h4>Special Worship Rules</h4>
                  <p>${this.currentTemple.specialWorship}</p>
                </div>
                ` : ''}

                ${this.currentTemple?.parikrama ? `
                <div class="parikrama">
                  <h4>Parikrama & Spiritual Significance</h4>
                  <p>${this.currentTemple.parikrama}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </div>

          <div class="temple-gallery">
            <h3>Photo Gallery (${this.galleryImages.length} photos)</h3>
            <div class="gallery-grid" id="gallery-grid">
              ${this.galleryImages.map((img, idx) => `
                <img src="${img}" alt="Gallery image ${idx + 1}" class="gallery-image" data-index="${idx}"
                     onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"gallery-placeholder\">Image not available</div>'">
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Full-screen lightbox -->
        <div class="gallery-lightbox" id="gallery-lightbox">
          <button class="gallery-close" aria-label="Close"></button>
          <button class="gallery-prev" aria-label="Previous"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.41 7l-5.95 5.95L3.51 7M5.75 17v-10"/></svg></button>
          <button class="gallery-next" aria-label="Next"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M8.59 12l5.95 5.95L20.49 12M14.25 17V7"/></svg></button>
          <div class="lightbox-content">
            <img src="" alt="Gallery image" class="lightbox-image" onerror="this.parentNode.style.display='none'">
          </div>
        </div>
      `;

      return overlay;
    },

    renderTemple: function() {
      if (!this.currentTemple) return;

      // Update header info
      const badge = document.querySelector('.temple-badge');
      const name = document.querySelector('.temple-name');
      const deity = document.querySelector('.temple-deity');
      const location = document.querySelector('.temple-location');
      const mapsLink = document.querySelector('.maps-link');

      if (badge) badge.textContent = this.currentTemple.category || '';
      if (name) name.textContent = this.currentTemple.name || '';
      if (deity) deity.textContent = this.currentTemple.deity || '';
      if (location) {
        const locHtml = `
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
          </svg>
          ${this.currentTemple.location?.address || ''}
        `;
        location.innerHTML = locHtml;
      }
      if (mapsLink && this.currentTemple.location?.mapsUrl) {
        mapsLink.href = this.currentTemple.location.mapsUrl;
      }

      // Update gallery
      this.renderGallery();

      // Update content sections
      this.renderContent();
    },

    renderGallery: function() {
      if (!this.galleryImages || this.galleryImages.length === 0) {
        const galleryGrid = document.getElementById('gallery-grid');
        if (galleryGrid) {
          galleryGrid.innerHTML = '<div class="gallery-placeholder">No photos available</div>';
        }
        return;
      }

      const galleryGrid = document.getElementById('gallery-grid');
      if (!galleryGrid) return;

      galleryGrid.innerHTML = this.galleryImages.map((img, idx) => `
        <img src="${img}" alt="Gallery image ${idx + 1}" class="gallery-image" data-index="${idx}"
             onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\"gallery-placeholder\">Image not available</div>'">
      `).join('');

      // Update gallery title
      const galleryTitle = document.querySelector('.temple-gallery h3');
      if (galleryTitle) {
        galleryTitle.textContent = `Photo Gallery (${this.galleryImages.length} photos)`;
      }
    },

    renderContent: function() {
      if (!this.currentTemple) return;

      // Destination guide section
      const destGuide = document.querySelector('.temple-section:nth-child(1)');
      if (destGuide) {
        destGuide.innerHTML = `
          <h3>Destination Guide</h3>
          <p><strong>Nearest Railway Station:</strong> ${this.currentTemple.location?.railwayStation || 'N/A'}</p>
          <p><strong>Nearest Airport:</strong> ${this.currentTemple.location?.airport || 'N/A'}</p>
          <p><strong>Best Season:</strong> ${this.currentTemple.bestSeason || 'Year-round'}</p>
          <p><strong>Daily Darshan:</strong> ${this.currentTemple.darshanTimings?.main || 'N/A'}</p>
          <p><strong>Aarti Timings:</strong> ${this.currentTemple.darshanTimings?.aarti || 'N/A'}</p>
          ${this.currentTemple.location?.mapsUrl ? `<a href="${this.currentTemple.location.mapsUrl}" target="_blank" class="maps-link">View on Google Maps</a>` : ''}
        `;
      }

      // History and beliefs section
      const historySection = document.querySelector('.temple-section:nth-child(2)');
      if (historySection) {
        historySection.innerHTML = `
          <h3>Puranic History & Beliefs</h3>
          <p>${this.currentTemple.history?.origin || 'Sacred temple with ancient blessings.'}</p>
          ${this.currentTemple.beliefs ? `<p><strong>Local Beliefs:</strong> ${this.currentTemple.beliefs}</p>` : ''}

          ${this.currentTemple.specialWorship ? `
          <div class="special-worship">
            <h4>Special Worship Rules</h4>
            <p>${this.currentTemple.specialWorship}</p>
          </div>
          ` : ''}

          ${this.currentTemple.parikrama ? `
          <div class="parikrama">
            <h4>Parikrama & Spiritual Significance</h4>
            <p>${this.currentTemple.parikrama}</p>
          </div>
          ` : ''}
        `;
      }
    },

    openGallery: function(index) {
      this.currentGalleryIndex = index;
      const lightbox = document.getElementById('gallery-lightbox');
      const lightboxImg = lightbox?.querySelector('.lightbox-image');

      if (lightbox && lightboxImg) {
        lightbox.classList.add('active');
        lightboxImg.src = this.galleryImages[index];
        lightboxImg.onload = function() {
          lightbox.style.display = 'block';
        };
        lightboxImg.onerror = function() {
          lightbox.style.display = 'none';
        };
      }
    },

    closeGallery: function() {
      const lightbox = document.getElementById('gallery-lightbox');
      if (lightbox) {
        lightbox.classList.remove('active');
        lightbox.style.display = 'none';
      }
    },

    nextGalleryImage: function() {
      if (this.currentGalleryIndex < this.galleryImages.length - 1) {
        this.currentGalleryIndex++;
        this.updateLightboxImage();
      }
    },

    prevGalleryImage: function() {
      if (this.currentGalleryIndex > 0) {
        this.currentGalleryIndex--;
        this.updateLightboxImage();
      }
    },

    updateLightboxImage: function() {
      const lightbox = document.getElementById('gallery-lightbox');
      const lightboxImg = lightbox?.querySelector('.lightbox-image');
      if (lightboxImg) {
        lightboxImg.src = this.galleryImages[this.currentGalleryIndex];
      }
    },

    closeTemple: function() {
      const overlay = document.getElementById('temple-viewer-overlay');
      if (overlay) {
        overlay.classList.remove('active');
      }

      // Update URL
      const url = new URL(window.location);
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);
    },

    isGalleryOpen: function() {
      const lightbox = document.getElementById('gallery-lightbox');
      return lightbox && lightbox.classList.contains('active');
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.querySelector('.temple-card, .temple-view-btn')) {
        TempleViewer.init();
      }
    });
  } else {
    if (document.querySelector('.temple-card, .temple-view-btn')) {
      TempleViewer.init();
    }
  }

  // Expose globally
  window.TempleViewer = TempleViewer;

})();