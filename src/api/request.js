import axios from "axios";

import store from '../store';

const requires = axios.create({
    baseURL:'/api',
    timeout:5000
})

//添加请求拦截器
requires.interceptors.request.use(function(config){

    if(store.state.Login.token){
        config.headers.token = store.state.Login.token
    }
    if(config.method == 'post'){
        config.data={
            ...config.data,
            _t:Date.parse(new Date())
        }
    }else if(config.method == 'get'){
        config.params = {
            _t:Date.parse(new Date()) / 1000,
            ...config.params
        }
    }
    return config;
},function(error){
    return Promise.reject(error);
})


//添加响应拦截器
requires.interceptors.response.use(function(response){
    //2xx范围内的状态码都会触发该函数。
    //对响应数据做点什么
    return response;
},function(error){
    //超过2xx范围的状态码都会触发该函数。
    //对响应错误做点什么
    return Promise.reject(error)
})

export default requires