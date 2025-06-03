// admin-frontend/src/api/user.js

import request from './axios';

/**
 * 获取用户列表
 * @param {Object} params 可选查询参数
 */
export function fetchUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  });
}

/**
 * 获取单个用户信息
 * @param {number|string} id
 */
export function fetchUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  });
}

/**
 * 更新用户（除密码以外的字段，如 username、email、role、isActive 等）
 * @param {number|string} id
 * @param {Object} data e.g. { username, email, role, isActive }
 */
export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  });
}

/**
 * 修改用户状态（如果后端单独提供 /users/:id/status 接口，也可改用一个独立函数；视后端实际而定）
 * @param {number|string} id
 * @param {{ status: number }} data
 */
export function updateUserStatus(id, data) {
  return request({
    url: `/users/${id}/status`,
    method: 'put',
    data
  });
}

/**
 * 创建新用户
 * @param {Object} data e.g. { username, password, email, role, isActive }
 */
export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  });
}

/**
 * 删除用户
 * @param {number|string} id
 */
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  });
}
