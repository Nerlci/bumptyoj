import Vue from "vue";
import Router from "vue-router";

const login = () => import("../pages/login");
const home = () => import("../pages/home");
const problems = () => import("../pages/Problem/problems");
const rank = () => import("../pages/rank");
const status = () => import("../pages/Status/status");
const register = () => import("../pages/register");
const manager = () => import("../pages/manager");
const problemDetail = () => import("../pages/Problem/problemDetail");
const problemEdit = () => import("../pages/Problem/problemEdit");
const problemAdd = () => import("../pages/Problem/problemAdd");
const statusDetail = () => import("../pages/Status/statusDetail");
const contest = () => import("../pages/Contest/contest");
const contestDetail = () => import("../pages/Contest/contestDetail");
const contestEdit = () => import("../pages/Contest/contestEdit");
const contestAdd = () => import("../pages/Contest/contestAdd");
const contestRank = () => import("../pages/Contest/contestRank");
const problemTestData = () => import("../pages/Problem/problemTestData");
const discuss = () => import("../pages/Discuss/discuss");
const postDetail = () => import("../pages/Discuss/postDetail");
Vue.use(Router);

const constRouter = [
  {
    path: "/",
    name: "Index",
    redirect: { name: "home" },
  },
  {
    path: "/home",
    name: "home",
    component: home,
  },
  {
    path: "/login",
    name: "login",
    component: login,
  },
  {
    path: "/problems",
    name: "problems",
    component: problems,
  },
  {
    path: "/rank",
    name: "rank",
    component: rank,
  },
  {
    path: "/status",
    name: "status",
    component: status,
  },
  {
    path: "/discuss",
    name: "discuss",
    component: discuss,
  },
  {
    path: "/post/detail/:id",
    name: "postDetail",
    component: postDetail,
  },
  {
    path: "/register",
    name: "register",
    component: register,
  },
  {
    path: "/manager",
    name: "manager",
    component: manager,
  },
  {
    path: "/problem/detail/:id",
    name: "problemDetail",
    component: problemDetail,
  },
  {
    path: "/problem/edit/:id",
    name: "problemEdit",
    component: problemEdit,
  },
  {
    path: "/problem/add",
    name: "problemAdd",
    component: problemAdd,
  },
  {
    path: "/problem/data/:id",
    name: "problemTestData",
    component: problemTestData,
  },
  {
    path: "/status/:submissionId",
    name: "statusDetail",
    component: statusDetail,
  },
  {
    path: "/contest",
    name: "contest",
    component: contest,
  },
  {
    path: "/contest/detail/:id",
    name: "contestDetail",
    component: contestDetail,
  },
  {
    path: "/contest/edit/:id",
    name: "contestEdit",
    component: contestEdit,
  },
  {
    path: "/contest/add",
    name: "contestAdd",
    component: contestAdd,
  },
  {
    path: "/contest/rank/:id",
    name: "contestRank",
    component: contestRank,
  },
];

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: constRouter,
});

export default router;
