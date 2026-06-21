const SearchHistory = require('../models/SearchHistory');

// GET /api/history
const getHistory = async (req, res, next) => {
  try {
    const sessionId = req.headers['x-session-id'] || 'anonymous';
    const history   = await SearchHistory.find({ sessionId })
      .sort({ savedAt: -1 })
      .limit(20)
      .select('query medicineName savedAt resultSnapshot');
    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/history/:id
const deleteHistory = async (req, res, next) => {
  try {
    await SearchHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'History entry deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory, deleteHistory };
