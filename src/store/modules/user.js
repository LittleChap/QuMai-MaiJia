import { login, getInfo } from '@/api/login';
import { getToken, setToken, removeToken, getIsSelfShop, setIsSelfShop, removeIsSelfShop } from '@/utils/auth';
import {getMessage} from '@/api/index';

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    shopId: '',
    loginNumber: 0,
    isSelfShop: getIsSelfShop(),
    afterSaleInfo: '',
    unreadMessageList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_SHOPID: (state, shopId) => {
      state.shopId = shopId;
    },
    SET_SHOPNAME: (state, shopName) => {
      state.shopName = shopName;
    },

    SET_LOGINNUM: (state, loginNumber) => {
        state.loginNumber = loginNumber;
    },
    SET_ISSELFSHOP: (state, isSelfShop) => {
      state.isSelfShop = isSelfShop;
    },
    SET_AFTERSALEINFO: (state, afterSaleInfo) => {
      state.afterSaleInfo = afterSaleInfo
    },
    SET_UNREADMESSAGELIST: (state, unreadMessageList) =>{
      state.unreadMessageList = unreadMessageList
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response;
          setToken(data.token);
          setIsSelfShop(data.isSelfShop);
          commit('SET_TOKEN', data.token);
          commit('SET_ISSELFSHOP', data.isSelfShop);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },


    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response;
          response.role = 'admin';
          commit('SET_ROLES', 'admin');
          commit('SET_NAME', data.shopjson.username);
          commit('SET_AVATAR', data.shopjson.avatar || '/static/avatar.gif');
          commit('SET_SHOPID', data.shopjson.shopId);
          commit('SET_SHOPNAME', data.shopjson.shopName);
          commit('SET_LOGINNUM', data.shopjson.loginNumber);
          commit('SET_AFTERSALEINFO', data.shopjson.afterSaleInfo);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        removeIsSelfShop();
        sessionStorage.removeItem('isFirst');
        sessionStorage.removeItem('isShowChangeDialog');
        resolve();
      });
    },

    // 保存售后信息
    SaveAfterSaleInfo({ commit }, data) {
      commit('SET_AFTERSALEINFO', data);
    },

    // 获得未读消息列表
    GetUnreadMessageList({ commit }, data) {
      return new Promise((resolve, reject) => {
        getMessage(data.shopId, data.token, 10000).then(response => {
          commit('SET_UNREADMESSAGELIST', response.messageArray)
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default user;
