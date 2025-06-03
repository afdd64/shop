<!-- admin-frontend/src/App.vue -->
<template>
  <div id="app">
    <!-- 1. 顶部导航 -->
    <Navbar />

    <div class="layout">
      <!-- 2. 左侧侧边栏 -->
      <Sidebar />

      <!-- 3. 右侧主内容区：路由渲染位置 -->
      <main class="main-content">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'App',
  components: { Navbar, Sidebar }
}
</script>

<style>
/* 简单布局，仅作示例 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
}
.layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}
</style>
