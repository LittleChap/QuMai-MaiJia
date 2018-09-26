import fetch from '@/utils/fetch';

export function getList(query) {
  return fetch({
    url: '/mobileSellerInstationMessage/getMessageList.do',
    method: 'post',
    params: query
  });
}

export function batchMarkRead(shopId, token, messageIds) {
  return fetch({
    url: '/mobileSellerInstationMessage/batchmarkRead.do',
    method: 'post',
    params: {
      shopId,
      token,
      messageIds
    }
  });
}

export function batchfalseDelete(shopId, token, messageIds) {
  return fetch({
    url: '/mobileSellerInstationMessage/batchfalseDelete.do',
    method: 'post',
    params: {
      shopId,
      token,
      messageIds
    }
  });
}

export function markRead(shopId, token, messageId) {
  return fetch({
    url: '/mobileSellerInstationMessage/markRead.do',
    method: 'post',
    params: {
      shopId,
      token,
      messageId
    }
  });
}
