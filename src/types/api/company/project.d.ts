import {PageQueryParam} from "@/types/api/base";

/**
 * 查询参数类型
 */
export interface QueryParam extends PageQueryParam {
  status?: number;
  name ?: string;
  auth :string;
}

/**
 * 添加与编辑
 */
export interface FormParam {
  id?: number;
  principal_id: number;
  name: string;
  remarks?: string;
  auth :string;
}

export interface DataParam {
  id?: number;
  name?: number;
  status?: number;
  remarks?:number;
  logo?:number;
  reason?:number;
  create_time?:string;
}
