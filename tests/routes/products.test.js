const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server');
const { Product, sequelize } = require('../../src/models/product');
const { createProduct } = require('../factories');

chai.use(chaiHttp);

describe('Product Routes', () => {
  before(async () => {
    process.env.DB_PATH = './test_routes.sqlite';
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  // sequelize connection will be closed on process exit

  describe('Read a product', () => {
    it('should GET a product by id', async () => {
      const product = await createProduct({ name: 'Readable Item' });
      const res = await chai.request(app).get(`/products/${product.id}`);
      expect(res).to.have.status(200);
      expect(res.body.name).to.equal('Readable Item');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await chai.request(app).get('/products/99999');
      expect(res).to.have.status(404);
    });
  });

  describe('Update a product', () => {
    it('should PUT and update a product', async () => {
      const product = await createProduct({ name: 'Before Update', price: 10 });
      const res = await chai.request(app)
        .put(`/products/${product.id}`)
        .send({ name: 'After Update', price: 99 });
      expect(res).to.have.status(200);
      expect(res.body.name).to.equal('After Update');
      expect(res.body.price).to.equal(99);
    });

    it('should return 404 when updating non-existent product', async () => {
      const res = await chai.request(app)
        .put('/products/99999')
        .send({ name: 'Ghost' });
      expect(res).to.have.status(404);
    });
  });

  describe('Delete a product', () => {
    it('should DELETE a product', async () => {
      const product = await createProduct();
      const res = await chai.request(app).delete(`/products/${product.id}`);
      expect(res).to.have.status(200);
      const check = await Product.findByPk(product.id);
      expect(check).to.be.null;
    });

    it('should return 404 when deleting non-existent product', async () => {
      const res = await chai.request(app).delete('/products/99999');
      expect(res).to.have.status(404);
    });
  });

  describe('List all products', () => {
    it('should GET all products', async () => {
      await createProduct({ name: 'Alpha' });
      await createProduct({ name: 'Beta' });
      await createProduct({ name: 'Gamma' });
      const res = await chai.request(app).get('/products');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(3);
    });
  });

  describe('List products by name', () => {
    it('should search products by name', async () => {
      await createProduct({ name: 'Red Shoes' });
      await createProduct({ name: 'Blue Hat' });
      await createProduct({ name: 'Green Shoes' });
      const res = await chai.request(app).get('/products/search/name/Shoes');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe('List products by category', () => {
    it('should filter products by category', async () => {
      await createProduct({ name: 'Laptop', category: 'Electronics' });
      await createProduct({ name: 'Jeans', category: 'Clothing' });
      await createProduct({ name: 'Phone', category: 'Electronics' });
      const res = await chai.request(app).get('/products/search/category/Electronics');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
    });
  });

  describe('List products by availability', () => {
    it('should filter in-stock products', async () => {
      await createProduct({ name: 'A', inStock: true });
      await createProduct({ name: 'B', inStock: false });
      await createProduct({ name: 'C', inStock: true });
      const res = await chai.request(app).get('/products/search/availability/true');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
    });

    it('should filter out-of-stock products', async () => {
      await createProduct({ name: 'D', inStock: false });
      await createProduct({ name: 'E', inStock: true });
      const res = await chai.request(app).get('/products/search/availability/false');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(1);
    });
  });
});
