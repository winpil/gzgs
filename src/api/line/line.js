import request from '@/utils/request'

// 创建责任区
export function createLine(query) {
    return request({
        url: '/api/v1/line_add/',
        method: 'post',
        data: query
      })
}

// 获取责任区列表
export function queryLine(query) {
    return request({
        url: '/api/v1/line_list/',
        method: 'get',
        params: query
      })
}

// 修改单个责任区
export function updateLine(query) {
    return request({
        url: '/api/v1/line_set/',
        method: 'put',
        params: query
      })
}

// 删除单个责任区
export function delLine(query) {
    return request({
        url: '/api/v1/line_delete/',
        method: 'delete',
        params: query
      })
}

// 地图: 查询所有责任区的告警事件的详情
export function queryLineDetail(query) {
  return request({
      url: '/api/v1/get_detail_response/',
      method: 'get',
      params: query
    })
}

// 导入责任区数据
export function insertZones(query) {
  return request({
    url: '/api/v1/insert_zones/',
    method: 'post',
    data: query
  })
}