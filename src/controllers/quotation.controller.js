const Quotation = require('../models/Quotation.model');
const Product = require('../models/Product.model');
const { sendQuotationEmail, sendServiceQuotationEmail } = require('../utils/email');

// @desc    Submit product quotation
// @route   POST /api/quotations/product
// @access  Private (logged-in users)
const submitProductQuotation = async (req, res) => {
  try {
    const { productId, message } = req.body;
    const { name, email, phone, location } = req.user;

    const product = await Product.findById(productId).populate('category', 'name');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const quotation = await Quotation.create({
      user: req.user._id || null,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userLocation: location,
      message,
      type: 'product',
      products: [{
        productId: product._id,
        name: product.name,
        category: product.category?.name || '',
        quantity: 1
      }]
    });

    // Send email
    try {
      await sendQuotationEmail({
        userName: name, userEmail: email, userPhone: phone, userLocation: location,
        message, products: [{ name: product.name, category: product.category?.name, quantity: 1 }],
        isCart: false
      });
      quotation.emailSent = true;
      await quotation.save();
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'We have received your request. Our team will reach you shortly.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit cart quotation
// @route   POST /api/quotations/cart
// @access  Private
const submitCartQuotation = async (req, res) => {
  try {
    const { cartItems, message } = req.body;
    // cartItems: [{ productId, name, category, quantity }]
    const { name, email, phone, location } = req.user;

    if (!cartItems?.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const quotation = await Quotation.create({
      user: req.user._id || null,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userLocation: location,
      message,
      type: 'cart',
      products: cartItems
    });

    try {
      await sendQuotationEmail({
        userName: name, userEmail: email, userPhone: phone, userLocation: location,
        message, products: cartItems, isCart: true
      });
      quotation.emailSent = true;
      await quotation.save();
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'We have received your request. Our team will reach you shortly.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Submit service/training quotation
// @route   POST /api/quotations/service
// @access  Private
const submitServiceQuotation = async (req, res) => {
  try {
    const { serviceName, serviceType, message } = req.body;
    const { name, email, phone, location } = req.user;

    const quotation = await Quotation.create({
      user: req.user._id || null,
      userName: name,
      userEmail: email,
      userPhone: phone,
      userLocation: location,
      message,
      type: serviceType || 'service',
      serviceName
    });

    try {
      await sendServiceQuotationEmail({
        userName: name, userEmail: email, userPhone: phone, userLocation: location,
        message, serviceName
      });
      quotation.emailSent = true;
      await quotation.save();
    } catch (emailErr) {
      console.error('Email send error:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'We have received your request. Our team will reach you shortly.'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all quotations (admin)
// @route   GET /api/quotations
// @access  Admin
const getAllQuotations = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Quotation.countDocuments(query);
    const quotations = await Quotation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: quotations
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update quotation status (admin)
// @route   PUT /api/quotations/:id/status
// @access  Admin
const updateQuotationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!quotation) return res.status(404).json({ success: false, message: 'Quotation not found' });
    res.json({ success: true, data: quotation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get dashboard stats (admin)
// @route   GET /api/quotations/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const total = await Quotation.countDocuments();
    const pending = await Quotation.countDocuments({ status: 'pending' });
    const responded = await Quotation.countDocuments({ status: 'responded' });
    const Product = require('../models/Product.model');
    const Partner = require('../models/Partner.model');
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalPartners = await Partner.countDocuments({ isActive: true });
    const recentQuotations = await Quotation.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalQuotations: total,
        pendingQuotations: pending,
        respondedQuotations: responded,
        totalProducts,
        totalPartners,
        recentQuotations
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  submitProductQuotation, submitCartQuotation, submitServiceQuotation,
  getAllQuotations, updateQuotationStatus, getDashboardStats
};
