/**
 * Diet-aware filtering of engine food recommendations.
 *
 * The engine respects diet type at generation time, but recommendations are
 * pre-computed and seeded — so when a patient answers (or updates) the
 * questionnaire afterwards, this filter makes "foods to eat" honor their
 * current diet, religious/cultural restrictions, allergies, and disliked
 * foods immediately, without re-running the engine.
 */

const MEAT_TERMS = [
  'meat', 'beef', 'pork', 'chicken', 'turkey', 'lamb', 'mutton', 'goat', 'veal',
  'venison', 'bison', 'duck', 'bacon', 'ham', 'sausage', 'salami', 'pepperoni',
  'chorizo', 'prosciutto', 'steak', 'poultry', 'liver', 'jerky',
];

const SHELLFISH_TERMS = [
  'shellfish', 'shrimp', 'prawn', 'prawns', 'crab', 'lobster', 'oyster', 'oysters',
  'mussel', 'mussels', 'clam', 'clams', 'scallop', 'scallops',
];

const FISH_TERMS = [
  'fish', 'seafood', 'salmon', 'tuna', 'sardine', 'sardines', 'mackerel', 'anchovy',
  'anchovies', 'cod', 'trout', 'herring', 'halibut', 'tilapia',
  ...SHELLFISH_TERMS,
];

// What vegans avoid beyond meat and fish.
const ANIMAL_PRODUCT_TERMS = [
  'egg', 'eggs', 'dairy', 'milk', 'yogurt', 'yoghurt', 'curd', 'cheese', 'paneer',
  'butter', 'ghee', 'cream', 'whey', 'kefir', 'honey',
];

// "Coconut yogurt" or "almond milk" are not dairy — a plant qualifier next to
// a dairy word means the food is the plant-based alternative, not the allergen.
const PLANT_QUALIFIERS = [
  'coconut', 'almond', 'soy', 'cashew', 'oat', 'rice', 'plant-based', 'plant based',
  'dairy-free', 'dairy free', 'vegan',
];

const BEEF_TERMS = ['beef', 'veal', 'steak', 'bison'];
const PORK_TERMS = ['pork', 'bacon', 'ham', 'sausage', 'salami', 'pepperoni', 'chorizo', 'prosciutto', 'lard'];

const ALLERGEN_TERMS = {
  'gluten / wheat': ['gluten', 'wheat', 'barley', 'rye', 'bread', 'pasta', 'couscous', 'seitan'],
  'dairy / lactose': ['dairy', 'milk', 'yogurt', 'yoghurt', 'curd', 'cheese', 'paneer', 'butter', 'ghee', 'cream', 'whey', 'kefir'],
  'tree nuts': ['almond', 'almonds', 'walnut', 'walnuts', 'cashew', 'cashews', 'pecan', 'pecans', 'pistachio', 'pistachios', 'hazelnut', 'hazelnuts', 'macadamia', 'nuts'],
  'peanuts': ['peanut', 'peanuts'],
  'shellfish': SHELLFISH_TERMS,
  'fish': FISH_TERMS,
  'eggs': ['egg', 'eggs'],
  'soy': ['soy', 'tofu', 'tempeh', 'edamame', 'miso'],
  'fodmap sensitivity': ['onion', 'onions', 'garlic'],
  'nightshades': ['tomato', 'tomatoes', 'eggplant', 'bell pepper', 'paprika'],
};

function lower(v) {
  return String(v == null ? '' : v).toLowerCase();
}

function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null || v === '') return [];
  return [v];
}

// Word-boundary match so "ham" doesn't hit "chamomile".
function matches(text, terms) {
  const t = lower(text);
  return terms.find((term) => new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t));
}

// Free-text like "mushrooms, okra; blue cheese" → ['mushrooms', 'okra', 'blue cheese']
function freeTextTerms(text) {
  return lower(text)
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 3);
}

/**
 * Build the exclusion rules implied by a questionnaire (Questionnaire.data).
 * Returns [{ terms: [...], reason: '...' }].
 */
function buildExclusions(data) {
  if (!data || typeof data !== 'object') return [];
  const rules = [];

  const dietText = lower(asArray(data.diet_type).join(' '));
  const restrictions = asArray(data.cultural_food_restrictions).map(lower);

  const vegan = dietText.includes('vegan');
  const vegetarian = vegan || dietText.includes('vegetarian') || restrictions.includes('hindu vegetarian');
  const pescatarian = dietText.includes('pescatarian');

  if (vegetarian) {
    rules.push({ terms: [...MEAT_TERMS, ...FISH_TERMS], reason: vegan ? 'Vegan diet' : 'Vegetarian diet' });
  } else if (pescatarian) {
    rules.push({ terms: MEAT_TERMS, reason: 'Pescatarian diet' });
  }
  if (vegan) {
    rules.push({ terms: ANIMAL_PRODUCT_TERMS, reason: 'Vegan diet', unless: PLANT_QUALIFIERS });
  }

  for (const r of restrictions) {
    if (r === 'halal') rules.push({ terms: [...PORK_TERMS, 'alcohol', 'wine', 'beer'], reason: 'Halal' });
    if (r === 'kosher') rules.push({ terms: [...PORK_TERMS, ...SHELLFISH_TERMS], reason: 'Kosher' });
    if (r === 'no beef') rules.push({ terms: BEEF_TERMS, reason: 'No beef' });
    if (r === 'no pork') rules.push({ terms: PORK_TERMS, reason: 'No pork' });
  }
  const restrictionOther = lower(data.cultural_food_restrictions_other);
  if (restrictionOther) {
    const terms = freeTextTerms(restrictionOther);
    if (terms.length) rules.push({ terms, reason: 'Food restriction' });
  }

  for (const allergen of asArray(data.food_allergy_list)) {
    const key = lower(allergen);
    const terms = ALLERGEN_TERMS[key];
    if (!terms) continue;
    const rule = { terms, reason: `Allergy: ${allergen}` };
    if (key === 'dairy / lactose') rule.unless = PLANT_QUALIFIERS;
    rules.push(rule);
  }
  const allergyDetails = freeTextTerms(data.food_allergy_details);
  if (allergyDetails.length) rules.push({ terms: allergyDetails, reason: 'Allergy' });

  const disliked = freeTextTerms(data.disliked_foods);
  if (disliked.length) rules.push({ terms: disliked, reason: 'Disliked food' });

  return rules;
}

/**
 * Split "eat" recommendations into kept vs excluded for this questionnaire.
 * Rows are plain objects or Sequelize instances with a `food` (and optional
 * `rationale`) text field. "Avoid" rows are never filtered — avoiding more
 * never conflicts with a restriction.
 */
function filterFoodsToEat(rows, questionnaireData) {
  const rules = buildExclusions(questionnaireData);
  if (!rules.length) return { kept: rows, excluded: [] };

  const kept = [];
  const excluded = [];
  for (const row of rows) {
    const foodText = row.food || row.get?.('food') || '';
    let hit = null;
    for (const rule of rules) {
      const term = matches(foodText, rule.terms);
      if (!term) continue;
      if (rule.unless && matches(foodText, rule.unless)) continue;
      hit = { term, reason: rule.reason };
      break;
    }
    if (hit) excluded.push({ food: foodText, matched: hit.term, reason: hit.reason });
    else kept.push(row);
  }
  return { kept, excluded };
}

module.exports = { buildExclusions, filterFoodsToEat };
