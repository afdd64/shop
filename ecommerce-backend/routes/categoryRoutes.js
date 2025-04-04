// shop/ecommerce-backend/app.js
const express = require('express');
const logger = require('./logger');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // 引入正确的路由文件
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 使用路由
app.use('/', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes); // 使用正确的路由
app.use('/addresses', addressRoutes);
app.use('/wallet', walletRoutes);

// 配置静态文件服务
app.use('/static', express.static('../static'));

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器错误' });
});

// 启动服务器
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});