const PriceAlert    = require('../models/PriceAlert');
const claudeService = require('../services/claudeService');

// POST /api/alerts
const createAlert = async (req, res, next) => {
  try {
    const { medicineName, targetPrice, email } = req.body;
    const sessionId = req.headers['x-session-id'] || 'anonymous';

    // Get current best price via Claude
    let currentBestPrice = null;
    let bestSource        = null;
    try {
      const priceData = await claudeService.getPriceComparison(medicineName);
      const sorted    = [...(priceData.sources || [])].sort((a, b) => a.price - b.price);
      if (sorted.length > 0) {
        currentBestPrice = sorted[0].price;
        bestSource        = sorted[0].name;
      }
    } catch (_) { /* non-fatal */ }

    const alert = await PriceAlert.create({
      medicineName,
      targetPrice,
      email,
      currentBestPrice,
      bestSource,
      isTriggered: currentBestPrice !== null && currentBestPrice <= targetPrice,
      sessionId,
    });

    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};

// GET /api/alerts
const listAlerts = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'anonymous';
    const alerts    = await PriceAlert.find({ sessionId }).sort({ createdAt: -1 });
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/alerts/:id
const deleteAlert = async (req, res, next) => {
  try {
    await PriceAlert.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
};

// Background job — check alerts every 6 hours
const checkAlerts = async () => {
  try {
    const untriggered = await PriceAlert.find({ isTriggered: false });
    for (const alert of untriggered) {
      try {
        const priceData = await claudeService.getPriceComparison(alert.medicineName);
        const sorted    = [...(priceData.sources || [])].sort((a, b) => a.price - b.price);
        if (sorted.length > 0) {
          const bestPrice = sorted[0].price;
          await PriceAlert.findByIdAndUpdate(alert._id, {
            currentBestPrice: bestPrice,
            bestSource:       sorted[0].name,
            isTriggered:      bestPrice <= alert.targetPrice,
          });
        }
      } catch (_) { /* skip this alert on error */ }
    }
    console.log(`[Alerts] Checked ${untriggered.length} alerts`);
  } catch (err) {
    console.error('[Alerts] Background check failed:', err.message);
  }
};

module.exports = { createAlert, listAlerts, deleteAlert, checkAlerts };
