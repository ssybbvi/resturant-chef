import axios from "axios"
import {
    getToken
} from "./tool"
import {
    Toast
} from "antd-mobile";
// import {
//     promised
// } from "q";


const DevBaseUrl = "http://localhost:3000"
const ProdBashUrl = "http://35.236.174.214:3000"

let config = {
    baseURL: process.env.NODE_ENV !== "production" ? DevBaseUrl : ProdBashUrl // 配置API接口地址
}

let token = getToken()
if (token) {
    config.headers = {
        Authorization: "Bearer " + token
    }
}


let request = axios.create(config)

// http request 拦截器
request.interceptors.request.use(
    config => {
        if (window) {
            let token = getToken()
            if (token) {
                // 判断是否存在token，如果存在的话，则每个http header都加上token
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        // if (config.method === 'get') {
        //     config.url = config.url + 'timestamp=' + Date.now().toString()
        // }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

request.interceptors.response.use(function (response) {
    if (response.data.result === false) {
        Toast.fail(response.data.data, 2);
        return Promise.reject(response.data.data)
    }
    return Promise.resolve(response);
}, function (error) {
    console.error(error)
    return Promise.reject(error);
});


export default request