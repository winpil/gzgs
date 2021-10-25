import request from '@/utils/request'

// 获取振动数据列表
export function queryData(query) {
    return request({
        url: '/api/v1/vibration_list/',
        method: 'get',
        params: query
      })
}
export function queryDataTuBiao(query) {
  return request({
      url: '/api/v1/show_data/',
      method: 'get',
      params: query
    })
}
export function queryDataTuBiaoMap(query) {
  return request({
      url: '/api/v1/waveform/',
      method: 'get',
      params: query
    })
}
export function queryDataTuBiaoOption(query) {
  return request({
      url: '/api/v1/show_data/',
      method: 'get',
      params: query
    })
}
export function queryZhiNengFenYeTuBiao(query) {
  return request({
      url: '/api/v1/alert_level/',
      method: 'get',
      params: query
    })
}
export function getTimeInfo(query) {
  // debugger
  return request({
    url: '/api/v1/get_time/',
    method: 'get',
    params: query
  })
}
export function alarmTrend(query) {
  return request({
      url: '/api/v1/alarm_trend/',
      method: 'get',
      params: query
    })
}