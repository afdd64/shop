// shop/ecommerce-backend/routes/orderRoutes.js
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

  if (status && status!== 'all') {
    sql += ' AND o.status = ?';
    params.push(status);
  }

  sql += ' GROUP BY o.id ORDER BY o.created_at DESC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('获取订单列表失败:', err);
      return res.status(500).json({ code: 500, message: '服务器错误' });
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

// 生成订单编号
function generateOrderNo() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);
  return `ORD${timestamp}${random.toString().padStart(4, '0')}`;
}

// 创建订单（修改后的逻辑）
router.post('/', (req, res) => {
  console.log('[创建订单] 请求头:', req.headers);
  console.log('[创建订单] 请求体:', req.body);

  const userId = req.headers['x-user-id'];
  const { items, totalAmount, addressId } = req.body;

  // 数据验证
  if (!userId ||!items ||!totalAmount ||!addressId) {
    return res.status(400).json({ code: 400, message: '缺少必要参数' });
  }

  db.beginTransaction(err => {
    if (err) {
      console.error('事务启动失败:', err);
      return res.status(500).json({ code: 500, message: '事务启动失败' });
    }

    const orderNo = generateOrderNo();
    const orderData = {
      user_id: userId,
      total_amount: totalAmount,
      address_id: addressId,
      status: 'pending',
      order_no: orderNo
    };

    // 1. 插入订单主记录
    db.query('INSERT INTO orders SET?', orderData, (err, orderResult) => {
      if (err) {
        console.error('插入订单记录失败:', err);
        return db.rollback(() => {
          res.status(500).json({ code: 500, message: '插入订单记录失败' });
        });
      }

      const orderId = orderResult.insertId;
      console.log('创建的订单ID:', orderId);

      // 2. 准备订单项数据（确保格式正确）
      const orderItems = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      console.log('准备插入的订单项数据:', orderItems);

      // 3. 插入订单项（修改后的SQL）
      db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES?',
        [orderItems],
        (err, result) => {
          if (err) {
            console.error('插入订单项失败:', err);
            return db.rollback(() => {
              res.status(500).json({ 
                code: 500, 
                message: '插入订单项失败',
                error: err.message 
              });
            });
          }

          console.log('插入订单项结果:', result);

          // 4. 提交事务
          db.commit(err => {
            if (err) {
              console.error('提交事务失败:', err);
              return db.rollback(() => {
                res.status(500).json({ code: 500, message: '提交事务失败' });
              });
            }

            console.log('订单创建成功，受影响行数:', result.affectedRows);
            res.json({ 
              code: 200, 
              data: { 
                orderId,
                orderNo,
                itemsCount: items.length 
              } 
            });
          });
        }
      );
    });
  });
});

// 取消订单
router.post('/:id/cancel', (req, res) => {
  const orderId = req.params.id;
  const userId = req.headers['x-user-id'];

  db.query(
    'UPDATE orders SET status = "cancelled" WHERE id =? AND user_id =?',
    [orderId, userId],
    (err, result) => {
      if (err) {
        console.error('取消订单失败:', err);
        return res.status(500).json({ 
          code: 500, 
          message: '取消订单失败' 
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          code: 404, 
          message: '订单不存在或无权操作' 
        });
      }
      res.json({ code: 200 });
    }
  );
});

// 更新订单状态
router.post('/:id/status', (req, res) => {
  const orderId = req.params.id;
  const userId = req.headers['x-user-id'];
  const { status } = req.body;

  if (!['pending', 'paid', 'shipped', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ 
      code: 400, 
      message: '无效的订单状态' 
    });
  }

  db.query(
    'UPDATE orders SET status =?, paid_at = IF(? = "paid", NOW(), paid_at) WHERE id =? AND user_id =?',
    [status, status, orderId, userId],
    (err, result) => {
      if (err) {
        console.error('更新订单状态失败:', err);
        return res.status(500).json({ 
          code: 500, 
          message: '更新订单状态失败' 
        });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          code: 404, 
          message: '订单不存在或无权操作' 
        });
      }
      res.json({ code: 200 });
    }
  );
});

// 在 module.exports 前添加这个新路由
router.get('/:id', (req, res) => {
  const orderId = req.params.id;
  const userId = req.headers['x-user-id'];

  const sql = `
    SELECT o.*, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'image', p.image,
          'quantity', oi.quantity
        )
      ) AS items,
      a.*
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN addresses a ON o.address_id = a.id
    WHERE o.id = ? AND o.user_id = ?
    GROUP BY o.id
  `;

  db.query(sql, [orderId, userId], (err, results) => {
    if (err) {
      console.error('获取订单详情失败:', err);
      return res.status(500).json({ code: 500, message: '服务器错误' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }

    const order = {
      ...results[0],
      items: JSON.parse(results[0].items)
    };

    res.json({ 
      code: 200, 
      data: order 
    });
  });
});
module.exports = router;    