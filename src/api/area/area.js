import request from '@/utils/request'

// 创建区域管理
export function createArea(query) {
    return request({
        url: '/api/v1/area_add/',
        method: 'post',
        data: query
      })
}

// 获取区域管理列表
export function queryArea(query) {
    return request({
        url: '/api/v1/area_list/',
        method: 'get',
        params: query
      })
}

// 修改单个区域管理
export function updateArea(query) {
    return request({
        url: '/api/v1/area_set/',
        method: 'put',
        params: query
      })
}

// 删除单个区域管理
export function delArea(query) {
    return request({
        url: '/api/v1/area_delete/',
        method: 'delete',
        params: query
      })
}

// 导入地域数据
export function insertArea(query) {
  return request({
    url: '/api/v1/insert_area/',
    method: 'post',
    data: query
  })
}