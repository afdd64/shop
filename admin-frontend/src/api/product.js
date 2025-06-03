// admin-frontend/src/api/category.js
import request from './axios';

export function fetchCategories() {
  return request({
    url: '/categories',
    method: 'get',
  });
}

export function fetchCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: 'get',
  });
}

export function createCategory(data) {
  return request({
    url: '/categories',
    method: 'post',
    data,
  });
}

export function updateCategory(id, data) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data,
  });
}

export function deleteCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete',
  });
}
