const { expect } = require('chai');
const { Product, sequelize } = require('../../src/models/product');
const { buildProduct, createProduct } = require('../factories');

describe('Product Model', () => {
  before(async () => {
    process.env.DB_PATH = './test_models.sqlite';
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  // sequelize connection will be closed on process exit

  describe('Read a product', () => {
    it('should find a product by its id', async () => {
      const created = await createProduct({ name: 'Test Gadget' });
      const found = await Product.findByPk(created.id);
      expect(found).to.not.be.null;
      expect(found.name).to.equal('Test Gadget');
    });
  });

  describe('Update a product', () => {
    it('should update a product\'s attributes', async () => {
      const created = await createProduct({ name: 'Old Name', price: 10 });
      created.name = 'New Name';
      created.price = 25;
      await created.save();
      const updated = await Product.findByPk(created.id);
      expect(updated.name).to.equal('New Name');
      expect(updated.price).to.equal(25);
    });
  });

  describe('Delete a product', () => {
    it('should delete a product from the database', async () => {
      const created = await createProduct();
      await created.destroy();
      const found = await Product.findByPk(created.id);
      expect(found).to.be.null;
    });
  });

  describe('List all products', () => {
    it('should return all products', async () => {
      await createProduct({ name: 'A' });
      await createProduct({ name: 'B' });
      await createProduct({ name: 'C' });
      const all = await Product.findAll();
      expect(all.length).to.equal(3);
    });
  });

  describe('Find a product by name', () => {
    it('should find products with matching name', async () => {
      await createProduct({ name: 'Wireless Mouse' });
      await createProduct({ name: 'USB Hub' });
      await createProduct({ name: 'Mouse Pad' });
      const { Op } = require('sequelize');
      const results = await Product.findAll({
        where: { name: { [Op.like]: '%Mouse%' } }
      });
      expect(results.length).to.equal(2);
    });
  });

  describe('Find products by category', () => {
    it('should find products in a given category', async () => {
      await createProduct({ name: 'Laptop', category: 'Electronics' });
      await createProduct({ name: 'Shirt', category: 'Clothing' });
      await createProduct({ name: 'Phone', category: 'Electronics' });
      const { Op } = require('sequelize');
      const results = await Product.findAll({
        where: { category: { [Op.eq]: 'Electronics' } }
      });
      expect(results.length).to.equal(2);
    });
  });

  describe('Find products by availability', () => {
    it('should find only in-stock products', async () => {
      await createProduct({ name: 'A', inStock: true });
      await createProduct({ name: 'B', inStock: false });
      await createProduct({ name: 'C', inStock: true });
      const results = await Product.findAll({ where: { inStock: true } });
      expect(results.length).to.equal(2);
    });

    it('should find only out-of-stock products', async () => {
      await createProduct({ name: 'D', inStock: false });
      await createProduct({ name: 'E', inStock: true });
      const results = await Product.findAll({ where: { inStock: false } });
      expect(results.length).to.equal(1);
    });
  });
});
