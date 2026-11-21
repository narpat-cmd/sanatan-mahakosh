# URGENT BUG FIXES (EXECUTE NOW)
The live site is currently unresponsive: clicking nav tabs, books, or temples does nothing, searching "GITA" shows "No results found", and header icons are garbled.

Fix all of these inside the current directory (use relative paths only):
1. Run `node --check` on every JS file in `./data/` and `./js/` and fix all syntax/runtime errors.
2. Verify all data variables (`SCRIPTURES_DATA`, `TEMPLES_DATA`, `TRADITIONS_DATA`) match the exact names expected by `js/app.js` and `js/search-engine.js`, and ensure `<script>` tags in `index.html` load `data/*.js` BEFORE `js/*.js`.
3. Ensure every click handler (nav tabs, 3D bookshelf, temples, flipbook, search dropdown, dark mode, font size) is properly attached inside `DOMContentLoaded` and works with zero console errors.
4. Put `<meta charset="UTF-8">` as the first tag in `<head>` and replace all garbled header icons with crisp inline SVGs.
5. Verify search returns real results for "GITA", "Kedarnath", and "Tilak".