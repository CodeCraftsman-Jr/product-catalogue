const { When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Product } = require('../../src/models/product');

setDefaultTimeout(30000);

async function startServer() {
  const app = require('../../src/server');
  const { sequelize } = require('../../src/models/product');
  await sequelize.sync();
  return new Promise((resolve) => {
    const server = app.listen(3001, () => resolve(server));
  });
}

async function getDriver() {
  const chrome = require('selenium-webdriver/chrome');
  const options = new chrome.Options();
  options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
  return new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
}

let driver;
let server;

When('I request the product with ID {int}', async function (id) {
  this.currentProduct = await Product.findByPk(id);
});

Then('I should see the product details for {string}', async function (name) {
  expect(this.currentProduct).to.not.be.null;
  expect(this.currentProduct.name).to.equal(name);
});

When('I update the product name to {string} and price to {int}', async function (name, price) {
  await this.currentProduct.update({ name, price });
  this.currentProduct = await Product.findByPk(this.currentProduct.id);
});

Then('the product should now be named {string} with price {int}', async function (name, price) {
  expect(this.currentProduct.name).to.equal(name);
  expect(this.currentProduct.price).to.equal(price);
});

When('I delete the product', async function () {
  await this.currentProduct.destroy();
});

Then('the product should no longer exist in the catalogue', async function () {
  const found = await Product.findByPk(this.currentProduct.id);
  expect(found).to.be.null;
});

When('I request the list of all products', async function () {
  this.allProducts = await Product.findAll();
});

Then('I should see all {int} products in the catalogue', async function (count) {
  expect(this.allProducts.length).to.equal(count);
});

When('I search for products with name {string}', async function (name) {
  const { Op } = require('sequelize');
  this.searchResults = await Product.findAll({
    where: { name: { [Op.like]: `%${name}%` } }
  });
});

Then('I should see {int} product matching {string}', async function (count, name) {
  expect(this.searchResults.length).to.equal(count);
  this.searchResults.forEach(p => {
    expect(p.name.toLowerCase()).to.include(name.toLowerCase());
  });
});

When('I search for products in category {string}', async function (category) {
  this.searchResults = await Product.findAll({
    where: { category }
  });
});

Then('I should see {int} products in the {string} category', async function (count, category) {
  expect(this.searchResults.length).to.equal(count);
  this.searchResults.forEach(p => {
    expect(p.category).to.equal(category);
  });
});

When('I search for available products', async function () {
  this.searchResults = await Product.findAll({
    where: { inStock: true }
  });
});

Then('I should see {int} products that are in stock', async function (count) {
  expect(this.searchResults.length).to.equal(count);
  this.searchResults.forEach(p => {
    expect(p.inStock).to.be.true;
  });
});
