import fetch from '@/utils/fetch';

// 预售列表
export function listPresale(params) {
    return fetch({
        url: '/mobileSellerPresale/listPresale.do',
        method: 'post',
        params: params
    });
}

// 添加商品到预售列表中
export function addPresaleGoods(params) {
    return fetch({
        url: '/mobileSellerPresale/addPresaleGoods.do',
        method: 'post',
        params: params
    });
}

// 预售详情
export function detailPresale(params) {
    return fetch({
        url: '/mobileSellerPresale/detailPresale.do',
        method: 'post',
        params: params
    });
}

// 提交审核预售商品
export function commitPresaleGoods(params) {
    return fetch({
        url: '/mobileSellerPresale/commitPresaleGoods.do',
        method: 'post',
        params: params
    });
}

// 删除预售商品
export function deletePresaleGoods(params) {
    return fetch({
        url: '/mobileSellerPresale/deletePresaleGoods.do',
        method: 'post',
        params: params
    });
}

// 预售商品选择器
export function selectActivityGoods(params) {
    return fetch({
        url: '/mobileSellerSelector/selectActivityGoods.do',
        method: 'post',
        params: params
    });
}