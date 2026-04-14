const Recognition = require('../models/Recognition.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const getRecognitions = async (req, res) => {
  try {
    const data = await Recognition.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllRecognitions = async (req, res) => {
  try {
    const data = await Recognition.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createRecognition = async (req, res) => {
  try {
    const { title, description, organization, year, order } = req.body;
    let logo = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/recognitions');
      logo = { url: result.secure_url, publicId: result.public_id };
    }

    const recognition = await Recognition.create({ title, description, organization, year, logo, order: order || 0 });
    res.status(201).json({ success: true, data: recognition });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateRecognition = async (req, res) => {
  try {
    const rec = await Recognition.findById(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Recognition not found' });

    const { title, description, organization, year, order, isActive } = req.body;

    if (req.file) {
      if (rec.logo?.publicId) await deleteFromCloudinary(rec.logo.publicId);
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/recognitions');
      rec.logo = { url: result.secure_url, publicId: result.public_id };
    }

    if (title) rec.title = title;
    if (description !== undefined) rec.description = description;
    if (organization !== undefined) rec.organization = organization;
    if (year !== undefined) rec.year = year;
    if (order !== undefined) rec.order = parseInt(order);
    if (isActive !== undefined) rec.isActive = isActive === 'true';

    await rec.save();
    res.json({ success: true, data: rec });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteRecognition = async (req, res) => {
  try {
    const rec = await Recognition.findById(req.params.id);
    if (!rec) return res.status(404).json({ success: false, message: 'Recognition not found' });
    if (rec.logo?.publicId) await deleteFromCloudinary(rec.logo.publicId);
    await rec.deleteOne();
    res.json({ success: true, message: 'Recognition deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getRecognitions, getAllRecognitions, createRecognition, updateRecognition, deleteRecognition };
