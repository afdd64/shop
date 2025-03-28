//ecommerce-backend/app.js
const express = require('express');
const logger = require('./logger'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const addressRoutes = require('./routes/addressRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 验证中间件
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    const userId = req.headers['x-user-id'];
    const sessionKey = req.headers['x-session-key'];

    if (!userId || !sessionKey) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }

    // 查询数据库验证 sessionKey
    const sql = 'SELECT session_key FROM users WHERE openid = ?';
    db.query(sql, [userId], (err, result) => {
      if (err || result.length === 0 || result[0].session_key !== sessionKey) {
        return res.status(401).json({ code: 401, message: '会话已过期' });
      }
      next(); // 验证通过，继续处理请求
    });
  } else {
    next();
  }
});
// 使用路由
app.use('/login', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/wallet', walletRoutes);

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