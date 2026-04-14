const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['lab-setup', 'training'],
    required: true
  },
  // For lab setup
  labCategory: {
    type: String,
    enum: ['full-fledged', 'semi-fledged']
  },
  description: {
    type: String,
    required: true
  },
  features: [{ type: String }],
  equipmentList: [{ type: String }],
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
