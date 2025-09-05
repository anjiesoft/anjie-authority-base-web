import {
  DataParam,
  FormParam, Option,
  QueryParam,
} from '@/types/api/authority/index';

import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import {RepData} from "@/types/api/base";

/**
 * 列表
 *
 */
export function imageToken(params ?: QueryParam): AxiosPromise<DataParam> {
  return request({
    url: '/public/image/token',
    method: 'post',
    params,
  });
}
