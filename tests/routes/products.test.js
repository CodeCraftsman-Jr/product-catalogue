const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../src/server');
const { Product, sequelize } = require('../../src/models/product');
const ProductFactory = require('../factories');

chai.use(chaiHttp);

describe('Product Routes', () => {
  before(async () => {
    process.env.DB_PATH = './test_routes.sqlite';
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  describe('Read a product', () => {
    it('should GET a product by id', async () => {
      const product = await ProductFactory.create({ name: 'Readable Item' });
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
    it('should create a product via POST then update description to unknown', async () => {
      const createRes = await chai.request(app)
        .post('/products')
        .send({ name: 'Test Product', description: 'original', price: 50, category: 'Test' });
      expect(createRes).to.have.status(201);

      const productId = createRes.body.id;
      const updateRes = await chai.request(app)
        .put(`/products/${productId}`)
        .set('Content-Type', 'application/json')
        .send({ description: 'unknown' });
      expect(updateRes).to.have.status(200);
      expect(updateRes.body.description).to.equal('unknown');
    });

    it('should return 404 when updating non-existent product', async () => {
      const res = await chai.request(app)
        .put('/products/99999')
        .send({ name: 'Ghost' });
      expect(res).to.have.status(404);
    });
  });

  describe('Delete a product', () => {
    it('should DELETE a product and return 204 with empty body and count decreases', async () => {
      const product = await ProductFactory.create();
      const initialCount = await Product.count();

      const res = await chai.request(app).delete(`/products/${product.id}`);
      expect(res).to.have.status(204);
      expect(res.body).to.be.empty;

      const finalCount = await Product.count();
      expect(finalCount).to.equal(initialCount - 1);
      const check = await Product.findByPk(product.id);
      expect(check).to.be.null;
    });

    it('should return 404 when deleting non-existent product', async () => {
      const res = await chai.request(app).delete('/products/99999');
      expect(res).to.have.status(404);
    });
  });

  describe('List all products', () => {
    it('should GET all 5 products', async () => {
      await ProductFactory.create({ name: 'Alpha' });
      await ProductFactory.create({ name: 'Beta' });
      await ProductFactory.create({ name: 'Gamma' });
      await ProductFactory.create({ name: 'Delta' });
      await ProductFactory.create({ name: 'Epsilon' });
      const res = await chai.request(app).get('/products');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(5);
    });
  });

  describe('List products by name', () => {
    it('should search products by name query parameter', async () => {
      await ProductFactory.create({ name: 'Red Shoes' });
      await ProductFactory.create({ name: 'Blue Hat' });
      await ProductFactory.create({ name: 'Green Shoes' });
      const res = await chai.request(app).get('/products/search/name/Shoes');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
      res.body.forEach(p => {
        expect(p.name.toLowerCase()).to.include('shoes');
      });
    });
  });

  describe('List products by category', () => {
    it('should filter products by category', async () => {
      await ProductFactory.create({ name: 'Laptop', category: 'Electronics' });
      await ProductFactory.create({ name: 'Jeans', category: 'Clothing' });
      await ProductFactory.create({ name: 'Phone', category: 'Electronics' });
      const res = await chai.request(app).get('/products/search/category/Electronics');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
      res.body.forEach(p => {
        expect(p.category).to.equal('Electronics');
      });
    });
  });

  describe('List products by availability', () => {
    it('should filter available products', async () => {
      await ProductFactory.create({ name: 'A', available: true });
      await ProductFactory.create({ name: 'B', available: false });
      await ProductFactory.create({ name: 'C', available: true });
      const res = await chai.request(app).get('/products/search/availability/true');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(2);
      res.body.forEach(p => {
        expect(p.available).to.be.true;
      });
    });

    it('should filter unavailable products', async () => {
      await ProductFactory.create({ name: 'D', available: false });
      await ProductFactory.create({ name: 'E', available: true });
      const res = await chai.request(app).get('/products/search/availability/false');
      expect(res).to.have.status(200);
      expect(res.body.length).to.equal(1);
      res.body.forEach(p => {
        expect(p.available).to.be.false;
      });
    });
  });
});
