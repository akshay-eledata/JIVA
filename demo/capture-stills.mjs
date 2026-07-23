// Capture brand-clean stills of the JIVA app for the PowerPoint preface deck.
// Requires the seeded stack to be running (frontend :5174, backend :5001)
// and Google Chrome installed (used via playwright-core channel 'chrome',
// so no browser download is needed).
//
// Usage: npm install && npm run stills
// Output: ./stills/<name>.png (3840x2160) plus logo.png

import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.JIVA_BASE_URL || 'http://localhost:5174';
const API = process.env.JIVA_API_URL || 'http://localhost:5001';
const OUT = path.join(DIR, 'stills');

const DEMO_EMAIL = 'test@jiva.com';
const DEMO_PASSWORD = 'password123';

async function login() {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: DEMO_EMAIL, password: DEMO_PASSWORD }),
  });
  if (!res.ok) throw new Error(`Login failed: HTTP ${res.status}`);
  const data = await res.json();
  if (!data.token) throw new Error('No token in login response');
  return data.token;
}

// Walk the /api/me/biomarkers payload and return the name of the first
// out-of-range marker, whatever the exact nesting looks like.
function findOutOfRangeMarker(node) {
  if (Array.isArray(node)) {
    for (const item of node) {
      const hit = findOutOfRangeMarker(item);
      if (hit) return hit;
    }
    return null;
  }
  if (node && typeof node === 'object') {
    const status = String(node.status || '').toLowerCase().replace(/[^a-z]/g, '');
    const markerName = node.testName || node.biomarkerName || null;
    if (markerName && (status === 'outofrange' || status === 'critical' || status === 'abnormal')) {
      return markerName;
    }
    for (const value of Object.values(node)) {
      const hit = findOutOfRangeMarker(value);
      if (hit) return hit;
    }
  }
  return null;
}

async function pickBiomarker(token) {
  const res = await fetch(`${API}/api/me/biomarkers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Biomarkers fetch failed: HTTP ${res.status}`);
  return findOutOfRangeMarker(await res.json());
}

// Hide demo scaffolding that must not appear in marketing material:
// the fixed homepage option switcher and the fixed DemoSkip pill.
function hideScaffolding() {
  for (const el of document.querySelectorAll('div')) {
    if (getComputedStyle(el).position !== 'fixed') continue;
    const text = (el.textContent || '').trim();
    const isSwitcher = text.includes('Option 1') && text.includes('Option 13');
    const isDemoSkip = text.includes('DEMO');
    if (isSwitcher || isDemoSkip) el.style.display = 'none';
  }
}

async function capture(context, { name, url, settle = 2500 }) {
  const page = await context.newPage();
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(settle);
  await page.evaluate(hideScaffolding);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  await page.close();
  console.log(`captured ${name}  (${url})`);
}

async function renderLogo(browser) {
  const svgPath = path.join(DIR, '..', 'JIVA_React_App', 'src', 'assets', 'jiva.svg');
  const svg = fs.readFileSync(svgPath, 'utf8');
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 600 });
  await page.setContent(
    `<body style="margin:0;background:#F3F9F3;display:flex;align-items:center;justify-content:center;height:100vh">
       <div id="logo" style="width:800px">${svg}</div>
     </body>`
  );
  await page.evaluate(() => {
    const s = document.querySelector('#logo svg');
    if (s) { s.style.width = '100%'; s.style.height = 'auto'; }
  });
  await page.waitForTimeout(300);
  await page.locator('#logo').screenshot({ path: path.join(OUT, 'logo.png') });
  await page.close();
  console.log('captured logo');
}

const SHOTS = [
  { name: 'welcome', url: '/', settle: 3500 },
  { name: 'intake', url: '/intake', settle: 2000 },
  { name: 'select-packages', url: '/select-packages', settle: 2000, authed: true },
  { name: 'dashboard', url: '/dashboard', settle: 2500, authed: true },
  { name: 'vitality-map', url: '/vitality-map', settle: 3500, authed: true },
  { name: 'action-plan', url: '/action-plan', settle: 2500, authed: true },
  { name: 'vitality-map-2', url: '/vitality-map-2', settle: 3000, authed: true },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const token = await login();
  console.log('logged in as demo user');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  const anonContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  const authContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 2,
  });
  await authContext.addInitScript(
    (t) => localStorage.setItem('token', t),
    token
  );

  for (const shot of SHOTS) {
    await capture(shot.authed ? authContext : anonContext, shot);
  }

  const marker = await pickBiomarker(token);
  if (marker) {
    await capture(authContext, {
      name: 'biomarker',
      url: `/biomarker/${encodeURIComponent(marker)}`,
      settle: 2500,
    });
    console.log(`biomarker page used: ${marker}`);
  } else {
    console.warn('no out-of-range biomarker found; skipping biomarker still');
  }

  await renderLogo(browser);
  await browser.close();
  console.log(`done. stills in ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
