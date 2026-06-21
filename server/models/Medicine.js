const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema({
  name:  { type: String },
  type:  { type: String, enum: ['govt', 'chain', 'online', 'local', 'brand'] },
  emoji: { type: String },
  price: { type: Number },
  mrp:   { type: Number },
  note:  { type: String },
  matchingTitle: { type: String },
  deliveryCost:  { type: String },
  deliveryTime:  { type: String },
});

const medicineSchema = new mongoose.Schema({
  name:        { type: String, required: true, index: true },
  genericName: { type: String },
  category:    { type: String },
  stripQty:    { type: String },
  sources:     [sourceSchema],
  awarenessTips: [String],
  consumerNote:  { type: String },
  lastFetched:   { type: Date, default: Date.now },
  searchCount:   { type: Number, default: 1 },
});

// Case-insensitive text index for search
medicineSchema.index({ name: 'text' });

module.exports = mongoose.model('Medicine', medicineSchema);
