const mongoose = require('mongoose');
module.exports = mongoose.model('Route', new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  description: String,
  image: String,
}, { timestamps: true }));