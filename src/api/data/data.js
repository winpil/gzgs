import request from '@/utils/request'

// 获取振动数据列表
export function queryData(query) {
    return request({
        url: '/api/v1/vibration_list/',
        method: 'get',
        params: query
      })
}