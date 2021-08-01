import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import RunIndex from "../views/RunIndex.vue";
import UserIndex from "../views/UserIndex.vue";
import RunsNew from "../views/RunsNew.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RunIndex",
    component: RunIndex,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
  {
    path: "/runs",
    name: "runs",
    component: RunIndex,
  },
  {
    path: "/runs/new",
    name: "runsNew",
    component: RunsNew,
  },
  {
    path: "/users",
    name: "users",
    component: UserIndex,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
