// admin-frontend/src/api/order.js
import request from './axios';

export function fetchOrders(params) {
  // params 可以包含 { status: 'pending' }
  return request({
    url: '/orders',
    method: 'get',
    params,
  });
}

export function fetchOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get',
  });
}

export function updateOrderStatus(id, data) {
  return request({
    url: `/orders/${id}`,
    method: 'put',
    data, // { status: 'shipped' }
  });
}
