// Sanatan Dharma Mahakosh - Main Application Controller
// State management, page routing, and dynamic renderers

(function() {
  'use strict';

  class SanatanApp {
    constructor() {
      this.init();
    }

    init() {
      this.populateIndexPage();
    }

    populateIndexPage() {
      // Shloka of the Day
      const dailyShlokaEl = document.getElementById('daily-shloka');
      if (dailyShlokaEl) {
        dailyShlokaEl.innerHTML = `
          <div class="shloka-card">
            <div class="shloka-badge">ॐ Shloka of the Day</div>
            <blockquote class="shloka-sanskrit">कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।<br>मा कर्मफलहेतुर्भूः मा ते सङ्गोऽस्त्वकर्मणि ॥</blockquote>
            <p class="shloka-transliteration">Karmaṇy evādhikāraste mā phaleṣu kadācana | mā karmaphalaheṭurbhūḥ mā te saṅgoऽstvakarmaṇi ||</p>
            <p class="shloka-meaning"><strong>Meaning:</strong> You have a right only to work, never to its fruits. Let not the fruits of action be your motive, nor let your attachment be to inaction.</p>
            <div class="shloka-actions">
              <button class="action-btn copy-verse" data-text="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूः मा ते सङ्गोऽस्त्वकर्मणि ॥">Copy Verse</button>
              <button class="action-btn share-whatsapp" data-text="कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूः मा ते सङ्गोऽस्त्वकर्मणि ॥">WhatsApp Share</button>
            </div>
          </div>
        `;
      }

      // Bookshelf preview on index
      const bookshelfEl = document.getElementById('bookshelf-preview');
      if (bookshelfEl && window.SCRIPTURES_DATA) {
        bookshelfEl.innerHTML = window.SCRIPTURES_DATA.slice(0, 4).map(book => `
          <div class="bookshelf-book" onclick="window.location.href='./scriptures.html?book=${book.id}'">
            <div class="book-spine">
              <span class="book-spine-title">${book.title}</span>
            </div>
          </div>
        `).join('');
      }

      // Temples preview on index
      const templesPreviewEl = document.getElementById('temples-preview');
      if (templesPreviewEl && window.TEMPLES_DATA) {
        templesPreviewEl.innerHTML = window.TEMPLES_DATA.slice(0, 6).map(temple => `
          <div class="temple-preview-card" onclick="window.location.href='./temples.html?id=${temple.id}'">
            <img src="${temple.images?.[0] || ''}" alt="${temple.name}" onerror="this.src=''; this.parentNode.classList.add('no-img')">
            <div class="temple-preview-info">
              <span class="temple-cat">${temple.category}</span>
              <h4>${temple.name}</h4>
              <p>${temple.deity}</p>
            </div>
          </div>
        `).join('');
      }
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