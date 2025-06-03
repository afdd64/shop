// admin-frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';

// 商品
import ProductList from '@/views/ProductList.vue';
import ProductForm from '@/views/ProductForm.vue';

// 分类
import CategoryList from '@/views/CategoryList.vue';
import CategoryForm from '@/views/CategoryForm.vue';

// 订单
import OrderList from '@/views/OrderList.vue';
import OrderDetail from '@/views/OrderDetail.vue';

// 用户
import UserList from '@/views/UserList.vue';
import UserForm from '@/views/UserForm.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    // 在 Dashboard 内部通过 <router-view> 显示子路由
    children: [
      {
        path: '/products',
        name: 'ProductList',
        component: ProductList,
      },
      {
        path: '/product/create',
        name: 'ProductCreate',
        component: ProductForm,
      },
      {
        path: '/product/edit/:id',
        name: 'ProductEdit',
        component: ProductForm,
        props: true,
      },
      {
        path: '/categories',
        name: 'CategoryList',
        component: CategoryList,
      },
      {
        path: '/category/create',
        name: 'CategoryCreate',
        component: CategoryForm,
      },
      {
        path: '/category/edit/:id',
        name: 'CategoryEdit',
        component: CategoryForm,
        props: true,
      },
      {
        path: '/orders',
        name: 'OrderList',
        component: OrderList,
      },
      {
        path: '/order/:id',
        name: 'OrderDetail',
        component: OrderDetail,
        props: true,
      },
      {
        path: '/users',
        name: 'UserList',
        component: UserList,
      },
      {
        path: '/user/create',
        name: 'UserCreate',
        component: UserForm,
      },
      {
        path: '/user/edit/:id',
        name: 'UserEdit',
        component: UserForm,
        props: true,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 全局前置守卫：检查登录态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('admin-token');
  if (to.path !== '/login' && !token) {
    return next('/login');
  }
  next();
});

export default router;
