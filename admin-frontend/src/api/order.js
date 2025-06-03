// admin-frontend/src/api/order.js

import request from './axios';

/**
 * 获取订单列表
 * @param {Object} params 可选查询参数，如 { status: 'pending' }
 */
export function fetchOrders(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  });
}

/**
 * 获取单条订单详情
 * @param {number|string} id
 */
export function fetchOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  });
}

/**
 * 更新订单状态
 * @param {number|string} id
 * @param {{ status: string }} data
 */
export function updateOrderStatus(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除订单
 * @param {number|string} id
 */
export function deleteOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'delete'
  });
}
