const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  userLocation: { type: String, required: true },
  message: String,
  type: {
    type: String,
    enum: ['product', 'cart', 'service', 'training'],
    required: true
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    category: String,
    quantity: { type: Number, default: 1 }
  }],
  serviceName: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'responded', 'closed'],
    default: 'pending'
  },
  emailSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
