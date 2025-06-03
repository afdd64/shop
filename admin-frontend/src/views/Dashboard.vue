<template>
  <div>
    <!-- 导航栏和侧边栏 -->
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>后台概览</h2>
      <div class="stats-cards">
        <div class="card">
          <h3>用户总数</h3>
          <p>{{ stats.usersCount }}</p>
        </div>
        <div class="card">
          <h3>订单总数</h3>
          <p>{{ stats.ordersCount }}</p>
        </div>
        <div class="card">
          <h3>商品总数</h3>
          <p>{{ stats.productsCount }}</p>
        </div>
        <div class="card">
          <h3>今日销售额</h3>
          <p>¥ {{ stats.todaySales }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { getDashboardStats } from '@/api/dashboard' // 需要在 src/api/ 下创建对应接口

export default {
  name: 'Dashboard',
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      stats: {
        usersCount: 0,
        ordersCount: 0,
        productsCount: 0,
        todaySales: 0
      }
    }
  },
  methods: {
    fetchStats() {
      getDashboardStats()
        .then(res => {
          // 假设后端返回 { data: { usersCount, ordersCount, productsCount, todaySales } }
          this.stats = res.data
        })
        .catch(err => {
          console.error('获取统计数据失败：', err)
        })
    }
  },
  created() {
    this.fetchStats()
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #fff;
}
h2 {
  margin-bottom: 20px;
}
.stats-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  flex: 1 1 200px;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.card h3 {
  margin-bottom: 12px;
  font-size: 1.1rem;
}
.card p {
  font-size: 1.8rem;
  font-weight: bold;
}
</style>
