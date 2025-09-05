import { Option } from '@/types/common';
import {
  DictFormTypeData,
  DictItemFormData,
  DictItemPageResult,
  DictItemQueryParam,
  DictPageResult,
  DictQueryParam,
} from '@/types/api/system/dict';
import request from '@/utils/request';
import { AxiosPromise } from 'axios';
/**
 * 根据字典类型编码获取字典数据项
 *
 * @param typeCode 字典类型编码
 */
export function getDictItemsByTypeCode(
  typeCode: string
): AxiosPromise<Option[]> {
  return request({
    url: '/youlai-admin/api/v1/dict-items/select_list',
    method: 'get',
    params: { typeCode: typeCode },
  });
}


