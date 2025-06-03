<!-- admin-frontend/src/App.vue -->
<template>
  <div id="app" class="app-container">
    <Sidebar v-if="showSidebar" />
    <div class="main-content">
      <Navbar />
      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue';
import Navbar from '@/components/Navbar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    Sidebar,
    Navbar,
  },
  setup() {
    const route = useRoute();
    // 在登录页不展示 Sidebar 和 Navbar
    const showSidebar = computed(() => route.path !== '/login');
    return { showSidebar };
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}
.app-container {
  display: flex;
  height: 100%;
}
/* 侧边栏宽度固定 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content-wrapper {
  padding: 16px;
  background-color: #f5f7fa;
  flex: 1;
  overflow-y: auto;
}
</style>
