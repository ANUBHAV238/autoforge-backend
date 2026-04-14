const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recognition title is required'],
    trim: true
  },
  description: String,
  logo: {
    url: String,
    publicId: String
  },
  organization: String,
  year: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Recognition', recognitionSchema);
