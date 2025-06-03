<template>
  <div>
    <el-card>
      <h2>订单管理</h2>
      <el-table :data="orders" style="width: 100%;" border>
        <el-table-column prop="id" label="订单编号" width="100" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="totalPrice" label="总价 (元)" />
        <el-table-column prop="status" label="状态" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteOrder(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 订单详情 -->
    <el-dialog title="订单详情" v-model="detailDialogVisible" width="50%">
      <el-table :data="selectedOrder.items || []" border>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="price" label="价格" />
      </el-table>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orders = ref([])
const selectedOrder = ref({})
const detailDialogVisible = ref(false)

const fetchOrders = async () => {
  const res = await axios.get('http://localhost:4000/api/orders')
  orders.value = res.data
}

const viewDetail = (order) => {
  selectedOrder.value = order
  detailDialogVisible.value = true
}

const deleteOrder = async (id) => {
  await axios.delete(`http://localhost:4000/api/orders/${id}`)
  fetchOrders()
}

onMounted(() => {
  fetchOrders()
})
</script>
