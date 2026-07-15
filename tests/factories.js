const { faker } = require('@faker-js/faker');
const { Product } = require('../src/models/product');

function buildProduct(overrides = {}) {
  return {
    name: overrides.name || faker.commerce.productName(),
    category: overrides.category || faker.commerce.department(),
    price: overrides.price !== undefined ? overrides.price : parseFloat(faker.commerce.price()),
    description: overrides.description || faker.commerce.productDescription(),
    inStock: overrides.inStock !== undefined ? overrides.inStock : faker.datatype.boolean(),
    imageUrl: overrides.imageUrl || faker.image.url(),
    ...overrides
  };
}

async function createProduct(overrides = {}) {
  const data = buildProduct(overrides);
  return await Product.create(data);
}

module.exports = { buildProduct, createProduct };
