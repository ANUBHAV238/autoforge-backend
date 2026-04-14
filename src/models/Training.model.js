const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Training title is required'],
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  modules: [{
    title: String,
    description: String
  }],
  duration: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  image: {
    url: String,
    publicId: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Training', trainingSchema);
