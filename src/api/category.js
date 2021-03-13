/*
 * @Author: leftlevel
 * @Date: 2020-10-17 14:04:24
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-11-16 22:20:38
 * @Description: 分类管理
 */
import request from '@/utils/request'

export function getTypes() {
    return request({
        url: '/type/list',
        method: 'get'
    })
}

export function getById(id) {
    return request({
        url: `/type/${id}`,
        method: 'get'
    })
}

export function update(pojo) {
    return request({
        url: `/type/${pojo.id}`,
        method: 'put',
        data: pojo
    })
}

export function add(pojo) {
    return request({
        url: '/type',
        method: 'post',
        data: pojo
    })
}

export function deleteById(id) {
    return request({
        url: `/type/${id}`,
        method: 'delete'
    })
}