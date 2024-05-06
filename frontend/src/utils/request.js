import axios from 'axios'
import { Message } from "element-ui";
import db from '../utils/sessionStorage'
import router from '../router'


axios.interceptors.response.use(success => {
    if (success.status && success.status === 200 && success.data.status === 500) {
        Message.error({message: success.data.msg})
        return ;
    }
    if (success.data.msg) {
        if (success.data.code == 200) {
            Message.success({message: success.data.msg})
        } else {
            Message.warning({message: success.data.msg})
        }
    }
    return success.data
}, error => {
    if (error.response.status === 504 || error.response.status === 404) {
        Message.error({message: "服务器凉了"})
    } else if (error.response.status === 403) {
        Message.error({message: "权限不足"})
    } else if (error.response.status === 401) {
        if (db.get("LOGIN") === "0") {
            Message.error({message: "尚未登陆或登录状态已过期"})
            db.remove("LOGINS")
            db.save("LOGIN", "1")
        }
        router.replace("/").then(() => {
            Message.info({message: "返回主页"})
        })
    } else {
        if (error.response.data.msg) {
            Message.error({message: error.response.data.msg})
        } else {
            Message.error({message: "unknown error"})
        }
    }
})


// 你可以直接在请求函数中使用相对路径，省去 baseApi
export const postRequest = (url, params) => {
    return axios.post(`/api${url}`, params);
}

export const getRequest = (url, params) => {
    return axios.get(`/api${url}`, { params });
}

export const putRequest = (url, params) => {
    return axios.put(`/api${url}`, params);
}

export const deleteRequest = (url, params) => {
    return axios.delete(`/api${url}`, { params });
}
