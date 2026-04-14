const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Partner name is required'],
    trim: true
  },
  logo: {
    url: String,
    publicId: String
  },
  website: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Partner', partnerSchema);
