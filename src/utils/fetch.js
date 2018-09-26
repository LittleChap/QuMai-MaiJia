import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '../store';
import { getToken } from '@/utils/auth';


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000                  // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data;
    if (parseInt(res.code) !== 1) {
      if (parseInt(res.code) === 5 || parseInt(res.code) === 7) {
        Message({
          message: '会话超时，请重新登录！',
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(function () {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }, 2000)
        // MessageBox.confirm('会话超时，请重新登录！', '会话超时', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('FedLogOut').then(() => {
        //     location.reload();// 为了重新实例化vue-router对象 避免bug
        //   });
        // })
      }else if(parseInt(res.code) === 2) {
        Message({
          message: '该帐号已禁用，请联系管理员！',
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(function () {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }, 2000)
      }else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        });
      }
      return Promise.reject('error');
    } else {
      let responseObj = {}
      if (res.data && (typeof res.data === 'object') && !(res.data instanceof Array)) {
        responseObj = res.data;
        responseObj.code = res.code;
        responseObj.message = res.message;
      }else {
        responseObj = res;
      }

      return responseObj;
    }
  },
  error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
)

export default service;

// 创建axios实例
const service2 = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000                  // 请求超时时间
});

// request拦截器
service2.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  return {code: -111, message: error}
})

// respone拦截器
service2.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data;
    if (parseInt(res.code) !== 1) {
      if (parseInt(res.code) === 5 || parseInt(res.code) === 7) {
        Message({
          message: '会话超时，请重新登录！',
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(function () {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }, 2000)
        // MessageBox.confirm('会话超时，请重新登录！', '会话超时', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('FedLogOut').then(() => {
        //     location.reload();// 为了重新实例化vue-router对象 避免bug
        //   });
        // })
      }else if(parseInt(res.code) === 2) {
        Message({
          message: '该帐号已禁用，请联系管理员！',
          type: 'error',
          duration: 2 * 1000
        })
        setTimeout(function () {
          store.dispatch('FedLogOut').then(() => {
            location.reload();// 为了重新实例化vue-router对象 避免bug
          });
        }, 2000)
      }else {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        });
      }
      return res;
    } else {
      let responseObj = {}
      if (res.data && (typeof res.data === 'object') && !(res.data instanceof Array)) {
        responseObj = res.data;
        responseObj.code = res.code;
        responseObj.message = res.message;
      }else {
        responseObj = res;
      }

      return responseObj;
    }
  },
  error => {
    console.log('err' + error);// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return {code: -111, message: error};
  }
)

export function post (url, data) {
  try {
    let res = service2({
      url: url,
      method: 'post',
      params: data
    })
    return res
  } catch (e) {
    return {code: -1, message: '网络异常'}
  }
}
