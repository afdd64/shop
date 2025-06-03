<!-- admin-frontend/src/views/OrderList.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>订单管理</h2>

      <table class="table-order">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户</th>
            <th>总金额</th>
            <th>状态</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.userName }}</td>
            <td>¥ {{ order.totalAmount }}</td>
            <td>{{ order.status }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button @click="viewDetail(order.id)" class="btn-detail">详情</button>
              <button @click="handleDelete(order.id)" class="btn-delete">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

// 1. 把 getOrders 改为 fetchOrders
// 2. 假设后台补齐了 deleteOrder 接口，否则得改成 updateOrderStatus(...)
import { fetchOrders, deleteOrder } from '@/api/order'

export default {
  name: 'OrderList',
  components: { Navbar, Sidebar },
  data() {
    return {
      orders: []
    }
  },
  methods: {
    fetchOrders() {
      fetchOrders() // 可传 params，例如 { status: 'pending' }
        .then(res => {
          this.orders = res
        })
        .catch(err => {
          console.error('获取订单列表失败：', err)
        })
    },
    viewDetail(id) {
      this.$router.push(`/orders/${id}`)
    },
    handleDelete(id) {
      if (window.confirm('确认删除该订单吗？')) {
        deleteOrder(id)
          .then(() => {
            this.fetchOrders()
          })
          .catch(err => {
            console.error('删除订单失败：', err)
          })
      }
    },
    formatDate(timestamp) {
      const d = new Date(timestamp)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ` +
             `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
  },
  created() {
    this.fetchOrders()
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background-color: #fff;
}
h2 {
  margin-bottom: 16px;
}
.table-order {
  width: 100%;
  border-collapse: collapse;
}
.table-order th,
.table-order td {
  border: 1px solid #ebeef5;
  padding: 8px;
  text-align: left;
}
.table-order th {
  background-color: #f5f7fa;
}
.btn-detail,
.btn-delete {
  margin-right: 8px;
  padding: 4px 8px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.btn-detail {
  background-color: #409eff;
  color: #fff;
}
.btn-detail:hover {
  background-color: #66b1ff;
}
.btn-delete {
  background-color: #f56c6c;
  color: #fff;
}
.btn-delete:hover {
  background-color: #f78989;
}
</style>
