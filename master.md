# MASTER BUILD & DEPLOY SPECIFICATION: SANATAN DHARMA MAHAKOSH
Act as a Principal Frontend Architect, Award-Winning UI/UX Designer, QA Engineer, and Sanatan Cultural Historian. Read this entire `master.md` file and execute everything autonomously from start to finish inside the current working directory (`./`). Do NOT stop halfway or ask unnecessary questions.

---

## 1. CRITICAL WORKSPACE, PATH & ANTI-CRASH RULES (MANDATORY)
1. **RELATIVE PATHS ONLY:** NEVER use absolute Windows paths (like `E:\Sanatan\...` or `E:\SANATAN\...`). Windows backslash escaping breaks paths. Use strictly relative paths: `./index.html`, `./styles/main.css`, `./data/scriptures.js`, `./js/app.js`, etc.
2. **CLEAN REBUILD:** Overwrite all existing HTML, CSS, and JS files cleanly so zero old bugs, broken variable names, or dead event listeners remain.
3. **ZERO CORS / MODULE ERRORS:** Do NOT use `type="module"` or `fetch()` for local data files. Load all scripts via standard `<script src="./..."></script>` tags at the bottom of `<body>` in this EXACT order:
   1. `./data/scriptures.js`
   2. `./data/temples.js`
   3. `./data/traditions.js`
   4. `./js/book-reader.js`
   5. `./js/temple-viewer.js`
   6. `./js/search-engine.js`
   7. `./js/app.js`
4. **UTF-8 & CRISP INLINE SVGs (ZERO GARBLED ICONS):** Put `<meta charset="UTF-8">` as the VERY FIRST line inside `<head>`. NEVER use raw emojis or broken Unicode symbols for UI buttons/icons. Use clean, custom inline `<svg>` icons for the Om emblem, Dark Mode toggle, Sound toggle, Search icon, Close (`X`), and Arrows. Use plain text `A-`, `A`, `A+` for font size controls.
5. **DEFENSIVE CLICK HANDLING:** Use event delegation (`document.addEventListener('click', ...)`) for dynamically rendered Book cards, Temple cards, Tradition cards, and Search results so every single click works 100% reliably.
6. **ZERO BROKEN IMAGES:** Use reliable Wikimedia Commons / Unsplash URLs for temple photos and devotional art, AND attach an `onerror` fallback to an inline ornate SVG illustration on every `<img>` so a broken image icon can never appear.

---

## 2. EXACT GLOBAL DATA CONTRACT (NO VARIABLE MISMATCHES)
Every data file MUST attach directly to `window` with these exact structures:

### A. `./data/scriptures.js` -> `window.SCRIPTURES_DATA` (Array)
Must contain at least 5 complete book objects:
1. **`bhagavad-gita`**: Shrimad Bhagavad Gita — All 18 Chapters with real Sanskrit shlokas, English transliteration, and clear English meanings (MUST include Chapter 2 Verse 47 and Chapter 10 Verse 2).
2. **`ramayan`**: Valmiki Ramayan & Ramcharitmanas — All 7 Kands (Bal, Ayodhya, Aranya, Kishkindha, Sundar, Lanka, Uttar Kand) with Chaupai/Doha and English meaning.
3. **`vedas`**: The 4 Vedas (Rigveda, Yajurveda, Samaveda, Atharvaveda) & Principal Upanishads (Isha, Katha, Mundaka, Prashna, Mandukya).
4. **`puranas`**: The 18 Mahapuranas (Shiv, Vishnu, Shrimad Bhagavat, Garud, Markandeya/Durga Saptashati, Skanda, Agni, Padma, etc.).
5. **`aarti-chalisa`**: Daily Aarti, Chalisa, Stotras & Mantras (Hanuman Chalisa, Ganesh Aarti, Shiv Aarti, Lakshmi Aarti, Durga Chalisa, Shiv Tandav Stotram, Rudrashtakam, Madhurashtakam, Gayatri Mantra, Mahamrityunjaya Mantra).

Each book object format:
`{ id, title, subtitle, category, coverColor, accentColor, keywords: [...], chapters: [{ chapterNumber, title, illustrationCaption, verses: [{ verseNumber, sanskrit, transliteration, meaning }] }] }`

### B. `./data/temples.js` -> `window.TEMPLES_DATA` (Array)
Must contain rich entries across all 5 categories:
- **12 Jyotirlingas** (Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Ramanathaswamy, Grishneshwar)
- **52 Shaktipeeths** (Kamakhya, Kalighat, Vaishno Devi, Jwala Ji, Hinglaj, Ambaji, Tarapith, Kangra, etc. — detailing body part/ornament, Shakti form, Bhairav form)
- **Char Dham & Chota Char Dham** (Badrinath, Dwarka, Puri, Rameswaram, Yamunotri, Gangotri)
- **Sapta Puri** (Ayodhya, Mathura, Haridwar, Kashi, Kanchipuram, Ujjain, Dwarka)
- **Famous Ancient Temples** (Tirupati Balaji, Jagannath Puri, Khatu Shyam Ji, Salasar Balaji, Prem Mandir, Padmanabhaswamy, Meenakshi Temple)

Each temple object format:
`{ id, name, category, deity, location, nearestRailway, nearestAirport, bestSeason, timings, mapUrl, originStory, localBeliefs: [...], worshipRules, gallery: [{ url, caption }] }`

### C. `./data/traditions.js` -> `window.TRADITIONS_DATA` (Array)
Must contain rich entries across all 4 categories:
- **Daily Traditions:** Brahma Muhurta, Bowing to Mother Earth, Surya Arghya (copper vessel), Bathing Mantras, Tilak types & science (Chandan, Bhasma, Kumkum, Gopi Chandan), Shikha & 3 strands of Janeu, Pranam science, Temple Bell & Parikrama rules.
- **Home Puja Rules:** Ishan Kon (North-East) temple setup, Diya rules (Ghee vs. Sesame oil, wick direction), Shankh rules, Tulsi puja & watering rules (why not on Sundays/Ekadashi), Kalava (Mauli) mantra & rules, 1–14 Mukhi Rudraksha guide, Go-Seva & Panchagavya.
- **16 Sanskars:** All 16 Sanskars from Garbhadhana to Antyeshti (meaning, procedure, significance).
- **Core Philosophy & Vrat:** 4 Purusharthas, 4 Ashramas, 4 Yugas, Karma & Reincarnation, Panchamahabhutas, Navagraha & remedies, Major Vrat Kathas (Ekadashi, Pradosh, Mahashivratri, Navratri, Janmashtami, Ram Navami, Diwali, Holi).

Each tradition object format:
`{ id, title, category, summary, details: [...], scienceAndSpirituality }`

---

## 3. LAYOUT, VISUAL DESIGN & INTERACTIVE FEATURES

### 1. Visual Design System & Cross-Device Fit
- **Colors:** Deep Temple Maroon (`#6B0F1A`), Sacred Saffron (`#E85D04`), Antique Gold (`#D4AF37`), Aged Handmade Parchment (`#FAF3E0`), Dark Sandalwood (`#2C1810`).
- **Fonts:** Google Fonts `Cinzel`, `Rozha One`, `Tiro Devanagari Sanskrit`, `Noto Serif Devanagari` + Tailwind CSS CDN.
- **Royal Heritage Craft:** Parchment grain textures, low-opacity gold mandala SVGs, warm diya-glow Dark Mode, carved wooden 3D bookshelf with embossed hardcover books, smooth micro-animations.
- **Responsive (Mobile, Tablet, PC, All Browsers):** Fit `320px` to `4K` with `overflow-x: hidden`, `clamp()` typography, `100dvh` modals, `-webkit-` prefixes for `backdrop-filter` and 3D transforms, and `44px × 44px` minimum touch targets.

### 2. Sticky Glassmorphic Header & Navigation (`./js/app.js`)
- **Left:** Inline SVG Om Emblem + `SANATAN MAHAKOSH`.
- **Center Nav:** `Home`, `Scriptures`, `Temples`, `Traditions`, `Sanskars`, `Aarti & Stotras`. Clicking ANY tab MUST close open modals and smoothly scroll to that section. Include a working mobile hamburger menu.
- **Right Controls:** Dark/Diya Mode toggle (persisted in `localStorage`), Font Size (`A-`, `A`, `A+`), Ambient Temple Bell Web Audio toggle (muted by default).

### 3. Hero Section & Universal Instant Search (`./js/search-engine.js`)
- Real-time, case-insensitive autocomplete dropdown across `SCRIPTURES_DATA`, `TEMPLES_DATA`, and `TRADITIONS_DATA`.
- Clicking a Scripture/Verse result (e.g., `"GITA"`, `"Gita 2.47"`, `"Gita 10.2"`, `"Sundarkand"`) MUST immediately open `window.BookReader.open(bookId, chapterIndex, verseIndex)`.
- Clicking a Temple result (e.g., `"Kedarnath"`, `"Kamakhya"`) MUST immediately open `window.TempleViewer.open(templeId)`.
- Clicking a Tradition/Sanskar result (e.g., `"Tilak"`, `"Rudraksha"`, `"16 Sanskars"`) MUST immediately open the **Tradition Detail Modal**.

### 4. Homepage Modular Sections
1. **Shloka of the Day Card:** Daily rotating Sanskrit verse + English meaning, Copy button (with toast), WhatsApp Share button.
2. **Royal 3D Bookshelf Grid:** Embossed hardcover books on carved wooden shelves. Clicking any book opens the 3D Book Reader.
3. **Temples & Pilgrimage Explorer:** Filter tabs (All, 12 Jyotirlingas, 52 Shaktipeeths, Char Dham, Sapta Puri, Famous Temples) + clickable Temple cards.
4. **Minute Details, 16 Sanskars & Aarti/Stotras Sections:** Clean filterable cards that open either the Tradition Detail Modal or the 3D Book Reader.

### 5. Interactive 3D Page-Flip Book Reader (`./js/book-reader.js`)
- Full-screen (`100dvh`) modal with aged Bhojpatra parchment (`#F9F1DF` to `#F2E2C4`), Rajasthani maroon/gold corner filigree, spine gutter shadow, hanging red silk bookmark, and Web Audio paper-rustle sound.
- **Desktop:** Two-page open book spread (Left: ornate gold-framed devotional artwork/SVG + caption; Right: Chapter header, bold Sanskrit verse in `#800000` with `|| 2 ||` markers, transliteration, gold lotus divider, simple English translation & meaning).
- **Mobile:** Single-page flip with smooth 3D animation + touch swipe.
- **Working Controls:** `Previous` / `Next` buttons, Keyboard Left/Right arrows, collapsible **Table of Contents (Chapter/Verse Index Drawer)**, Font Size, Copy Verse, WhatsApp Share, `Close (X)` & `Escape`.

### 6. Temple Darshan & Bottom Photo Gallery Modal (`./js/temple-viewer.js`)
Must render strictly in this top-to-bottom order:
1. **Hero Header & Destination Guide:** Name, Category Badge, Deity, Location, Nearest Railway/Airport, Best Season, Darshan/Aarti Timings, and working Google Maps button.
2. **Complete Puranic History & Every Small-to-Big Belief:** (1) Main Puranic Origin Story, (2) Every Small & Big Local Belief, Miracles & Mysteries, (3) Special Worship Rules, Parikrama & Phalashruti.
3. **Bottom Photo Gallery (4–6 photos):** Responsive grid with click-to-zoom full-screen **Image Lightbox** (Prev/Next/Close) and ornate SVG fallbacks on every `<img>`.

---

## 4. MANDATORY AUTOMATED QA & GITHUB PAGES DEPLOYMENT
1. Run `node --check` on ALL 7 JS files (`./data/*.js` and `./js/*.js`). Fix any syntax error immediately.
2. Run a Node.js verification script that loads `data/scriptures.js`, `data/temples.js`, and `data/traditions.js` into a mock `window` object and verifies:
   - `window.SCRIPTURES_DATA.length >= 5`
   - `window.TEMPLES_DATA.length >= 20`
   - `window.TRADITIONS_DATA.length >= 15`
   - Case-insensitive search logic finds real matches for `"GITA"`, `"2.47"`, `"Kedarnath"`, `"Kamakhya"`, and `"Tilak"`.
3. Verify `index.html` has `<meta charset="UTF-8">` on the first line of `<head>` and zero garbled symbols in the header.
4. Commit and push to GitHub:
   - `git add index.html styles/ data/ js/ README.md`
   - `git commit -m "Complete rebuild from master.md: working search, 3D book reader, temple viewer, and SVG icons"`
   - `git push origin main`
5. Print `git log -1` and the live URL: `https://narpat-cmd.github.io/sanatan-mahakosh/`