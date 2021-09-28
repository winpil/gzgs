import request from '@/utils/request'

// 获取告警事件列表
export function queryAlarm(query) {
    return request({
        url: '/api/v1/alarm_list/',
        method: 'get',
        params: query
      })
}
// 获取实时告警事件列表
export function queryRealTimeAlarm(query) {
    return request({
        url: '/api/v1/alarm_query/',
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
export function alertWhite(query) {
  return request({
    url: '/api/v1/alert_white/',
    method: 'post',
    data: query
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
//清空告警
export function clearAlarm(query) {
  return request({
    url: '/api/v1/clear_alarm/',
    method: 'post',
    data: query
  })
}
//告警统计信息
export function queryAlarmCount(query) {
  return request({
    url: '/api/v1/alarm_count/',
    method: 'get',
    params: query
  })
}
export function alarmInfo(query) {
  return request({
      url: '/api/v1/alert_log/',
      method: 'get',
      params: query
    })
}
export function alertParamInfo(query) {
  return request({
      url: '/api/v1/alert_param/',
      method: 'get',
      params: query
    })
}
export function alertParamCRUD(query) {
  return request({
      url: '/api/v1/alert_param/',
      method: 'post',
      data: query
    })
}
export function workParamInfo(query) {
  return request({
      url: '/api/v1/work_param/',
      method: 'get',
      params: query
    })
}
export function workParamCRUD(query) {
  return request({
      url: '/api/v1/work_param/',
      method: 'post',
      data: query
    })
}
export function opeLogInfo(query) {
  return request({
      url: '/api/v1/ope_log/',
      method: 'get',
      params: query
    })
}
export function shakeInfo(query) {
  return request({
      url: '/api/v1/shake_info/',
      method: 'get',
      params: query
    })
}
export function alarmChuli(query) {
  return request({
      url: '/api/v1/alert_deal/',
      method: 'post',
      data: query
    })
}


