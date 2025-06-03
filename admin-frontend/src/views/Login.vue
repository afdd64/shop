<!-- admin-frontend/src/views/Login.vue -->
<template>
  <div class="login-container">
    <el-form
      :model="form"
      :rules="rules"
      ref="loginForm"
      label-position="left"
      label-width="80px"
    >
      <h2 class="title">后台登录</h2>

      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
// 确保这行会从 src/api/auth.js 中正确引入 login 方法
import { login } from '@/api/auth';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loginForm = ref(null);
    const form = reactive({
      username: '',
      password: '',
    });
    const rules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    };

    const submitLogin = () => {
      loginForm.value.validate(async (valid) => {
        if (valid) {
          try {
            // login({ username, password }) 返回示例：{ token, user: { id, username, role } }
            const res = await login({ username: form.username, password: form.password });
            // 将 token 与 user 信息存到 localStorage
            localStorage.setItem('admin-token', res.token);
            localStorage.setItem('admin-user', JSON.stringify(res.user));
            ElMessage.success('登录成功');
            // 登陆成功后跳转到仪表盘
            router.push('/');
          } catch (err) {
            // 如果后端返回 401/403，axios 拦截器里会触发 ElMessage.error，这里不需额外处理
          }
        }
      });
    };

    return { form, rules, loginForm, submitLogin };
  },
};
</script>

<style scoped>
.login-container {
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  background-color: #fff;
}
.title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
