//ecommerce-backend\routes\userRoutes.js
const express = require('express');
const db = require('../db');
const axios = require('axios');
const router = express.Router();

const APPID = 'wx2cd11b967dc8102f';
const SECRET = '9e74190677a257bcf67478ea0291ef8f';

// 登录接口
router.post('/login', async (req, res) => {
    console.log('接收到登录请求，请求体:', req.body);
    const { code, nickName, avatarUrl } = req.body;
    try {
        console.log('准备调用微信接口，js_code:', code);
        const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
            params: {
                appid: APPID,
                secret: SECRET,
                js_code: code,
                grant_type: 'authorization_code'
            }
        });
        console.log('微信接口返回结果:', response.data);

        if (response.status !== 200) {
            console.error('微信接口返回非 200 状态码:', response.data);
            return res.status(500).json({ code: 500, message: '微信接口调用失败' });
        }

        const { openid, session_key } = response.data;

        if (!openid || !session_key) {
            console.error('微信接口返回信息不完整:', response.data);
            return res.status(500).json({ code: 500, message: '微信接口返回信息不完整' });
        }

        const sql = 'SELECT * FROM users WHERE openid = ?';
        db.query(sql, [openid], (err, result) => {
            if (err) {
                console.error('数据库查询出错:', err);
                return res.status(500).json({ code: 500, message: '数据库查询出错' });
            }
            if (result.length > 0) {
                const user = result[0];
                const updateSql = 'UPDATE users SET nickname = ?, avatar_url = ? WHERE openid = ?';
                db.query(updateSql, [nickName, avatarUrl, openid], (updateErr) => {
                    if (updateErr) {
                        console.error('用户信息更新出错:', updateErr);
                        return res.status(500).json({ code: 500, message: '用户信息更新出错' });
                    }
                    console.log('用户信息更新成功，返回登录结果');
                    res.json({
                        code: 200,
                        userId: user.id,
                        token: session_key,
                        userInfo: {
                            nickName: nickName,
                            avatarUrl: avatarUrl
                        }
                    });
                });
            } else {
                const insertSql = 'INSERT INTO users (openid, nickname, avatar_url) VALUES (?, ?, ?)';
                db.query(insertSql, [openid, nickName, avatarUrl], (insertErr, insertResult) => {
                    if (insertErr) {
                        console.error('用户注册出错:', insertErr);
                        return res.status(500).json({ code: 500, message: '用户注册出错' });
                    }
                    const userId = insertResult.insertId;
                    console.log('用户注册成功，返回登录结果');
                    res.json({
                        code: 200,
                        userId,
                        token: session_key,
                        userInfo: {
                            nickName: nickName,
                            avatarUrl: avatarUrl
                        }
                    });
                });
            }
        });
    } catch (error) {
        console.error('登录过程中出现错误:', error);
        res.status(500).json({ code: 500, message: '登录过程中出现错误' });
    }
});

module.exports = router;