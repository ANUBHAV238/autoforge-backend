const express = require('express');
const router = express.Router();
const {
  submitProductQuotation, submitCartQuotation, submitServiceQuotation,
  getAllQuotations, updateQuotationStatus, getDashboardStats
} = require('../controllers/quotation.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.post('/product', protect, submitProductQuotation);
router.post('/cart', protect, submitCartQuotation);
router.post('/service', protect, submitServiceQuotation);

// Admin routes
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllQuotations);
router.put('/:id/status', protect, adminOnly, updateQuotationStatus);

module.exports = router;
