import request from '@/utils/request'

// 创建GT设备
export function createDeviceGt(query) {
    return request({
        url: '/api/v1/device_gt_add/',
        method: 'post',
        data: query
      })
}

// 获取GT设备信息列表
export function queryDeviceGt(query) {
    return request({
        url: '/api/v1/device_gt_list/',
        method: 'get',
        params: query
      })
}

// 修改单个GT设备信息
export function updateDeviceGt(query) {
    return request({
        url: '/api/v1/device_gt_set/',
        method: 'put',
        params: query
      })
}

// 删除单个GT设备信息
export function delDeviceGt(query) {
    return request({
        url: '/api/v1/device_gt_delete/',
        method: 'delete',
        params: query
      })
}

// 创建smt设备
export function createDeviceSmt(query) {
    return request({
        url: '/api/v1/device_smt_add/',
        method: 'POST',
        data: query
      })
}

// 获取smt设备信息列表
export function queryDeviceSmt(query) {
    return request({
        url: '/api/v1/device_smt_list/',
        method: 'get',
        params: query
      })
}

// 修改单个SMT设备信息
export function updateDeviceSmt(query) {
    return request({
        url: '/api/v1/device_smt_set/',
        method: 'put',
        data: query
      })
}

// 删除单个smt设备信息
export function delDeviceSmt(query) {
    return request({
        url: '/api/v1/device_smt_delete/',
        method: 'delete',
        params: query
      })
}

// 创建防区
export function createField(query) {
  return request({
      url: '/api/v1/field_add/',
      method: 'POST',
      data: query
    })
}

// 修改单个防区信息
export function updateField(query) {
  return request({
      url: '/api/v1/change_field/',
      method: 'put',
      data: query
    })
}

// 删除单个防区信息
export function delField(query) {
  return request({
      url: '/api/v1/change_field/',
      method: 'delete',
      params: query
    })
}

// 创建节点
export function createNode(query) {
  return request({
      url: '/api/v1/node_set/',
      method: 'POST',
      data: query
    })
}

// 修改节点
export function updateNode(query) {
  return request({
      url: '/api/v1/node_set/',
      method: 'PUT',
      data: query
    })
}

// 查询节点
export function queryNode(query) {
  return request({
      url: '/api/v1/node_set/',
      method: 'GET',
      params: query
    })
}

// 删除节点
export function delNode(query) {
  return request({
      url: '/api/v1/node_set/',
      method: 'DELETE',
      params: query
    })
}

// 导入GT设备数据
export function insertGt(query) {
  return request({
    url: '/api/v1/insert_gt/',
    method: 'post',
    data: query
  })
}

// 导入SMT设备数据
export function insertSmt(query) {
  return request({
    url: '/api/v1/insert_smt/',
    method: 'post',
    data: query
  })
}

// 导入防区数据
export function insertFields(query) {
  return request({
    url: '/api/v1/insert_fields/',
    method: 'post',
    data: query
  })
}

// 导入节点数据
export function insertNodes(query) {
  return request({
    url: '/api/v1/insert_nodes/',
    method: 'post',
    data: query
  })
}

// 获取设备信息
export function deviceInfo(query) {
  return request({
      url: '/api/v1/device_data/',
      method: 'get',
      params: query
    })
}
export function deviceCRUD(query) {
  return request({
      url: '/api/v1/device_data/',
      method: 'post',
      data: query
    })
}
//获取线路信息
export function lineChange(query) {
  return request({
      url: '/api/v1/line_change/',
      method: 'get',
      params: query
    })
}
//更新告警状态
export function alertDeal(query) {
  return request({
      url: '/api/v1/alert_deal/',
      method: 'post',
      data: query
    })
}