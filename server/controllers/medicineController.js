const Medicine      = require('../models/Medicine');
const SearchHistory = require('../models/SearchHistory');
const claudeService = require('../services/claudeService');
const searchService = require('../services/searchService');
const cache         = require('../services/cacheService');

const ONE_HOUR_MS = 60 * 60 * 1000;

// GET /api/medicine/search?q=paracetamol
const searchMedicine = async (req, res, next) => {
  try {
    const query     = (req.query.q || '').trim();
    const sessionId = req.headers['x-session-id'] || 'anonymous';

    if (!query) return res.status(400).json({ success: false, error: 'Query is required' });

    // 0. Check verified override database
    const verifiedPrices = require('../data/verifiedPrices.json');
    const cleanQuery = query.toLowerCase().trim();
    const matchKey = Object.keys(verifiedPrices).find(key => 
      cleanQuery.includes(key) || key.includes(cleanQuery)
    );
    let result;
    let source = 'claude';
    const cacheKey = `medicine:${query.toLowerCase()}`;

    if (matchKey) {
      result = verifiedPrices[matchKey];
      source = 'verified';
    } else {
      // 1. Check in-memory cache
      const cached = cache.get(cacheKey);
      if (cached) {
        return res.json({ success: true, data: cached, source: 'cache' });
      }

      // 2. Check MongoDB (within 1 hour)
      const existing = await Medicine.findOne({
        name: { $regex: new RegExp(`^${query}$`, 'i') },
        lastFetched: { $gte: new Date(Date.now() - ONE_HOUR_MS) },
      });

      if (existing) {
        cache.set(cacheKey, existing);
        return res.json({ success: true, data: existing, source: 'db' });
      }

      // 3. Call searchService to fetch live data (RAG Context)
      let liveData = null;
      try {
        liveData = await searchService.fetchLiveMedicineData(query);
      } catch (searchErr) {
        console.error(`[medicineController] Search service failed: ${searchErr.message}`);
      }

      // 4. Call Claude with live data context
      result = await claudeService.getPriceComparison(query, liveData);
    }

    // 4. Upsert into MongoDB
    const medicine = await Medicine.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${result.medicine}$`, 'i') } },
      {
        name:          result.medicine,
        genericName:   result.genericName,
        category:      result.category,
        stripQty:      result.stripQty,
        sources:       result.sources,
        awarenessTips: result.awarenessTips,
        consumerNote:  result.consumerNote,
        lastFetched:   new Date(),
        $inc: { searchCount: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 5. Save to history
    await SearchHistory.create({
      query,
      medicineName:   result.medicine,
      resultSnapshot: result,
      sessionId,
    });

    cache.set(cacheKey, medicine);
    res.json({ success: true, data: medicine, source });
  } catch (err) {
    next(err);
  }
};

// GET /api/medicine/trending
const getTrending = async (req, res, next) => {
  try {
    const trending = await Medicine.find({})
      .sort({ searchCount: -1 })
      .limit(6)
      .select('name genericName category searchCount');
    res.json({ success: true, data: trending });
  } catch (err) {
    next(err);
  }
};

// GET /api/medicine/alternatives?name=Metformin
const getGenericAlternatives = async (req, res, next) => {
  try {
    const name = (req.query.name || '').trim();
    if (!name) return res.status(400).json({ success: false, error: 'Medicine name required' });

    const cacheKey   = `alternatives:${name.toLowerCase()}`;
    const cached     = cache.get(cacheKey);
    if (cached) return res.json({ success: true, data: cached });

    const alternatives = await claudeService.getGenericAlternatives(name);
    cache.set(cacheKey, alternatives, 7200); // 2hr cache
    res.json({ success: true, data: alternatives });
  } catch (err) {
    next(err);
  }
};

module.exports = { searchMedicine, getTrending, getGenericAlternatives };
