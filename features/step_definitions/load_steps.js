const { Given, Before } = require('@cucumber/cucumber');
const { Product, sequelize } = require('../../src/models/product');

Before(async function () {
  process.env.DB_PATH = './bdd.sqlite';
  await sequelize.sync({ force: true });
});

Given('the following products exist in the catalogue', async function (dataTable) {
  const products = dataTable.hashes();
  for (const product of products) {
    await Product.create({
      name: product.name,
      category: product.category,
      price: parseFloat(product.price),
      inStock: product.inStock === 'true',
      description: product.description
    });
  }
});
