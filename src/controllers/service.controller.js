const Service = require('../models/Service.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const getServices = async (req, res) => {
  try {
    const { type } = req.query;
    const query = { isActive: true };
    if (type) query.type = type;
    const data = await Service.find(query).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllServices = async (req, res) => {
  try {
    const { type } = req.query;
    const query = {};
    if (type) query.type = type;
    const data = await Service.find(query).sort({ order: 1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createService = async (req, res) => {
  try {
    const { title, type, labCategory, description, features, equipmentList, order } = req.body;
    let image = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/services');
      image = { url: result.secure_url, publicId: result.public_id };
    }

    const service = await Service.create({
      title, type, labCategory, description,
      features: features ? JSON.parse(features) : [],
      equipmentList: equipmentList ? JSON.parse(equipmentList) : [],
      image, order: order || 0
    });

    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const { title, type, labCategory, description, features, equipmentList, order, isActive } = req.body;

    if (req.file) {
      if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/services');
      service.image = { url: result.secure_url, publicId: result.public_id };
    }

    if (title) service.title = title;
    if (type) service.type = type;
    if (labCategory !== undefined) service.labCategory = labCategory;
    if (description) service.description = description;
    if (features) service.features = JSON.parse(features);
    if (equipmentList) service.equipmentList = JSON.parse(equipmentList);
    if (order !== undefined) service.order = parseInt(order);
    if (isActive !== undefined) service.isActive = isActive === 'true';

    await service.save();
    res.json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.image?.publicId) await deleteFromCloudinary(service.image.publicId);
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getServices, getAllServices, getService, createService, updateService, deleteService };
