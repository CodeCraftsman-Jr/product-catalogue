const express = require('express');
const { Product, sequelize } = require('./models/product');
const productsRouter = require('./routes/products');

const app = express();
app.use(express.json());

app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Product Catalogue API' });
});

if (require.main === module) {
  sequelize.sync().then(() => {
    app.listen(3000, () => {
      console.log('Server running on port 3000');
    });
  });
}

module.exports = app;
