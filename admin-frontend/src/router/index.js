// admin-frontend/src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';

// —— 引入所有页面组件 ——
// （如果文件路径不同，请根据自己项目结构相应调整）
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';

import ProductList from '@/views/ProductList.vue';
import ProductForm from '@/views/ProductForm.vue';

import CategoryList from '@/views/CategoryList.vue';
import CategoryForm from '@/views/CategoryForm.vue';

import OrderList from '@/views/OrderList.vue';
import OrderDetail from '@/views/OrderDetail.vue';

import UserList from '@/views/UserList.vue';
import UserForm from '@/views/UserForm.vue';

const routes = [
  // 登录页（无需 token）
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // 仪表盘：根路径 默认渲染 Dashboard
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },

  // 商品管理
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/products/add',
    name: 'ProductAdd',
    component: ProductForm
  },
  {
    path: '/products/edit/:id',
    name: 'ProductEdit',
    component: ProductForm
  },

  // 分类管理
  {
    path: '/categories',
    name: 'CategoryList',
    component: CategoryList
  },
  {
    path: '/categories/add',
    name: 'CategoryAdd',
    component: CategoryForm
  },
  {
    path: '/categories/edit/:id',
    name: 'CategoryEdit',
    component: CategoryForm
  },

  // 订单管理
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail
  },

  // 用户管理
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/users/add',
    name: 'UserAdd',
    component: UserForm
  },
  {
    path: '/users/edit/:id',
    name: 'UserEdit',
    component: UserForm
  },

  // 其余任意路径，统一重定向到仪表盘（可选，避免 404）
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

/**
 * 全局前置守卫
 *  - 如果访问的路由不是 /login，且 localStorage 中不存在 token，就跳到 /login
 *  - 否则放行。
 */
router.beforeEach((to, from, next) => {
  // 始终允许访问登录页
  if (to.path === '/login') {
    return next();
  }

  // 如果访问其他页面，先检查 token
  const token = localStorage.getItem('admin-token');
  if (!token) {
    // 没有 token，就重定向到登录
    return next('/login');
  }
  // 已经登录，放行
  next();
});

export default router;
