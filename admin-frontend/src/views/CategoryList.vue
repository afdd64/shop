<!-- admin-frontend/src/views/CategoryList.vue -->
<template>
  <div>
    <Navbar />
    <Sidebar />

    <div class="container">
      <h2>分类管理</h2>
      <button @click="goAdd" class="btn-add">添加分类</button>

      <table class="table-category">
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in categories" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>
              <button @click="goEdit(item.id)" class="btn-edit">编辑</button>
              <button @click="handleDelete(item.id)" class="btn-delete">删除</button>
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

// 注意：把 getCategories 改为 fetchCategories
import { fetchCategories, deleteCategory } from '@/api/category'

export default {
  name: 'CategoryList',
  components: { Navbar, Sidebar },
  data() {
    return {
      categories: []
    }
  },
  methods: {
    // 修改为 fetchCategories
    fetchCategories() {
      fetchCategories()
        .then(res => {
          // 因为 axios 拦截器已经 return response.data，所以 res 就是后端返回的 data 对象
          this.categories = res
        })
        .catch(err => {
          console.error('获取分类列表失败：', err)
        })
    },
    goAdd() {
      this.$router.push('/categories/add')
    },
    goEdit(id) {
      this.$router.push(`/categories/edit/${id}`)
    },
    handleDelete(id) {
      if (window.confirm('确认删除该分类吗？')) {
        deleteCategory(id)
          .then(() => {
            this.fetchCategories()
          })
          .catch(err => {
            console.error('删除分类失败：', err)
          })
      }
    }
  },
  created() {
    // 初始化时调用 fetchCategories 方法
    this.fetchCategories()
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
.table-category {
  width: 100%;
  border-collapse: collapse;
}
.table-category th,
.table-category td {
  border: 1px solid #ebeef5;
  padding: 8px;
  text-align: left;
}
.table-category th {
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
