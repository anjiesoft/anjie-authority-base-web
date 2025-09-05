import {
  FormParam,
} from '@/types/api/company/project';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {RepData} from "@/types/api/base";
import { getAuthByKey } from '@/utils/filter';
import { CONFIG_DATA } from '@/utils/code';

/**
 * 列表
 *
 */
export function list(): AxiosPromise<RepData<any>> {
  const data = {auth : getAuthByKey(CONFIG_DATA.projectListId)}
  return request({
    url: '/admin/project/items',
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
  data.auth = getAuthByKey(CONFIG_DATA.projectEditId)
  return request({
    url: '/admin/project/edit',
    method: 'post',
    data,
  });
}

/**
 * 详情
 * @param auth 
 * @param id
 */
export function detail(id : number) : AxiosPromise<any> {
  const data = {id:id, auth : getAuthByKey(CONFIG_DATA.projectDetailId)}
  return request({
    url: '/admin/project/info',
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
  const data = {auth : getAuthByKey(CONFIG_DATA.projectStatusId), id : id, status : status, reason:reason}
  return request({
    url: '/admin/project/status',
    method: 'post',
    data,
  });
}