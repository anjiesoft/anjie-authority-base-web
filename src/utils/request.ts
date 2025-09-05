import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { localStorage } from '@/utils/storage';
import useStore from '@/store';
import { CONFIG_DATA, Numbers } from './code';

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      throw new Error(
        `Expected 'config' and 'config.headers' not to be undefined`
      );
    }
    const { user } = useStore();
    if (user.token) {
      config.headers.Authorization = `Bearer ${localStorage.get('access_token')}`;
      config.headers.Project = CONFIG_DATA.projectId + "";
    }

    if (typeof config.data != 'undefined' && typeof config.data.auth != 'undefined') {
      config.headers.Auth = config.data.auth;
      // delete config.data.auth
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return  response.data
  },
  error => {
    const { code, message } = error.response;
    
    const msg = typeof message == "undefined" ? '系统出错' : message;
    //没有登录或失效
    if (code == Numbers.errorNoLogin || code == Numbers.errorJwtExpired
       ||  code == Numbers.errorJwtError) {
      // token 过期
      localStorage.clear(); // 清除浏览器全部缓存
      window.location.href = '/'; // 跳转登录页
      ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {});
    } else {
      ElMessage({
        message: msg || '系统出错',
        type: 'error'
      });
    }
    return Promise.reject(new Error(msg || 'Error'));
  }
);

// 导出 axios 实例
export default service;
