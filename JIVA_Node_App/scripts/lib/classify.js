/**
 * Shared helpers for ingestion: canonical name keys + lab-value classification.
 * The tier rule matches the v5 engine (Data/Engine/jiva_engine_prompt_v5.md §1B):
 *   IN RANGE     = value comfortably inside the range (not near either edge)
 *   BORDERLINE   = inside the range but within the outer cusp of a boundary —
 *                  on the cusp of leaving the in-range zone (early warning)
 *   OUT OF RANGE = outside the reference range
 *   CRITICAL     = beyond a critical threshold
 */

// Fraction of the reference span treated as the borderline cusp when no
// explicit inner threshold is supplied (mirrors buildLabRanges.CUSP_FRACTION).
const CUSP_FRACTION = 0.15;

// Normalize a messy test/biomarker name into a stable lookup key.
// "hs-CRP" -> "hscrp"; "Vitamin D (25-OH)" -> "vitamind25oh".
function canonicalKey(name) {
  return String(name == null ? '' : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

const NORMAL_QUALITATIVE = new Set([
  'normal', 'negative', 'none detected', 'nondetected', 'clear', 'e3/e3', 'e3e3',
]);

/**
 * Classify a single lab value.
 * @param {number|string} value        raw value (may be qualitative)
 * @param {number|null}   refLow        lower reference bound
 * @param {number|null}   refHigh       upper reference bound
 * @param {{low:?number,high:?number}|null} critical critical thresholds
 * @returns {{status:string, isNormal:(boolean|null), numericValue:(number|null)}}
 */
function classify(value, refLow, refHigh, critical) {
  if (value === null || value === undefined || value === '') {
    return { status: 'unknown', isNormal: null, numericValue: null };
  }

  const num = typeof value === 'number' ? value : parseFloat(value);

  // Qualitative result (non-numeric) — normal/negative => in range, else out of range.
  if (Number.isNaN(num)) {
    const v = String(value).trim().toLowerCase();
    const isNorm = NORMAL_QUALITATIVE.has(v);
    return { status: isNorm ? 'in_range' : 'out_of_range', isNormal: isNorm, numericValue: null };
  }

  const critLow = critical && critical.low != null ? critical.low : null;
  const critHigh = critical && critical.high != null ? critical.high : null;
  if (critLow != null && num < critLow) return { status: 'critical', isNormal: false, numericValue: num };
  if (critHigh != null && num > critHigh) return { status: 'critical', isNormal: false, numericValue: num };

  const lo = refLow == null ? null : refLow;
  const hi = refHigh == null ? null : refHigh;

  // Outside the reference range => out of range.
  if (lo != null && num < lo) return { status: 'out_of_range', isNormal: false, numericValue: num };
  if (hi != null && num > hi) return { status: 'out_of_range', isNormal: false, numericValue: num };

  // Inside the range: flag the outer CUSP_FRACTION near a meaningful edge as
  // borderline (on the cusp of leaving in range).
  const hasLow = lo != null && lo > 0;
  const hasHigh = hi != null && hi < 999;
  const span = hasLow && hasHigh ? hi - lo : null;
  const cuspLow = hasLow ? lo + CUSP_FRACTION * (span != null ? span : lo) : null;
  const cuspHigh = hasHigh ? hi - CUSP_FRACTION * (span != null ? span : hi) : null;
  if (cuspLow != null && num < cuspLow) return { status: 'borderline', isNormal: false, numericValue: num };
  if (cuspHigh != null && num > cuspHigh) return { status: 'borderline', isNormal: false, numericValue: num };
  return { status: 'in_range', isNormal: true, numericValue: num };
}

/**
 * 4-tier classification against explicit boundaries from Lab_Ranges.xlsx.
 * @param {number|string} value
 * @param {{critLow:?number,bLow:?number,inLow:?number,inHigh:?number,bHigh:?number,critHigh:?number}} r
 */
function classifyExplicit(value, r) {
  if (value === null || value === undefined || value === '') {
    return { status: 'unknown', isNormal: null, numericValue: null };
  }
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(num)) {
    const v = String(value).trim().toLowerCase();
    const isNorm = NORMAL_QUALITATIVE.has(v);
    return { status: isNorm ? 'in_range' : 'out_of_range', isNormal: isNorm, numericValue: null };
  }
  const mk = (status) => ({ status, isNormal: status === 'in_range', numericValue: num });
  const { critLow, bLow, inLow, inHigh, bHigh, critHigh } = r || {};

  if (critLow != null && num < critLow) return mk('critical');
  if (critHigh != null && num > critHigh) return mk('critical');

  // Outside the reference range (but not critical) => out of range.
  if (inLow != null && num < inLow) return mk('out_of_range');
  if (inHigh != null && num > inHigh) return mk('out_of_range');

  // Inside the range: near an edge (past the inner cusp threshold) => borderline.
  if (bLow != null && num < bLow) return mk('borderline');
  if (bHigh != null && num > bHigh) return mk('borderline');
  return mk('in_range');
}

module.exports = { canonicalKey, classify, classifyExplicit };
