import axios from "axios";
import { Message } from "element-ui";
import db from "../utils/sessionStorage";
import router from "../router";
import * as config from "../utils/config";

axios.interceptors.response.use(
  (success) => {
    if (!success.status || success.status !== 200) {
      Message.error({ message: success.data.err.msg });
      return;
    }
    if (success.data.code !== "200") {
      const errorType = {
        400: "请求错误",
        401: "未登录",
        500: "服务器错误",
      };
      Message.error({
        message: `${errorType[success.data.code]}: ${success.data.error.msg}`,
      });
      return;
    }
    return success.data;
  },
  (error) => {
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: "服务器错误" });
    } else if (error.response.status === 403) {
      Message.error({ message: "权限不足" });
    } else if (error.response.status === 401) {
      if (db.get("LOGIN") === "0") {
        Message.error({ message: "尚未登陆或登录状态已过期" });
        db.remove("LOGINS");
        db.save("LOGIN", "1");
      }
      router.replace("/").then(() => {
        Message.info({ message: "返回主页" });
      });
    } else {
      if (error.response.data.msg) {
        Message.error({ message: error.response.data.msg });
      } else {
        Message.error({ message: "unknown error" });
      }
    }
  },
);

let base = config.baseApi;

// 你可以直接在请求函数中使用相对路径，省去 baseApi
export const postRequest = (url, params) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
  });
};

export const getRequest = (url, params) => {
  //Message.info({message: `${base}${url}`})
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params,
  });
};

export const putRequest = (url, params) => {
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
  });
};

export const deleteRequest = (url, params) => {
  return axios({
    method: "delete",
    url: `${base}${url}`,
    params: params,
  });
};
