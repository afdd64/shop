// admin-frontend/src/api/dashboard.js

import axios from './axios'

// 获取后台概览统计数据
export function getDashboardStats() {
  return axios.get('/dashboard')
}
