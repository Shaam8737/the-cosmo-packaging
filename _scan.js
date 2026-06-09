const fs = require('fs');
const path = require('path');

console.log('=== SCANNING WEBSITE FOR ERRORS ===\n');

// 1. Check all HTML files
console.log('--- HTML FILES ---');
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    const openScript = (c.match(/<script/g) || []).length;
    const closeScript = (c.match(/<\/script>/g) || []).length;
    if (openScript !== closeScript) console.log('  [SCRIPT TAG MISMATCH] ' + f + ': ' + openScript + ' open vs ' + closeScript + ' close');
    
    const openDiv = (c.match(/<div/g) || []).length;
    const closeDiv = (c.match(/<\/div>/g) || []).length;
    if (openDiv !== closeDiv) console.log('  [DIV MISMATCH] ' + f + ': ' + openDiv + ' open vs ' + closeDiv + ' close');
    
    if (f === '404.html' && c.length < 50) console.log('  [404 PAGE TOO SHORT] ' + f);
    
    console.log('  OK: ' + f + ' (' + c.length + ' bytes)');
  } catch(e) {
    console.log('  [READ ERROR] ' + f + ': ' + e.message);
  }
});

// 2. Check CSS files
console.log('\n--- CSS FILES ---');
['css/luxury-style.css', 'css/tw-output.css', 'css/tw-input.css', 'css/product-imagery.css'].forEach(f => {
  try {
    if (fs.existsSync(f)) {
      const c = fs.readFileSync(f, 'utf8');
      console.log('  OK: ' + f + ' (' + c.length + ' bytes)');
    } else {
      console.log('  [MISSING CSS FILE] ' + f);
    }
  } catch(e) {
    console.log('  [READ ERROR] ' + f + ': ' + e.message);
  }
});

// 3. Check JS files
console.log('\n--- JS FILES ---');
['js/config.js', 'js/lead-schema.js', 'js/main.js', 'js/quick-quote.js', 'js/site-shell.js', 'js/style-page.js', 'js/style-product-data.js', 'js/webhook.js'].forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('  [MISSING JS FILE] ' + f);
  } else {
    const c = fs.readFileSync(f, 'utf8');
    console.log('  OK: ' + f + ' (' + c.length + ' bytes)');
  }
});

// 4. Check all linked pages from index.html
console.log('\n--- INTERNAL LINK CHECK (from index.html) ---');
const indexContent = fs.readFileSync('index.html', 'utf8');
const hrefRegex = /href="([^"]+\.html)"/g;
let match;
const linkedPages = [];
while ((match = hrefRegex.exec(indexContent)) !== null) {
  linkedPages.push(match[1]);
}
const uniquePages = [...new Set(linkedPages)];
let brokenCount = 0;
uniquePages.forEach(p => {
  if (!fs.existsSync(p)) {
    console.log('  [BROKEN INTERNAL LINK] ' + p);
    brokenCount++;
  }
});
if (brokenCount === 0) console.log('  All ' + uniquePages.length + ' linked pages exist.');
else console.log('  Found ' + brokenCount + ' broken links out of ' + uniquePages.length + ' total.');

// 5. Check all linked pages from all HTML files
console.log('\n--- CROSS-PAGE LINK CHECK ---');
const allHtml = htmlFiles.filter(f => f !== 'index.html');
let totalBroken = 0;
let totalLinks = 0;
allHtml.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    const re = /href="([^"]+\.html)"/g;
    let m;
    let localBroken = 0;
    let localCount = 0;
    while ((m = re.exec(c)) !== null) {
      localCount++;
      totalLinks++;
      const target = m[1];
      if (target !== '#' && !target.startsWith('http') && !fs.existsSync(target)) {
        console.log('  [BROKEN LINK in ' + f + '] -> ' + target);
        localBroken++;
        totalBroken++;
      }
    }
    if (localBroken === 0) {
      // silent if OK
    }
  } catch(e) {
    console.log('  [READ ERROR] ' + f);
  }
});
if (totalBroken === 0) console.log('  All cross-page links are valid.');
else console.log('  Found ' + totalBroken + ' broken cross-page links.');

// 6. Check for production domain references
console.log('\n--- DOMAIN REFERENCE CHECK ---');
allHtml.forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('thecosmopackaging.com')) {
      // Check if it's in canonical or just in text
      const canonicalCount = (c.match(/thecosmopackaging\.com/g) || []).length;
      if (canonicalCount > 0) {
        console.log('  ' + f + ': ' + canonicalCount + ' references to thecosmopackaging.com');
      }
    }
  } catch(e) {}
});

// 7. Check JS syntax errors (basic)
console.log('\n--- JS SYNTAX CHECK ---');
['js/main.js', 'js/site-shell.js', 'js/quick-quote.js'].forEach(f => {
  try {
    const c = fs.readFileSync(f, 'utf8');
    // Basic check: count braces
    const openBrace = (c.match(/\{/g) || []).length;
    const closeBrace = (c.match(/\}/g) || []).length;
    const openParen = (c.match(/\(/g) || []).length;
    const closeParen = (c.match(/\)/g) || []).length;
    const openBracket = (c.match(/\[/g) || []).length;
    const closeBracket = (c.match(/\]/g) || []).length;
    let issues = [];
    if (openBrace !== closeBrace) issues.push('braces: ' + openBrace + ' open vs ' + closeBrace + ' close');
    if (openParen !== closeParen) issues.push('parentheses: ' + openParen + ' open vs ' + closeParen + ' close');
    if (openBracket !== closeBracket) issues.push('brackets: ' + openBracket + ' open vs ' + closeBracket + ' close');
    if (issues.length > 0) console.log('  [SYNTAX ISSUE in ' + f + '] ' + issues.join(', '));
    else console.log('  OK: ' + f);
  } catch(e) {
    console.log('  [READ ERROR] ' + f);
  }
});

// 8. Check sitemap.xml 
console.log('\n--- SITEMAP CHECK ---');
if (fs.existsSync('sitemap.xml')) {
  const c = fs.readFileSync('sitemap.xml', 'utf8');
  const urls = (c.match(/<loc>([^<]+)<\/loc>/g) || []).length;
  console.log('  sitemap.xml has ' + urls + ' URLs');
}

// 9. Check robots.txt
if (fs.existsSync('robots.txt')) {
  const c = fs.readFileSync('robots.txt', 'utf8');
  console.log('  robots.txt: ' + c.trim().split('\n').length + ' lines');
}

console.log('\n=== SCAN COMPLETE ===');