const express = require('express');
const { Op } = require('sequelize');
const { Product } = require('../models/product');

const router = express.Router();

// Create a product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// List all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Read a product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update(req.body);
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.destroy();
    return res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List products by name
router.get('/search/name/:name', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        name: { [Op.like]: `%${req.params.name}%` }
      }
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List products by category
router.get('/search/category/:category', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        category: { [Op.like]: `%${req.params.category}%` }
      }
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// List products by availability (inStock)
router.get('/search/availability/:status', async (req, res) => {
  try {
    const inStock = req.params.status === 'true' || req.params.status === '1';
    const products = await Product.findAll({
      where: { inStock }
    });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
