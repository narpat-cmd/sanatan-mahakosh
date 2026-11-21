#!/usr/bin/env node
/**
 * SANATAN Dharma Mahakosh - Link Validation Script
 * Static link checker that:
 * - Reads every HTML file
 * - Extracts all href, src, onclick attributes
 * - Verifies target files exist
 * - Checks for missing DOM elements referenced by JS
 */

const fs = require('fs');
const path = require('path');

const HTML_FILES = [
  'index.html',
  'scriptures.html',
  'temples.html',
  'traditions.html',
  'sanskars.html',
  'aarti.html'
];

const DATA_FILES = [
  'data/scriptures.js',
  'data/temples.js',
  'data/traditions.js',
  'data/sanskars.js',
  'data/aarti.js'
];

const CSS_FILES = [
  'styles/main.css'
];

let hasErrors = false;
const errors = [];
const warnings = [];

// Get all HTML files in directory
function getHtmlFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html') || entry.name.endsWith('.htm')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Check if file exists
function fileExists(filePath, basePath = '.') {
  const fullPath = path.join(basePath, filePath);
  return fs.existsSync(fullPath);
}

// Extract href and src from HTML
function extractLinks(htmlContent, filePath, basePath = '.') {
  const links = [];
  const hrefRegex = /href=["']([^"']+)["']/g;
  const srcRegex = /src=["']([^"']+)["']/g;
  const onclickRegex = /onclick=["']([^"']+)["']/g;
  const forIdRegex = /for=["']([^"']+)["']/g;
  const idRefRegex = /#([^"\s>]+\b)/g;

  // Extract href attributes
  let match;
  while ((match = hrefRegex.exec(htmlContent)) !== null) {
    links.push({ type: 'href', value: match[1], line: getLineNumber(htmlContent, match.index) });
  }

  // Extract src attributes
  while ((match = srcRegex.exec(htmlContent)) !== null) {
    links.push({ type: 'src', value: match[1], line: getLineNumber(htmlContent, match.index) });
  }

  // Extract onclick handlers
  while ((match = onclickRegex.exec(htmlContent)) !== null) {
    const onclick = match[1];
    // Check for DOM element references in onclick
    const elementRefs = onclick.match(/document\.getElement(?:ById|ElementsByClassName|QuerySelector)/g);
    if (elementRefs) {
      links.push({ type: 'onclick', value: onclick, line: getLineNumber(htmlContent, match.index), hasRefs: true });
    }
  }

  // Extract form for attributes
  while ((match = forIdRegex.exec(htmlContent)) !== null) {
    links.push({ type: 'for', value: match[1], line: getLineNumber(htmlContent, match.index) });
  }

  // Extract ID references
  const idMatches = htmlContent.matchAll(idRefRegex);
  for (const idMatch of idMatches) {
    links.push({ type: 'id-ref', value: idMatch[1], line: getLineNumber(htmlContent, idMatch.index) });
  }

  return links;
}

// Get line number from character index
function getLineNumber(content, index) {
  const beforeIndex = content.substring(0, index);
  const lines = beforeIndex.split('\n');
  return lines.length;
}

// Check if a path should be validated
function shouldValidatePath(path) {
  // Skip external URLs
  if (path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('//') ||
      path.startsWith('mailto:')) {
    return false;
  }

  // Skip anchor links (handled separately)
  if (path.startsWith('#')) {
    return false;
  }

  // Skip data URIs
  if (path.startsWith('data:')) {
    return false;
  }

  return true;
}

// Check anchor links for DOM elements
function checkAnchorLinks(htmlContent, filePath) {
  const idRefs = new Set();
  const idRegex = /id=["']([^"']+)["']/g;
  let match;

  while ((match = idRegex.exec(htmlContent)) !== null) {
    idRefs.add(match[1]);
  }

  // Find all anchor references
  const anchorRegex = /href=["']#([^"']+)["']/g;
  const anchorMatches = htmlContent.matchAll(anchorRegex);
  const linkedElements = new Set();

  for (const anchorMatch of anchorMatches) {
    linkedElements.add(anchorMatch[1]);
  }

  // Check for missing IDs
  const missingIds = [...linkedElements].filter(id => !idRefs.has(id));

  return missingIds;
}

// Check JavaScript for DOM element references
function checkJsReferences(jsContent, htmlFile, htmlContent) {
  const refs = new Set();

  // Extract getElementById calls
  const getElementByIdRegex = /getElementById\(["']([^"']+)["']\)/g;
  let match;
  while ((match = getElementByIdRegex.exec(jsContent)) !== null) {
    refs.add(match[1]);
  }

  // Extract querySelector calls
  const querySelectorRegex = /querySelector\(["']([^"']+)["']\)/g;
  while ((match = querySelectorRegex.exec(jsContent)) !== null) {
    // Only track ID selectors
    if (match[1].startsWith('#')) {
      refs.add(match[1].substring(1));
    }
  }

  // Get all IDs in HTML
  const htmlIds = new Set();
  const htmlIdRegex = /id=["']([^"']+)["']/g;
  const htmlIdMatches = htmlContent.matchAll(htmlIdRegex);
  for (const idMatch of htmlIdMatches) {
    htmlIds.add(idMatch[1]);
  }

  // Find missing references
  const missingRefs = [...refs].filter(id => !htmlIds.has(id));

  return missingRefs;
}

// Check CSS for missing selectors
function checkCssSelectors(cssContent, htmlContent) {
  const issues = [];

  // Extract class selectors from CSS
  const classSelectors = new Set();
  const classRegex = /\.([a-zA-Z][\w-]*)/g;
  let match;
  while ((match = classRegex.exec(cssContent)) !== null) {
    classSelectors.add(match[1]);
  }

  // Check if classes are used in HTML
  for (const className of classSelectors) {
    if (!htmlContent.includes(`class="${className}`) && !htmlContent.includes(`class='${className}`)) {
      // Check for usage with other classes or variations
      if (!htmlContent.includes(`class="`) && !htmlContent.includes("class='")) {
        issues.push(`CSS class "${className}" not found in HTML`);
      }
    }
  }

  return issues;
}

// Main validation function
function validateLinks(htmlFile, basePath = '.') {
  const filePath = path.join(basePath, htmlFile);

  if (!fs.existsSync(filePath)) {
    errors.push({ file: htmlFile, error: `File not found: ${filePath}` });
    hasErrors = true;
    return;
  }

  const htmlContent = fs.readFileSync(filePath, 'utf8');
  const links = extractLinks(htmlContent, filePath, basePath);

  // Check each link
  for (const link of links) {
    if (!shouldValidatePath(link.value)) continue;

    let resolvedPath = link.value;

    // Handle relative paths
    if (link.value.startsWith('./')) {
      resolvedPath = link.value.substring(2);
    }

    if (link.value.startsWith('../')) {
      resolvedPath = link.value.substring(3);
    }

    // Check if file exists
    if (link.type === 'href' || link.type === 'src') {
      // It's a file reference
      if (!fileExists(resolvedPath, path.dirname(path.join(basePath, filePath)))) {
        // Try from root
        if (!fileExists(resolvedPath, basePath)) {
          warnings.push({
            file: htmlFile,
            line: link.line,
            type: link.type,
            value: link.value,
            message: `File may not exist: ${link.value}`
          });
        }
      }
    }
  }

  // Check anchor links
  const missingIds = checkAnchorLinks(htmlContent, htmlFile);
  for (const id of missingIds) {
    warnings.push({
      file: htmlFile,
      line: 0,
      type: 'anchor',
      value: `#${id}`,
      message: `Anchor link #${id} points to missing or non-existent element`
    });
  }

  // Check JS references for external pages
  const jsFilePath = path.join(basePath, 'js', path.basename(htmlFile, '.html') + '.js');
  if (fs.existsSync(jsFilePath)) {
    const jsContent = fs.readFileSync(jsFilePath, 'utf8');
    const missingRefs = checkJsReferences(jsContent, htmlFile, htmlContent);

    for (const ref of missingRefs) {
      warnings.push({
        file: htmlFile,
        line: 0,
        type: 'js-ref',
        value: ref,
        message: `JavaScript references DOM element that may not exist: ${ref}`
      });
    }
  }
}

// Validate external CSS file
function validateCss(cssFile, basePath = '.') {
  const filePath = path.join(basePath, cssFile);

  if (!fs.existsSync(filePath)) {
    errors.push({ file: cssFile, error: `File not found: ${filePath}` });
    hasErrors = true;
    return;
  }

  const cssContent = fs.readFileSync(filePath, 'utf8');

  // Check for CSS syntax errors (basic check)
  const openBraces = (cssContent.match(/{/g) || []).length;
  const closeBraces = (cssContent.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    errors.push({ file: cssFile, error: `CSS brace mismatch: ${openBraces} open, ${closeBraces} close` });
    hasErrors = true;
  }

  // Check for unclosed parentheses in functions
  const functionCalls = cssContent.match(/\b(?!linear-gradient|radial-gradient|repeating-)(?:url|calc|var|rgba|hsl|hsla)\s*\([^)]*\{/g);
}

// Validate data files
function validateDataFiles(dataFiles, basePath = '.') {
  for (const dataFile of dataFiles) {
    const filePath = path.join(basePath, dataFile);

    if (!fs.existsSync(filePath)) {
      errors.push({ file: dataFile, error: `Data file not found: ${filePath}` });
      hasErrors = true;
      continue;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      // Try to parse as JavaScript
      const isValidJs = /window\.\w+_DATA\s*[=:]/.test(content);
      if (!isValidJs) {
        warnings.push({ file: dataFile, message: 'Data file may not have expected data structure' });
      }
    } catch (e) {
      errors.push({ file: dataFile, error: `Cannot read data file: ${e.message}` });
      hasErrors = true;
    }
  }
}

// Run validation
console.log('🔍 SANATAN Dharma Mahakosh - Link Validation');
console.log('='.repeat(50));

// Check all HTML files
console.log('\n📄 Checking HTML files...');
for (const htmlFile of HTML_FILES) {
  console.log(`  Checking: ${htmlFile}`);
  validateLinks(htmlFile, '.');
}

// Check CSS files
console.log('\n🎨 Checking CSS files...');
for (const cssFile of CSS_FILES) {
  console.log(`  Checking: ${cssFile}`);
  validateCss(cssFile, '.');
}

// Check data files
console.log('\n📚 Checking data files...');
for (const dataFile of DATA_FILES) {
  console.log(`  Checking: ${dataFile}`);
  validateDataFiles([dataFile], '.');
}

// Report results
console.log('\n' + '='.repeat(50));
console.log('📊 RESULTS');
console.log('='.repeat(50));

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  for (const error of errors) {
    console.log(`  ${error.file}: ${error.error || error.message}`);
  }
} else {
  console.log('\n✅ No critical errors found');
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  for (const warning of warnings) {
    console.log(`  ${warning.file}:${warning.line} - ${warning.value}: ${warning.message}`);
  }
} else {
  console.log('✅ No warnings');
}

console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ CHECK FAILED');
  process.exit(1);
} else {
  console.log('✅ CHECK PASSED');
  process.exit(0);
}