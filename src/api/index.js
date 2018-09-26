import fetch from '@/utils/fetch';

export function getNum(shopId, token) {
  return fetch({
    url: '/mobileSellerInstationMessage/getNum.do',
    method: 'post',
    params: {
      shopId,
      token
    }
  });
}

export function getMessage(shopId, token, num) {
  return fetch({
    url: '/mobileSellerInstationMessage/getUnReadMessageList.do',
    method: 'post',
    params: {
      shopId,
      token,
      num
    }
  });
}
