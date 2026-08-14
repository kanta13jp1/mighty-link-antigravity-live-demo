import fs from 'fs';

const appCode = fs.readFileSync('app.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const productData = fs.readFileSync('product-data.js', 'utf8');

const allText = appCode + '\n' + indexHtml + '\n' + productData;
const matched = allText.match(/https?:\/\/[^\s"'<>`\)]+/g) || [];
const cleanUrls = matched.map(u => u.replace(/[,\.;]+$/, ''));
const uniqueUrls = [...new Set(cleanUrls)].filter(u => !u.includes('example.com') && !u.includes('schema.org') && !u.includes('w3.org'));

console.log('Auditing ' + uniqueUrls.length + ' total URLs across the site...');

async function testUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    const ok = res.status < 400 || res.status === 403 || res.status === 405;
    return { url, status: res.status, ok };
  } catch (e) {
    try {
      const res2 = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
      const ok = res2.status < 400 || res2.status === 403;
      return { url, status: res2.status, ok };
    } catch (err) {
      return { url, status: 'ERROR: ' + err.message, ok: false };
    }
  }
}

Promise.all(uniqueUrls.map(testUrl)).then(results => {
  const bad = results.filter(r => !r.ok);
  console.log('\n--- AUDIT SUMMARY ---');
  console.log('Total URLs tested: ' + results.length);
  console.log('Passed: ' + (results.length - bad.length));
  console.log('Failed / Broken: ' + bad.length);
  if (bad.length > 0) {
    console.log('\nBroken URLs details:');
    bad.forEach(b => console.log('  [' + b.status + '] ' + b.url));
  }
});
