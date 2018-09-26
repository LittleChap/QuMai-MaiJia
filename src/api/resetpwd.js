import fetch from '@/utils/fetch';

export function resetPwd(shopId, token, oldPassword, newPassword) {
  return fetch({
    url: '/mobileSellerShop/editPassword.do',
    method: 'post',
    params: {
      shopId,
      token,
      oldPassword,
      newPassword
    }
  });
}