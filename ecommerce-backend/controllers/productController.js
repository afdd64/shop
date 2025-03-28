const db = require('../db');

// 假设图片存储的基础路径
const imageBaseUrl = 'http://localhost:3000/static/images/';

// 获取商品列表
exports.getProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: '数据库查询失败' });
        } else {
            // 为每个商品添加图片的完整访问路径
            const productsWithImageUrl = result.map(product => {
                return {
                    ...product,
                    image: product.image ? `${imageBaseUrl}${product.image}` : null
                };
            });
            res.json(productsWithImageUrl); // 返回带有图片路径的商品列表
        }
    });
};

// 获取商品详情
exports.getProductById = (req, res) => {
    const productId = req.params.id;
    const sql = `SELECT * FROM products WHERE id = ${productId}`;
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ error: '数据库查询失败' });
        } else if (result.length === 0) {
            res.status(404).json({ error: '商品不存在' });
        } else {
            const product = result[0];
            // 为商品添加图片的完整访问路径
            const productWithImageUrl = {
                ...product,
                image: product.image ? `${imageBaseUrl}${product.image}` : null
            };
            res.json(productWithImageUrl); // 返回带有图片路径的商品详情
        }
    });
};