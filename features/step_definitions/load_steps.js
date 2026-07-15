const { Given, Before } = require('@cucumber/cucumber');
const { Product, sequelize } = require('../../src/models/product');
const ProductFactory = require('../../tests/factories');

Before(async function () {
  process.env.DB_PATH = './bdd.sqlite';
  await sequelize.sync({ force: true });
});

Given('the following products exist in the catalogue', async function (dataTable) {
  const products = dataTable.hashes();
  for (const product of products) {
    await ProductFactory.create({
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      available: product.available === 'true',
      description: product.description
    });
  }
});
