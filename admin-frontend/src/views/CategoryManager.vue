<template>
  <div>
    <el-card>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2>分类管理</h2>
        <el-button type="primary" @click="dialogVisible = true">添加分类</el-button>
      </div>

      <el-table :data="categories" style="width: 100%;" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button size="small" @click="editCategory(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加/编辑对话框 -->
      <el-dialog :title="isEdit ? '编辑分类' : '添加分类'" v-model="dialogVisible">
        <el-form :model="form">
          <el-form-item label="分类名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitCategory">确定</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const categories = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, name: '', description: '' })

const fetchCategories = async () => {
  const res = await axios.get('http://localhost:4000/api/categories')
  categories.value = res.data
}

const submitCategory = async () => {
  if (isEdit.value) {
    await axios.put(`http://localhost:4000/api/categories/${form.value.id}`, form.value)
  } else {
    await axios.post('http://localhost:4000/api/categories', form.value)
  }
  dialogVisible.value = false
  fetchCategories()
}

const editCategory = (category) => {
  form.value = { ...category }
  isEdit.value = true
  dialogVisible.value = true
}

const deleteCategory = async (id) => {
  await axios.delete(`http://localhost:4000/api/categories/${id}`)
  fetchCategories()
}

onMounted(() => {
  fetchCategories()
})
</script>
