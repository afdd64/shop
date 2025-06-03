<!-- admin-frontend/src/views/ProductList.vue -->
<template>
  <div>
    <el-card shadow="hover" class="box-card">
      <div slot="header" class="clearfix">
        <span>商品列表</span>
        <el-button type="primary" size="small" @click="goCreate" style="float: right;">
          新增商品
        </el-button>
      </div>
      <el-table
        :data="products"
        style="width: 100%"
        border
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="price" label="价格" width="100" />
        <el-table-column prop="category_name" label="分类" width="120" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              type="primary"
              size="mini"
              @click="goEdit(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchProducts, deleteProduct } from '@/api/product';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';

export default {
  name: 'ProductList',
  setup() {
    const router = useRouter();
    const products = ref([]);
    const loading = ref(false);

    const loadData = async () => {
      loading.value = true;
      try {
        products.value = await fetchProducts();
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadData);

    const goCreate = () => {
      router.push('/product/create');
    };

    const goEdit = (id) => {
      router.push(`/product/edit/${id}`);
    };

    const handleDelete = (id) => {
      ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
        type: 'warning',
      })
        .then(async () => {
          try {
            await deleteProduct(id);
            ElMessage.success('删除成功');
            await loadData();
          } catch (err) {
            console.error(err);
          }
        })
        .catch(() => {});
    };

    return {
      products,
      loading,
      goCreate,
      goEdit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.box-card {
  margin: 16px;
}
</style>
