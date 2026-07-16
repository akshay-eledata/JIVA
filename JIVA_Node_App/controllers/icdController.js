/**
 * /api/icd/* — ICD-11 condition lookup for the intake questionnaire.
 *
 * Public (the intake wizard runs before an account exists) and read-only: it
 * only ever forwards a search term to the ICD-API and returns code + title.
 */
const { searchConditions } = require('../services/icdService');

// GET /api/icd/search?q=<free text>&limit=10
async function searchIcd(req, res) {
  const q = (req.query.q || '').trim();
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 25);

  if (q.length < 2) return res.json({ query: q, results: [] });

  try {
    const results = await searchConditions(q, limit);
    res.json({ query: q, results });
  } catch (err) {
    // Autocomplete must never block the form: report the failure but let the
    // client fall back to accepting plain free text.
    console.warn('ICD search failed:', err.message);
    res.status(503).json({ query: q, results: [], message: 'ICD lookup unavailable' });
  }
}

module.exports = { searchIcd };
