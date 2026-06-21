const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  query:          { type: String, required: true },
  medicineName:   { type: String },
  resultSnapshot: { type: mongoose.Schema.Types.Mixed },
  savedAt:        { type: Date, default: Date.now },
  sessionId:      { type: String, index: true },
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
