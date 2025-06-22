<!-- admin-frontend/src/App.vue -->
<template>
  <div id="app" class="app-container">
    <Sidebar v-if="showLayout" />

    <div class="main-content">
      <Navbar v-if="showLayout" />

      <div class="content-wrapper">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import Navbar  from '@/components/Navbar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showLayout = computed(() => route.name !== 'Login');
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
}
.app-container {
  display: flex;
  height: 100%;
}
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
