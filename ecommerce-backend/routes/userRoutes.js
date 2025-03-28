const express = require('express');
const logger = require('../logger'); 
const db = require('../db');
const axios = require('axios');
const router = express.Router();

const APPID = 'wx62775bdf040bd1b1';
const SECRET = 'da2a1e23989b683b890be165431fe9ea';

router.post('/', async (req, res) => {
  const { code, nickName, avatarUrl, phoneNumber } = req.body;
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

    if (response.status!== 200) {
      // 明确提示微信接口返回非 200 状态码
      const errorMsg = `微信接口返回非 200 状态码: ${JSON.stringify(response.data)}`;
      console.error(errorMsg);
      return res.status(500).json({ code: 500, message: errorMsg });
    }

    const { openid, session_key } = response.data;

    if (!openid ||!session_key) {
      // 明确提示微信接口返回信息不完整
      const errorMsg = `微信接口返回信息不完整: ${JSON.stringify(response.data)}`;
      console.error(errorMsg);
      return res.status(500).json({ code: 500, message: errorMsg });
    }

    const sql = 'SELECT * FROM users WHERE openid = ?';
    db.query(sql, [openid], (err, result) => {
      if (err) {
        // 明确提示数据库查询出错
        const errorMsg = `数据库查询出错: ${err.message}`;
        console.error(errorMsg);
        return res.status(500).json({ code: 500, message: errorMsg });
      }
      if (result.length > 0) {
        const user = result[0];
        // 更新用户信息
        const updateSql = 'UPDATE users SET nickname = ?, avatar_url = ?, phone = ? WHERE openid = ?';
        db.query(updateSql, [nickName, avatarUrl, phoneNumber, openid], (updateErr) => {
          if (updateErr) {
            // 明确提示用户信息更新出错
            const errorMsg = `用户信息更新出错: ${updateErr.message}`;
            console.error(errorMsg);
            return res.status(500).json({ code: 500, message: errorMsg });
          }
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
        const insertSql = 'INSERT INTO users (openid, nickname, avatar_url, phone) VALUES (?, ?, ?, ?)';
        db.query(insertSql, [openid, nickName, avatarUrl, phoneNumber], (insertErr, insertResult) => {
          if (insertErr) {
            // 明确提示用户注册出错
            const errorMsg = `用户注册出错: ${insertErr.message}`;
            console.error(errorMsg);
            return res.status(500).json({ code: 500, message: errorMsg });
          }
          const userId = insertResult.insertId;
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
    // 捕获通用错误并提示
    const errorMsg = `微信接口调用出错: ${error.message}`;
    console.error(errorMsg);
    res.status(500).json({ code: 500, message: errorMsg });
  }
});

module.exports = router;