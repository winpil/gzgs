import request from '@/utils/request'

// 获取告警事件列表
export function queryAlarm(query) {
    return request({
        url: '/api/v1/alarm_list/',
        method: 'get',
        params: query
      })
}

// 获取告警事件列表
export function dealAlarm(query) {
    return request({
        url: '/api/v1/alarm_deal/',
        method: 'put',
        params: query
      })
}

// 获取告警事件条件
export function getAlarmJudge(query) {
  return request({
      url: '/api/v1/judge/',
      method: 'get',
      params: query
    })
}

// 修改告警事件条件
export function updateAlarmJudge(query) {
  return request({
      url: '/api/v1/judge/',
      method: 'put',
      params: query
    })
}

// 导入事件数据
export function insertEvent(query) {
  return request({
    url: '/api/v1/insert_event/',
    method: 'post',
    data: query
  })
}