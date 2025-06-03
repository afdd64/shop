// admin-frontend/src/api/auth.js

import request from './axios';

/**
 * 登录
 * @param {{ username: string, password: string }} params
 * @returns {Promise<{ token: string, user: { id: number, username: string, role: string } }>}
 */
export function login(params) {
  // 对应后端 POST /api/auth/login
  return request({
    url: '/auth/login',
    method: 'post',
    data: params,
  });
}

/**
 * 获取用户信息
 * @returns {Promise<{ id: number, username: string, role: string }>}
 *
 * 如果后端实现了 GET /api/auth/userinfo，则直接调用；否则可从 localStorage 里读取
 */
export function getInfo() {
  return request({
    url: '/auth/userinfo',
    method: 'get',
  });
}

/**
 * 退出登录
 * @returns {Promise<void>}
 *
 * 对应后端 POST /api/auth/logout（可选，如果后端未实现可在前端直接清除 localStorage）
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post',
  });
}
