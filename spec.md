# MASTER EXECUTION DIRECTIVE FOR CLAUDE CODE
Act as a Principal Frontend Architect, Award-Winning UI/UX Designer, and Sanatan Cultural Historian. Read this entire `spec.md` file and execute everything autonomously from start to finish without stopping halfway or asking unnecessary questions.

## STRICT QUALITY & EXECUTION STANDARDS
1. **VISUAL MASTERPIECE:** Craft an Awwwards-level royal Indian heritage aesthetic—rich parchment textures, intricate gold mandala & temple filigree SVGs, warm diya-glow dark mode, smooth micro-animations, carved wooden 3D bookshelf with embossed hardcover books, and zero generic/flat templates.
2. **MODULAR ARCHITECTURE:** Build clean, zero-backend static files inside this directory:
   - `index.html` (Semantic, SEO-friendly main template layout)
   - `styles/main.css` (Custom paper textures, 3D book perspective rules, gold borders, and dark mode variables)
   - `js/app.js` (State management, navigation, font-size & dark-mode controllers, Web Audio ambient temple bell/flute toggle)
   - `js/search-engine.js` (Instant multi-category autocomplete search across shlokas, temples, beliefs, and traditions)
   - `js/book-reader.js` (Realistic 3D page-flip physics using StPageFlip CDN or custom 3D curl engine, two-page spread renderer, and Chapter index drawer)
   - `js/temple-viewer.js` (Temple Darshan profile renderer with destination info, detailed small-to-big beliefs, and bottom lightbox photo gallery)
   - `data/scriptures.js`, `data/temples.js`, `data/traditions.js` (Rich, well-structured JS datasets)
3. **COMPLETE & AUTHENTIC DATA:** NEVER use empty placeholders or "TODO" comments. Fetch an open-source Bhagavad Gita JSON dataset from GitHub (or bundle rich, complete chapters) so all 18 chapters have real Sanskrit verses + English transliteration & translations. Populate all 12 Jyotirlingas, all 52 Shaktipeeths, Char Dham, Sapta Puri, famous temples, 16 Sanskars, daily rituals, Hanuman Chalisa, and Aartis with deep, authentic details.
4. **ZERO BROKEN IMAGES:** For temple galleries and devotional art, use verified working Wikimedia Commons / Unsplash URLs (verify they return HTTP 200) AND pair every image with a custom, ornate fallback SVG illustration so no broken image icon ever appears.
5. **TECH STACK:** Use Tailwind CSS CDN, Google Fonts (`Tiro Devanagari Sanskrit`, `Noto Serif Devanagari`, `Rozha One`, `Cinzel`), and StPageFlip (`page-flip`) CDN.

---

# PROJECT SPECIFICATION
**TITLE:** Sanatan — Sampoorna Sanatan Dharma (The Complete Encyclopedia of Sanatan Dharma Knowledge, Scriptures, Sacred Pilgrimages, and Philosophy of Life)

## 1. MODERN STATIC TEMPLATE LAYOUT & NAVIGATION ARCHITECTURE
- **Sticky Glassmorphic Temple Header:**
  - **Left:** Sacred Emblem (`Om Sanatan Mahakosh`) with subtle gold mandala styling.
  - **Center Navigation Bar:** Quick-jump tabs for **1. Digital Scripture Library**, **2. Divine Temples & Pilgrimages**, **3. Sanatan Lifestyle & Minute Rules**, **4. 16 Sanskars & Panchang**, and **5. Daily Aarti, Chalisa & Stotras**.
  - **Right Controls:** **Dark / Diya Night Reading Mode**, **Font Size Adjuster (`A- / A / A+`)**, and an optional **Ambient Temple Bell & Flute Sound Toggle** (muted by default).
- **Hero Section & Universal Instant Search Bar:**
  - Large, prominent, real-time filtering **Universal Search Bar** in the hero section (and accessible in the sticky header when scrolling).
  - Categorized autocomplete dropdown results with icons, thumbnails, and previews:
    - *Scripture & Verse Search:* Typing `"Ramayan"`, `"Bhagavad Gita Chapter 10 Verse 2"`, `"Gita 2.47"`, or `"Sundarkand"` immediately opens the **3D Realistic Flipbook directly to that exact Chapter and Verse page**.
    - *Temple & Pilgrimage Search:* Typing `"Kedarnath"`, `"Kamakhya"`, `"Mahakaleshwar"`, `"Somnath"`, `"Vaishno Devi"`, or `"Khatu Shyam"` immediately opens that temple's **Complete Darshan, All Small-to-Big Beliefs & Bottom Photo Gallery View**.
    - *Ritual & Minute Detail Search:* Typing `"Tilak"`, `"Surya Arghya"`, `"Janeu"`, `"Rudraksha"`, `"Deepak"`, or `"16 Sanskars"` immediately opens that **Sanatan Tradition & Scientific/Spiritual Guide**.
- **Homepage Modular Flow:**
  1. **Shloka of the Day Card:** Daily rotating Sanskrit verse with English translation & meaning, Copy button, and WhatsApp Share button.
  2. **Royal 3D Bookshelf Grid:** Embossed hardcover books arranged on carved wooden temple shelves.
  3. **Major Temples & Pilgrimage Explorer Cards:** Filterable by 12 Jyotirlingas, 52 Shaktipeeths, Char Dham, Sapta Puri, and Famous Temples.
  4. **Minute Details of Sanatan Dharma Cards:** Quick-read cards on everyday customs and spiritual science.

## 2. INTERACTIVE 3D REALISTIC PAGE-FLIP BOOK READER
Clicking ANY scripture, epic, Veda, Purana, or Chalisa launches a full-screen **Interactive 3D Page-Flip Book Reader** with realistic 3D page-curl physics, corner-drag/click turning, spine crease shadow, and subtle Web Audio paper-rustle sound:
- **Ancient Manuscript Aesthetic:** Warm aged handmade Bhojpatra/parchment texture (`#F9F1DF` to `#F2E2C4`), organic paper grain, distressed vintage edges, Rajasthani/Temple floral corner filigree in Sacred Maroon (`#7A1C1C`) and Antique Gold (`#C59B27`), center spine gutter shadow, hardcover edges peeking behind pages, and a hanging red silk bookmark ribbon.
- **Two-Page Open Book Spread (Desktop) / Single-Page Flip (Mobile):**
  - **Left Page (Devotional Artwork):** Classical Indian devotional painting/illustration relevant to the chapter/shloka inside an ornate antique gold border with a title caption.
  - **Right Page (Scripture & Translation):** Page Header (Scripture Name, Chapter/Kand Title, Page Number), Original Sanskrit Verse in bold Sacred Maroon (`#800000`) with `|| 2 ||` markers + English transliteration, delicate lotus/Om gold divider, and simple English translation & spiritual meaning.
- **Controls:** Corner-curl hover preview, Previous/Next buttons, touch swipe & keyboard arrow support, collapsible **Table of Contents (Chapter/Verse Index Drawer)**, Font Size (`A- / A+`), Copy Verse, and WhatsApp Share.

## 3. COMPLETE SCRIPTURE & GRANTH LIBRARY DATA
- **Shrimad Bhagavad Gita:** All 18 Chapters with Sanskrit shlokas, English transliteration, English translation, and illustrations (must include Chapter 2 Verse 47 and Chapter 10 Verse 2).
- **Valmiki Ramayan & Ramcharitmanas:** All 7 Kands (Bal, Ayodhya, Aranya, Kishkindha, Sundar, Lanka, Uttar Kand) with Chaupai, Doha, and English meaning.
- **The 4 Vedas & Principal Upanishads:** Rigveda, Yajurveda, Samaveda, Atharvaveda, plus Isha, Katha, Mundaka, Prashna, and Mandukya Upanishads.
- **The 18 Mahapuranas:** Shiv Puran, Vishnu Puran, Shrimad Bhagavat Puran, Garud Puran, Markandeya Puran (Durga Saptashati), Skanda Puran, Agni Puran, Padma Puran, and summaries of all 18.
- **Daily Aarti, Chalisa, Stotras & Mantras:** Ganesh Aarti, Shiv Aarti, Lakshmi Aarti, Hanuman Chalisa, Durga Chalisa, Shiv Tandav Stotram, Rudrashtakam, Madhurashtakam, Gayatri Mantra, Mahamrityunjaya Mantra.

## 4. DIVINE TEMPLES, DESTINATIONS, ALL BELIEFS & BOTTOM PHOTO GALLERY
Include comprehensive entries for **All 12 Jyotirlingas**, **All 52 Shaktipeeths** (body part/ornament, Shakti form, Bhairav form), **Char Dham & Chota Char Dham**, **Sapta Puri**, and **Famous Ancient Temples** (Tirupati Balaji, Jagannath Puri, Khatu Shyam Ji, Salasar Balaji, Prem Mandir, Padmanabhaswamy, Meenakshi Temple).

**MANDATORY TOP-TO-BOTTOM TEMPLE VIEW LAYOUT:**
1. **Temple Hero Header & Destination Guide:** Name, Category Badge, Main Deity, Exact Location, Nearest Railway Station & Airport with distance, Best Season, Daily Darshan & Aarti Timings, and **"View Location / Route"** Google Maps button.
2. **Complete Puranic History & Every Small-to-Big Belief:**
   - **1. Main Puranic Origin Story**
   - **2. Every Small & Big Local Belief, Miracles & Mysteries** (sacred kunds, architectural mysteries, tying threads/locks/bells, special wishes, unique prasad traditions)
   - **3. Special Worship Rules, Parikrama & Spiritual Significance** (auspicious days, dress code, parikrama rules, Phalashruti)
3. **Divine Temple Photo Gallery at the Bottom:** Responsive High-Resolution Photo Gallery Grid (4–6 photos per temple) with click-to-zoom full-screen Lightbox (Exterior Shikhar, Garbhagriha/Deity representation, Aarti atmosphere, Courtyard/Kund/Scenery).

## 5. SANATAN DHARMA MINUTE DETAILS & EVERYDAY HINDU LIFE
Searchable **Sanatan Micro-Knowledge Encyclopedia** covering:
- **Daily Routine & Science Behind Rituals:** Brahma Muhurta, bowing to Mother Earth, Surya Arghya (copper vessel), bathing mantras, Tilak types & science (Sandalwood, Bhasma, Kumkum, Gopi Chandan), Shikha & 3 strands of Janeu, Pranam (touching feet), temple bell & Parikrama rules.
- **Home Temple & Puja Rules:** Ishan Kon (North-East) setup, Diya rules (Ghee vs. Sesame oil, wick direction), Shankh rules, Tulsi puja & watering rules (why not on Sundays/Ekadashi), Kalava (Mauli) mantra & rules, 1–14 Mukhi Rudraksha guide, Go-Seva & Panchagavya.
- **All 16 Sanskars (Birth to Moksha):** Garbhadhana through Antyeshti—meaning, procedure, and significance of each.
- **Core Philosophy & Cosmic Structure:** 4 Purusharthas, 4 Ashramas, 4 Yugas, Karma & Reincarnation, Panchamahabhutas, Navagraha & remedies, and authentic Vrat Kathas (Ekadashi, Pradosh, Mahashivratri, Navratri, Janmashtami, Ram Navami, Diwali, Holi).

## 6. VISUAL DESIGN SYSTEM
- **Colors:** Deep Temple Maroon (`#6B0F1A`), Sacred Saffron/Bhagwa (`#E85D04`), Antique Gold (`#D4AF37`), Aged Handmade Parchment (`#FAF3E0`), Dark Sandalwood (`#2C1810`).

### DESIGN & CRAFT EXCELLENCE RULES (NO GENERIC TEMPLATES)
- **Custom Royal Heritage UI:** Do NOT use generic SaaS cards or flat Bootstrap/Tailwind layouts. Craft bespoke temple-inspired frames, ornate SVG mandala backgrounds (low opacity rotating subtly), carved wood bookshelf textures, and gold-leaf border accents.
- **Typography & Hierarchy:** Pair `Cinzel` / `Rozha One` for majestic headings with `Tiro Devanagari Sanskrit` for shlokas and `Noto Serif Devanagari` for crisp reading. Add generous whitespace and balanced visual rhythm.
- **Micro-Interactions & Motion:** Add subtle hover elevations, soft diya-glow shadows in Dark Mode, smooth tab transitions, corner-curl hover preview on the 3D flipbook, and a polished loading shimmer/fade-in.
- **Curated Icons & Textures:** Use clean inline SVGs (Om, Lotus, Shankh, Diya, Temple Shikhar) and CSS SVG noise/grain overlays for authentic aged Bhojpatra parchment feel—zero blurry raster clip-art.
- **Mobile-First Polish:** Ensure sticky header, search dropdown, 3D single-page flipbook, and temple lightbox gallery feel like a native app on mobile screens.
---
### CROSS-DEVICE & CROSS-BROWSER COMPATIBILITY (MOBILE, TABLET, PC)
- **Universal Responsive Layout:** Must fit and scale flawlessly across all screen sizes—Small Mobile (`320px–480px`), Large Mobile (`481px–767px`), Tablet Portrait & Landscape (`768px–1024px`), Laptops (`1025px–1440px`), and Large/4K Monitors (`1441px+`).
- **Zero Horizontal Overflow:** Strictly prevent unwanted horizontal scrollbars (`overflow-x: hidden` on root/body), use fluid typography (`clamp()`), responsive CSS Grid/Flexbox, and ensure all buttons/links have touch-friendly tap targets (minimum `44px × 44px`).
- **Adaptive 3D Flipbook & Modals:**
  - Desktop/Landscape Tablet: Full two-page open book spread with smooth 3D page-curl.
  - Mobile/Portrait Tablet: Clean single-page flipbook with touch-swipe, pinch-safe viewport, and accessible bottom Prev/Next controls.
- **All-Browser Support (Chrome, Safari/iOS, Firefox, Edge, Samsung Internet):**
  - Include standard + `-webkit-` prefixes for `backdrop-filter`, `transform-style: preserve-3d`, `backface-visibility`, and custom scrollbars.
  - Handle iOS Safari quirks cleanly: use `100dvh` (dynamic viewport height) instead of `100vh` for full-screen readers/modals, respect `env(safe-area-inset-*)` for notched phones, and unlock Web Audio (temple bell/page rustle) only on explicit user interaction.
  - Use clean, standard ES6+ Vanilla JS with zero browser-specific breaking APIs so it works reliably on both latest and older mobile/desktop browsers.

# SELF-AUDIT, VERIFICATION & FREE AUTO-DEPLOYMENT
1. Audit every JS file for syntax errors (`node --check` or similar), verify Universal Search mappings, 3D Flipbook, Temple Darshan + Bottom Lightbox Gallery, and mobile responsiveness. Fix all issues automatically.
2. Initialize git (`git init`, `git branch -M main`), commit all files, and create a public GitHub repository named `sanatan-mahakosh` using `gh repo create sanatan-mahakosh --public --source=. --remote=origin --push`.
3. Enable GitHub Pages on the `main` branch (`/`) using the GitHub CLI API (`gh api -X POST repos/{owner}/sanatan-mahakosh/pages -f source[branch]=main -f source[path]=/`).
4. Print the final live GitHub Pages URL (`https://<username>.github.io/sanatan-mahakosh/`) once deployment is triggered.