const mongoose = require('mongoose');
module.exports = mongoose.model('Interaction', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  landmark: { type: mongoose.Schema.Types.ObjectId, ref: 'Landmark' },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  type: { type: String, enum: ['view', 'ar', 'qr'], default: 'view' },
  duration: { type: Number, default: 0 }, // seconds
}, { timestamps: true }));