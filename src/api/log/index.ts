import {
  ActionQueryParam,
  DataParam,
  QueryParam,
} from '@/types/api/log/login';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { getAuthByKey } from '@/utils/filter';
import { CONFIG_DATA } from '@/utils/code';

/**
 * 获取分页数据
 *
 */
export function loginList(data : QueryParam): AxiosPromise<DataParam> {
  data.auth = getAuthByKey(CONFIG_DATA.logLoginId)
  //@ts-ignore
  if (data.status == "") {
    delete data.status
  }
  return request({
    url: '/admin/log/login',
    method: 'post',
    data,
  });
}

export function actionList(data : ActionQueryParam): AxiosPromise<DataParam> {
  data.auth = getAuthByKey(CONFIG_DATA.logActionId)
  //@ts-ignore
   if (data.type == "") {
    delete data.type
  } else {
      //@ts-ignore
      data.type = parseInt(data.type)
  }
  
  return request({
    url: '/admin/log/action',
    method: 'post',
    data,
  });
}