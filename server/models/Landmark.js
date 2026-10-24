const mongoose = require('mongoose');
const landmarkSchema = new mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  name: { type: String, required: true },
  qrCode: { type: String, unique: true },
  description: { en: String, hi: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  images: [String],
  audioUrl: { en: String, hi: String },
  videoUrl: String,
  modelUrl: String, // .glb 3D model reference
  timeline: [{ year: String, event: String }],
  character: { name: String, quote: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Landmark', landmarkSchema);