<!-- admin-frontend/src/views/UserList.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>用户管理</h2>
      <button @click="goAdd" class="btn-add">添加用户</button>

      <table class="table-user">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.isActive ? '启用' : '禁用' }}</td>
            <td>
              <button @click="goEdit(user.id)" class="btn-edit">编辑</button>
              <button @click="handleDelete(user.id)" class="btn-delete">删除</button>
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

// 1. 把 getUsers 改为 fetchUsers
// 2. 假设 api/user.js 已经新增了 deleteUser
import { fetchUsers, deleteUser } from '@/api/user'

export default {
  name: 'UserList',
  components: { Navbar, Sidebar },
  data() {
    return {
      users: []
    }
  },
  methods: {
    fetchUsers() {
      fetchUsers()
        .then(res => {
          this.users = res
        })
        .catch(err => {
          console.error('获取用户列表失败：', err)
        })
    },
    goAdd() {
      this.$router.push('/users/add')
    },
    goEdit(id) {
      this.$router.push(`/users/edit/${id}`)
    },
    handleDelete(id) {
      if (window.confirm('确认删除该用户吗？')) {
        deleteUser(id)
          .then(() => {
            this.fetchUsers()
          })
          .catch(err => {
            console.error('删除用户失败：', err)
          })
      }
    }
  },
  created() {
    this.fetchUsers()
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
.btn-add {
  margin-bottom: 12px;
  padding: 6px 12px;
  background-color: #409eff;
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}
.btn-add:hover {
  background-color: #66b1ff;
}
.table-user {
  width: 100%;
  border-collapse: collapse;
}
.table-user th,
.table-user td {
  border: 1px solid #ebeef5;
  padding: 8px;
  text-align: left;
}
.table-user th {
  background-color: #f5f7fa;
}
.btn-edit,
.btn-delete {
  margin-right: 8px;
  padding: 4px 8px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}
.btn-edit {
  background-color: #67c23a;
  color: #fff;
}
.btn-edit:hover {
  background-color: #85ce61;
}
.btn-delete {
  background-color: #f56c6c;
  color: #fff;
}
.btn-delete:hover {
  background-color: #f78989;
}
</style>
