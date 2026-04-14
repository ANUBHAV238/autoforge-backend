const express = require('express');
const router = express.Router();
const { getPartners, getAllPartners, createPartner, updatePartner, deletePartner } = require('../controllers/partner.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getPartners);
router.get('/admin/all', protect, adminOnly, getAllPartners);
router.post('/', protect, adminOnly, upload.single('logo'), createPartner);
router.put('/:id', protect, adminOnly, upload.single('logo'), updatePartner);
router.delete('/:id', protect, adminOnly, deletePartner);

module.exports = router;
