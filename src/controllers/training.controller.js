const Training = require('../models/Training.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const getTrainings = async (req, res) => {
  try {
    const data = await Training.find({ isActive: true }).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllTrainings = async (req, res) => {
  try {
    const data = await Training.find().sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
    res.json({ success: true, data: training });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createTraining = async (req, res) => {
  try {
    const { title, description, modules, duration, level, order } = req.body;
    let image = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/training');
      image = { url: result.secure_url, publicId: result.public_id };
    }

    const training = await Training.create({
      title, description,
      modules: modules ? JSON.parse(modules) : [],
      duration, level, image, order: order || 0
    });

    res.status(201).json({ success: true, data: training });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ success: false, message: 'Training not found' });

    const { title, description, modules, duration, level, order, isActive } = req.body;

    if (req.file) {
      if (training.image?.publicId) await deleteFromCloudinary(training.image.publicId);
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/training');
      training.image = { url: result.secure_url, publicId: result.public_id };
    }

    if (title) training.title = title;
    if (description) training.description = description;
    if (modules) training.modules = JSON.parse(modules);
    if (duration) training.duration = duration;
    if (level) training.level = level;
    if (order !== undefined) training.order = parseInt(order);
    if (isActive !== undefined) training.isActive = isActive === 'true';

    await training.save();
    res.json({ success: true, data: training });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) return res.status(404).json({ success: false, message: 'Training not found' });
    if (training.image?.publicId) await deleteFromCloudinary(training.image.publicId);
    await training.deleteOne();
    res.json({ success: true, message: 'Training deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getTrainings, getAllTrainings, getTraining, createTraining, updateTraining, deleteTraining };
