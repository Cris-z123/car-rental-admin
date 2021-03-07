import router from "./index";
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = "汽车租赁管理平台-" + to.meta.title
    }
    next()
})