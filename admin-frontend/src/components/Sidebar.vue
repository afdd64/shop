<!-- admin-frontend/src/components/Sidebar.vue -->
<template>
  <aside class="sidebar">
    <div class="sidebar-title">商家后台</div>

    <ul class="menu">
      <li class="menu-item">
        <router-link to="/" class="menu-link" exact-active-class="active">
          仪表盘
        </router-link>
      </li>

      <li class="menu-item has-children">
        <a href="javascript:;" @click.prevent="toggleMenu('product')" class="menu-link">
          商品管理
          <span class="arrow" :class="{ open: open.product }">›</span>
        </a>
        <ul v-show="open.product" class="submenu">
          <li>
            <router-link to="/products" class="submenu-link" active-class="active">
              商品列表
            </router-link>
          </li>
          <li>
            <router-link to="/products/add" class="submenu-link" active-class="active">
              新增商品
            </router-link>
          </li>
        </ul>
      </li>

      <li class="menu-item has-children">
        <a href="javascript:;" @click.prevent="toggleMenu('category')" class="menu-link">
          分类管理
          <span class="arrow" :class="{ open: open.category }">›</span>
        </a>
        <ul v-show="open.category" class="submenu">
          <li>
            <router-link to="/categories" class="submenu-link" active-class="active">
              分类列表
            </router-link>
          </li>
          <li>
            <router-link to="/categories/add" class="submenu-link" active-class="active">
              新增分类
            </router-link>
          </li>
        </ul>
      </li>

      <li class="menu-item">
        <router-link to="/orders" class="menu-link" active-class="active">
          订单管理
        </router-link>
      </li>

      <li class="menu-item">
        <router-link to="/users" class="menu-link" active-class="active">
          用户管理
        </router-link>
      </li>

      <li class="menu-item">
        <a href="javascript:;" class="menu-link" @click.prevent="logout">
          退出登录
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const open = reactive({ product: false, category: false });

function toggleMenu(menuKey) {
  open[menuKey] = !open[menuKey];
}

function logout() {
  localStorage.removeItem('admin-token');
  localStorage.removeItem('admin-user');
  router.push('/login');
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #2d3a4b;
  color: #fff;
  height: 100%;
  overflow-y: auto;
}
.sidebar-title {
  padding: 20px;
  font-size: 1.2rem;
  text-align: center;
  background-color: #1f2a36;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}
.menu-item {
  position: relative;
}
.menu-link {
  display: block;
  padding: 12px 20px;
  color: #cfd8dc;
  text-decoration: none;
  cursor: pointer;
}
.menu-link:hover,
.menu-link.active {
  background-color: #1f2a36;
  color: #fff;
}
.has-children .arrow {
  float: right;
  transition: transform 0.2s;
}
.has-children .arrow.open {
  transform: rotate(90deg);
}
.submenu {
  list-style: none;
  padding-left: 20px;
  background-color: #32414b;
}
.submenu li {
  margin: 0;
}
.submenu-link {
  display: block;
  padding: 8px 20px;
  color: #b0bec5;
  text-decoration: none;
}
.submenu-link:hover,
.submenu-link.active {
  background-color: #1f2a36;
  color: #fff;
}
</style>
