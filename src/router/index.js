import Vue from "vue";
import VueRouter from "vue-router";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import RunsIndex from "../views/RunsIndex.vue";
import RunsShow from "../views/RunsShow.vue";
import UsersIndex from "../views/UsersIndex.vue";
import UsersShow from "../views/UsersShow.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "RunIndex",
    component: RunsIndex,
  },
  {
    path: "/runs/:id",
    name: "runs show",
    component: RunsShow,
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
    path: "/users",
    name: "users",
    component: UsersIndex,
  },
  {
    path: "/users/:id",
    name: "users show",
    component: UsersShow,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
