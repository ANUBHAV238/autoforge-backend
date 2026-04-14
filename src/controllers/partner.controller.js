const Partner = require('../models/Partner.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: partners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createPartner = async (req, res) => {
  try {
    const { name, website, order } = req.body;
    let logo = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/partners');
      logo = { url: result.secure_url, publicId: result.public_id };
    }

    const partner = await Partner.create({ name, website, logo, order: order || 0 });
    res.status(201).json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });

    const { name, website, order, isActive } = req.body;

    if (req.file) {
      if (partner.logo?.publicId) await deleteFromCloudinary(partner.logo.publicId);
      const result = await uploadToCloudinary(req.file.buffer, 'autoforge/partners');
      partner.logo = { url: result.secure_url, publicId: result.public_id };
    }

    if (name) partner.name = name;
    if (website !== undefined) partner.website = website;
    if (order !== undefined) partner.order = parseInt(order);
    if (isActive !== undefined) partner.isActive = isActive === 'true';

    await partner.save();
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ success: false, message: 'Partner not found' });
    if (partner.logo?.publicId) await deleteFromCloudinary(partner.logo.publicId);
    await partner.deleteOne();
    res.json({ success: true, message: 'Partner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getPartners, getAllPartners, createPartner, updatePartner, deletePartner };
