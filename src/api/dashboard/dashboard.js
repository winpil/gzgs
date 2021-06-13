import request from '@/utils/request';

// 获取区域内所有责任区防区GPS信息列表
export function queryAreaGps(query) {
    return request({
        url: '/api/v1/area_gps_list/',
        method: 'get',
        params: query
      })
}

// 获取设备GPS信息列表
export function queryDeviceGps(query) {
  return request({
      url: '/api/v1/device_query/',
      method: 'get',
      params: query
    })
}

// 查询区域内统计信息 默认一周
export function getAreaInfo(query) {
  return request({
      url: '/api/v1/area_get/',
      method: 'get',
      params: query
    })
}

// 根据ID查询单个责任区信息（zone of responsibility） 默认一周
export function queryZoneInfo(query) {
  return request({
      url: '/api/v1/zone_query/',
      method: 'post',
      params: query
    })
}

// 查询单个设备信息
export function getDeviceInfo(query) {
  return request({
      url: '/api/v1/device_get/',
      method: 'post',
      params: query
    })
}

// 获取地图可视化中心坐标
export function getMapCenter(query) {
  return request({
      url: '/api/v1/map_center/',
      method: 'post',
      params: query
    })
}

// 获取报警防区gps
export function getAlarmFields(query) {
  return request({
      url: '/api/v1/get_fields_nodes/',
      method: 'get',
      params: query
    })
}