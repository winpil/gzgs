import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/login/',
    method: 'post',
    params: data
  })
}

export function getInfo(data) {
  return request({
    url: '/api/v1/login/',
    method: 'post',
    params: data
  })
}

export function logout(data) {
  return request({
    url: '/api/v1/logout/',
    method: 'post',
    params: data
  })
}
