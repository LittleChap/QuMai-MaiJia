import fetch from '@/utils/fetch';

export function getGoodsList(params) {
  return fetch({
    url: '/mobileSellerGoods/getGoodsList.do',
    method: 'post',
    params: params
  });
}

// 商品分类列表
export function getGoods(params) {
  return fetch({
    url: '/mobileSellerGoodsCat/getGoodsCatList.do',
    method: 'post',
    params: params
  });
}

// 获取所有商品分类
export function getAllGoodsCatList(params) {
  return fetch({
    url: '/mobileSellerGoodsCat/getAllGoodsCatList.do',
    method: 'post',
    params: params
  });
}

// 商品品牌列表
export function getBrand(params) {
  return fetch({
    url: '/mobileSellerBrand/getBrandList.do',
    method: 'post',
    params: params
  });
}
//导出商品
export function exportGoods(params) {
  return fetch({
    url: '/mobileSellerGoods/exportGoods.do',
    method: 'post',
    params: params
  });
}

// 批量删除商品
export function deleteGoods(params) {
  return fetch({
    url: '/mobileSellerGoods/delete.do',
    method: 'post',
    params: params
  });
}

// 删除商品
export function deleteGood(params) {
  return fetch({
    url: '/mobileSellerGoods/falseDeleteGoods.do',
    method: 'post',
    params: params
  });
}

// 批量上架商品
export function batchPutAwayGoods(params) {
  return fetch({
    url: '/mobileSellerGoods/batchPutAwayGoods.do',
    method: 'post',
    params: params
  });
}

// 批量下架商品
export function batchDownAwayGoods(params) {
  return fetch({
    url: '/mobileSellerGoods/batchDownAwayGoods.do',
    method: 'post',
    params: params
  });
}

/* 商品详情 */
// 获取商品详情
export function getGoodsDetail(params) {
  return fetch({
    url: '/mobileSellerGoods/getGoodsDetail.do',
    method: 'post',
    params: params
  });
}

// 新增商品或编辑商品
export function saveOrEditGoods(params) {
  return fetch({
    url: '/mobileSellerGoods/saveOrEditGoods.do',
    method: 'post',
    params: params
  });
}

// 获取运费模板
export function listLogisticsTemplate(params) {
  return fetch({
    url: '/mobileSellerLogistics/listLogisticsTemplate.do',
    method: 'post',
    params: params
  });
}

// 图片上传
export function uploadImg(params) {
  return fetch({
    url: '/mobileUpload/uploadImg4Base64Str.do',
    method: 'post',
    params: params
  });
}

// 导入商品
export function importGoodsTemplate(params) {
  return fetch({
    url: '/mobileSellerGoods/importGoodsTemplate.do',
    method: 'post',
    params: params
  });
}

// 查询导入商品是否完成
export function importGoodsIsOk(params) {
  return fetch({
    url: '/mobileSellerGoods/importGoodsIsOk.do',
    method: 'post',
    params: params
  });
}

// 模板下载
export function downloadGoodsTemplate(params) {
  return fetch({
    url: '/mobileSellerGoods/downloadGoodsTemplate.do',
    method: 'post',
    params: params
  });
}

// 获取规格列表
export function getSpecList(params) {
  return fetch({
    url: '/mobileSellerSpec/getSpecList.do',
    method: 'post',
    params: params
  });
}
// 新增或修改规格
export function saveOrEditSpec(params) {
  return fetch({
    url: '/mobileSellerSpec/saveOrEditSpec.do',
    method: 'post',
    params: params
  });
}
// 删除单个规格
export function deleteSpec(params) {
  return fetch({
    url: '/mobileSellerSpec/deleteSpec.do',
    method: 'post',
    params: params
  });
}
// 获取规格项列表
export function getSpecItemList(params) {
  return fetch({
    url: '/mobileSellerSpecItem/getSpecItemList.do',
    method: 'post',
    params: params
  });
}
// 新增规格项
export function saveSpecItem(params) {
  return fetch({
    url: '/mobileSellerSpecItem/saveSpecItem.do',
    method: 'post',
    params: params
  });
}
// 删除单个规格项
export function deleteSpecItem(params) {
  return fetch({
    url: '/mobileSellerSpecItem/deleteSpecItem.do',
    method: 'post',
    params: params
  });
}
// 生成规格名称
export function createSpec(params) {
  return fetch({
    url: '/mobileSellerProductSpec/createSpec.do',
    method: 'post',
    params: params
  });
}
