const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:     { type: String, unique: true, sparse: true },
  sessionId: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
  prefs: {
    nearbyPincode: String,
    preferGeneric: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model('User', userSchema);
