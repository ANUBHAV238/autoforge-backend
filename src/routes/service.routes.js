const express = require('express');
const router = express.Router();
const { getServices, getAllServices, getService, createService, updateService, deleteService } = require('../controllers/service.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getServices);
router.get('/admin/all', protect, adminOnly, getAllServices);
router.get('/:id', getService);
router.post('/', protect, adminOnly, upload.single('image'), createService);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
