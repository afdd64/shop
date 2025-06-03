<template>
  <div>
    <el-card>
      <h2>用户管理</h2>
      <el-table :data="users" style="width: 100%;" border>
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="编辑用户" v-model="dialogVisible">
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const dialogVisible = ref(false)
const form = ref({ id: null, username: '', email: '', role: 'user' })

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:4000/api/users')
  users.value = res.data
}

const editUser = (user) => {
  form.value = { ...user }
  dialogVisible.value = true
}

const updateUser = async () => {
  await axios.put(`http://localhost:4000/api/users/${form.value.id}`, form.value)
  dialogVisible.value = false
  fetchUsers()
}

const deleteUser = async (id) => {
  await axios.delete(`http://localhost:4000/api/users/${id}`)
  fetchUsers()
}

onMounted(() => {
  fetchUsers()
})
</script>
