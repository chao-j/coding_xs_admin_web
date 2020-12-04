// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import ViewUI from "view-design";
import "view-design/dist/styles/iview.css";
import axios from "axios";
import VueAxios from "vue-axios";
import qs from "qs";

import ServerUtil from "./common/serverUtil";

Vue.config.productionTip = false;
Vue.use(ViewUI);
Vue.use(VueAxios, axios);
const serverUtil = new ServerUtil(
  process.env.NODE_ENV == "development" ? "dev" : "prod"
);
Vue.prototype.$server = serverUtil;
Vue.prototype.$qs = qs;
const thatVue = Vue.prototype;
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    config.data = config.data || {};
    // 转换axios的格式
    config.data = qs.stringify(config.data);

    if (thatVue.$server.env == "dev") {
      // 开发环境下，在请求头中加入token
      const token = window.localStorage.getItem("token");
      // config.data["token"] = token;
      config.headers["X-Auth-Token"] = token;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    let { data, msg, code } = response.data;
    if (response.status != 200) {
      thatVue.$Message.error({
        content: `${response.status}：${response.statusText}`,
        duration: 3
      });
    }
    // 如果请求成功但是不是正确响应，需要警告
    else if (!serverUtil.isSuccess(code)) {
      thatVue.$Message.warning({ content: `${code}：${msg}`, duration: 3 });
    }
    // 开发环境下，把token存到storage中
    if (thatVue.$server.env == "dev") {
      if (data && data.token) {
        window.localStorage.setItem("token", data.token);
      }
    }
    return response;
  },
  function(error) {
    // 错误请求直接报错
    thatVue.$Message.error({ content: `${error.message}`, duration: 3 });
    return Promise.reject(error);
  }
);
// 防止跨域时发起两次请求
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
// axios.defaults.headers["Access-Control-Allow-Origin"] = "*";
axios.defaults.baseURL = serverUtil.serverUrl;
axios.defaults.withCredentials = true;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
