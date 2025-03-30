const express = require('express');
const router = express.Router();
const db = require('../db');
const winston = require('winston');

// 配置日志记录器
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ filename: 'logs/address.log' })
  ]
});

// 获取地址列表
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'];
  
  logger.info(`Fetching address list for userId: ${userId}`);

  db.query(
    'SELECT * FROM addresses WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        logger.error(`Database error while fetching addresses: ${err.message}`);
        return res.status(500).json({ code: 500, message: '数据库错误' });
      }
      logger.info(`Successfully fetched ${results.length} address(es) for userId: ${userId}`);
      res.json({ code: 200, data: results });
    }
  );
});

// 创建地址
router.post('/', (req, res) => {
  const address = { ...req.body, user_id: req.headers['x-user-id'] };
  // 移除可能存在的 created_at 和 updated_at 字段
  delete address.created_at;
  delete address.updated_at;

  logger.info(`Creating address for userId: ${address.user_id}, name: ${address.name}`);

  db.query('INSERT INTO addresses SET ?', address, (err, result) => {
    if (err) {
      logger.error(`Error while creating address: ${err.message}`);
      return res.status(500).json({ code: 500, message: '创建失败' });
    }
    logger.info(`Address created successfully with ID: ${result.insertId}`);
    res.json({ code: 200, data: result.insertId });
  });
});

// 获取单个地址
router.get('/:id', (req, res) => {
  const addressId = req.params.id;
  const userId = req.headers['x-user-id'];

  logger.info(`Fetching address with ID: ${addressId} for userId: ${userId}`);

  db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId], (err, results) => {
    if (err) {
      logger.error(`Database error while fetching address: ${err.message}`);
      return res.status(500).json({ code: 500, message: '数据库错误' });
    }
    if (results.length === 0) {
      logger.warn(`Address with ID: ${addressId} not found or not owned by userId: ${userId}`);
      return res.status(404).json({ code: 404, message: '地址不存在或不属于当前用户' });
    }

    logger.info(`Successfully fetched address with ID: ${addressId}`);
    res.json({ code: 200, data: results[0] });
  });
});

// 更新地址 (PUT 路由)
router.put('/:id', (req, res) => {
  const addressId = req.params.id;
  const userId = req.headers['x-user-id'];
  const updatedAddress = req.body;
  // 移除可能存在的 created_at 和 updated_at 字段
  delete updatedAddress.created_at;
  delete updatedAddress.updated_at;

  logger.info(`Attempting to update address with ID: ${addressId} for userId: ${userId}`);

  db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId], (err, results) => {
    if (err) {
      logger.error(`Database error while checking address before updating: ${err.message}`);
      return res.status(500).json({ code: 500, message: '数据库错误' });
    }
    if (results.length === 0) {
      logger.warn(`Address with ID: ${addressId} not found or not owned by userId: ${userId}`);
      return res.status(404).json({ code: 404, message: '地址不存在或不属于当前用户' });
    }

    logger.info(`Updating address with ID: ${addressId}`);

    db.query('UPDATE addresses SET ? WHERE id = ? AND user_id = ?', [updatedAddress, addressId, userId], (err, result) => {
      if (err) {
        logger.error(`Error while updating address: ${err.message}`);
        return res.status(500).json({ code: 500, message: '更新失败' });
      }

      logger.info(`Successfully updated address with ID: ${addressId} for userId: ${userId}`);
      res.json({ code: 200, message: '地址更新成功' });
    });
  });
});

// 删除地址
router.delete('/:id', (req, res) => {
  const addressId = req.params.id;
  const userId = req.headers['x-user-id'];

  logger.info(`Attempting to delete address with ID: ${addressId} for userId: ${userId}`);

  // 检查地址是否属于当前用户
  db.query('SELECT * FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId], (err, results) => {
    if (err) {
      logger.error(`Database error while checking address before deletion: ${err.message}`);
      return res.status(500).json({ code: 500, message: '数据库错误' });
    }
    if (results.length === 0) {
      logger.warn(`Address with ID: ${addressId} not found or not owned by userId: ${userId}`);
      return res.status(404).json({ code: 404, message: '地址不存在或不属于当前用户' });
    }

    // 删除地址
    db.query('DELETE FROM addresses WHERE id = ? AND user_id = ?', [addressId, userId], (err, result) => {
      if (err) {
        logger.error(`Error while deleting address: ${err.message}`);
        return res.status(500).json({ code: 500, message: '删除失败' });
      }

      logger.info(`Successfully deleted address with ID: ${addressId} for userId: ${userId}`);
      res.json({ code: 200, message: '地址删除成功' });
    });
  });
});

module.exports = router;    