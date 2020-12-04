<template>
  <div class="container">
    <h1 class="title">CXS管理平台-管理员鉴权</h1>
    <transition name="fade" mode="out-in">
      <div v-if="show == 'login'" class="form-panel" key="login">
        <Form ref="loginForm" :model="loginForm">
          <FormItem>
            <Input
              type="text"
              v-model="loginForm.email"
              placeholder="请输入管理员账号"
              maxlength="32"
            >
              <Icon type="ios-at-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              maxlength="32"
            >
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="onLogin"
              :disabled="logindisbaled"
              :loading="loginForm.loading"
              >登录</Button
            >
          </FormItem>
          <Button type="text" @click="changePanel('register')"
            >去注册<Icon type="md-arrow-round-forward"
          /></Button>
        </Form>
      </div>
      <div v-if="show == 'register'" class="form-panel" key="register">
        <Form ref="registerForm" :model="registerForm">
          <FormItem>
            <Input
              type="text"
              v-model="registerForm.email"
              placeholder="请输入管理员账号"
              maxlength="32"
            >
              <Icon type="ios-at-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Input
              type="password"
              v-model="registerForm.password"
              placeholder="请输入密码"
              maxlength="32"
              password
            >
              <Icon type="ios-lock-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Input
              type="password"
              v-model="registerForm.password_cf"
              placeholder="请确认密码"
              maxlength="32"
              password
            >
              <Icon type="ios-checkmark" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Input
              type="text"
              v-model="registerForm.code"
              placeholder="请输入授权码"
              maxlength="32"
            >
              <Icon type="ios-barcode-outline" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              @click="onRegister"
              :loading="registerForm.loading"
              :disabled="registerDisabled"
              >注册</Button
            >
          </FormItem>
          <Button type="text" @click="changePanel('login')"
            >去登录<Icon type="md-arrow-round-forward"
          /></Button>
        </Form>
      </div>
      <div v-if="show == 'welcome'">
        <h1>
          欢迎您：<span class="info-name">{{ info.name }}</span
          >（{{ info.level }}）
        </h1>
        <p>3s后自动跳转到<router-link to="/" replace> 主页 </router-link></p>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: "Admin",
  data() {
    return {
      show: "login",
      loginForm: {
        email: "",
        password: "",
        loading: false
      },
      registerForm: {
        email: "",
        password: "",
        password_cf: "",
        code: "",
        loading: false
      }
    };
  },
  methods: {
    changePanel(tag) {
      this.show = tag;
      // this.axios.post("users/get").then(res => {
      //   console.log(res);
      // });
    },
    // 注册
    onRegister() {
      let { email, password: pwd, password_cf, code } = this.registerForm;
      if (pwd != password_cf) {
        this.$Message.error({ content: "前后密码不一致" });
        return;
      }
      if (pwd.length < 6) {
        this.$Message.error({ content: "密码请大于6位" });
        return;
      }
      this.registerForm.loading = true;
      this.axios
        .post(`manager/auth/register`, { email, pwd, code })
        .then(result => {
          let { code } = result.data;
          if (this.$server.isSuccess(code)) {
            this.registerForm = {
              email: "",
              password: "",
              password_cf: "",
              code: "",
              loading: false
            };
            this.changePanel("login");
          }
        })
        .catch(err => {
          // console.log(err, "222");
        })
        .finally(() => {
          this.registerForm.loading = false;
        });
    },
    // 登录
    onLogin() {
      let { email, password: pwd } = this.loginForm;
      if (pwd.length < 6) {
        this.$Message.error({ content: "密码请大于6位" });
        return;
      }
      this.loginForm.loading = true;
      this.axios
        .post(`manager/auth/login`, { email, pwd })
        .then(result => {
          let {
            code,
            data: { name, level }
          } = result.data;
          if (this.$server.isSuccess(code)) {
            this.info = { name, level };
            window.localStorage.setItem(
              "adminInfo",
              JSON.stringify({ name, level })
            );
            this.changePanel("welcome");
            setTimeout(() => {
              this.$router.replace("/");
            }, 3000);
          }
        })
        .catch(err => {
          // console.log(err, "222");
        })
        .finally(() => {
          this.loginForm.loading = false;
        });
    }
  },
  computed: {
    logindisbaled() {
      let { email, password, loading } = this.loginForm;
      // console.log(email == "", password == "", loading);
      return email == "" || password == "" || loading;
    },
    registerDisabled() {
      let { email, password, password_cf, loading, code } = this.registerForm;
      return (
        email == "" ||
        password == "" ||
        password_cf == "" ||
        loading ||
        code == ""
      );
    }
  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}
.title {
  position: absolute;
  text-align: center;
  top: 20px;
}
.info-name {
  color: #1cc09f;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-leave-to,
.fade-enter {
  opacity: 0;
  transform: translateX(100px);
}
</style>
