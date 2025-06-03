<template>
  <el-menu
    :default-active="activeMenu"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    router
  >
    <el-menu-item index="/">仪表盘</el-menu-item>
    <el-sub-menu index="products">
      <template #title><i class="el-icon-goods"></i>商品管理</template>
      <el-menu-item index="/products">商品列表</el-menu-item>
      <el-menu-item index="/product/create">新增商品</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="categories">
      <template #title><i class="el-icon-menu"></i>分类管理</template>
      <el-menu-item index="/categories">分类列表</el-menu-item>
      <el-menu-item index="/category/create">新增分类</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/orders"><i class="el-icon-document"></i>订单管理</el-menu-item>
    <el-menu-item index="/users"><i class="el-icon-user"></i>用户管理</el-menu-item>
    <el-menu-item @click="logout"><i class="el-icon-switch-button"></i>退出登录</el-menu-item>
  </el-menu>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'Sidebar',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const activeMenu = route.path;
    const logout = () => {
      localStorage.removeItem('admin-token');
      router.push('/login');
    };
    return { activeMenu, logout };
  },
};
</script>

<style scoped>
.el-menu-vertical-demo {
  width: 200px;
  min-height: 100vh;
}
</style>
