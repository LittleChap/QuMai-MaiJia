import fetch from '@/utils/fetch';

// 运费模板列表
export function listLogisticsTemplate(params) {
    return fetch({
        url: '/mobileSellerLogistics/listLogisticsTemplate.do',
        method: 'post',
        params: params
    });
}

// 添加，修改运费模板
export function saveOrEditLogisticsTemplate(params) {
    return fetch({
        url: '/mobileSellerLogistics/saveOrEditLogisticsTemplate.do',
        method: 'post',
        params: params
    });
}

// 运费模板详情
export function getLogisticsTemplate(params) {
    return fetch({
        url: '/mobileSellerLogistics/getLogisticsTemplateDetail.do',
        method: 'post',
        params: params
    });
}

// 删除运费模板
export function deletedLogisticsTemplate(params) {
    return fetch({
        url: '/mobileSellerLogistics/deletedLogisticsTemplate.do',
        method: 'post',
        params: params
    });
}

// 确认删除运费模板
export function confirmDeleteLogisticsTemplate(params) {
    return fetch({
        url: '/mobileSellerLogistics/confirmDeleteLogisticsTemplate.do',
        method: 'post',
        params: params
    });
}

// 获得地区数据
export function getAreaList(params) {
   return fetch({
       url: '/mobileBaseData/listRegionsTreeLevel2.do',
       method: 'post',
       params: params
   });
}

// 获得地区数据
/*export function getAreaList(params) {
    return fetch({
        url: '/mobileBaseData/listRegionsByParentId.do',
        method: 'post',
        params: params
    });
}*/

// 修改模板sort和isOpen
export function editSimpleInfo(params) {
  return fetch({
    url: '/mobileSellerLogistics/editSimpleInfo.do',
    method: 'post',
    params: params
  });
}
// 获取已添加物流公司列表
export function getLogisticsCompanyList(params) {
  return fetch({
    url: '/mobileSellerLogistics/getLogisticsCompanyList.do',
    method: 'post',
    params: params
  });
}
// 查看物流
export function viewLogistics(params) {
  return fetch({
    url: '/mobileSellerLogistics/viewLogistics.do',
    method: 'post',
    params: params
  });
}
// 修改订单或售后单的物流信息
export function editOrderLogistics(params) {
  return fetch({
    url: '/mobileSellerLogistics/editOrderLogistics.do',
    method: 'post',
    params: params
  });
}