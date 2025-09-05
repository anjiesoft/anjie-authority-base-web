import {
  LoginFormData,
  Login2FormData,
  LoginResponseData,
} from '@/types/api/system/login';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';

/**
 * 登录
 * @param data
 */
export function login(data: LoginFormData): AxiosPromise<LoginResponseData> {
  return request({
    // url: 'sales/v1/login',
    url: '/admin/login',
    method: 'post',
    data
  })
}
