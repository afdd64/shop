// admin-frontend/src/api/product.js

import request from './axios';

/**
 * 获取商品列表
 * @param {Object} params 可选查询参数
 */
export function fetchProducts(params) {
  return request({
    url: '/products',
    method: 'get',
    params
  });
}

/**
 * 获取单个商品详情
 * @param {number|string} id
 */
export function fetchProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  });
}

/**
 * 创建新商品
 * @param {Object} data 商品信息，如 { name, price, categoryId, ... }
 */
export function createProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  });
}

/**
 * 更新商品
 * @param {number|string} id
 * @param {Object} data 更新字段
 */
export function updateProduct(id, data) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品
 * @param {number|string} id
 */
export function deleteProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  });
}
