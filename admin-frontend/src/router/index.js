// admin-frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Login        from '@/views/Login.vue';
import Dashboard    from '@/views/Dashboard.vue';

import ProductList  from '@/views/ProductList.vue';
import ProductForm  from '@/views/ProductForm.vue';

import CategoryList from '@/views/CategoryList.vue';
import CategoryForm from '@/views/CategoryForm.vue';

import OrderList    from '@/views/OrderList.vue';
import OrderDetail  from '@/views/OrderDetail.vue';

import UserList     from '@/views/UserList.vue';
import UserForm     from '@/views/UserForm.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
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
  // 兜底：任意其它路径回到 Dashboard
  {
    path: '/:catchAll(.*)',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    return next();
  }
  const token = localStorage.getItem('admin-token');
  if (!token) {
    return next('/login');
  }
  next();
});

export default router;
