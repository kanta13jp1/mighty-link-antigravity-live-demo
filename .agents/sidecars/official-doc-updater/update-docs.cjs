/**
 * Official Documentation Fetcher Sidecar
 * Automatically runs periodically to check live status and latest updates from official AI agent sources.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const SOURCES = [
  { name: 'Codex', url: 'https://developers.openai.com/codex' },
  { name: 'Claude Code', url: 'https://code.claude.com/docs' },
  { name: 'Claude Cowork', url: 'https://claude.com/product/cowork' },
  { name: 'Google Antigravity', url: 'https://antigravity.google/docs' },
  { name: 'Kiro', url: 'https://kiro.dev/docs/' }
];

async function checkUrlStatus(targetUrl) {
  return new Promise((resolve) => {
    const req = https.get(targetUrl, { headers: { 'User-Agent': 'Antigravity-Sidecar-DocFetcher/1.0' } }, (res) => {
      resolve({ url: targetUrl, statusCode: res.statusCode, timestamp: new Date().toISOString() });
    });
    req.on('error', (err) => {
      resolve({ url: targetUrl, statusCode: 0, error: err.message, timestamp: new Date().toISOString() });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url: targetUrl, statusCode: 408, error: 'Timeout', timestamp: new Date().toISOString() });
    });
  });
}

async function runDocCheck() {
  console.log(`[${new Date().toISOString()}] Antigravity Sidecar: Starting official doc health check...`);
  const results = [];

  for (const src of SOURCES) {
    const status = await checkUrlStatus(src.url);
    results.push({ name: src.name, ...status });
    console.log(`- ${src.name} (${src.url}): ${status.statusCode}`);
  }

  const logDir = path.join(__dirname, 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logFile = path.join(logDir, 'sidecar-fetch-log.json');
  fs.writeFileSync(logFile, JSON.stringify({ lastRun: new Date().toISOString(), results }, null, 2));
  console.log(`[${new Date().toISOString()}] Antigravity Sidecar: Official doc fetch log written to ${logFile}`);
}

runDocCheck().catch(err => {
  console.error("Sidecar Error:", err);
  process.exit(1);
});
