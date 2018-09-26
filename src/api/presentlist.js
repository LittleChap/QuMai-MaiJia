import fetch from '@/utils/fetch';

// 买赠活动列表
export function getPresentList(params) {
    return fetch({
        url: '/mobileSellerPresent/getPresentList.do',
        method: 'post',
        params: params
    });
}

// 批量停止活动和删除
export function batchAction(params) {
    return fetch({
        url: '/mobileSellerPresent/batchAction.do',
        method: 'post',
        params: params
    });
}

// 规格选择器
export function selectProducts(params) {
    return fetch({
        url: '/mobileSellerSelector/selectProducts.do',
        method: 'post',
        params: params
    });
}

// 买赠活动详情
export function getPresentDetail(params) {
    return fetch({
        url: '/mobileSellerPresent/getPresentDetail.do',
        method: 'post',
        params: params
    });
}

// 添加、编辑买赠活动
export function saveOrEditPresent(params) {
    return fetch({
        url: '/mobileSellerPresent/saveOrEditPresent.do',
        method: 'post',
        params: params
    });
}