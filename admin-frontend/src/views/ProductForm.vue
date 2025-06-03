<!-- admin-frontend/src/views/ProductForm.vue -->
<template>
  <div>
    <el-card shadow="hover" class="box-card">
      <span slot="header">
        {{ isEdit ? '编辑商品' : '新增商品' }}
      </span>
      <el-form :model="form" :rules="rules" ref="productForm" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :step="0.01" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
        <el-form-item label="分类" prop="category_id">
          <el-select v-model="form.category_id" placeholder="请选择分类">
            <el-option
              v-for="c in categories"
              :key="c.id"
              :label="c.name"
              :value="c.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图片链接" prop="image_url">
          <el-input v-model="form.image_url" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input type="textarea" v-model="form.description" rows="4" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">
            保存
          </el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  fetchCategories
} from '@/api/category';
import {
  fetchProduct,
  createProduct,
  updateProduct
} from '@/api/product';
import { ElMessage } from 'element-plus';

export default {
  name: 'ProductForm',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEdit = computed(() => !!route.params.id);
    const productForm = ref(null);
    const form = reactive({
      name: '',
      price: 0.0,
      stock: 0,
      category_id: null,
      status: 1,
      image_url: '',
      description: '',
    });
    const rules = {
      name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
      price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    };

    const categories = ref([]);

    // 加载所有分类
    const loadCategories = async () => {
      try {
        categories.value = await fetchCategories();
      } catch (err) {
        console.error(err);
      }
    };

    // 如果是编辑态，加载单个商品数据
    const loadProduct = async () => {
      if (isEdit.value) {
        try {
          const data = await fetchProduct(route.params.id);
          Object.assign(form, {
            name: data.name,
            price: data.price,
            stock: data.stock,
            category_id: data.category_id,
            status: data.status,
            image_url: data.image_url,
            description: data.description,
          });
        } catch (err) {
          console.error(err);
        }
      }
    };

    onMounted(async () => {
      await loadCategories();
      await loadProduct();
    });

    const submitForm = () => {
      productForm.value.validate(async (valid) => {
        if (valid) {
          try {
            if (isEdit.value) {
              await updateProduct(route.params.id, form);
              ElMessage.success('更新成功');
            } else {
              await createProduct(form);
              ElMessage.success('创建成功');
            }
            router.push('/products');
          } catch (err) {
            console.error(err);
          }
        }
      });
    };

    const goBack = () => {
      router.push('/products');
    };

    return {
      form,
      rules,
      productForm,
      categories,
      isEdit,
      submitForm,
      goBack,
    };
  },
};
</script>

<style scoped>
.box-card {
  margin: 16px;
}
</style>
