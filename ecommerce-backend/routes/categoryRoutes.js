// shop/ecommerce-backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// 获取所有分类
router.get('/', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            console.error('查询分类失败:', err);
            return res.status(500).json({ code: 500, message: '数据库错误' });
        }
        res.json({ code: 200, categories: results });
    });
});

// 根据分类 ID 获取分类信息
router.get('/:id', (req, res) => {
    const categoryId = req.params.id;
    db.query('SELECT * FROM categories WHERE id = ?', [categoryId], (err, results) => {
        if (err) {
            console.error('查询分类失败:', err);
            return res.status(500).json({ code: 500, message: '数据库错误' });
        }
        if (results.length === 0) {
            return res.status(404).json({ code: 404, message: '未找到该分类' });
        }
        res.json({ code: 200, category: results[0] });
    });
});

module.exports = router;