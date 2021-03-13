/*
 * @Author: leftlevel
 * @Date: 2020-11-16 22:21:42
 * @LastEditors: leftlevel
 * @LastEditTime: 2020-12-11 17:52:12
 * @Description: 文章管理
 */
import request from '@/utils/request'

export function fetchList(params) {
    return request({
        url: '/post/list',
        method: 'get',
        params
    })
}

export function fetchListBySearchWords(params) {
    return request({
        url: '/post/searchList',
        method: 'get',
        params
    })
}

export function getArticleById(id) {
    return request({
        url: `/article/${id}`,
        method: 'get'
    })
}

export function auditSuccess(id) {
    return request({
        url: `/article/audit/success/${id}`,
        method: 'put'
    })
}

export function auditFail(id) {
    return request({
        url: `/article/audit/fail/${id}`,
        method: 'put'
    })
}

export function deleteArticleById(id) {
    return request({
        url: `/article/delete/${id}`,
        method: 'put'
    })
}

export function getArticleNumber() {
    return request({
        url: '/article/number',
        method: 'get'
    })
}

export function getCommentNumber() {
    return request({
        url: '/comment/number',
        method: 'get'
    })
}

export function getArticleBelongTagNumber() {
    return request({
        url: '/article/tag/number',
        method: 'get'
    })
}