const Category = require('../models/Category.model');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    const category = await Category.create({ name, description, icon, order: order || 0 });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Category name already exists' });
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, order },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const Product = require('../models/Product.model');
    const count = await Product.countDocuments({ category: req.params.id });
    if (count > 0) {
      return res.status(400).json({ success: false, message: `Cannot delete — ${count} products use this category` });
    }
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
