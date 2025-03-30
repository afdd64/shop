const express = require('express');
const logger = require('./logger');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-User-Id', 'Authorization']
}));

app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/addresses', addressRoutes);
app.use('/wallet', walletRoutes);

app.use('/static', express.static('../static'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器错误' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
