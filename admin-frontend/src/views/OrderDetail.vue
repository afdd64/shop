<!-- admin-frontend/src/views/OrderDetail.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container" v-if="order">
      <h2>订单详情（ID: {{ order.id }}）</h2>

      <div class="order-info">
        <p><strong>用户：</strong> {{ order.userName }}</p>
        <p><strong>下单时间：</strong> {{ formatDate(order.createdAt) }}</p>
        <p><strong>总金额：</strong> ¥ {{ order.totalAmount }}</p>
        <p><strong>状态：</strong>
          <select v-model="order.status">
            <option value="待支付">待支付</option>
            <option value="待发货">待发货</option>
            <option value="已发货">已发货</option>
            <option value="已完成">已完成</option>
            <option value="已取消">已取消</option>
          </select>
        </p>
      </div>

      <h3>商品项</h3>
      <table class="table-items">
        <thead>
          <tr>
            <th>商品名</th>
            <th>数量</th>
            <th>单价</th>
            <th>小计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.items" :key="item.productId">
            <td>{{ item.productName }}</td>
            <td>{{ item.quantity }}</td>
            <td>¥ {{ item.price }}</td>
            <td>¥ {{ (item.price * item.quantity).toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="form-actions">
        <button @click="updateStatus" class="btn-submit">保存修改</button>
        <button @click="goBack" class="btn-cancel">返回列表</button>
      </div>
    </div>
    <div v-else class="loading">正在加载订单详情...</div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

// 把 getOrder 改为 fetchOrder
// 把 updateOrder 改为 updateOrderStatus
import { fetchOrder, updateOrderStatus } from '@/api/order'

export default {
  name: 'OrderDetail',
  components: { Navbar, Sidebar },
  data() {
    return {
      order: null
    }
  },
  methods: {
    fetchOrderData() {
      const id = this.$route.params.id
      fetchOrder(id)
        .then(res => {
          this.order = res
        })
        .catch(err => {
          console.error('获取订单详情失败：', err)
        })
    },
    updateStatus() {
      updateOrderStatus(this.order.id, { status: this.order.status })
        .then(() => {
          this.$router.push('/orders')
        })
        .catch(err => {
          console.error('更新订单状态失败：', err)
        })
    },
    goBack() {
      this.$router.push('/orders')
    },
    formatDate(timestamp) {
      const d = new Date(timestamp)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ` +
             `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    }
  },
  created() {
    this.fetchOrderData()
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
.order-info p {
  margin-bottom: 8px;
}
.table-items {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}
.table-items th,
.table-items td {
  border: 1px solid #ebeef5;
  padding: 8px;
  text-align: left;
}
.table-items th {
  background-color: #f5f7fa;
}
.form-actions {
  margin-top: 20px;
}
.btn-submit,
.btn-cancel {
  padding: 6px 14px;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 12px;
}
.btn-submit {
  background-color: #67c23a;
}
.btn-submit:hover {
  background-color: #85ce61;
}
.btn-cancel {
  background-color: #909399;
}
.btn-cancel:hover {
  background-color: #a6a9ad;
}
.loading {
  padding: 20px;
  text-align: center;
}
</style>
