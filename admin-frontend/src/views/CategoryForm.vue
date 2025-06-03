<!-- admin-frontend/src/views/CategoryForm.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>{{ isEdit ? '编辑分类' : '添加分类' }}</h2>
      <form @submit.prevent="handleSubmit" class="form-category">
        <div class="form-item">
          <label for="name">名称：</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="请输入分类名称"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit">
            {{ isEdit ? '保存修改' : '创建分类' }}
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

// 1. 把 getCategory 改为 fetchCategory
// 2. createCategory/updateCategory 本身名称没变
import {
  fetchCategory,
  createCategory,
  updateCategory
} from '@/api/category'

export default {
  name: 'CategoryForm',
  components: { Navbar, Sidebar },
  data() {
    return {
      form: {
        name: ''
      },
      isEdit: false
    }
  },
  methods: {
    handleSubmit() {
      if (this.isEdit) {
        updateCategory(this.$route.params.id, this.form)
          .then(() => {
            this.$router.push('/categories')
          })
          .catch(err => {
            console.error('更新分类失败：', err)
          })
      } else {
        createCategory(this.form)
          .then(() => {
            this.$router.push('/categories')
          })
          .catch(err => {
            console.error('创建分类失败：', err)
          })
      }
    },
    fetchCategory() {
      const id = this.$route.params.id
      fetchCategory(id)
        .then(res => {
          this.form = res
        })
        .catch(err => {
          console.error('获取分类详情失败：', err)
        })
    },
    goBack() {
      this.$router.push('/categories')
    }
  },
  created() {
    const id = this.$route.params.id
    if (id) {
      this.isEdit = true
      this.fetchCategory()
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
.form-category {
  max-width: 400px;
}
.form-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}
.form-item label {
  width: 60px;
}
.form-item input {
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
}
.btn-submit {
  background-color: #409eff;
  margin-right: 12px;
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
