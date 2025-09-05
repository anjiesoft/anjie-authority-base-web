import {
  DataParam,
  FormParam,
  QueryParam,
} from '@/types/api/authority/admin';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {RepData} from "@/types/api/base";
import { getAuthByKey } from '@/utils/filter';
import { CONFIG_DATA } from '@/utils/code';

/**
 * 获取分页数据
 *
 */
export function list(data : QueryParam): AxiosPromise<DataParam> {
  data.auth = getAuthByKey(CONFIG_DATA.adminListId)
  return request({
    url: '/admin/admin/items',
    method: 'post',
    data,
  });
}

/**
 * 编辑
 *
 * @param data
 */
export function edit(data : FormParam) : AxiosPromise<RepData<any>> {
  data.auth = getAuthByKey(CONFIG_DATA.adminEditId)
  return request({
    url: '/admin/admin/edit',
    method: 'post',
    data,
  });
}

/**
 * 详情
 * @param id
 */
export function detail(id : number) : AxiosPromise<any> {
  const data = {id:id, auth: getAuthByKey(CONFIG_DATA.adminDetailId)}
  return request({
    url: '/admin/admin/info',
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
  const data = {id : id, status : status, reason:reason, auth: getAuthByKey(CONFIG_DATA.adminStatusId)}
  return request({
    url: '/admin/admin/status',
    method: 'post',
    data,
  });
}

export function password(id : number, password : string) : AxiosPromise<any> {
  const data = {id : id, password : password, auth: getAuthByKey(CONFIG_DATA.adminPasswordId)}
  return request({
    url: '/admin/admin/password',
    method: 'post',
    data,
  });
}

export function roles() : AxiosPromise<any> {
  const data = {auth: getAuthByKey(CONFIG_DATA.roleAuthsTitleId)}
  return request({
    url: '/admin/role/name_items',
    method: 'post',
    data,
  });
}

export function ownPassword(pwd:string): AxiosPromise<any> {
  const data = {"password":pwd}
  return request({
    url: '/admin/admin/ownpwd',
    method: 'post',
    data,
  });
}