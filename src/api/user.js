import { Get } from '../plugins/axios'

export function getUserInfo() {
  return Get('/api/001')
}

export function loginOut() {
  return Get('/api/loginOut')
}

export const userApi = {
  getUserInfo,
  loginOut
}
