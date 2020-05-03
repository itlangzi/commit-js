export const COMT_VERSION = VERSION // eslint-disable-line

export const AuthorRegexp = /^[\w\u4e00-\u9fa5](([\w\u4e00-\u9fa5\s,/#\s-]+)?[\w\u4e00-\u9fa5])?$/
export const EmailRegexp = /^\w+([.-]\w+)*@[\dA-Za-z]+(-[\dA-Za-z]+)?(\.[a-z]{2,5}){1,2}$/
export const WebsiteRegexp = /^(https?:)\/\/[^.]{2,}/

export const trim = (value = '') => (value || '').replace(/^\s+/, '').replace(/\s+$/, '')
export const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'
export const isFunction = fn => typeof fn === 'function'