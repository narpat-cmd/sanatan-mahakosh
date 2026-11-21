// Sanatan Dharma Mahakosh - Shared Layout, Header, Footer, Theme/Font/Audio Controllers

(function() {
  'use strict';

  // Theme and state management
  const state = {
    darkMode: localStorage.getItem('sanatan-dark-mode') === 'true' || false,
    diyaMode: localStorage.getItem('sanatan-diya-mode') === 'true',
    fontSize: localStorage.getItem('sanatan-font-size') || 'medium',
    audioEnabled: localStorage.getItem('sanatan-audio-enabled') === 'true'
  };

  // Audio context for temple bell
  let audioContext = null;
  let templeBellBuffer = null;

  // Create temple bell audio buffer
  async function initAudio() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Generate a simple temple bell sound
      const duration = 0.5;
      const sampleRate = audioContext.sampleRate;
      const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
      const data = buffer.getChannelData(0);

      // Create a bell-like waveform (complex tone with harmonics)
      for (let i = 0; i < sampleRate * duration; i++) {
        const t = i / sampleRate;
        // Multiple harmonics for bell-like sound
        data[i] = Math.sin(2 * Math.PI * 660 * t) *
                  Math.sin(2 * Math.PI * 1320 * t) *
                  Math.sin(2 * Math.PI * 1980 * t) *
                  Math.exp(-t * 3) * 0.3;
      }
      templeBellBuffer = buffer;
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  // Play temple bell sound
  function playTempleBell() {
    if (!state.audioEnabled) return;
    if (!audioContext) {
      initAudio();
      return;
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (templeBellBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = templeBellBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  }

  // Toggle audio
  function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;
    localStorage.setItem('sanatan-audio-enabled', state.audioEnabled);
    updateAudioButton();
    return state.audioEnabled;
  }

  // Apply theme classes to body
  function applyTheme() {
    const body = document.body;
    if (state.darkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
    if (state.diyaMode) {
      body.classList.add('diya-mode');
    } else {
      body.classList.remove('diya-mode');
    }
    saveTheme();
  }

  // Save theme preference to localStorage
  function saveTheme() {
    localStorage.setItem('sanatan-dark-mode', state.darkMode);
    localStorage.setItem('sanatan-diya-mode', state.diyaMode);
  }

  // Toggle dark/diya mode
  function toggleMode() {
    if (state.darkMode && state.diyaMode) {
      // Switch from diya to dark
      state.diyaMode = false;
      applyTheme();
    } else if (state.darkMode) {
      // Switch from dark to regular/light
      state.darkMode = false;
      applyTheme();
    } else {
      // Switch from light to dark mode
      state.darkMode = true;
      applyTheme();
    }
    updateModeButton();
  }

  // Adjust font size
  function adjustFontSize(delta) {
    const body = document.body;
    body.classList.remove('font-small', 'font-medium', 'font-large');

    if (delta < 0) {
      state.fontSize = 'small';
      body.classList.add('font-small');
    } else if (delta > 0) {
      state.fontSize = 'large';
      body.classList.add('font-large');
    } else {
      state.fontSize = 'medium';
      body.classList.add('font-medium');
    }

    localStorage.setItem('sanatan-font-size', state.fontSize);
  }

  // Create header element
  function createHeader() {
    const header = document.createElement('header');
    header.className = 'sticky-header';
    header.innerHTML = `
      <div class="header-container">
        <a href="./index.html" class="header-logo">
          <svg viewBox="0 0 24 24" class="om-icon" width="28" height="28" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93c-1.44 0-2.6-1.16-2.6-2.6 0-1.16.93-2.13 2.13-2.13.55 0 1.03.23 1.44.56-.12.43-.19.91-.19 1.41 0 1.16.93 2.13 2.1 2.13H9.4L8 16.93z"/>
          </svg>
          <span class="site-title">SANATAN MAHAKOSH</span>
        </a>

        <nav class="main-nav" id="main-nav">
          <a href="./index.html" class="nav-link ${getCurrentPageClass('home')}" data-page="home">Home</a>
          <a href="./scriptures.html" class="nav-link ${getCurrentPageClass('scriptures')}" data-page="scriptures">Scriptures</a>
          <a href="./temples.html" class="nav-link ${getCurrentPageClass('temples')}" data-page="temples">Temples</a>
          <a href="./traditions.html" class="nav-link ${getCurrentPageClass('traditions')}" data-page="traditions">Traditions</a>
          <a href="./sanskars.html" class="nav-link ${getCurrentPageClass('sanskars')}" data-page="sanskars">Sanskars</a>
          <a href="./aarti.html" class="nav-link ${getCurrentPageClass('aarti')}" data-page="aarti">Aarti & Stotras</a>
        </nav>

        <div class="header-controls">
          <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Dark/Diya Mode">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z"/>
              <path d="M21 12h-2a1 1 0 0 1 0 2 1 1 0 0 1 0-2zm-9 7a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm9 0a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1zm-9-15a1 1 0 0 1 1 1H9a1 1 0 0 1 0 2H9a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm5.657 4.343a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zm-11.314 5.657a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zm13.157 1.586a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0z"/>
            </svg>
          </button>

          <button class="font-size-toggle" id="font-size-toggle" aria-label="Adjust Font Size">
            <span id="font-size-text">A</span>
          </button>

          <button class="audio-toggle" id="audio-toggle" aria-label="Toggle Temple Bell Audio">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M16.5 12c0-1-1-1.5-2-1.5s-2 .5-2 1.5c0 1 1 1.5 2 1.5s2-.5 2-1.5zM9 15v-6h-3L6.5 3H17.5L21 5.5V18.5L17.5 21H7.5L4.5 19H7V5H9z"/>
              <path d="M12 5v14M8.5 5v14l-2.5-1.5V6.5L8.5 5z"/>
            </svg>
          </button>

          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Menu">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M3 6h18M3 12h18M3 18h18"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="mobile-nav-drawer" id="mobile-nav-drawer">
        <button class="close-btn" id="mobile-close-btn" aria-label="Close Menu">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M18.36 6.64l-10.72 10.72M5.64 6.64l10.72 10.72"/>
          </svg>
        </button>
        <nav>
          <a href="./index.html" class="nav-link" data-page="home">Home</a>
          <a href="./scriptures.html" class="nav-link" data-page="scriptures">Scriptures</a>
          <a href="./temples.html" class="nav-link" data-page="temples">Temples</a>
          <a href="./traditions.html" class="nav-link" data-page="traditions">Traditions</a>
          <a href="./sanskars.html" class="nav-link" data-page="sanskars">Sanskars</a>
          <a href="./aarti.html" class="nav-link" data-page="aarti">Aarti & Stotras</a>
        </nav>
      </div>

      <div class="nav-overlay" id="nav-overlay"></div>
    `;

    return header;
  }

  // Get current page for nav highlighting
  function getCurrentPageClass(currentPage) {
    const path = window.location.pathname.split('/').pop();
    if (path === '' && currentPage === 'home') return 'active';
    if (path === 'index.html' && currentPage === 'home') return 'active';
    return path === `${currentPage}.html` ? 'active' : '';
  }

  // Create footer element
  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-content">
        <div class="footer-logo">
          <svg viewBox="0 0 24 24" class="om-icon" width="28" height="28" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93c-1.44 0-2.6-1.16-2.6-2.6 0-1.16.93-2.13 2.13-2.13.55 0 1.03.23 1.44.56-.12.43-.19.91-.19.141 0 1.16.93 2.13 2.1 2.13H9.4L8 16.93z"/>
          </svg>
          <span>SANATAN MAHAKOSH</span>
        </div>

        <nav class="footer-nav">
          <a href="./index.html">Home</a>
          <a href="./scriptures.html">Scriptures</a>
          <a href="./temples.html">Temples</a>
          <a href="./traditions.html">Traditions</a>
          <a href="./sanskars.html">Sanskars</a>
          <a href="./aarti.html">Aarti</a>
        </nav>

        <div class="footer-invocation">
          सर्वे भवन्तु सुखिनः सर्वे संतु सुखिनः ।<br>
          सर्वे वर्द्धन्तु संपलः सर्वे णो भवन्तु राघवः ॥<br>
          May all be happy, may all be free from sorrow,<br>
          May all prosper, may all be united in divine consciousness.
        </div>

        <div class="footer-copyright">
          <p>&copy; 2024 Sanatan Dharma Mahakosh. All rights reserved.</p>
          <p>Built with  श्रद्धा for the preservation and propagation of Sanatan Dharma.</p>
        </div>
      </div>
    `;

    return footer;
  }

  // Initialize layout
  function initLayout() {
    const header = createHeader();
    const footer = createFooter();

    document.body.insertBefore(header, document.body.firstChild);
    document.body.appendChild(footer);

    // Set initial theme
    applyTheme();
    updateModeButton();
    updateAudioButton();

    // Add event listeners
    document.addEventListener('click', function(e) {
      // Theme toggle
      if (e.target.id === 'theme-toggle' || e.target.closest('#theme-toggle')) {
        toggleMode();
      }

      // Audio toggle
      if (e.target.id === 'audio-toggle' || e.target.closest('#audio-toggle')) {
        if (toggleAudio()) {
          playTempleBell();
        }
      }

      // Font size
      if (e.target.id === 'font-size-toggle' || e.target.closest('#font-size-toggle')) {
        let currentSize = state.fontSize;
        if (currentSize === 'small') currentSize = 'medium';
        else if (currentSize === 'medium') currentSize = 'large';
        else currentSize = 'small';
        adjustFontSize(currentSize === 'small' ? -1 : currentSize === 'large' ? 1 : 0);
      }

      // Mobile menu
      if (e.target.id === 'mobile-menu-btn' || e.target.closest('#mobile-menu-btn')) {
        document.body.classList.add('mobile-menu-open');
      }

      if (e.target.id === 'mobile-close-btn' || e.target.closest('#mobile-close-btn') ||
          e.target.id === 'nav-overlay' || e.target.closest('#nav-overlay')) {
        document.body.classList.remove('mobile-menu-open');
      }

      // Handle nav link clicks on mobile
      const navLink = e.target.closest('.nav-link');
      if (navLink) {
        const drawer = document.querySelector('.mobile-nav-drawer');
        if (drawer) {
          drawer.closest('body, html').classList.remove('mobile-menu-open');
        }
      }
    });

    // Initialize audio context
    initAudio();
  }

  // Update mode button icon
  function updateModeButton() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      const sunPath = "M12 4.5a1 1 0 0 1 1 1V7a1 1 0 0 1-2 0V5.5a1 1 0 0 1 1-1z M12 19.5a1 1 0 0 1 1 1V21a1 1 0 0 1-2 0v-1.5a1 1 0 0 1 1-1z M4.5 12a1 1 0 0 1 1-1H6a1 1 0 0 1 0 2H5.5a1 1 0 0 1-1-1z M19.5 12a1 1 0 0 1 1-1H21a1 1 0 0 1 0 2h-1.5a1 1 0 0 1-1-1z M6.364 6.364a1 1 0 0 1 0 1.414L4.95 9.172a1 1 0 1 1-1.414-1.414l1.822-1.822a1 1 0 0 1 1.414 0zm11.314 0a1 1 0 0 1 0 1.414l1.822 1.822a1 1 0 0 1-1.414 1.414L16.364 9.172a1 1 0 0 1-1.414-1.414zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z";
      const moonPath = "M21 12.79A9 9 0 0 1 11.21 3c.34-.03.67.07 1 .2.55.13 1.14.33 1.7.6a1 1 0 0 0 1.19-.21 1 1 0 0 0 .26-1.31l-.26-.8a1 1 0 0 0-1.13-.57A9 9 0 0 1 12 2c-4.97 0-9 4.03-9 9 0 4.97 4.03 9 9 9 2.3 0 4.43-.8 6.13-2.14a1 1 0 0 0 .26-1.31l-.26-.8a1 1 0 0 0-1.13-.57 8.95 8.95 0 0 1-1.03-.79z";

      if (state.diyaMode) {
        // Diya icon
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 2L14 6H18L13 9L15 13L12 11L9 13L11 9L6 6H10L12 2z"/>
          <path d="M9 16v2h6v-2H9z"/>
        </svg>`;
      } else if (state.darkMode) {
        // Moon icon
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="${moonPath}"/>
        </svg>`;
      } else {
        // Sun icon
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 2v2M12 21v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M21 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>`;
      }
    }
  }

  // Update audio button
  function updateAudioButton() {
    const btn = document.getElementById('audio-toggle');
    if (btn) {
      if (state.audioEnabled) {
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M16.5 12c0-1-1-1.5-2-1.5s-2 .5-2 1.5c0 1 1 1.5 2 1.5s2-.5 2-1.5zM9 15v-6h-3L6.5 3H17.5L21 5.5V18.5L17.5 21H7.5L4.5 19H7V5H9z"/>
          <path d="M12 5v14M8.5 5v14l-2.5-1.5V6.5L8.5 5z"/>
          <path d="M5 9v6h4l4 4V5H9v6H5z"/>
        </svg>`;
        btn.classList.add('active');
      } else {
        btn.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M16.5 12c0-1-1-1.5-2-1.5s-2 .5-2 1.5c0 1 1 1.5 2 1.5s2-.5 2-1.5zM9 15v-6h-3L6.5 3H17.5L21 5.5V18.5L17.5 21H7.5L4.5 19H7V5H9z"/>
          <path d="M12 5v14M8.5 5v14l-2.5-1.5V6.5L8.5 5z"/>
        </svg>`;
        btn.classList.remove('active');
      }
    }
  }

  // Expose functions globally
  window.SanatanLayout = {
    init: initLayout,
    toggleMode: toggleMode,
    adjustFontSize: adjustFontSize,
    toggleAudio: toggleAudio,
    applyTheme: applyTheme,
    state: state
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayout);
  } else {
    initLayout();
  }

})();