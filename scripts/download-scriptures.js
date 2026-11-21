#!/usr/bin/env node
/**
 * Sanatan Dharma Mahakosh - Scripture Dataset Downloader
 * Downloads open-source scripture datasets to local ./data/ directory
 *
 * Downloads:
 * - gita-full.json: Complete Shrimad Bhagavad Gita (700 verses)
 * - ramayan-full.json: Valmiki Ramayan & Ramcharitmanas (7 Kands)
 * - vedas-full.json: 4 Vedas & Principal Upanishads
 * - puranas-full.json: All 18 Mahapuranas
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const PORTAL_ROOT = 'https://raw.githubusercontent.com';

// Source repositories for open-source Hindu scriptures
const SOURCES = {
  gita: {
    url: 'https://raw.githubusercontent.com/wiki/OpenSanskrit/Bhagavad-Gita/GITA_JSON.json',
    fallbackUrl: 'https://raw.githubusercontent.com/curious-coder/Sanskrit-TTS-Data/master/data/gita.json',
    filename: 'gita-full.json'
  },
  ramayan: {
    url: 'https://raw.githubusercontent.com/curious-coder/Sanskrit-TTS-Data/master/data/ramayana.json',
    fallbackUrl: 'https://raw.githubusercontent.com/OpenSanskrit/Ramayan/master/ramayana.json',
    filename: 'ramayan-full.json'
  },
  vedas: {
    url: 'https://raw.githubusercontent.com/curious-coder/Sanskrit-TTS-Data/master/data/vedas.json',
    fallbackUrl: 'https://raw.githubusercontent.com/OpenSanskrit/Vedas/master/vedas.json',
    filename: 'vedas-full.json'
  },
  puranas: {
    url: 'https://raw.githubusercontent.com/curious-coder/Sanskrit-TTS-Data/master/data/puranas.json',
    fallbackUrl: 'https://raw.githubusercontent.com/OpenSanskrit/Puranas/master/puranas.json',
    filename: 'puranas-full.json'
  }
};

/**
 * Fetch data from URL with fallback
 */
function fetchData(url, fallbackUrl) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const fetchUrl = (fetchUrl, resolve) => {
      client.get(fetchUrl, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            JSON.parse(data); // Validate JSON
            resolve({ data, url: fetchUrl });
          } catch (e) {
            reject(new Error(`Invalid JSON from ${fetchUrl}`));
          }
        });
      }).on('error', reject);
    };

    fetchUrl(url, (result) => resolve(result))
      .catch(() => fetchUrl(fallbackUrl, resolve));
  });
}

/**
 * Download and save scripture dataset
 */
async function downloadScripture(key, config) {
  console.log(`Downloading ${config.filename}...`);

  try {
    const { data, url } = await fetchData(config.url, config.fallbackUrl);
    const outputPath = path.join(DATA_DIR, config.filename);

    // Format and save
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const formatted = JSON.stringify(parsed, null, 2);

    fs.writeFileSync(outputPath, formatted, 'utf8');
    console.log(`✓ Saved ${config.filename} (${parsed.length || 'dataset'} items)`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to download ${config.filename}:`, error.message);
    return false;
  }
}

/**
 * Create sample data if download fails
 */
function createSampleData(key, config) {
  console.log(`Creating sample ${config.filename}...`);

  const samples = {
    gita: {
      id: 'bhagavad-gita',
      title: 'Shrimad Bhagavad Gita',
      chapters: Array.from({ length: 18 }, (_, i) => ({
        chapterNumber: i + 1,
        title: `Chapter ${i + 1}`,
        verses: [
          {
            verseNumber: 1,
            sanskrit: 'धर्मक्षेत्रे कुरुक्षेत्रे...',
            transliteration: 'DharmaKshetra KuruKshetra...',
            meaning: 'Sample verse meaning'
          }
        ]
      }))
    },
    ramayan: {
      id: 'ramayan',
      title: 'Valmiki Ramayan & Ramcharitmanas',
      kands: [
        { id: 'balakand', title: 'Balakand', chapters: 299 },
        { id: 'ayodhya-kand', title: 'Ayodhya Kand', chapters: 399 },
        { id: 'aranya-kand', title: 'Aranya Kand', chapters: 230 },
        { id: 'konisha-kand', title: 'Konisha Kand', chapters: 203 },
        { id: 'sundarakand', title: 'Sundarakand', chapters: 119 },
        { id: 'yuddhakand', title: 'Yuddhakand', chapters: 193 },
        { id: 'uttarakand', title: 'Uttarakand', chapters: 366 }
      ]
    },
    vedas: {
      id: 'vedas',
      title: 'Four Vedas',
      vedas: [
        {
          id: 'rigveda',
          title: 'ऋग्वेद',
          name: 'Rigveda',
          suktas: ['Indrasukta', 'Agnishukta', 'Rudram', 'Chandogya'],
          sections: [
            { mandala: 1, suktas: 10 },
            { mandala: 2, suktas: 11 },
            { mandala: 3, suktas: 9 }
          ]
        },
        {
          id: 'yajurveda',
          title: 'यजुर्वेद',
          name: 'Yajurveda',
          types: ['Krishna Yajurveda', 'Shukla Yajurveda'],
          mantras: ['Jayamantra', 'Brahma Mantra']
        },
        {
          id: 'samaveda',
          title: 'सामवेद',
          name: 'Samaveda',
          singers: ['Udgata', 'Suddha'],
          collections: ['Kanda 1', 'Kanda 2', 'Kanda 3']
        },
        {
          id: 'atharvaveda',
          title: 'अथर्ववेद',
          name: 'Atharvaveda',
          spells: ['Garuda Path', 'Vishnu Path'],
          charms: ['Health Charms', 'Protection Charms']
        }
      ],
      upanishads: [
        { id: 'brihadaranyaka', title: 'भ्रदारण्यक उपनिषद्', name: 'Brihadaranyaka Upanishad' },
        { id: 'chandogya', title: 'चन्दोग्य उपनिषद्', name: 'Chandogya Upanishad' },
        { id: 'corpus', title: 'कषायत्रिपरा उपनिषद्', name: 'Kashyapa Tripara Upanishad' },
        { id: 'bodha', title: 'बोधह उपनिषद्', name: 'Bodha Upanishad' },
        { id: 'prashna', title: 'प्रश्न उपनिषद्', name: 'Prashna Upanishad' }
      ]
    },
    puranas: {
      id: 'puranas',
      title: '18 Mahapuranas',
      category: 'scripture',
      puranas: [
        { id: 'brahma', title: 'ब्रह्म पुराण', name: 'Brahma Purana', stories: 100 },
        { id: 'padma', title: 'पद्म पुराण', name: 'Padma Purana', stories: 200 },
        { id: 'vishnu', title: 'विष्णु पुराण', name: 'Vishnu Purana', stories: 150 },
        { id: 'shiva', title: 'शिव पुराण', name: 'Shiva Purana', stories: 180 },
        { id: 'bhagavata', title: 'भागवत पुराण', name: 'Bhagavata Purana', stories: 180 },
        { id: 'narada', title: 'नारद पुराण', name: 'Narada Purana', stories: 130 },
        { id: 'markandeya', title: 'मार्कंडेय पुराण', name: 'Markandeya Purana', stories: 120 },
        { id: 'agni', title: 'अग्नि पुराण', name: 'Agni Purana', stories: 250 },
        { id: 'bhavishya', title: 'भविष्य पुराण', name: 'Bhavishya Purana', stories: 140 },
        { id: 'brahmavaivarta', title: 'ब्रह्मवैवर्त पुराण', name: 'Brahmavaivarta Purana', stories: 160 },
        { id: 'linga', title: 'लिंग पुराण', name: 'Linga Purana', stories: 170 },
        { id: 'varaha', title: 'वराह पुराण', name: 'Varaha Purana', stories: 110 },
        { id: 'skanda', title: 'स्कंद पुराण', name: 'Skanda Purana', stories: 200 },
        { id: 'vamana', title: 'वामन पुराण', name: 'Vamana Purana', stories: 90 },
        { id: 'kurma', title: 'कुर्मा पुराण', name: 'Kurma Purana', stories: 80 },
        { id: 'matsya', title: 'मत्स्य पुराण', name: 'Matsya Purana', stories: 100 },
        { id: 'garuda', title: 'गरुड़ पुराण', name: 'Garuda Purana', stories: 95 },
        { id: 'brahmanda', title: 'ब्रह्माण्ड पुराण', name: 'Brahmanda Purana', stories: 175 }
      ]
    }
  };

  const outputPath = path.join(DATA_DIR, config.filename);
  fs.writeFileSync(outputPath, JSON.stringify(samples[key], null, 2), 'utf8');
  console.log(`✓ Created sample ${config.filename}`);
}

/**
 * Main download function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Sanatan Dharma Mahakosh - Scripture Dataset Downloader');
  console.log('='.repeat(60));
  console.log('');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log(`Created data directory: ${DATA_DIR}`);
  }

  const results = {};

  for (const [key, config] of Object.entries(SOURCES)) {
    results[key] = await downloadScripture(key, config);
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Summary:');
  console.log(`  Downloads completed: ${Object.values(results).filter(r => r).length}/${Object.keys(results).length}`);

  // Verify all files exist
  console.log('\nVerifying files:');
  for (const key of Object.keys(SOURCES)) {
    const filePath = path.join(DATA_DIR, SOURCES[key].filename);
    if (fs.existsSync(filePath)) {
      console.log(`  ✓ ${SOURCES[key].filename} exists`);
    } else {
      console.log(`  ✗ ${SOURCES[key].filename} missing`);
      await createSampleData(key, SOURCES[key]);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);