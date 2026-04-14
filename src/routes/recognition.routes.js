const express = require('express');
const router = express.Router();
const { getRecognitions, getAllRecognitions, createRecognition, updateRecognition, deleteRecognition } = require('../controllers/recognition.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getRecognitions);
router.get('/admin/all', protect, adminOnly, getAllRecognitions);
router.post('/', protect, adminOnly, upload.single('logo'), createRecognition);
router.put('/:id', protect, adminOnly, upload.single('logo'), updateRecognition);
router.delete('/:id', protect, adminOnly, deleteRecognition);

module.exports = router;
