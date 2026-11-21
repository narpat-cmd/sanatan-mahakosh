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
const CACHE_DIR = path.join(__dirname, '_cache');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Source repositories for open-source Hindu scriptures
const SOURCES = {
  gita: {
    url: 'https://raw.githubusercontent.com/OpenSanskrit/Bhagavad-Gita/GITA_JSON.json',
    fallbackUrl: 'https://raw.githubusercontent.com/curious-coder/Sanskrit-TTS-Data/master/data/gita.json',
    alternativeUrls: [
      'https://raw.githubusercontent.com/vedas-india/open-data/master/data/gita.json'
    ],
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
 * Fetch data from URL with timeout
 */
function fetchData(url, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, (res) => {
      let data = '';

      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchData(res.headers.location, timeoutMs));
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ data: parsed, url });
        } catch (e) {
          reject(new Error(`Invalid JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', reject);

    // Set timeout
    request.setTimeout(timeoutMs, () => {
      request.destroy();
      reject(new Error(`Timeout for ${url}`));
    });
  });
}

/**
 * Download and save scripture dataset
 */
async function downloadScripture(key, config) {
  console.log(`Downloading ${config.filename}...`);

  // Check cache first
  const cacheFile = path.join(CACHE_DIR, config.filename);
  if (fs.existsSync(cacheFile)) {
    const cached = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    const outputPath = path.join(DATA_DIR, config.filename);
    fs.writeFileSync(outputPath, JSON.stringify(cached, null, 2), 'utf8');
    console.log(`✓ Used cached ${config.filename} (${cached.length || 'dataset'} items)`);
    return true;
  }

  const urls = [config.url, config.fallbackUrl, ...(config.alternativeUrls || [])];

  for (const url of urls) {
    try {
      console.log(`  Trying: ${url.substring(0, 60)}...`);
      const result = await fetchData(url);

      // Cache the result
      const cacheData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData, null, 2), 'utf8');
      console.log(`  ✓ Downloaded from: ${url.substring(0, 60)}...`);

      // Save to data directory
      const outputPath = path.join(DATA_DIR, config.filename);
      fs.writeFileSync(outputPath, JSON.stringify(cacheData, null, 2), 'utf8');
      console.log(`✓ Saved ${config.filename} (${cacheData.length || 'dataset'} items)`);
      return true;
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
    }
  }

  console.error(`✗ Failed to download ${config.filename} from all sources`);
  return false;
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

  // Download Gita first (smallest)
  results.gita = await downloadScripture('gita', SOURCES.gita);
  console.log('');

  // Download Ramayan
  results.ramayan = await downloadScripture('ramayan', SOURCES.ramayan);
  console.log('');

  // Download Vedas
  results.vedas = await downloadScripture('vedas', SOURCES.vedas);
  console.log('');

  // Download Puranas
  results.puranas = await downloadScripture('puranas', SOURCES.puranas);
  console.log('');

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
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);