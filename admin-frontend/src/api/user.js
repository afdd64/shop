// admin-frontend/src/api/user.js
import request from './axios';

export function fetchUsers() {
  return request({
    url: '/users',
    method: 'get',
  });
}

export function fetchUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'get',
  });
}

export function updateUserStatus(id, data) {
  return request({
    url: `/users/${id}/status`,
    method: 'put',
    data, // { status: 0 } 或 { status: 1 }
  });
}

export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data, // { username, password, email, role, status }
  });
}
