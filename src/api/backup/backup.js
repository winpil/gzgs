import request from '@/utils/request'

// 创建计划备份
export function createPlan(query) {
    return request({
        url: '/api/v1/backup_plan/',
        method: 'post',
        data: query
      })
}

// 获取备份列表
export function queryPlan(query) {
    return request({
        url: '/api/v1/backup_plan/',
        method: 'get',
        params: query
      })
}

// 修改单个计划备份
export function updatePlan(query) {
    return request({
        url: '/api/v1/backup_plan/',
        method: 'put',
        data: query
      })
}

// 删除单个计划备份
export function delPlan(query) {
    return request({
        url: '/api/v1/backup_plan/',
        method: 'delete',
        params: query
      })
}