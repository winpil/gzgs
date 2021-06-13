import request from '@/utils/request'

// 创建管理员
export function createUser(query) {
    return request({
        url: '/api/v1/user_add/',
        method: 'post',
        data: query
      })
}

// 获取管理员列表
export function queryUser(query) {
    return request({
        url: '/api/v1/user_list/',
        method: 'get',
        params: query
      })
}

// 修改单个管理员
export function updateUser(query) {
    return request({
        url: '/api/v1/user_set/',
        method: 'put',
        params: query
      })
}

// 删除单个管理员
export function delUser(query) {
    return request({
        url: '/api/v1/user_delete/',
        method: 'delete',
        params: query
      })
}