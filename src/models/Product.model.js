const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  features: [{
    type: String,
    trim: true
  }],
  specifications: [{
    key: String,
    value: String
  }],
  images: [{
    url: String,
    publicId: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Text search index
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Product', productSchema);
