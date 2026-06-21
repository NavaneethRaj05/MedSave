/**
 * Price aggregation helpers — used to compute savings, sort sources, etc.
 */

function getBestSource(sources) {
  if (!sources || sources.length === 0) return null;
  return [...sources].sort((a, b) => a.price - b.price)[0];
}

function getLocalSource(sources) {
  return sources.find((s) => s.type === 'local') || null;
}

function computeSavings(sources) {
  const best = getBestSource(sources);
  const local = getLocalSource(sources);
  if (!best || !local) return { saving: 0, savePct: 0 };
  const saving = Math.max(0, local.price - best.price);
  const savePct = local.price > 0 ? Math.round((saving / local.price) * 100) : 0;
  return { saving, savePct };
}

function sortedSources(sources) {
  return [...sources].sort((a, b) => a.price - b.price);
}

module.exports = { getBestSource, getLocalSource, computeSavings, sortedSources };
