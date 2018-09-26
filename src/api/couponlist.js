import fetch from '@/utils/fetch';

// 获取优惠券列表
export function getCouponList(params) {
    return fetch({
        url: '/mobileSellerCoupon/getCouponList.do',
        method: 'post',
        params: params
    });
}

// 删除单个优惠券
export function falseDeleteCoupon(params) {
    return fetch({
        url: '/mobileSellerCoupon/falseDeleteCoupon.do',
        method: 'post',
        params: params
    });
}

// 批量删除优惠券
export function batchfalseDeleteCoupon(params) {
    return fetch({
        url: '/mobileSellerCoupon/batchfalseDeleteCoupon.do',
        method: 'post',
        params: params
    });
}

// 批量停止发放（只有进行中的优惠券活动才可以停止）
export function batchStopGrant(params) {
    return fetch({
        url: '/mobileSellerCoupon/batchStopGrant.do',
        method: 'post',
        params: params
    });
}

// 批量停止发放并撤回（只有进行中的优惠券活动才可以停止）
export function batchStopGrantAndRecall(params) {
    return fetch({
        url: '/mobileSellerCoupon/batchStopGrantAndRecall.do',
        method: 'post',
        params: params
    });
}

// 新增、编辑优惠券
export function saveOrEditCoupon(params) {
    return fetch({
        url: '/mobileSellerCoupon/saveOrEditCoupon.do',
        method: 'post',
        params: params
    });
}

// 优惠券的商品选择器搜索商品(给使用范围用的)
export function selectGoodsToUseRange(params) {
    return fetch({
        url: '/mobileSellerCoupon/selectGoodsToUseRange.do',
        method: 'post',
        params: params
    });
}

// 优惠券的商品选择器搜索商品（给领取条件用的）
export function selectGoodsToGrantCondition(params) {
    return fetch({
        url: '/mobileSellerCoupon/selectGoodsToGrantCondition.do',
        method: 'post',
        params: params
    });
}


// 优惠券（满减券）详情
export function getCouponDetail(params) {
    return fetch({
        url: '/mobileSellerCoupon/getCouponDetail.do',
        method: 'post',
        params: params
    });
}

