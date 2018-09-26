const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  shopId: state => state.user.shopId,
  loginNumber: state => state.user.loginNumber,
  isSelfShop: state => state.user.isSelfShop,
  shopName: state => state.user.shopName,
  afterSaleInfo: state => state.user.afterSaleInfo,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  unreadMessageList: state => state.user.unreadMessageList
};
export default getters
