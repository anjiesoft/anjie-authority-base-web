import {
  DataParam,
  FormParam, Option,
  QueryParam
} from '@/types/api/authority/index';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {RepData} from "@/types/api/base";
import { CONFIG_DATA } from '@/utils/code';
import { getAuthByKey } from '@/utils/filter';

/**
 * 列表
 *
 */
export function list(data : QueryParam): AxiosPromise<DataParam> {
  data.auth = getAuthByKey(CONFIG_DATA.authorityListId)
  return request({
    url: '/admin/authority/items',
    method: 'post',
    data,
  });
}

/**
 * 下拉列表
 */
export function sortList(data : QueryParam): AxiosPromise<RepData<Option>> {
  data.auth = getAuthByKey(CONFIG_DATA.authorityTitlesId)
  data.type = 1
  data.project = CONFIG_DATA.projectId
  return request({
    url: '/admin/authority/name_items',
    method: 'post',
    data,
  });
}

/**
 * 编辑
 *
 * @param data
 */
export function edit(id:number, data : FormParam) : AxiosPromise<RepData<any>> {
  data.id = id
  data.auth = getAuthByKey(CONFIG_DATA.authorityEditId)
  return request({
    url: '/admin/authority/edit',
    method: 'post',
    data,
  });
}


/**
 * 详情
 * @param id
 */
export function detail(id : number) : AxiosPromise<any> {
  const data = {id : id, auth:getAuthByKey(CONFIG_DATA.authorityDetailId), project:CONFIG_DATA.projectId}
  return request({
    url: '/admin/authority/info',
    method: 'post',
    data,
  });
}

/**
 * 状态
 * @param id
 * @param status
 */
export function status(id : number, status : number, reason:string) : AxiosPromise<any> {
  const data = {id : id, status : status, reason:reason, auth:getAuthByKey(CONFIG_DATA.authorityStatusId), project:CONFIG_DATA.projectId}
  return request({
    url: '/admin/authority/status',
    method: 'post',
    data,
  });
}

/**
 * 状态
 * @param id
 * @param status
 */
export function del(id : number, reason:string) : AxiosPromise<any> {
  const data = {auth:getAuthByKey(CONFIG_DATA.roleDelId), id : id, reason:reason}
  return request({
    url: '/admin/authority/del',
    method: 'post',
    data,
  });
}

/**
 * 状态
 * @param id
 * @param status
 */
export function projectSortList() : AxiosPromise<any> {
  const data = {auth:getAuthByKey(CONFIG_DATA.publicProjectTitlesId)}
  return request({
    url: '/admin/project/name_items',
    method: 'post',
    data,
  });
}