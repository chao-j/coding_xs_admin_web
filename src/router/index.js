import Vue from "vue";
import Router from "vue-router";
import HelloWorld from "@/components/HelloWorld";
import Index from "@/components/index/Index";
import NavBar from "@/components/components/NavBar";
import Admin from "@/components/admin/Admin";
import ErrorPage from "@/components/errorPage/ErrorPage";
import Modular from "@/components/modular/Modular";
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      components: {
        side: Index,
        navbar: NavBar
      }
    },
    {
      path: "/admin",
      name: "Admin",
      components: {
        side: Admin
      }
    },
    {
      path: "/errorPage",
      name: "ErrorPage",
      components: {
        side: ErrorPage
      }
    },
    {
      path: "/modular",
      name: "Modular",
      components: {
        navbar: NavBar,
        side: Modular
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 页面不存在
  if (to.matched.length === 0) {
    // 如果从其他页面跳转，则不跳转继续保持在该页面
    // 如果直接输入url，则重定向到404页面
    from.name
      ? next({
          name: from.name
        })
      : next("/errorPage");
  } else {
    next(); //如果匹配到正确跳转
  }
});

export default router;
