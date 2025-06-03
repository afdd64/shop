// admin-frontend/src/api/axios.js
import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const service = axios.create({
  baseURL: 'http://localhost:4000/api', // 后端接口基础地址
  timeout: 5000,
});

// 请求拦截：加上 JWT Token
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截：根据状态码处理
service.interceptors.response.use(
  (response) => {
    return response.data; // 直接返回接口的数据部分
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        ElMessage.error('身份验证失败，请重新登录');
        localStorage.removeItem('admin-token');
        router.push('/login');
      } else if (status === 403) {
        ElMessage.error('权限不足');
      } else {
        ElMessage.error(error.response.data.message || '接口请求失败');
      }
    } else {
      ElMessage.error('网络错误，请稍后重试');
    }
    return Promise.reject(error);
  }
);

export default service;
