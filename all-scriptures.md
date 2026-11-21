# COMPLETE SANATAN GRANTH, VED, PURAN & IN-APP API ENGINE
Execute inside the current directory (`./`) using strictly relative paths only.

## CORE RULE: ZERO EXTERNAL REDIRECTS
NEVER send the user to Wikipedia, Wikisource, or any external website. Every single scripture, Veda, Puran, Upanishad, Temple, or Tradition MUST open and display **100% inside our own website's Royal Parchment Reader / 3D Book Reader / Temple Darshan Modal**.

## 1. DOWNLOAD OPEN-SOURCE SCRIPTURE DATASETS (LOCAL `./data/`)
Write and run a Node.js script (`./scripts/download-scriptures.js`) to fetch free open-source JSON datasets from GitHub and save them locally (load them on-demand via `fetch()` when on GitHub Pages, with inline JS fallback):
- **Complete Shrimad Bhagavad Gita** (all 18 chapters, all 700 verses — Sanskrit, transliteration, Hindi/English meaning) -> `./data/gita-full.json`
- **Valmiki Ramayan / Ramcharitmanas** (all 7 Kands) -> `./data/ramayan-full.json`
- **4 Vedas & Principal Upanishads** (Rigveda, Yajurveda, Samaveda, Atharvaveda + Upanishads structured index & verses) -> `./data/vedas-full.json`
- **All 18 Mahapuranas** (Brahma, Padma, Vishnu, Shiva, Bhagavata, Narada, Markandeya, Agni, Bhavishya, Brahmavaivarta, Linga, Varaha, Skanda, Vamana, Kurma, Matsya, Garuda, Brahmanda — full summaries, key chapters, and stories) -> `./data/puranas-full.json`

## 2. IN-APP LIVE ENCYCLOPEDIA ENGINE (`./js/live-encyclopedia.js`)
Build a seamless background API fetcher so that if a user searches ANY Granth, Veda, Puran, Upanishad, Shloka, Rishi, Deity, or Temple in the universe:
- Query Wikipedia REST API (`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=...&format=json&origin=*`) and full-page extract API (`prop=extracts|pageimages&exintro=false&explaintext=true&pithumbsize=800`) + Wikisource API (`https://en.wikisource.org/w/api.php?...&origin=*`) in the background.
- Render the fetched full text, chapters, and high-res image **directly inside our own website's Royal Parchment Reader Modal** (matching our maroon/gold/parchment theme, with Font Size `A-/A/A+`, Copy, and WhatsApp Share).
- NEVER show external "Read on Wikipedia" links—keep the entire reading experience 100% inside our own site.

## 3. VERIFY ALL 6 PAGES & PUSH TO GITHUB
1. Ensure all 6 pages (`index.html`, `scriptures.html`, `temples.html`, `traditions.html`, `sanskars.html`, `aarti.html`) are connected cleanly via the shared header and every click/search/modal works with zero console errors.
2. Run `node --check` on all `.js` files.
3. Run `git add .`, `git commit -m "Add complete scriptures, 18 Puranas, 4 Vedas, and in-app live reader"`, and `git push origin main`.