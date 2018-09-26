/**
 * Created by ruth.chen on 2017/8/26.
 */
import fetch from '@/utils/fetch';
export function getOrderList(query) { // 订单列表
    return fetch({
        url: '/mobileSellerOrder/listOrder.do',
        method: 'post',
        params: query
    });
}
export function exportOrder(query) { // 订单导出
    return fetch({
        url: 'mobileSellerOrder/exportOrder.do',
        method: 'post',
        params: query
    });
}
export function deliverBatchOrder(query) { // 批量发货
    return fetch({
        url: 'mobileSellerOrder/deliverBatchOrder.do',
        method: 'post',
        params: query
    });
}

export function detailOrder(query) { // 订单详情
    return fetch({
        url: 'mobileSellerOrder/detailOrder.do',
        method: 'post',
        params: query
    });
}
export function editRemark(query) { // 详情页-修改卖家备注
    return fetch({
        url: 'mobileSellerOrder/editRemark.do',
        method: 'post',
        params: query
    });
}
export function editPrice(query) { // 详情页-修改价格
    return fetch({
        url: 'mobileSellerOrder/editPrice.do',
        method: 'post',
        params: query
    });
}
export function deliverOrder(query) {  // 详情页-确认发货
    return fetch({
        url: 'mobileSellerOrder/deliverOrder.do',
        method: 'post',
        params: query
    });
}
export function cancelOrder(query) {  // 详情页-取消订单
    return fetch({
        url: 'mobileSellerOrder/cancelOrder.do',
        method: 'post',
        params: query
    });
}
export function getCommentList(query) {  // 评论列表
    return fetch({
        url: 'mobileSellerOrderItemComment/getOrderItemCommentList.do',
        method: 'post',
        params: query
    });
}
export function replayComment(query) {  // 评论列表
    return fetch({
        url: 'mobileSellerOrderItemComment/replyComment.do',
        method: 'post',
        params: query
    });
}
export function getWaitDeliveredOrder(query) {  // 获得待发货的商品
    return fetch({
        url: 'mobileSellerOrder/getWaitDeliveredOrderItem.do',
        method: 'post',
        params: query
    });
}