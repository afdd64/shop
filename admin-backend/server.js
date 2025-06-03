// admin-backend/server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 4000;

// 中间件
app.use(cors());
app.use(express.json());

// MySQL 连接配置
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
};

// 测试数据库连接
async function testDbConnection() {
  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('✅ 已连接到 MySQL 数据库:', process.env.DB_NAME);
    await conn.end();
  } catch (err) {
    console.error('❌ 无法连接到 MySQL，请检查 .env 配置。', err);
  }
}
testDbConnection();

/** ------------------ JWT 鉴权中间件 ------------------ **/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '未提供 Token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token 无效' });
    req.user = user; // user 中包含载荷（payload），如 { id, username, role }
    next();
  });
};

/** ------------------ 公共接口（无需鉴权） ------------------ **/

// 后端健康检查
app.get('/api/ping', (req, res) => {
  res.json({ message: 'Pong 👏 后端服务正常运行' });
});

/** 1. 登录接口（生成 JWT） **/
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM users WHERE username = ?', [username]);
    await conn.end();
    if (rows.length === 0) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    const user = rows[0];
    // 比对明文或哈希密码（这里假设存储的是 bcrypt 哈希，如果存储明文可直接比较）
    const passwordMatches = await bcrypt.compare(password, user.password);
    // 如果你在数据库存的是明文，请使用：const passwordMatches = (password === user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    if (user.status === 0) {
      return res.status(403).json({ message: '账号已被禁用' });
    }
    // 生成 JWT，载荷中可以放 id、username、role
    const payload = { id: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: payload });
  } catch (err) {
    console.error('登录失败：', err);
    res.status(500).json({ message: '登录失败' });
  }
});

/** ------------------ 下面的接口都需要鉴权 ------------------ **/
app.use('/api', authenticateToken);

/** ------------------ 商品（Products） ------------------ **/

// 获取所有商品
app.get('/api/products', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `);
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('获取商品列表失败：', err);
    res.status(500).json({ message: '获取商品列表失败' });
  }
});

// 根据 ID 获取单个商品
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    await conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ message: '商品不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取单个商品失败：', err);
    res.status(500).json({ message: '获取单个商品失败' });
  }
});

// 新增商品
app.post('/api/products', async (req, res) => {
  const { name, description, price, stock, image_url, category_id, status } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ message: '商品名称和价格是必填项' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      `INSERT INTO products 
        (name, description, price, stock, image_url, category_id, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        price,
        stock || 0,
        image_url || '',
        category_id || null,
        status != null ? status : 1,
      ]
    );
    await conn.end();
    res.json({
      id: result.insertId,
      name,
      description,
      price,
      stock,
      image_url,
      category_id,
      status,
    });
  } catch (err) {
    console.error('新增商品失败：', err);
    res.status(500).json({ message: '新增商品失败' });
  }
});

// 更新商品
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, image_url, category_id, status } = req.body;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      `UPDATE products SET 
        name = ?, 
        description = ?, 
        price = ?, 
        stock = ?, 
        image_url = ?, 
        category_id = ?, 
        status = ?
      WHERE id = ?`,
      [
        name,
        description || '',
        price,
        stock || 0,
        image_url || '',
        category_id || null,
        status != null ? status : 1,
        id,
      ]
    );
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '商品不存在或未做任何修改' });
    }
    res.json({ id, name, description, price, stock, image_url, category_id, status });
  } catch (err) {
    console.error('更新商品失败：', err);
    res.status(500).json({ message: '更新商品失败' });
  }
});

// 删除商品
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute('DELETE FROM products WHERE id = ?', [id]);
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '商品不存在或已删除' });
    }
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除商品失败：', err);
    res.status(500).json({ message: '删除商品失败' });
  }
});

/** ------------------ 分类（Categories） ------------------ **/

// 获取所有分类
app.get('/api/categories', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM categories ORDER BY id ASC');
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('获取分类列表失败：', err);
    res.status(500).json({ message: '获取分类列表失败' });
  }
});

// 根据 ID 获取单个分类
app.get('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute('SELECT * FROM categories WHERE id = ?', [id]);
    await conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ message: '分类不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取单个分类失败：', err);
    res.status(500).json({ message: '获取单个分类失败' });
  }
});

// 新增分类
app.post('/api/categories', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: '分类名称不能为空' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || '']
    );
    await conn.end();
    res.json({ id: result.insertId, name, description });
  } catch (err) {
    console.error('新增分类失败：', err);
    // 如果 name 重复会报错，可自行处理错误码 1062
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '分类名称已存在' });
    }
    res.status(500).json({ message: '新增分类失败' });
  }
});

// 更新分类
app.put('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ message: '分类名称不能为空' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'UPDATE categories SET name = ?, description = ? WHERE id = ?',
      [name, description || '', id]
    );
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '分类不存在或未修改' });
    }
    res.json({ id, name, description });
  } catch (err) {
    console.error('更新分类失败：', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '分类名称已存在' });
    }
    res.status(500).json({ message: '更新分类失败' });
  }
});

// 删除分类
app.delete('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    // 在删除前可判断是否有商品依赖此分类，若有关联则拒绝删除
    const [countRes] = await conn.execute(
      'SELECT COUNT(*) AS cnt FROM products WHERE category_id = ?',
      [id]
    );
    if (countRes[0].cnt > 0) {
      await conn.end();
      return res
        .status(400)
        .json({ message: '该分类下存在商品，无法删除' });
    }
    const [result] = await conn.execute('DELETE FROM categories WHERE id = ?', [id]);
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '分类不存在或已删除' });
    }
    res.json({ message: '删除成功' });
  } catch (err) {
    console.error('删除分类失败：', err);
    res.status(500).json({ message: '删除分类失败' });
  }
});

/** ------------------ 订单（Orders） ------------------ **/

// 获取所有订单（可按状态筛选 ?status=pending）
app.get('/api/orders', async (req, res) => {
  const { status } = req.query;
  try {
    const conn = await mysql.createConnection(dbConfig);
    let sql = `
      SELECT o.*, u.username, u.email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;
    const params = [];
    if (status) {
      sql += ' WHERE o.status = ?';
      params.push(status);
    }
    sql += ' ORDER BY o.id DESC';
    const [rows] = await conn.execute(sql, params);
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('获取订单列表失败：', err);
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

// 根据 ID 获取单个订单
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      `SELECT o.*, u.username, u.email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id]
    );
    await conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取单个订单失败：', err);
    res.status(500).json({ message: '获取单个订单失败' });
  }
});

// 更新订单状态
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 期望传入新的状态
  if (!status) {
    return res.status(400).json({ message: '请提供订单状态' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, id]
    );
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '订单不存在或未修改' });
    }
    res.json({ id, status });
  } catch (err) {
    console.error('更新订单状态失败：', err);
    res.status(500).json({ message: '更新订单状态失败' });
  }
});

/** ------------------ 用户（Users） ------------------ **/

// 获取所有用户（管理员可查看普通用户，或也可列出管理员自己）
app.get('/api/users', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      'SELECT id, username, email, role, status, created_at FROM users ORDER BY id ASC'
    );
    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error('获取用户列表失败：', err);
    res.status(500).json({ message: '获取用户列表失败' });
  }
});

// 根据 ID 获取单个用户（可用于显示详情）
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      'SELECT id, username, email, role, status, created_at FROM users WHERE id = ?',
      [id]
    );
    await conn.end();
    if (rows.length === 0) {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('获取单个用户失败：', err);
    res.status(500).json({ message: '获取单个用户失败' });
  }
});

// 禁用或启用用户（status: 1=启用, 0=禁用）
app.put('/api/users/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (status == null) {
    return res.status(400).json({ message: '请提供 status 字段' });
  }
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, id]
    );
    await conn.end();
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '用户不存在或未修改' });
    }
    res.json({ id, status });
  } catch (err) {
    console.error('更新用户状态失败：', err);
    res.status(500).json({ message: '更新用户状态失败' });
  }
});

// （可选）为管理员创建新用户
app.post('/api/users', async (req, res) => {
  const { username, password, email, role, status } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: '用户名和密码不能为空' });
  }
  // 使用 bcrypt 对密码进行哈希（生产环境必需）
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      'INSERT INTO users (username, password, email, role, status) VALUES (?, ?, ?, ?, ?)',
      [
        username,
        hashedPassword,
        email || '',
        role || 'admin',
        status != null ? status : 1,
      ]
    );
    await conn.end();
    res.json({ id: result.insertId, username, email, role, status });
  } catch (err) {
    console.error('创建用户失败：', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: '用户名已存在' });
    }
    res.status(500).json({ message: '创建用户失败' });
  }
});

/** ------------------ 启动服务器 ------------------ **/
app.listen(PORT, () => {
  console.log(`🛒 后台服务已启动，监听端口 ${PORT}`);
  console.log(`  • 健康检查接口： GET http://localhost:${PORT}/api/ping`);
  console.log(`  • 登录接口：     POST http://localhost:${PORT}/api/auth/login`);
});
