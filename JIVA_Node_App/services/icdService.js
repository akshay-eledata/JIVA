/**
 * ICD-11 lookup service.
 *
 * Backed by the WHO ICD-API. By default we talk to a locally deployed
 * container (no auth, no rate limits, works offline):
 *
 *   docker run -d --name jiva-icd-api -p 8382:80 \
 *     -e acceptLicense=true -e saveAnalytics=false whoicd/icd-api
 *
 * To use WHO's cloud API instead, set in .env:
 *   ICD_API_BASE=https://id.who.int
 *   ICD_CLIENT_ID=... ICD_CLIENT_SECRET=...
 * and this module transparently adds an OAuth2 client-credentials bearer
 * token. Everything else (routes, frontend) stays the same.
 */

const ICD_API_BASE = (process.env.ICD_API_BASE || 'http://localhost:8382').replace(/\/$/, '');
const ICD_LINEARIZATION = process.env.ICD_LINEARIZATION || 'mms';
// 'latest' resolves the newest release the server actually has, so the app
// keeps working when the container image ships a newer release.
const ICD_RELEASE = process.env.ICD_RELEASE || 'latest';
const ICD_LANGUAGE = process.env.ICD_LANGUAGE || 'en';
const ICD_CLIENT_ID = process.env.ICD_CLIENT_ID;
const ICD_CLIENT_SECRET = process.env.ICD_CLIENT_SECRET;
const ICD_TOKEN_URL = process.env.ICD_TOKEN_URL || 'https://icdaccessmanagement.who.int/connect/token';

const SEARCH_TIMEOUT_MS = 8000;

/* ── OAuth2 (cloud only) ──────────────────────────────────────────────────── */
let tokenCache = { value: null, expiresAt: 0 };

async function getToken() {
  if (!ICD_CLIENT_ID || !ICD_CLIENT_SECRET) return null; // local container needs no auth
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) return tokenCache.value;

  const body = new URLSearchParams({
    client_id: ICD_CLIENT_ID,
    client_secret: ICD_CLIENT_SECRET,
    scope: 'icdapi_access',
    grant_type: 'client_credentials',
  });
  const res = await fetch(ICD_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`ICD token request failed (${res.status})`);
  const data = await res.json();
  tokenCache = {
    value: data.access_token,
    // refresh a minute early
    expiresAt: Date.now() + Math.max(0, (data.expires_in || 3600) - 60) * 1000,
  };
  return tokenCache.value;
}

/* ── Release resolution ───────────────────────────────────────────────────── */
let releaseCache = { id: null, at: 0 };
const RELEASE_TTL_MS = 60 * 60 * 1000;

async function icdFetch(path, { timeout = SEARCH_TIMEOUT_MS } = {}) {
  const token = await getToken();
  const headers = {
    Accept: 'application/json',
    'API-Version': 'v2',
    'Accept-Language': ICD_LANGUAGE,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(`${ICD_API_BASE}${path}`, { headers, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// Which release id to query, e.g. "2026-01". Asks the server when set to 'latest'.
async function resolveRelease() {
  if (ICD_RELEASE !== 'latest') return ICD_RELEASE;
  if (releaseCache.id && Date.now() - releaseCache.at < RELEASE_TTL_MS) return releaseCache.id;

  const res = await icdFetch(`/icd/release/11/${ICD_LINEARIZATION}`);
  if (!res.ok) throw new Error(`ICD release lookup failed (${res.status})`);
  const data = await res.json();
  // e.g. "http://id.who.int/icd/release/11/2026-01/mms" -> "2026-01"
  const match = /\/release\/11\/([^/]+)\/\w+$/.exec(data.latestRelease || '');
  if (!match) throw new Error('Could not resolve latest ICD release');
  releaseCache = { id: match[1], at: Date.now() };
  return releaseCache.id;
}

/* ── Search ───────────────────────────────────────────────────────────────── */
// Small LRU-ish cache: autocomplete replays the same prefixes constantly.
const searchCache = new Map();
const SEARCH_CACHE_MAX = 500;
const SEARCH_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const stripTags = (s) => String(s || '').replace(/<[^>]*>/g, '').trim();

/**
 * Search ICD-11 for a free-text condition.
 * @returns {Promise<Array<{code:string,title:string,matchedOn:string|null,entityId:string|null}>>}
 */
async function searchConditions(query, limit = 10) {
  const q = String(query || '').trim();
  if (q.length < 2) return [];

  const key = `${q.toLowerCase()}|${limit}`;
  const hit = searchCache.get(key);
  if (hit && Date.now() - hit.at < SEARCH_CACHE_TTL_MS) return hit.results;

  const release = await resolveRelease();
  const params = new URLSearchParams({
    q,
    // flat list of entities rather than a nested tree — what an autocomplete wants
    flatResults: 'true',
    // WHO's synonym/lay-term index: lets "heart attack" find myocardial infarction
    useFlexisearch: 'true',
    highlightingEnabled: 'false',
  });
  const res = await icdFetch(`/icd/release/11/${release}/${ICD_LINEARIZATION}/search?${params}`);
  if (!res.ok) throw new Error(`ICD search failed (${res.status})`);
  const data = await res.json();

  const results = (data.destinationEntities || [])
    // Residual "other specified"/"unspecified" buckets are noise for patients.
    .filter((e) => e.theCode)
    .slice(0, limit)
    .map((e) => ({
      code: e.theCode,
      title: stripTags(e.title),
      // why it matched, e.g. the synonym "heart attack"
      matchedOn: e.matchingPVs && e.matchingPVs.length ? stripTags(e.matchingPVs[0].label) : null,
      entityId: e.id ? String(e.id).split('/').pop() : null,
    }));

  if (searchCache.size >= SEARCH_CACHE_MAX) searchCache.clear();
  searchCache.set(key, { at: Date.now(), results });
  return results;
}

module.exports = { searchConditions, resolveRelease, ICD_API_BASE };
