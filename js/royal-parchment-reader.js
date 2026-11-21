// Sanatan Dharma Mahakosh - Royal Parchment Reader Modal
// Universal modal reader for Traditions, Sanskars, Aarti content
// Supports trilingual modes: hi (Sanskrit+Hindi), en (English), all (three languages)

(function() {
  'use strict';

  const RoyalParchmentReader = {
    currentItem: null,
    currentType: null,
    currentContent: null,
    lang: 'hi',

    init: function() {
      this.lang = localStorage.getItem('sanatan_lang') || 'hi';
      document.documentElement.setAttribute('data-lang', this.lang);
      this.bindEvents();
    },

    bindEvents: function() {
      const that = this;

      document.addEventListener('click', function(e) {
        const langToggle = e.target.closest('.lang-toggle');
        if (langToggle) {
          e.preventDefault();
          that.toggleLanguage();
          return;
        }

        const langOption = e.target.closest('.lang-option');
        if (langOption) {
          e.preventDefault();
          that.setLanguage(langOption.dataset.lang);
          return;
        }

        const closeBtn = e.target.closest('.rp-close, .live-reader-close');
        if (closeBtn) {
          that.closeModal();
          return;
        }

        const copyBtn = e.target.closest('.rp-copy');
        if (copyBtn) {
          that.copyContent();
          return;
        }

        const shareBtn = e.target.closest('.rp-share');
        if (shareBtn) {
          that.shareContent();
          return;
        }
      });
    },

    setLanguage: function(lang) {
      this.lang = lang;
      localStorage.setItem('sanatan_lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      if (this.isOpen()) {
        this.renderContent();
      }
    },

    toggleLanguage: function() {
      const options = ['hi', 'en', 'all'];
      const currentIndex = options.indexOf(this.lang);
      const nextIndex = (currentIndex + 1) % options.length;
      this.setLanguage(options[nextIndex]);
    },

    openTradition: function(traditionId) {
      const traditions = window.TRADITIONS_DATA || [];
      this.currentItem = traditions.find(t => t.id === traditionId);
      this.currentType = 'tradition';

      if (this.currentItem) {
        this.createModal();
        this.renderContent();
        this.openModal();
        const url = new URL(window.location);
        url.searchParams.set('modal', 'tradition');
        url.searchParams.set('id', traditionId);
        window.history.pushState({}, '', url);
      }
    },

    openSanskar: function(sanskarId) {
      const sanskars = window.SANSKARS_DATA || [];
      this.currentItem = sanskars.find(s => s.id === sanskarId);
      this.currentType = 'sanskar';

      if (this.currentItem) {
        this.createModal();
        this.renderContent();
        this.openModal();
        const url = new URL(window.location);
        url.searchParams.set('modal', 'sanskar');
        url.searchParams.set('id', sanskarId);
        window.history.pushState({}, '', url);
      }
    },

    openAarti: function(aartiId) {
      const aarti = window.AARTI_DATA || [];
      this.currentItem = aarti.find(a => a.id === aartiId);
      this.currentType = 'aarti';

      if (this.currentItem) {
        this.createModal();
        this.renderContent();
        this.openModal();
        const url = new URL(window.location);
        url.searchParams.set('modal', 'aarti');
        url.searchParams.set('id', aartiId);
        window.history.pushState({}, '', url);
      }
    },

    openModal: function() {
      let modal = document.getElementById('royal-parchment-modal');
      if (!modal) {
        modal = this.createModalElement();
        document.body.appendChild(modal);
      }
      modal.classList.add('active');
    },

    createModalElement: function() {
      const modal = document.createElement('div');
      modal.id = 'royal-parchment-modal';
      modal.className = 'royal-parchment-modal';
      modal.innerHTML = `
        <div class="rp-overlay" role="dialog" aria-modal="true">
          <div class="rp-container">
            <div class="rp-header glassmorphic">
              <h2 class="rp-title font-cinzel"></h2>
              <button class="rp-close" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M18.36 6.64l-10.72 10.72M5.64 6.64l10.72 10.72"/>
                </svg>
              </button>
            </div>
            <div class="rp-content-wrapper">
              <div class="rp-sidebar">
                <div class="lang-toggle-wrapper">
                  <span class="lang-label">भाषा / Language:</span>
                  <div class="lang-toggle" tabindex="0">
                    <span class="lang-option ${this.lang === 'hi' ? 'active' : ''}" data-lang="hi">HI</span>
                    <span class="lang-option ${this.lang === 'en' ? 'active' : ''}" data-lang="en">EN</span>
                    <span class="lang-option ${this.lang === 'all' ? 'active' : ''}" data-lang="all">ALL</span>
                  </div>
                </div>
                <div class="rp-meta"></div>
              </div>
              <div class="rp-content">
                <div class="rp-text"></div>
              </div>
            </div>
            <div class="rp-footer glassmorphic flex justify-between items-center">
              <button class="rp-copy touch-target" aria-label="Copy Content">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16 1H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm3 4H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"/>
                </svg>
              </button>
              <button class="rp-share touch-target" aria-label="Share on WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM7.3 13.7l-.8-.5-3.5 1.3 1.1-1.2 3.1-1.2 3.1 3.1-1.6 3.1-3.5-1.3 2.9-2.8-1.5-3.1-3.1 3.1z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Add styles
      const style = document.createElement('style');
      style.textContent = `
        .royal-parchment-modal {
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
        .royal-parchment-modal.active {
          opacity: 1;
          visibility: visible;
        }
        .rp-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .rp-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          padding: 1rem;
        }
        .rp-header {
          position: sticky;
          top: 0;
          z-index: 10;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .rp-title {
          flex: 1;
          margin: 0;
          font-size: 1.25rem;
          color: var(--maroon, #6B0F1A);
        }
        .rp-close {
          background: none;
          border: none;
          color: var(--maroon, #6B0F1A);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .rp-close:hover {
          background: rgba(107, 15, 26, 0.1);
        }
        .rp-content-wrapper {
          display: flex;
          gap: 1rem;
          flex: 1;
          overflow: hidden;
        }
        .rp-sidebar {
          min-width: 180px;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          flex-shrink: 0;
        }
        .rp-content {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
        }
        .lang-toggle-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .lang-label {
          font-size: 0.75rem;
          color: var(--sandalwood, #2C1810);
          font-weight: 500;
        }
        .lang-toggle {
          display: inline-flex;
          gap: 0.25rem;
          background: var(--parchment, #FAF3E0);
          border: 1px solid var(--gold, #D4AF37);
          border-radius: 9999px;
          padding: 0.25rem;
          cursor: pointer;
        }
        .lang-option {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--maroon, #6B0F1A);
          background: transparent;
          transition: all 0.2s;
        }
        .lang-option.active,
        .lang-option:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .lang-label {
          color: #f5e6d3;
        }
        body.dark .rp-sidebar {
          background: rgba(45, 31, 18, 0.5);
        }
        .rp-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .rp-meta-item {
          font-size: 0.8rem;
          color: var(--sandalwood, #2C1810);
        }
        .rp-text {
          font-family: 'Tiro Devanagari Sanskrit', 'Noto Serif Devanagari', serif;
          font-size: 1rem;
          line-height: 1.8;
          color: var(--sandalwood, #2C1810);
        }
        body.dark .rp-text {
          color: #f5e6d3;
        }
        .rp-text h3 {
          color: var(--maroon, #6B0F1A);
          font-family: 'Cinzel', serif;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .rp-text p {
          margin: 0.75em 0;
        }
        .rp-text .divider {
          height: 1px;
          background: var(--gold, #D4AF37);
          margin: 1.5em 0;
          opacity: 0.5;
        }
        .rp-footer {
          position: sticky;
          bottom: 0;
          z-index: 10;
          padding: 1rem 1.5rem;
        }
        .touch-target {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--parchment, #FAF3E0);
          border: 1px solid var(--gold, #D4AF37);
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .touch-target:hover {
          background: var(--gold, #D4AF37);
          color: var(--parchment, #FAF3E0);
        }
        body.dark .touch-target {
          background: var(--bhojpatra, #2d1f12);
          color: #f5e6d3;
        }
        @media (max-width: 768px) {
          .rp-content-wrapper {
            flex-direction: column;
          }
          .rp-sidebar {
            min-width: auto;
            padding: 1rem;
          }
          .rp-content {
            padding: 1rem;
          }
        }
      `;
      document.head.appendChild(style);

      return modal;
    },

    renderContent: function() {
      if (!this.currentItem) return;

      const modal = document.getElementById('royal-parchment-modal');
      if (!modal) return;

      const titleEl = modal.querySelector('.rp-title');
      const metaEl = modal.querySelector('.rp-meta');
      const textEl = modal.querySelector('.rp-text');

      // Set title based on type
      const title = this.currentItem.name || this.currentItem.title || 'Content';
      if (titleEl) titleEl.textContent = title;

      // Set metadata
      if (metaEl) {
        const metaHtml = this.renderMeta();
        metaEl.innerHTML = metaHtml;
      }

      // Set content based on type and language
      if (textEl) {
        textEl.innerHTML = this.renderTextContent();
      }
    },

    renderMeta: function() {
      const items = [];

      if (this.currentType === 'tradition') {
        items.push({ label: 'Category', value: this.currentItem.category || '' });
        items.push({ label: 'Timing', value: this.currentItem.timing || '' });
      } else if (this.currentType === 'sanskar') {
        items.push({ label: 'Number', value: this.currentItem.number || '' });
        items.push({ label: 'Timing', value: this.currentItem.timing || '' });
        items.push({ label: 'Meaning', value: this.currentItem.meaning || '' });
      } else if (this.currentType === 'aarti') {
        items.push({ label: 'Deity', value: this.currentItem.deity || '' });
        items.push({ label: 'Type', value: this.currentItem.type || '' });
        items.push({ label: 'Translation', value: this.currentItem.translation || '' });
      }

      if (this.currentItem.nameEnglish) {
        items.unshift({ label: 'English', value: this.currentItem.nameEnglish });
      }

      return items.map(item =>
        `<div class="rp-meta-item"><strong>${item.label}:</strong> ${item.value}</div>`
      ).join('');
    },

    renderTextContent: function() {
      const lang = this.lang;
      const type = this.currentType;

      // Hindi mode - Sanskrit + Hindi Anuvad
      if (lang === 'hi') {
        if (type === 'aarti') {
          return `
            <h3>${this.currentItem.title} (${this.currentItem.titleEnglish})</h3>
            <h4>${this.currentItem.deity}</h4>
            <p style="font-size: 1.1em; line-height: 1.8;">${this.currentItem.text}</p>
            <div class="divider"></div>
            <h3>ਹિંદી અનુવાદ</h3>
            <p style="color: #6B0F1A; font-weight: 500;">${this.currentItem.hindiMeaning}</p>
            <div class="divider"></div>
            <h3>English Translation</h3>
            <p style="color: #6B0F1A; font-style: italic;">${this.currentItem.translation}</p>
          `;
        }
        if (type === 'tradition') {
          return `
            <h3>${this.currentItem.name}</h3>
            <h4>${this.currentItem.nameEnglish}</h4>
            <div class="divider"></div>
            <h4>विवरण</h4>
            <p>${this.currentItem.description || this.currentItem.significance}</p>
            ${this.currentItem.types ? `<p><strong>प्रकार:</strong> ${this.currentItem.types}</p>` : ''}
            ${this.currentItem.timing ? `<p><strong>समय:</strong> ${this.currentItem.timing}</p>` : ''}
          `;
        }
        if (type === 'sanskar') {
          return `
            <h3>संस्कार #${this.currentItem.number}</h3>
            <h4>${this.currentItem.name}</h4>
            <h5>${this.currentItem.nameEnglish}</h5>
            <div class="divider"></div>
            <h4>अर्थ</h4>
            <p style="color: #6B0F1A; font-weight: 500;">${this.currentItem.meaning}</p>
            <div class="divider"></div>
            <h4>क्रिया विधि</h4>
            <ol>
              ${(this.currentItem.procedure || []).map(p => `<li>${p}</li>`).join('')}
            </ol>
            ${this.currentItem.mantra ? `<p style="margin-top: 1em;"><strong>मंत्र:</strong> ${this.currentItem.mantra}</p>` : ''}
          `;
        }
      }

      // English mode - separate Sanskrit and English
      if (lang === 'en') {
        if (type === 'aarti') {
          return `
            <h3>${this.currentItem.title} (${this.currentItem.titleEnglish})</h3>
            <h4>${this.currentItem.deity}</h4>
            <h4>Sanskrit Text</h4>
            <p style="font-size: 1.1em; line-height: 1.8;">${this.currentItem.text}</p>
            <div class="divider"></div>
            <h4>English Translation</h4>
            <p>${this.currentItem.translation}</p>
            <div class="divider"></div>
            <h4>Hindi Meaning</h4>
            <p style="color: #6B0F1A;">${this.currentItem.hindiMeaning}</p>
          `;
        }
        if (type === 'tradition') {
          return `
            <h3>${this.currentItem.name}</h3>
            <h4>${this.currentItem.nameEnglish}</h4>
            <div class="divider"></div>
            <h4>Description</h4>
            <p>${this.currentItem.description || this.currentItem.significance}</p>
            ${this.currentItem.types ? `<p><strong>Types:</strong> ${this.currentItem.types}</p>` : ''}
            ${this.currentItem.timing ? `<p><strong>Timing:</strong> ${this.currentItem.timing}</p>` : ''}
          `;
        }
        if (type === 'sanskar') {
          return `
            <h3>Sanskar #${this.currentItem.number}: ${this.currentItem.name}</h3>
            <h4>${this.currentItem.nameEnglish}</h4>
            <div class="divider"></div>
            <h4>Meaning</h4>
            <p>${this.currentItem.meaning}</p>
            <div class="divider"></div>
            <h4>Procedure</h4>
            <ol>
              ${(this.currentItem.procedure || []).map(p => `<li>${p}</li>`).join('')}
            </ol>
            ${this.currentItem.mantra ? `<p><strong>Mantra:</strong> ${this.currentItem.mantra}</p>` : ''}
          `;
        }
      }

      // All languages mode
      if (lang === 'all') {
        if (type === 'aarti') {
          return `
            <h3>${this.currentItem.title} (${this.currentItem.titleEnglish})</h3>
            <h4>${this.currentItem.deity}</h4>
            <div class="divider"></div>
            <h4>ॐ संस्कृत (Sanskrit)</h4>
            <p style="font-size: 1.1em; line-height: 1.8;">${this.currentItem.text}</p>
            <div class="divider"></div>
            <h4>हिंदी अनुवाद (Hindi Translation)</h4>
            <p style="color: #6B0F1A;">${this.currentItem.hindiMeaning}</p>
            <div class="divider"></div>
            <h4>English Translation</h4>
            <p>${this.currentItem.translation}</p>
          `;
        }
        if (type === 'tradition') {
          return `
            <h3>
              <span style="color: #6B0F1A;">संस्कृत: </span>${this.currentItem.name}
              <br>
              <span style="color: #E85D04;">English: </span>${this.currentItem.nameEnglish}
            </h3>
            <div class="divider"></div>
            <h4>विवरण / Description</h4>
            <p>${this.currentItem.description || this.currentItem.significance}</p>
            ${this.currentItem.types ? `<p><strong>प्रकार / Type:</strong> ${this.currentItem.types}</p>` : ''}
            ${this.currentItem.timing ? `<p><strong>समय / Timing:</strong> ${this.currentItem.timing}</p>` : ''}
          `;
        }
        if (type === 'sanskar') {
          return `
            <h3>
              <span style="color: #6B0F1A;">संस्कार #${this.currentItem.number}: </span>${this.currentItem.name}
              <br>
              <span style="color: #E85D04;">Sanskar #${this.currentItem.number}: </span>${this.currentItem.nameEnglish}
            </h3>
            <div class="divider"></div>
            <h4>अर्थ / Meaning</h4>
            <p style="color: #6B0F1A;">${this.currentItem.meaning}</p>
            <div class="divider"></div>
            <h4>क्रिया विधि / Procedure</h4>
            <ol>
              ${(this.currentItem.procedure || []).map(p => `<li>${p}</li>`).join('')}
            </ol>
            ${this.currentItem.mantra ? `<p><strong>मंत्र / Mantra:</strong> ${this.currentItem.mantra}</p>` : ''}
          `;
        }
      }

      // Default: Hindi mode
      if (type === 'aarti') {
        return `
          <h3>${this.currentItem.title}</h3>
          <h4>${this.currentItem.deity}</h4>
          <p style="font-size: 1.1em; line-height: 1.8;">${this.currentItem.text}</p>
          <div class="divider"></div>
          <h4>हिंदी अनुवाद</h4>
          <p style="color: #6B0F1A;">${this.currentItem.hindiMeaning}</p>
        `;
      }
      if (type === 'tradition') {
        return `
          <h3>${this.currentItem.name}</h3>
          <p>${this.currentItem.description || this.currentItem.significance}</p>
        `;
      }
      if (type === 'sanskar') {
        return `
          <h3>संस्कार #${this.currentItem.number}: ${this.currentItem.name}</h3>
          <p>${this.currentItem.meaning}</p>
        `;
      }

      return '<p>Content not available</p>';
    },

    isOpen: function() {
      const modal = document.getElementById('royal-parchment-modal');
      return modal && modal.classList.contains('active');
    },

    closeModal: function() {
      const modal = document.getElementById('royal-parchment-modal');
      if (modal) {
        modal.classList.remove('active');
      }
      this.currentItem = null;
      this.currentType = null;

      // Update URL
      const url = new URL(window.location);
      url.searchParams.delete('modal');
      url.searchParams.delete('id');
      window.history.pushState({}, '', url);
    },

    copyContent: function() {
      const content = this.renderTextContent();
      const temp = document.createElement('div');
      temp.innerHTML = content;
      const text = temp.textContent || temp.innerText || '';

      navigator.clipboard.writeText(text).then(() => {
        this.showToast('Content copied to clipboard');
      }).catch(() => {
        alert('Copied to clipboard');
      });
    },

    shareWhatsApp: function() {
      const title = this.currentItem.name || this.currentItem.title || 'Sanatan Dharma';
      const content = this.renderTextContent();
      const temp = document.createElement('div');
      temp.innerHTML = content;
      const text = temp.textContent || temp.innerText || '';
      const url = `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + text)}`;
      window.open(url, '_blank');
    },

    showToast: function(message) {
      let toast = document.getElementById('rp-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'rp-toast';
        toast.className = 'fixed top-4 right-4 glassmorphic px-4 py-3 rounded-lg shadow-lg z-50';
        document.body.appendChild(toast);
      }

      toast.textContent = message;
      toast.style.opacity = '1';

      setTimeout(() => {
        toast.style.opacity = '0';
      }, 3000);
    },

    checkUrlParams: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const modalType = urlParams.get('modal');
      const itemId = urlParams.get('id');

      if (modalType && itemId) {
        if (modalType === 'tradition') {
          this.openTradition(itemId);
        } else if (modalType === 'sanskar') {
          this.openSanskar(itemId);
        } else if (modalType === 'aarti') {
          this.openAarti(itemId);
        }
      }
    }
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.RoyalParchmentReader = RoyalParchmentReader;
      RoyalParchmentReader.init();
      RoyalParchmentReader.checkUrlParams();
    });
  } else {
    window.RoyalParchmentReader = RoyalParchmentReader;
    RoyalParchmentReader.init();
    RoyalParchmentReader.checkUrlParams();
  }

  // Expose globally
  window.RoyalParchmentReader = RoyalParchmentReader;

})();