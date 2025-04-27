//ecommerce-backend\routes\orderRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取订单列表
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { status } = req.query;

  let sql = `
    SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'image', p.image,
          'quantity', oi.quantity
        )
      ) AS items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
  `;

  const params = [userId];

  // 状态过滤
  if (status && status !== 'all') {
    sql += ' AND o.status = ?';
    params.push(status);
  }

  sql += ' GROUP BY o.id ORDER BY o.created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('查询订单列表时出错:', err);
      return res.status(500).json({ code: 500, message: '数据库查询出错' });
    }
    res.json({ 
      code: 200, 
      data: results.map(order => ({
        ...order,
        items: JSON.parse(order.items)
      }))
    });
  });
});

// 取消订单
router.post('/:id/cancel', (req, res) => {
  const orderId = req.params.id;
  const userId = req.headers['x-user-id'];
  db.query(
    'UPDATE orders SET status = "cancelled" WHERE id = ? AND user_id = ?',
    [orderId, userId],
    (err, result) => {
      if (err) {
        console.error('取消订单时出错:', err);
        return res.status(500).json({ code: 500, message: '数据库更新出错' });
      }
      res.json({ code: 200 });
    }
  );
});

// 创建订单
router.post('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  const { items, totalAmount, addressId } = req.body;

  // 生成唯一的订单编号
  const orderNo = generateOrderNo();

  db.beginTransaction(err => {
    if (err) {
      console.error('事务启动失败:', err);
      return res.status(500).json({ code: 500, message: '事务启动失败' });
    }

    // 插入订单记录
    const orderData = {
      user_id: userId,
      total_amount: totalAmount,
      address_id: addressId,
      status: 'pending', 
      created_at: new Date(),
      order_no: orderNo // 添加订单编号
    };
    db.query('INSERT INTO orders SET ?', orderData, (err, result) => {
      if (err) {
        console.error('插入订单记录失败:', err);
        return db.rollback(() => res.status(500).json({ code: 500, message: '插入订单记录失败' }));
      }
      const orderId = result.insertId;

      // 插入订单商品记录
      const orderItems = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      if (orderItems.length === 0) {
        // 如果 orderItems 为空，直接提交事务
        db.commit(() => {
          res.json({ code: 200, data: { orderId, orderNo } });
        });
      } else {
        db.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
          [orderItems],
          (err) => {
            if (err) {
              console.error('插入订单商品记录失败:', err);
              return db.rollback(() => res.status(500).json({ code: 500, message: '插入订单商品记录失败' }));
            }
            db.commit(() => {
              res.json({ code: 200, data: { orderId, orderNo } });
            });
          }
        );
      }
    });
  });
});

// 生成唯一的订单编号
function generateOrderNo() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORDER-${timestamp}-${random}`;
};

module.exports = router;