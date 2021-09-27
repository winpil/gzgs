import request from '@/utils/request'
import axios from 'axios'
export function login(data) {
  return request({
    url: '/api/v1/login/',
    method: 'post',
    data: data
  })
}

export function getInfo(data) {
  //debugger
  return request({
    url: '/api/v1/login/',
    method: 'get',
    params: data
  })
}

export function authCode(param) {
  // return request({
  //   url: '/api/v1/auth_code/',
  //   method: 'post',
  //   data: param
  // })
  return axios({
      method: "POST",
      url: '/api/v1/auth_code/',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'token': 'phone_auth_code'
      },
      data:param,
  });
}

export function changePwd(param) {
  return request({
    url: '/api/v1/change_pwd/',
    method: 'post',
    data: param
  })
}

export function forgetPassword(param) {
  return axios({
    method: "POST",
    url: '/api/v1/change_pwd/',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': 'login_forget_pwd'
    },
    data:param,
  });
}

export function logout(data) {
	//debugger
  return request({
    url: '/api/v1/logout/',
    method: 'post',
    data: data
  })
}
