const { expect } = require('chai');
const { Product, sequelize } = require('../../src/models/product');
const ProductFactory = require('../factories');

describe('Product Model', () => {
  before(async () => {
    process.env.DB_PATH = './test_models.sqlite';
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  describe('Read a product', () => {
    it('should find a product by its id and verify all attributes', async () => {
      const created = await ProductFactory.create({
        name: 'Test Gadget',
        description: 'A useful device',
        price: 49.99
      });
      const found = await Product.findByPk(created.id);
      expect(found).to.not.be.null;
      expect(found.name).to.equal('Test Gadget');
      expect(found.description).to.equal('A useful device');
      expect(found.price).to.equal(49.99);
    });
  });

  describe('Update a product', () => {
    it('should retain the original id and update description to testing', async () => {
      const created = await ProductFactory.create({
        name: 'Original Item',
        description: 'Original description',
        price: 10
      });
      const originalId = created.id;
      created.name = 'Updated Item';
      created.description = 'testing';
      created.price = 25;
      await created.save();
      const updated = await Product.findByPk(originalId);
      expect(updated.id).to.equal(originalId);
      expect(updated.name).to.equal('Updated Item');
      expect(updated.description).to.equal('testing');
      expect(updated.price).to.equal(25);
    });
  });

  describe('Delete a product', () => {
    it('should delete a product from the database', async () => {
      const created = await ProductFactory.create();
      await created.destroy();
      const found = await Product.findByPk(created.id);
      expect(found).to.be.null;
    });
  });

  describe('List all products', () => {
    it('should start empty then return all 5 products after creation', async () => {
      const initialCount = await Product.count();
      expect(initialCount).to.equal(0);

      await ProductFactory.create({ name: 'Alpha' });
      await ProductFactory.create({ name: 'Beta' });
      await ProductFactory.create({ name: 'Gamma' });
      await ProductFactory.create({ name: 'Delta' });
      await ProductFactory.create({ name: 'Epsilon' });

      const all = await Product.findAll();
      expect(all.length).to.equal(5);
    });
  });

  describe('Find a product by name', () => {
    it('should find products with matching name and verify each result', async () => {
      await ProductFactory.create({ name: 'Wireless Mouse' });
      await ProductFactory.create({ name: 'USB Hub' });
      await ProductFactory.create({ name: 'Mouse Pad' });
      const { Op } = require('sequelize');
      const results = await Product.findAll({
        where: { name: { [Op.like]: '%Mouse%' } }
      });
      expect(results.length).to.equal(2);
      results.forEach(p => {
        expect(p.name.toLowerCase()).to.include('mouse');
      });
    });
  });

  describe('Find products by category', () => {
    it('should find products in a given category and verify each', async () => {
      await ProductFactory.create({ name: 'Laptop', category: 'Electronics' });
      await ProductFactory.create({ name: 'Shirt', category: 'Clothing' });
      await ProductFactory.create({ name: 'Phone', category: 'Electronics' });
      const { Op } = require('sequelize');
      const results = await Product.findAll({
        where: { category: { [Op.eq]: 'Electronics' } }
      });
      expect(results.length).to.equal(2);
      results.forEach(p => {
        expect(p.category).to.equal('Electronics');
      });
    });
  });

  describe('Find products by availability', () => {
    it('should find only in-stock products', async () => {
      await ProductFactory.create({ name: 'A', inStock: true });
      await ProductFactory.create({ name: 'B', inStock: false });
      await ProductFactory.create({ name: 'C', inStock: true });
      const results = await Product.findAll({ where: { inStock: true } });
      expect(results.length).to.equal(2);
      results.forEach(p => {
        expect(p.inStock).to.be.true;
      });
    });

    it('should find only out-of-stock products', async () => {
      await ProductFactory.create({ name: 'D', inStock: false });
      await ProductFactory.create({ name: 'E', inStock: true });
      const results = await Product.findAll({ where: { inStock: false } });
      expect(results.length).to.equal(1);
      results.forEach(p => {
        expect(p.inStock).to.be.false;
      });
    });
  });
});
