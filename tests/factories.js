const { faker } = require('@faker-js/faker');
const { Product } = require('../src/models/product');

class ProductFactory {
  static build(overrides = {}) {
    return {
      id: overrides.id || faker.number.int({ min: 1, max: 10000 }),
      name: overrides.name || faker.commerce.productName(),
      description: overrides.description || faker.commerce.productDescription(),
      price: overrides.price !== undefined ? overrides.price : parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
      category: overrides.category || faker.commerce.department(),
      available: overrides.available !== undefined ? overrides.available : faker.datatype.boolean(),
      imageUrl: overrides.imageUrl || faker.image.url(),
      ...overrides
    };
  }

  static async create(overrides = {}) {
    const data = ProductFactory.build(overrides);
    return await Product.create(data);
  }
}

module.exports = ProductFactory;
