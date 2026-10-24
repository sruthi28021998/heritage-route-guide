const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  language: { type: String, enum: ['en', 'hi'], default: 'en' },
  visited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Landmark' }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Landmark' }],
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);