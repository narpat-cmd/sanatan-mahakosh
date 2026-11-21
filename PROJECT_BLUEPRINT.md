# SANATAN DHARMA MAHAKOSH — A-TO-Z MASTER ARCHITECTURE & BUILD BLUEPRINT
**Role:** Act as a Principal Frontend Architect, Award-Winning UI/UX Designer, QA Automation Engineer, and Sanatan Cultural Historian.
**Objective:** Build, verify, and deploy a **massive, museum-grade, 6-page static Encyclopedia & Portal** for Sanatan Dharma inside the current working directory (`./`). Execute everything autonomously from start to finish without stopping halfway or asking unnecessary questions.

---

## 1. CRITICAL WORKSPACE, PATH & ANTI-CRASH ENGINEERING RULES
1. **STRICTLY RELATIVE PATHS ONLY:** NEVER use absolute Windows paths (like `E:\Sanatan\...` or `E:\SANATAN\...`) in any file write or shell command—Windows backslash escaping (`\S`) corrupts paths. Always use strictly relative paths: `./index.html`, `./temples.html`, `./styles/main.css`, `./js/layout.js`, `./data/scriptures.js`.
2. **CLEAN OVERWRITE:** Rebuild all HTML, CSS, and JS files cleanly so zero old broken code, mismatched variable names, or dead event listeners remain.
3. **ZERO CORS / ZERO ES MODULES:** Do NOT use `type="module"` or `fetch()` for local JS/JSON files (they break on `file://` and cause CORS issues). Load all scripts via standard `<script src="./..."></script>` tags at the bottom of `<body>` in this exact dependency order:
   1. `./data/scriptures.js`
   2. `./data/temples.js`
   3. `./data/traditions.js`
   4. `./data/sanskars.js`
   5. `./data/aarti.js`
   6. `./js/layout.js`
   7. `./js/search-engine.js`
   8. `./js/book-reader.js` (on `scriptures.html` & `aarti.html`)
   9. `./js/temple-viewer.js` (on `temples.html`)
   10. `./js/app.js`
4. **UTF-8 & CRISP INLINE SVGs (ZERO GARBLED ICONS):** Place `<meta charset="UTF-8">` as the VERY FIRST line inside `<head>` on ALL 6 HTML pages. NEVER use raw emojis or broken Unicode symbols for UI buttons/icons. Use custom, clean inline `<svg>` icons for:
   - Om Emblem (Logo)
   - Moon / Sun (Dark / Diya Mode)
   - Volume / Mute (Ambient Temple Bell)
   - Magnifying Glass (Search)
   - Hamburger Menu & Close (`X`)
   - Left / Right Navigation Arrows, Copy, WhatsApp Share, Map Pin, Book, Temple, Lotus
   - Use plain text `A-`, `A`, `A+` for Font Size buttons.
5. **BULLETPROOF CLICK HANDLING:** Use event delegation (`document.addEventListener('click', ...)`) for all dynamically rendered cards, filter pills, bookshelf items, temple cards, and search dropdown items. Always null-check DOM elements so a missing ID on one page never crashes `app.js`.
6. **ZERO BROKEN IMAGES:** Use verified Wikimedia Commons / Unsplash URLs for temple galleries and devotional art, AND attach an `onerror` handler to every `<img>` that swaps in an ornate inline SVG fallback illustration so a broken image icon can never appear.

---

## 2. COMPLETE MULTI-PAGE SITEMAP & FILE ARCHITECTURE
```text
./
├── index.html          # Grand Royal Homepage & Universal Portal
├── scriptures.html     # Digital Scripture Library + 3D Page-Flip Book Reader
├── temples.html        # Temples & Pilgrimages Encyclopedia + Darshan & Lightbox Gallery
├── traditions.html     # Sanatan Lifestyle, Daily Rules, Home Puja & Spiritual Science
├── sanskars.html       # 16 Sanskars Timeline, Core Philosophy & Major Vrat Kathas
├── aarti.html          # Daily Aarti, Chalisa, Stotras & Vedic Mantras Sangrah
├── styles/
│   └── main.css        # Royal Heritage Design System, Dark/Diya Mode, 3D Flipbook, Responsive
├── js/
│   ├── layout.js       # Shared Sticky Header, Mobile Menu, Footer, Theme/Font/Audio Controllers
│   ├── search-engine.js# Cross-Page Universal Instant Search with URL Deep-Linking
│   ├── book-reader.js  # 3D Page-Flip Book Reader Engine (Desktop 2-Page / Mobile 1-Page)
│   ├── temple-viewer.js# Temple Darshan Modal + Bottom Photo Gallery Lightbox Engine
│   └── app.js          # Page Router & Section Renderers for all 6 HTML pages
└── data/
    ├── scriptures.js   # window.SCRIPTURES_DATA
    ├── temples.js      # window.TEMPLES_DATA
    ├── traditions.js   # window.TRADITIONS_DATA
    ├── sanskars.js     # window.SANSKARS_DATA
    └── aarti.js        # window.AARTI_DATA
3. VISUAL DESIGN SYSTEM & CROSS-DEVICE COMPATIBILITY
Aesthetic: Museum-grade Royal Indian Heritage (NO generic SaaS/Bootstrap/flat cards). Use aged handmade Bhojpatra parchment textures (CSS SVG noise/grain overlay), subtle rotating low-opacity gold mandala backgrounds, Rajasthani maroon/gold filigree corners, carved wooden 3D bookshelf shelves, and soft diya-glow shadows in Dark Mode.

Color Palette (CSS Variables):

--maroon: #6B0F1A (Deep Temple Maroon)

--saffron: #E85D04 (Sacred Bhagwa)

--gold: #D4AF37 / #C59B27 (Antique Gold)

--parchment: #FAF3E0 / #F2E2C4 (Aged Handmade Parchment)

--sandalwood: #2C1810 (Dark Sandalwood Text)

Dark / Diya Night Mode (body.dark-mode): Deep charcoal-sandalwood #160D0A background, warm parchment #F5E6CA text, antique gold #E5C158 accents, soft amber diya-glow shadows.

Typography: Load Google Fonts Cinzel, Rozha One, Tiro Devanagari Sanskrit, Noto Serif Devanagari + Tailwind CSS CDN. Use clamp() fluid typography so headings scale cleanly from 320px phones to 4K monitors.

Universal Device & Browser Fit (Chrome, Edge, Firefox, Safari/iOS, Samsung Internet):

Strictly overflow-x: hidden on html, body.

Use 100dvh (not 100vh) for full-screen Book Reader and Modals to prevent iOS Safari address-bar clipping.

Include -webkit-backdrop-filter, -webkit-transform-style: preserve-3d, and -webkit-backface-visibility: hidden.

Respect env(safe-area-inset-*) and ensure all interactive buttons have minimum 44px × 44px tap targets.

4. DETAILED PAGE-BY-PAGE SPECIFICATIONS
Shared Header & Footer (./js/layout.js — Injected on ALL 6 Pages)
Sticky Glassmorphic Header:

Left: Inline SVG Om Emblem + SANATAN MAHAKOSH (links to ./index.html).

Center Nav (with active-page gold underline): Home (./index.html), Scriptures (./scriptures.html), Temples (./temples.html), Traditions (./traditions.html), Sanskars (./sanskars.html), Aarti & Stotras (./aarti.html).

Right Controls: Dark/Diya Mode toggle (saved in localStorage), Font Size (A-, A, A+ saved in localStorage), Ambient Temple Bell Web Audio toggle (muted by default, unlocked only on user click), and Mobile Hamburger button (< 768px) opening a smooth slide-down nav drawer.

Royal Heritage Footer: Sacred Om emblem, quick links to all 6 pages, Sanskrit peace invocation (Sarve Bhavantu Sukhinah), and copyright note.

Page 1: ./index.html (Grand Royal Portal Homepage)
Majestic Hero Section: Rotating low-opacity gold mandala backdrop, title "SANATAN DHARMA MAHAKOSH", subtitle, and a prominent Universal Instant Search Bar with quick-suggestion pills ("Gita 2.47", "Kedarnath", "Kamakhya", "Tilak", "Hanuman Chalisa", "16 Sanskars").

Shloka of the Day Card: Daily rotating Sanskrit shloka + English transliteration + clear meaning + Copy Verse (with toast notification) + WhatsApp Share button.

5-Portal Gateway Grid: 5 ornate cards linking directly to scriptures.html, temples.html, traditions.html, sanskars.html, and aarti.html with item counts.

Featured Royal 3D Bookshelf Preview: Carved wooden shelf showing Bhagavad Gita, Ramayan, 4 Vedas, 18 Puranas (clicking any book navigates to ./scriptures.html?book=<id>).

Featured Sacred Temples Preview: 6 iconic temple cards (clicking navigates to ./temples.html?id=<id>).

Featured Sanatan Science & Traditions Preview: 6 everyday tradition cards (clicking navigates to ./traditions.html?id=<id>).

Page 2: ./scriptures.html (Digital Library & 3D Page-Flip Book Reader)
Category Filter Bar: All, Bhagavad Gita, Ramayan, 4 Vedas & Upanishads, 18 Mahapuranas.

Carved Wooden 3D Bookshelf Grid: Embossed hardcover books with gold spine details and hover 3D tilt.

Interactive 3D Page-Flip Book Reader (./js/book-reader.js):

Full-screen (100dvh) modal with aged Bhojpatra parchment (#F9F1DF to #F2E2C4), Rajasthani maroon/gold corner filigree, center spine gutter shadow, hanging red silk bookmark ribbon, and subtle Web Audio paper-rustle sound on turn.

Desktop: Two-page open book spread — Left Page: ornate antique gold-framed devotional artwork/SVG + caption; Right Page: Granth/Chapter header, bold Sanskrit verse in #800000 with || 2 || markers, English transliteration, gold lotus divider, and simple English translation & spiritual meaning.

Mobile: Single-page 3D flip with touch-swipe + accessible bottom Prev/Next bar.

Controls: Prev/Next buttons, Left/Right keyboard arrows, collapsible Table of Contents (Chapter/Verse Index Drawer), Font Size, Copy Verse, WhatsApp Share, Close (X) & Escape.

URL Deep-Linking: ./scriptures.html?book=bhagavad-gita&ch=2&v=47 MUST auto-open the 3D Book Reader directly to Bhagavad Gita Chapter 2 Verse 47.

Page 3: ./temples.html (Divine Temples & Pilgrimages Encyclopedia)
Filter Tabs + Instant Temple Filter Input: All, 12 Jyotirlingas, 52 Shaktipeeths, Char Dham, Sapta Puri, Famous Temples.

Temple Explorer Grid: Rich cards showing Temple Name, Category Badge, Deity, Location, and "Darshan & Beliefs" CTA.

Complete Temple Darshan Modal (./js/temple-viewer.js) — Mandatory Top-to-Bottom Order:

Hero Header & Destination Guide: Name, Category Badge, Main Deity, Exact Location, Nearest Railway Station & Airport with distance, Best Season, Daily Darshan & Aarti Timings, and working Google Maps route button.

Complete Puranic History & Every Small-to-Big Belief:

1. Main Puranic Origin Story

2. Every Small & Big Local Belief, Miracles & Mysteries (sacred kunds, architectural mysteries, tying threads/locks/bells, special wishes, unique prasad)

3. Special Worship Rules, Parikrama & Spiritual Significance (Phalashruti)

Bottom Photo Gallery (4–6 photos per temple): Responsive grid where clicking any photo launches a full-screen Image Lightbox (Prev/Next/Close + caption). Every <img> has an onerror ornate temple SVG fallback.

URL Deep-Linking: ./temples.html?id=kedarnath MUST auto-open Kedarnath's full Darshan View on load.

Page 4: ./traditions.html (Sanatan Lifestyle, Daily Rules & Science)
Filter Tabs: All, Daily Routine & Science, Home Temple & Puja Rules, Sacred Symbols & Rudraksha.

Cards Grid + Detail Reader Modal: Clicking any card opens a clean modal showing Summary, Step-by-Step Rules/Types, Mantras, and Scientific & Spiritual Significance.

URL Deep-Linking: ./traditions.html?id=tilak MUST auto-open the Tilak guide on load.

Page 5: ./sanskars.html (16 Sanskars, Philosophy & Vrat Kathas)
Tab / Section 1 — All 16 Sanskars Timeline: Numbered 1 to 16 (Garbhadhana to Antyeshti) with clickable cards revealing timing, meaning, procedure, and spiritual significance.

Tab / Section 2 — Core Sanatan Philosophy: 4 Purusharthas, 4 Ashramas, 4 Yugas, Karma & Reincarnation, Panchamahabhutas, Navagraha & Remedies.

Tab / Section 3 — Major Vrat Kathas & Festivals: Ekadashi, Pradosh, Mahashivratri, Navratri, Janmashtami, Ram Navami, Diwali, Holi.

Page 6: ./aarti.html (Daily Aarti, Chalisa, Stotras & Mantras)
Filter Tabs: All, Aartis, Chalisas, Stotras, Vedic Mantras.

Devotional Reader: Clicking any Aarti/Chalisa/Stotra opens it in a clean parchment reader (or 3D Book Reader) with original text, transliteration, English meaning, Copy, and WhatsApp Share.

5. CROSS-PAGE UNIVERSAL SEARCH ENGINE (./js/search-engine.js)
Loaded on ALL pages. Searches case-insensitively across window.SCRIPTURES_DATA, window.TEMPLES_DATA, window.TRADITIONS_DATA, window.SANSKARS_DATA, and window.AARTI_DATA.

Supports natural queries like "GITA", "Gita 2.47", "10.2", "Sundarkand", "Kedarnath", "Kamakhya", "Tilak", "Rudraksha", "Garbhadhana", "Hanuman Chalisa".

Clicking a result navigates directly to the exact target page with deep-link query params (e.g., ./scriptures.html?book=bhagavad-gita&ch=2&v=47, ./temples.html?id=kedarnath, ./traditions.html?id=tilak, ./sanskars.html?id=garbhadhana, ./aarti.html?id=hanuman-chalisa).

6. EXACT GLOBAL DATA CONTRACTS & AUTHENTIC CONTENT (./data/)
NEVER use placeholders or "TODO" comments. Populate complete, authentic data:

./data/scriptures.js -> window.SCRIPTURES_DATA (Array):

bhagavad-gita (All 18 Chapters; MUST include 2.47 & 10.2 with Sanskrit, transliteration, meaning)

ramayan (All 7 Kands: Bal, Ayodhya, Aranya, Kishkindha, Sundar, Lanka, Uttar Kand)

vedas (Rigveda, Yajurveda, Samaveda, Atharvaveda + Isha, Katha, Mundaka, Prashna, Mandukya Upanishads)

puranas (All 18 Mahapuranas summaries + key stories/verses)

./data/temples.js -> window.TEMPLES_DATA (Array):

All 12 Jyotirlingas (Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Ramanathaswamy, Grishneshwar)

Major & comprehensive 52 Shaktipeeths (Kamakhya, Kalighat, Vaishno Devi, Jwala Ji, Hinglaj, Ambaji, Tarapith, Kangra, etc. with body part/ornament, Shakti & Bhairav forms)

Char Dham & Chota Char Dham (Badrinath, Dwarka, Puri, Rameswaram, Yamunotri, Gangotri)

Sapta Puri (Ayodhya, Mathura, Haridwar, Kashi, Kanchipuram, Ujjain, Dwarka)

Famous Ancient Temples (Tirupati Balaji, Jagannath Puri, Khatu Shyam Ji, Salasar Balaji, Prem Mandir, Padmanabhaswamy, Meenakshi Temple)

./data/traditions.js -> window.TRADITIONS_DATA (Array):

Brahma Muhurta, Bowing to Mother Earth, Surya Arghya, Bathing Mantras, Tilak types & science, Shikha & 3 strands of Janeu, Pranam science, Temple Bell & Parikrama, Ishan Kon home temple, Diya rules (Ghee vs Sesame oil, wick direction), Shankh rules, Tulsi puja & watering rules, Kalava (Mauli) mantra & rules, 1–14 Mukhi Rudraksha guide, Go-Seva & Panchagavya.

./data/sanskars.js -> window.SANSKARS_DATA (Array):

All 16 Sanskars (Garbhadhana through Antyeshti), 4 Purusharthas, 4 Ashramas, 4 Yugas, Karma & Reincarnation, Panchamahabhutas, Navagraha & remedies, and Major Vrat Kathas.

./data/aarti.js -> window.AARTI_DATA (Array):

Ganesh Aarti, Shiv Aarti, Lakshmi Aarti, Hanuman Chalisa, Durga Chalisa, Shiv Tandav Stotram, Rudrashtakam, Madhurashtakam, Gayatri Mantra, Mahamrityunjaya Mantra.

7. MANDATORY AUTOMATED QA & FREE GITHUB PAGES DEPLOYMENT
Syntax Audit: Run node --check on EVERY .js file in ./data/ and ./js/. Zero syntax errors allowed.

Runtime & Search Verification Script: Run a Node.js script that loads all 5 ./data/*.js files into a mock window object and verifies:

All 5 datasets are non-empty arrays with valid IDs.

Case-insensitive search returns real matches for "GITA", "2.47", "Kedarnath", "Kamakhya", "Tilak", "Garbhadhana", and "Hanuman Chalisa".

HTML Audit: Verify all 6 HTML files (index.html, scriptures.html, temples.html, traditions.html, sanskars.html, aarti.html) have <meta charset="UTF-8"> first in <head>, valid relative script paths, and zero garbled icons.

Git Commit & Live Push:

git add *.html styles/ data/ js/ README.md

git commit -m "Build complete 6-page Sanatan Dharma Mahakosh portal from PROJECT_BLUEPRINT.md"

git push origin main

Print git log -1 and confirm the live URL: https://narpat-cmd.github.io/sanatan-mahakosh/