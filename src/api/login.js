import fetch from '@/utils/fetch';

export function login(username, password) {
  return fetch({
    url: '/mobileSellerShop/login.do',
    method: 'post',
    params: {
      username,
      password
    }
  });
}

export function getInfo(token) {
    return fetch({
        url: '/mobileSellerShop/getShopInfo.do',
        method: 'post',
        params: { token }
    });
}
export function getImg() {
    return fetch({
        url: '/mobileSetting/getSiteSettingInfo.do',
        method: 'post'
    });
}




