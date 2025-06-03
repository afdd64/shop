<!-- admin-frontend/src/views/UserForm.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>{{ isEdit ? '编辑用户' : '添加用户' }}</h2>
      <form @submit.prevent="handleSubmit" class="form-user">
        <div class="form-item">
          <label for="username">用户名：</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-item">
          <label for="email">邮箱：</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="请输入邮箱"
          />
        </div>

        <div class="form-item">
          <label for="role">角色：</label>
          <select id="role" v-model="form.role" required>
            <option value="admin">管理员</option>
            <option value="user">普通用户</option>
          </select>
        </div>

        <div class="form-item">
          <label for="isActive">状态：</label>
          <select id="isActive" v-model="form.isActive">
            <option :value="true">启用</option>
            <option :value="false">禁用</option>
          </select>
        </div>

        <!-- 只有新增时需要填写密码 -->
        <div class="form-item" v-if="!isEdit">
          <label for="password">密码：</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="请输入初始密码"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">
            {{ isEdit ? '保存修改' : '创建用户' }}
          </button>
          <button @click="goBack" type="button" class="btn-cancel">
            取消
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

// 1. 把 getUser 改为 fetchUser
// 2. 把 updateUser 改为 updateUser（前提：api/user.js 已新增 updateUser）
// 3. createUser 名称本来就是一样的
import {
  fetchUser,
  createUser,
  updateUser
} from '@/api/user'

export default {
  name: 'UserForm',
  components: { Navbar, Sidebar },
  data() {
    return {
      form: {
        username: '',
        email: '',
        role: 'user',
        isActive: true,
        password: ''
      },
      isEdit: false
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        // 编辑模式：这里只更新 username、email、role、isActive（不改密码）
        const payload = {
          username: this.form.username,
          email: this.form.email,
          role: this.form.role,
          isActive: this.form.isActive
        }
        updateUser(this.$route.params.id, payload)
          .then(() => {
            this.$router.push('/users')
          })
          .catch(err => {
            console.error('更新用户失败：', err)
          })
      } else {
        // 新增模式：连同密码一起提交
        createUser(this.form)
          .then(() => {
            this.$router.push('/users')
          })
          .catch(err => {
            console.error('创建用户失败：', err)
          })
      }
    },
    fetchUser() {
      const id = this.$route.params.id
      fetchUser(id)
        .then(res => {
          // 获取到 { id, username, email, role, isActive } 等
          this.form = { ...res, password: '' }
        })
        .catch(err => {
          console.error('获取用户详情失败：', err)
        })
    },
    goBack() {
      this.$router.push('/users')
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.fetchUser()
    }
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
.form-user {
  max-width: 500px;
}
.form-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}
.form-item label {
  width: 80px;
}
.form-item input,
.form-item select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
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
  background-color: #409eff;
}
.btn-submit:hover {
  background-color: #66b1ff;
}
.btn-cancel {
  background-color: #909399;
}
.btn-cancel:hover {
  background-color: #a6a9ad;
}
</style>
