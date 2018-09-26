import Vue from 'vue';
import Router from 'vue-router';
import Vuex from 'vuex';
// import store from '../store'

Vue.use(Vuex);

const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

/* login */
const Login = _import('login/index');

/* dashboard */
const dashboard = _import('dashboard/index');

/* error page */
const Err404 = _import('404');

/* 商品管理 */
const goodslist = _import('goodsmanage/goodslist');
const freighttemplate = _import('goodsmanage/freighttemplate');
/*商品管理-->商品列表-->商品详情和宅配卡*/
const goodsdetail2 = _import('goodsmanage/goodsdetail')
const goodsdetail = _import('goodsmanage/goodsdetail2')
/*商品管理-->运费模板-->运费模板设置*/
const freightsetting = _import('goodsmanage/freightsetting')

/* 活动管理*/
const couponlist = _import('activemanage/couponList')
const fullcutdetail = _import('activemanage/fullcutDetail')
const fullcutsetting = _import('activemanage/fullcutSetting')

/* 订单管理 */
const orderlist = _import('ordermanage/orderlist');
const orderDetail = _import('ordermanage/orderDetail');
const commentlist = _import('ordermanage/commentlist');

/* 售后订单管理 */
const aftersaleslist = _import('aftersalesmanage/aftersaleslist');
const aftersalesDetail = _import('aftersalesmanage/aftersalesDetail');
const aftersalesSetting = _import('aftersalesmanage/aftersalesSetting');

/* 消息中心 */
const messagebox = _import('messagebox/messagebox');

/* 店铺管理 */
const resetpwd = _import('storemanage/resetpwd');

Vue.use(Router);

const PERMISSIONNAME = 'admin';

export const constantRouterMap = [
  { path: '/login', component: Login, hidden: true },
  { path: '/404', component: Err404, hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Home',
    hidden: true,
    children: [{ path: 'dashboard', component: dashboard }]
  }
]

export default new Router({
  //mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/messagebox',
    component: Layout,
    redirect: '/messagebox/index',
    name: '消息中心',
    hidden: true,
    meta: { role: [PERMISSIONNAME] },
    children: [
      { path: 'index', meta: { role: [PERMISSIONNAME] }, component: messagebox }
    ]
  },
  {
    path: '/storemanage',
    component: Layout,
    name: '店铺管理',
    redirect: '/storemanage/resetpwd',
    hidden: true,
    meta: { role: [PERMISSIONNAME] },
    children: [
      { path: 'resetpwd', name: '修改密码', meta: { role: [PERMISSIONNAME] }, component: resetpwd }
    ]
  },
  {
    path: '/goodsmanage',
    component: Layout,
    redirect: '/goodsmanage/goodslist',
    name: '商品管理',
    icon: 'zujian',
    meta: { role: [PERMISSIONNAME] },
    children: [
      { path: 'goodslist', component: goodslist, name: '商品列表', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' },
      { path: 'freighttemplate', component: freighttemplate, name: '运费模版', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe'},
      { path: 'goodsdetail', name: '商品详情', meta: { role: [PERMISSIONNAME] }, component: goodsdetail, hidden: true  },
      { path: 'freightsetting', name: '运费模板设置', meta: { role: [PERMISSIONNAME] }, component: freightsetting, hidden: true  }
    ]
  },
  {
    path: '/activemanage',
    component: Layout,
    redirect: '/activemanage/couponlist',
    name: '活动管理',
    icon: 'zujian',
    meta: { role: [PERMISSIONNAME] },
    children: [
      { path: 'couponlist', component: couponlist, name: '优惠券列表', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' },
      { path: 'fullcutdetail', component: fullcutdetail, name: '满减券详情', meta: { role: [PERMISSIONNAME] }, hidden: true },
      { path: 'fullcutsetting', component: fullcutsetting, name: '满减券设置', meta: { role: [PERMISSIONNAME] }, hidden: true }
    ]
  },
  {
    path: '/ordermanage',
    component: Layout,
    redirect: '/ordermanage/orderlist',
    name: '订单管理',
    icon: 'zujian',
    meta: { role: [PERMISSIONNAME] },
    children: [
      { path: 'orderlist', component: orderlist, name: '订单列表', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' },
      { path: 'orderDetail', component: orderDetail, name: '订单详情', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe', hidden: true },
      { path: 'commentlist', component: commentlist, name: '评论列表', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' }
    ]
  },
  {
    path: '/aftersalesmanage',
    component: Layout,
    redirect: '/aftersalesmanage/aftersaleslist',
    name: '售后管理',
    icon: 'zujian',
    meta: { role: [PERMISSIONNAME] },
    children: [
      {path: 'aftersaleslist', component: aftersaleslist, name: '售后单列表', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' },
      {path: 'aftersalesDetail', component: aftersalesDetail, name: '售后单详情', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe', hidden: true  },
      {path: 'aftersalesSetting', component: aftersalesSetting, name: '售后信息设置', meta: { role: [PERMISSIONNAME] }, icon: 'zonghe' }
    ]
  },

  {path: '*', redirect: '/404', hidden: true }
];
