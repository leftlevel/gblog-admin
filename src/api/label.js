/*
 * @Author: leftlevel
 * @Date: 2020-10-09 19:21:55
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-11-16 22:21:12
 * @Description: 标签管理
 */
import request from '@/utils/request'

export function getTags() {
    return request({
        url: '/tag/list',
        method: 'get'
    })
}

export function search(query) {
    return request({
        url: '/tag/list/search',
        method: 'post',
        data: query
    })
}

export function getById(id) {
    return request({
        url: `/tag/${id}`,
        method: 'get'
    })
}

export function update(pojo) {
    return request({
        url: `/tag/${pojo.id}`,
        method: 'put',
        data: pojo
    })
}

export function add(pojo) {
    return request({
        url: '/tag',
        method: 'post',
        data: pojo
    })
}

export function deleteById(id) {
    return request({
        url: `/tag/${id}`,
        method: 'delete'
    })
}