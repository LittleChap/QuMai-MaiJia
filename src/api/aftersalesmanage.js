/**
 * Created by ruth.chen on 2017/8/30.
 */
import fetch from '@/utils/fetch';
export function getReturnOrderList(query) { // 售后列表
  return fetch({
    url: '/mobileSellerReturnOrder/listReturnOrder.do',
    method: 'post',
    params: query
  });
}
export function exportOrder(query) { // 售后列表
  return fetch({
    url: '/mobileSellerReturnOrder/exportOrder.do',
    method: 'post',
    params: query
  });
}
export function getReturnOrderDetail(query) { // 售后详情
  return fetch({
    url: '/mobileSellerReturnOrder/getReturnOrderDetail.do',
    method: 'post',
    params: query
  });
}
export function agreeOrRefuseApply(query) { // 同意或拒绝 申请
  return fetch({
    url: '/mobileSellerReturnOrder/agreeOrRefuseApply.do',
    method: 'post',
    params: query
  });
}
export function agreeOrRefuseReceiveReturnGoods(query) { // 同意或拒绝签收退货商品
  return fetch({
    url: '/mobileSellerReturnOrder/agreeOrRefuseReceiveReturnGoods.do',
    method: 'post',
    params: query
  });
}
export function agreeOrRefuseReceiveExchangeGoods(query) { // 同意或拒绝签收换货商品
  return fetch({
    url: '/mobileSellerReturnOrder/agreeOrRefuseReceiveExchangeGoods.do',
    method: 'post',
    params: query
  });
}
export function sendOutGoods(query) { // 卖家寄出换货商品
  return fetch({
    url: '/mobileSellerReturnOrder/sendOutGoods.do',
    method: 'post',
    params: query
  });
}
export function setAfterSaleInfo(query) { // 1.5 售后信息设置
  return fetch({
    url: '/mobileSellerShop/addOrUpdateAfterSaleInfo.do',
    method: 'post',
    params: query
  });
}