// Extract scriptures into chunked files for lazy loading
// This script processes existing scripture data and creates individual chunk files

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SCRIPTURES_DIR = path.join(DATA_DIR, 'scriptures');

// Read the backup scriptures.js
const backupPath = path.join(DATA_DIR, '_backup', 'scriptures.js');

if (!fs.existsSync(backupPath)) {
  console.error('Backup file not found:', backupPath);
  process.exit(1);
}

const content = fs.readFileSync(backupPath, 'utf8');

// Parse the JavaScript file to extract window.SCRIPTURES_DATA
let scripturesData;
try {
  // Create a safe eval context
  const vm = require('vm');
  const sandbox = { window: {}, console: { log: () => {} } };
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  scripturesData = sandbox.window.SCRIPTURES_DATA;
} catch (e) {
  console.error('Failed to parse scriptures.js:', e.message);
  process.exit(1);
}

console.log('Found', scripturesData.length, 'scripture books in backup');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Create chunk file for a book section/chapter
function createChunkFile(bookId, sectionPath, chunkKey, chunkData) {
  const outputDir = path.join(SCRIPTURES_DIR, sectionPath);
  ensureDir(outputDir);

  const fileName = `${chunkKey}.js`;
  const filePath = path.join(outputDir, fileName);

  const fileContent = `// ${chunkKey} of ${bookId}\nwindow.SCRIPTURE_CHUNKS = window.SCRIPTURE_CHUNKS || {};\nwindow.SCRIPTURE_CHUNKS["${bookId}/${chunkKey}"] = ${JSON.stringify(chunkData, null, 2)};`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`  Created: ${filePath}`);
}

// Process each scripture book
scripturesData.forEach(book => {
  const bookId = book.id;
  console.log(`\nProcessing: ${book.title} (${bookId})`);

  if (book.chapters) {
    if (bookId === 'bhagavad-gita') {
      // Gita chapters
      book.chapters.forEach(chapter => {
        const chapterNum = chapter.chapterNumber;
        const chunkKey = `ch${String(chapterNum).padStart(2, '0')}`;
        const sectionPath = 'gita';

        const chunkData = {
          book: bookId,
          section: 'chapters',
          chapter: chapterNum,
          title: chapter.title || `Chapter ${chapterNum}`,
          illustration: chapter.illustration || '',
          illustrationCaption: chapter.illustrationCaption || '',
          verses: (chapter.verses || []).map(v => ({
            n: v.verseNumber,
            sa: v.sanskrit || v.sa || '',
            tr: v.transliteration || v.tr || '',
            hi: v.meaning || v.hi || '',
            en: v.meaning || v.en || '',
            source: v.source || 'Wikisource',
            license: 'public-domain'
          }))
        };

        createChunkFile(bookId, sectionPath, chunkKey, chunkData);
      });
    } else if (bookId === 'ramayan' || bookId === 'ramcharitmanas') {
      // Ramayan chapters
      const sectionPath = bookId === 'ramayan' ? 'valmiki-ramayan' : 'ramcharitmanas';
      book.chapters.forEach((chapter, idx) => {
        const chunkKey = `chapter-${String(idx + 1).padStart(2, '0')}`;

        const chunkData = {
          book: bookId,
          section: 'kands',
          chapter: idx + 1,
          title: chapter.title || `Chapter ${idx + 1}`,
          illustration: chapter.illustration || '',
          illustrationCaption: chapter.illustrationCaption || '',
          verses: (chapter.verses || []).map(v => ({
            n: v.verseNumber,
            sa: v.sanskrit || v.sa || '',
            tr: v.transliteration || v.tr || '',
            hi: v.meaning || v.hi || '',
            en: v.meaning || v.en || '',
            source: v.source || 'Wikisource',
            license: 'public-domain'
          }))
        };

        createChunkFile(bookId, sectionPath, chunkKey, chunkData);
      });
    } else if (bookId === 'vedas' || bookId === 'upanishads') {
      // Vedas and Upanishads
      const sectionPath = bookId === 'vedas' ? 'vedas' : 'upanishads';
      book.chapters.forEach((chapter, idx) => {
        const chunkKey = `entry-${String(idx + 1).padStart(2, '0')}`;

        const chunkData = {
          book: bookId,
          section: 'books',
          chapter: idx + 1,
          title: chapter.title || chapter.name || `Entry ${idx + 1}`,
          illustration: chapter.illustration || '',
          illustrationCaption: chapter.illustrationCaption || '',
          verses: (chapter.verses || []).map(v => ({
            n: v.verseNumber,
            sa: v.sanskrit || v.sa || '',
            tr: v.transliteration || v.tr || '',
            hi: v.meaning || v.hi || '',
            en: v.meaning || v.en || '',
            source: v.source || 'Wikisource',
            license: 'public-domain'
          }))
        };

        createChunkFile(bookId, sectionPath, chunkKey, chunkData);
      });
    } else if (bookId === 'puranas' || bookId === 'aarti-chalisa') {
      // Puranas and Aarti
      const sectionPath = bookId === 'puranas' ? 'puranas' : 'aarti';
      book.chapters.forEach((chapter, idx) => {
        const chunkKey = `entry-${String(idx + 1).padStart(2, '0')}`;

        const chunkData = {
          book: bookId,
          section: 'puranas',
          chapter: idx + 1,
          title: chapter.title || `Entry ${idx + 1}`,
          illustration: chapter.illustration || '',
          illustrationCaption: chapter.illustrationCaption || '',
          verses: (chapter.verses || []).map(v => ({
            n: v.verseNumber,
            sa: v.sanskrit || v.sa || '',
            tr: v.transliteration || v.tr || '',
            hi: v.meaning || v.hi || '',
            en: v.meaning || v.en || '',
            source: v.source || 'Wikisource',
            license: 'public-domain'
          }))
        };

        createChunkFile(bookId, sectionPath, chunkKey, chunkData);
      });
    } else {
      console.log(`  Skipping ${bookId} - no chapters defined`);
    }
  }
});

console.log('\nExtraction complete!');