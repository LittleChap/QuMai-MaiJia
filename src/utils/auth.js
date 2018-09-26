import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const selfShop = 'selfShop'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getIsSelfShop() {
  return Cookies.get(selfShop)
}

export function setIsSelfShop(isSelfShop) {
  return Cookies.set(selfShop, isSelfShop)
}

export function removeIsSelfShop() {
  return Cookies.remove(selfShop)
}