/**
 * Created by ruth.chen on 2017/8/26.
 */
import fetch from '@/utils/fetch';
export function getDeliveryCardList(query) { // 宅配卡配送单列表
    return fetch({
        url: '/mobileSellerDeliveryCardOrder/list.do',
        method: 'post',
        params: query
    });
}
export function getDetailConfig(query) { // 配送计划设置详情
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/detailConfig.do',
        method: 'post',
        params: query
    });
}
export function saveDetailConfig(query) { // 保存配送计划设置
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/saveConfig.do',
        method: 'post',
        params: query
    });
}
export function exportOrder(query) { // 导出订单
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/export.do',
        method: 'post',
        params: query
    });
}
export function toDeliveryOrder(query) { // 开始配送
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/deliverOrder.do',
        method: 'post',
        params: query
    });
}
export function toCancelOrder(query) { // 取消配送
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/cancelOrder.do',
        method: 'post',
        params: query
    });
}
export function toComplateOrder(query) { // 配送成功
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/complateOrder.do',
        method: 'post',
        params: query
    });
}
export function toFailOrder(query) { // 配送失败
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/failOrder.do',
        method: 'post',
        params: query
    });
}
export function detailOrder(query) { // 订单详情
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/detail.do',
        method: 'post',
        params: query
    });
}
export function editRemark(query) { // 详情页-修改卖家备注
    return fetch({
        url: 'mobileSellerDeliveryCardOrder/editRemark.do',
        method: 'post',
        params: query
    });
}