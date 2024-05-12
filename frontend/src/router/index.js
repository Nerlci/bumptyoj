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
const class_ = () => import("../pages/Class/class");
const classDetail = () => import("../pages/Class/classDetail");
const classEdit = () => import("../pages/Class/classEdit");
const classAdd = () => import("../pages/Class/classAdd");

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
    query: { param: "problemsetId" },
    component: status,
  },
  {
    path: "/discuss",
    name: "discuss",
    component: discuss,
  },
  {
    path: "/discuss/:postId",
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
    query: { param: "problemsetId" },
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
    path: "/problemset/detail/:id",
    name: "contestDetail",
    component: contestDetail,
  },
  {
    path: "/problemset/edit/:id",
    name: "contestEdit",
    component: contestEdit,
  },
  {
    path: "/problemset/add",
    name: "contestAdd",
    query: [{ param: "type" }, { param: "classId" }],
    component: contestAdd,
  },
  {
    path: "/problemset/rank/:id",
    name: "contestRank",
    component: contestRank,
  },
  {
    path: "/class",
    name: "class",
    component: class_,
  },
  {
    path: "/class/detail/:id",
    name: "classDetail",
    component: classDetail,
  },
  {
    path: "/class/edit/:id",
    name: "classEdit",
    component: classEdit,
  },
  {
    path: "/class/add",
    name: "classAdd",
    component: classAdd,
  },
];

let router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: constRouter,
});

export default router;
