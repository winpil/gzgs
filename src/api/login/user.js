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

export function authCode(data) {
  // let urlAndParam='/api/v1/auth_code?purpose=1&phone='+phone;
  // return request({
  //   url: urlAndParam,
  //   method: 'get'
  // })
  return request({
    url: '/api/v1/auth_code/',
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
