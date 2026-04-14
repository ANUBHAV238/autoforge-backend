const express = require('express');
const router = express.Router();
const { getTrainings, getAllTrainings, getTraining, createTraining, updateTraining, deleteTraining } = require('../controllers/training.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getTrainings);
router.get('/admin/all', protect, adminOnly, getAllTrainings);
router.get('/:id', getTraining);
router.post('/', protect, adminOnly, upload.single('image'), createTraining);
router.put('/:id', protect, adminOnly, upload.single('image'), updateTraining);
router.delete('/:id', protect, adminOnly, deleteTraining);

module.exports = router;
