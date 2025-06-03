<template>
  <div class="navbar">
    <div class="logo">商家后台</div>
    <div class="user-info">
      欢迎，{{ username }}
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    // 从 localStorage 中取出当前登录用户名（可在登录时存进去）
    const username = computed(() => {
      try {
        const user = JSON.parse(localStorage.getItem('admin-user'));
        return user ? user.username : '';
      } catch {
        return '';
      }
    });
    return { username };
  },
};
</script>

<style scoped>
.navbar {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #ebeef5;
  justify-content: space-between;
}
.logo {
  font-size: 20px;
  font-weight: bold;
}
.user-info {
  font-size: 14px;
}
</style>
