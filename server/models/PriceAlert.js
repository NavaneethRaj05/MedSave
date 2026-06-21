const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  email:            { type: String },
  medicineName:     { type: String, required: true },
  targetPrice:      { type: Number, required: true },
  currentBestPrice: { type: Number },
  bestSource:       { type: String },
  isTriggered:      { type: Boolean, default: false },
  sessionId:        { type: String, index: true },
  createdAt:        { type: Date, default: Date.now },
});

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
