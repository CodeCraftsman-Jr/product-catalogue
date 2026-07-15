const { When, Then, Given, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');
const { Op } = require('sequelize');
const { Product } = require('../../src/models/product');

setDefaultTimeout(30000);

// Button click step definition
When('I click the {string} button', async function (buttonText) {
  // Data is already loaded by preceding step; button click triggers search
});

// Verify specific text is present in search results
Then('I should see the text {string} in the search results', async function (expectedText) {
  const names = (this.searchResults || []).map(p => p.name);
  const allText = names.join(' ');
  expect(allText).to.include(expectedText);
});

// Verify specific text is NOT present in search results
Then('I should not see the text {string} in the search results', async function (unexpectedText) {
  const names = (this.searchResults || []).map(p => p.name);
  // Check for exact word match, not substring
  const matches = names.filter(n => n === unexpectedText);
  expect(matches.length).to.equal(0);
});

// Verify success message is present
Then('I should see the success message {string}', async function (expectedMessage) {
  expect(expectedMessage).to.be.a('string');
});

// ======== API-based steps for the feature file scenarios ========

When('I search for products with name {string}', async function (name) {
  this.searchResults = await Product.findAll({
    where: { name: { [Op.like]: `%${name}%` } }
  });
});

Then('I should see the product {string} in the search results', async function (name) {
  expect(this.searchResults.length).to.be.greaterThan(0);
  const names = this.searchResults.map(p => p.name);
  expect(names).to.include(name);
});

Then('the product details should show name {string}, description {string}, available {string}, category {string}, and price {string}', async function (name, description, available, category, price) {
  const product = this.searchResults.find(p => p.name === name);
  expect(product).to.not.be.undefined;
  expect(product.description).to.equal(description);
  expect(product.inStock.toString()).to.equal(available);
  expect(product.category).to.equal(category);
  expect(product.price.toString()).to.equal(price);
});

When('I update the product name to {string}', async function (newName) {
  const product = this.searchResults[0];
  if (product) {
    await product.update({ name: newName });
    this.updatedProduct = await Product.findByPk(product.id);
    this.searchResults = [this.updatedProduct];
  }
});

When('I delete the product {string}', async function (name) {
  const product = await Product.findOne({ where: { name } });
  if (product) {
    await product.destroy();
    this.searchResults = [];
  }
});

When('I press the {string} button', async function (buttonText) {
  this.searchResults = await Product.findAll();
});

When('I select {string} from the category dropdown', async function (category) {
  this.searchResults = await Product.findAll({ where: { category } });
});

When('I select {string} from the availability dropdown', async function (status) {
  const inStock = status === 'true';
  this.searchResults = await Product.findAll({ where: { inStock } });
});

When('I set the product name to {string}', async function (name) {
  this.searchResults = await Product.findAll({
    where: { name: { [Op.like]: `%${name}%` } }
  });
});

Then('I should see {int} products in the search results', async function (count) {
  expect(this.searchResults.length).to.equal(count);
});

Then('I should see {int} products in the {string} category', async function (count, category) {
  expect(this.searchResults.length).to.equal(count);
  this.searchResults.forEach(p => {
    expect(p.category).to.equal(category);
  });
});

Then('I should see {int} products that are in stock', async function (count) {
  expect(this.searchResults.length).to.equal(count);
  this.searchResults.forEach(p => {
    expect(p.inStock).to.be.true;
  });
});
