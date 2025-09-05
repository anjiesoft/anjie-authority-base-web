import {
  DataParam,
  FormParam,
} from '@/types/api/authority/role';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {RepData} from "@/types/api/base";
import { getAuthByKey } from '@/utils/filter';
import { CONFIG_DATA } from '@/utils/code';

/**
 * 获取分页数据
 *
 */
export function list(projectId:number|string): AxiosPromise<DataParam> {
  const data = {auth:getAuthByKey(CONFIG_DATA.roleListId), project_id:projectId}
  return request({
    url: '/admin/role/items',
    method: 'post',
    data,
  });
}

/**
 * 编辑
 *
 * @param data
 */
export function edit(data : FormParam, projectId:number) : AxiosPromise<RepData<any>> {
  data.auth = getAuthByKey(CONFIG_DATA.roleEdidId)
  data.project_id = projectId
  return request({
    url: '/admin/role/edit',
    method: 'post',
    data,
  });
}

/**
 * 详情
 * @param id
 */
export function auths(projectId : number) : AxiosPromise<any> {
  const data = {project_id:projectId, auth:getAuthByKey(CONFIG_DATA.authorityTitlesId), type : 5}
  return request({
    url: '/admin/authority/name_items',
    method: 'post',
    data,
  });
}

/**
 * 详情
 * @param id
 */
export function detail(id : number) : AxiosPromise<any> {
  const data = {id:id, auth:getAuthByKey(CONFIG_DATA.roleDetailId)}
  return request({
    url: '/admin/role/info',
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
  const data = {id : id, status : status,reason:reason, auth:getAuthByKey(CONFIG_DATA.roleStatusId)}
  return request({
    url: '/admin/role/status',
    method: 'post',
    data,
  });
}

