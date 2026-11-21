# MASTER EXECUTION DIRECTIVE FOR CLAUDE CODE
Act as a Principal Frontend Architect, Award-Winning UI/UX Designer, QA Engineer, and Sanatan Cultural Historian. Read this entire `spec.md` file and execute everything autonomously from start to finish inside the current working directory (`E:\Sanatan`).

## CRITICAL WORKSPACE & PATH RULES (MUST FOLLOW)
1. **RELATIVE PATHS ONLY:** NEVER use absolute Windows paths (like `E:\Sanatan\...` or `E:\SANATAN\...`) in file writes or shell commands—Windows backslash escaping (`\S`) breaks paths. Always use strictly relative paths from the current directory: `./index.html`, `./styles/main.css`, `./js/app.js`, `./data/scriptures.js`, etc.
2. **CLEAN WORKSPACE FIRST:** Before building, delete any accidental/corrupted folders inside the current directory (such as `E*SANATAN*` folders) so the project tree stays 100% clean.
3. **REBUILD CLEANLY:** Overwrite and rebuild all project files cleanly so there are zero leftover bugs, broken references, or partial files.

## STRICT ENGINEERING, COMPATIBILITY & QUALITY STANDARDS
1. **WORKS ON BOTH `file://` AND GITHUB PAGES:** Do NOT use ES modules (`type="module"`) or `fetch()` for local JS/JSON files (they fail with CORS errors when opened directly via `file://`). Load all data and logic files using standard `<script>` tags in the exact dependency order (`data/*.js` first, then `js/*.js`).
2. **UTF-8 & CRISP INLINE SVGs:** Place `<meta charset="UTF-8">` as the very first tag inside `<head>`. NEVER rely on raw emojis or special Unicode symbols for UI buttons/icons (they break/garble on Windows browsers). Use crisp, custom inline SVGs for the Om emblem, Dark Mode toggle, Font Size controls (`A- / A / A+`), Sound toggle, Search icon, and navigation icons.
3. **VISUAL MASTERPIECE (NO GENERIC TEMPLATES):** Craft an Awwwards-level royal Indian heritage aesthetic—rich aged Bhojpatra parchment textures, intricate low-opacity gold mandala & temple filigree SVGs, warm diya-glow Dark Mode, carved wooden 3D bookshelf with embossed hardcover books, and smooth micro-animations.
4. **COMPLETE & AUTHENTIC DATA (ZERO PLACEHOLDERS):** NEVER use "TODO" comments or empty stubs. Populate rich, authentic content (original Sanskrit verses + English transliteration & clear English meanings) across all scriptures, temples, and traditions.
5. **ZERO BROKEN IMAGES:** Use verified working Wikimedia Commons / Unsplash URLs for temple photos and devotional art, AND attach an `onerror` fallback to a custom ornate SVG illustration on every `<img>` so a broken image icon can never appear.
6. **CROSS-DEVICE & CROSS-BROWSER FIT:** Must scale flawlessly on Small Mobile (`320px–480px`), Large Mobile, Tablet, Laptop, and 4K PC across Chrome, Edge, Firefox, Safari/iOS, and Samsung Internet. Use `overflow-x: hidden`, `clamp()` fluid typography, `100dvh` for full-screen modals/flipbook, `-webkit-` prefixes for `backdrop-filter` and 3D transforms, and minimum `44px × 44px` tap targets.

---

# PROJECT SPECIFICATION
**TITLE:** Sanatan — Sampoorna Sanatan Dharma (The Complete Encyclopedia of Sanatan Dharma Knowledge, Scriptures, Sacred Pilgrimages, and Philosophy of Life)

## 1. MODULAR FILE ARCHITECTURE
Build these exact files using relative paths:
- `./index.html` (Semantic, SEO-friendly main template layout)
- `./styles/main.css` (Custom parchment textures, 3D book perspective rules, gold borders, dark mode variables, responsive breakpoints)
- `./data/scriptures.js` (Global `window.SCRIPTURES_DATA` — Bhagavad Gita, Ramayan, 4 Vedas, Upanishads, 18 Mahapuranas, Aarti/Chalisa/Stotras)
- `./data/temples.js` (Global `window.TEMPLES_DATA` — 12 Jyotirlingas, 52 Shaktipeeths, Char Dham, Sapta Puri, Famous Temples)
- `./data/traditions.js` (Global `window.TRADITIONS_DATA` — Daily rules, Home Temple/Puja rules, 16 Sanskars, Philosophy & Vrat Kathas)
- `./js/search-engine.js` (Instant, case-insensitive multi-category autocomplete search across all three datasets)
- `./js/book-reader.js` (Interactive 3D page-flip book reader using StPageFlip CDN with custom 3D CSS fallback, two-page desktop spread / single-page mobile, Chapter/Verse index drawer, paper-rustle Web Audio)
- `./js/temple-viewer.js` (Dedicated Temple Darshan modal/view with Destination Guide, Small-to-Big Beliefs, and Bottom Photo Gallery with full-screen Lightbox)
- `./js/app.js` (State management, navigation, Shloka of the Day, Dark/Diya Mode, Font Size `A-/A/A+`, Ambient Temple Bell/Flute Web Audio toggle muted by default)

## 2. LAYOUT, HEADER & UNIVERSAL INSTANT SEARCH
- **Sticky Glassmorphic Temple Header:**
  - **Left:** Sacred Emblem (`Om Sanatan Mahakosh`) with gold mandala SVG.
  - **Center Nav:** **1. Digital Scripture Library**, **2. Divine Temples & Pilgrimages**, **3. Sanatan Lifestyle & Minute Rules**, **4. 16 Sanskars & Panchang**, **5. Daily Aarti, Chalisa & Stotras**.
  - **Right Controls:** Dark / Diya Night Mode, Font Size (`A- / A / A+`), Ambient Sound Toggle (muted by default).
- **Hero Section & Universal Instant Search Bar:**
  - Real-time, case-insensitive search dropdown with category badges, icons, and previews.
  - Searching `"Gita"`, `"Gita 2.47"`, `"Gita 10.2"`, `"Ramayan"`, `"Sundarkand"`, or `"Hanuman Chalisa"` opens the **3D Flipbook directly to that exact Chapter/Verse**.
  - Searching `"Kedarnath"`, `"Kamakhya"`, `"Mahakaleshwar"`, `"Somnath"`, `"Vaishno Devi"`, or `"Khatu Shyam"` opens that temple's **Complete Darshan, Beliefs & Bottom Photo Gallery View**.
  - Searching `"Tilak"`, `"Surya Arghya"`, `"Janeu"`, `"Rudraksha"`, `"Deepak"`, or `"16 Sanskars"` opens that **Sanatan Tradition & Scientific/Spiritual Guide**.
- **Homepage Modular Flow:**
  1. **Shloka of the Day Card:** Daily rotating Sanskrit verse + English meaning, Copy & WhatsApp Share buttons.
  2. **Royal 3D Bookshelf Grid:** Embossed hardcover books on carved wooden temple shelves.
  3. **Temples & Pilgrimage Explorer:** Filterable by 12 Jyotirlingas, 52 Shaktipeeths, Char Dham, Sapta Puri, and Famous Temples.
  4. **Minute Details of Sanatan Dharma Cards:** Quick-read cards on everyday customs and spiritual science.

## 3. INTERACTIVE 3D REALISTIC PAGE-FLIP BOOK READER
- **Ancient Manuscript Aesthetic:** Aged Bhojpatra parchment (`#F9F1DF` to `#F2E2C4`), organic paper grain, Rajasthani floral corner filigree in Sacred Maroon (`#7A1C1C`) & Antique Gold (`#C59B27`), center spine gutter shadow, hardcover edges, hanging red silk bookmark ribbon, subtle Web Audio paper-rustle sound.
- **Spread Layout:** Desktop two-page spread (Left: classical devotional artwork in ornate gold frame with caption; Right: Granth/Chapter header, bold Sanskrit verse in `#800000` with `|| 2 ||` markers + transliteration, gold lotus divider, simple English translation & spiritual meaning). Mobile: clean single-page flip.
- **Controls:** Corner-curl hover, Prev/Next buttons, touch swipe, keyboard arrows, collapsible **Table of Contents (Chapter/Verse Index Drawer)**, Font Size, Copy Verse, WhatsApp Share.

## 4. COMPLETE SCRIPTURE, TEMPLE & TRADITION DATA
- **Scriptures:** Shrimad Bhagavad Gita (all 18 Chapters with key & famous shlokas including 2.47 and 10.2), Ramayan & Ramcharitmanas (all 7 Kands + Sundarkand), 4 Vedas & Principal Upanishads, 18 Mahapuranas, and Daily Aarti/Hanuman Chalisa/Durga Chalisa/Stotras/Mantras.
- **Temples (Mandatory Top-to-Bottom View):**
  1. **Hero Header & Destination Guide:** Name, Category Badge, Main Deity, Exact Location, Nearest Railway/Airport with distance, Best Season, Darshan/Aarti Timings, Google Maps route button.
  2. **Complete Puranic History & Every Small-to-Big Belief:** (1) Main Puranic Origin Story, (2) Every Small & Big Local Belief, Miracles & Mysteries (kunds, architectural mysteries, threads/locks/bells, wishes, prasad), (3) Special Worship Rules, Parikrama & Phalashruti.
  3. **Bottom Photo Gallery:** Responsive 4–6 photo grid per temple with click-to-zoom full-screen Lightbox.
- **Minute Details & Everyday Hindu Life:** Brahma Muhurta, Surya Arghya, Tilak types & science, Shikha & 3 strands of Janeu, Pranam science, Temple bell & Parikrama, Ishan Kon home temple, Diya/Shankh/Tulsi/Kalava rules, 1–14 Mukhi Rudraksha, Go-Seva, all 16 Sanskars, 4 Purusharthas/Ashramas/Yugas, Karma, Panchamahabhutas, Navagraha, and major Vrat Kathas.

## 5. COLOR PALETTE & TYPOGRAPHY
- **Colors:** Deep Temple Maroon (`#6B0F1A`), Sacred Saffron (`#E85D04`), Antique Gold (`#D4AF37`), Aged Handmade Parchment (`#FAF3E0`), Dark Sandalwood (`#2C1810`).
- **Fonts:** Google Fonts `Cinzel`, `Rozha One`, `Tiro Devanagari Sanskrit`, `Noto Serif Devanagari` + Tailwind CSS CDN.

---

# AUTONOMOUS QA, SELF-FIXING & FREE GITHUB PAGES DEPLOYMENT
1. **Self-Audit & Auto-Fix:** After creating all files, autonomously inspect and test everything:
   - Run `node --check` on every `.js` file in `./data/` and `./js/` to guarantee zero syntax errors.
   - Verify all `<script>` tags in `./index.html` load in the right order and expose global data properly to `search-engine.js`, `book-reader.js`, `temple-viewer.js`, and `app.js`.
   - Verify case-insensitive search returns real results for `"GITA"`, `"Gita 2.47"`, `"Kedarnath"`, and `"Tilak"`.
   - Fix any bug, broken link, missing icon, or layout issue you find before proceeding.
2. **Git & GitHub Pages Deploy:**
   - Initialize git (`git init`, `git branch -M main`), stage all clean project files, and commit.
   - Create or update the public GitHub repository `narpat-cmd/sanatan-mahakosh` using `gh` CLI and push to `main`.
   - Enable GitHub Pages on the `main` branch (`/`) via `gh api -X POST repos/narpat-cmd/sanatan-mahakosh/pages -f source[branch]=main -f source[path]=/` (or verify it is already enabled).
   - Print the final live URL: `https://narpat-cmd.github.io/sanatan-mahakosh/`