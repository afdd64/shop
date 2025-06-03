<template>
  <div class="login-container">
    <el-form :model="form" :rules="rules" ref="loginForm" label-position="left" label-width="80px">
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
import { login } from '@/api/auth';
import { ElMessage } from 'element-plus';

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
            const res = await login({ username: form.username, password: form.password });
            // res = { token, user: { id, username, role } }
            localStorage.setItem('admin-token', res.token);
            localStorage.setItem('admin-user', JSON.stringify(res.user));
            ElMessage.success('登录成功');
            router.push('/');
          } catch (err) {
            // 错误消息在 axios 拦截器里已提示
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
