const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all products (with search & category filter)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, featured, limit = 50, page = 1 } = req.query;
    const query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (featured === 'true') query.isFeatured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon')
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: products
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, shortDescription, category, features, specifications, isActive, isFeatured, order } = req.body;

    let images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'autoforge/products');
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    const product = await Product.create({
      name, description, shortDescription, category,
      features: features ? JSON.parse(features) : [],
      specifications: specifications ? JSON.parse(specifications) : [],
      images, isActive, isFeatured,
      order: order || 0
    });

    const populated = await Product.findById(product._id).populate('category', 'name slug');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const { name, description, shortDescription, category, features, specifications, isActive, isFeatured, order, removeImages } = req.body;

    // Handle removed images
    if (removeImages) {
      const toRemove = JSON.parse(removeImages);
      for (const publicId of toRemove) {
        await deleteFromCloudinary(publicId);
        product.images = product.images.filter(img => img.publicId !== publicId);
      }
    }

    // Upload new images
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'autoforge/products');
        product.images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (category) product.category = category;
    if (features) product.features = JSON.parse(features);
    if (specifications) product.specifications = JSON.parse(specifications);
    if (isActive !== undefined) product.isActive = isActive === 'true';
    if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true';
    if (order !== undefined) product.order = parseInt(order);

    await product.save();
    const updated = await Product.findById(product._id).populate('category', 'name slug');
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    for (const img of product.images) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
