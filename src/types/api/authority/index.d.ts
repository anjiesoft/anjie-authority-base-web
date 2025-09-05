import {PageQueryParam} from "@/types/api/base";

/**
 * 查询参数类型
 */
export interface QueryParam extends PageQueryParam {
  status?: number;
  project_id?:number|string;
  project:number,
  auth:string,
  type ?:int
}

export interface QueParam {
  data : any;
  code : number
  message : string
}

export interface Option {
  value: string;
  label: string;
  checked?: boolean;
  children?: Option[];
}

export interface SortName {
  id: number;
  name:string;
  logo:string;
}

/**
 * 详情
 */
export interface DetailParam  {
  auth:string;
  type:number;
  auth_id:number;
}

/**
 * 添加与编辑
 */
export interface FormParam {
  id?: number;
  api?: string;
  view_path?: string;
  path?: string;
  remarks?: string;
  icon?: string;
  name?: string;
  sort?: number;
  parent_id?: number;
  is_show?: number;
  identification?:string
  project_id:number
  remarks?:string
  auth:number|string,
  type:number,
  parent_type:number,
}

export interface DataParam {
  id?: number;
  api?: string;
  view_path?: string;
  path?: string;
  icon?: string;
  name?: string;
  sort?: number;
  parent_id?: number;
  type?: number;
  status?: number;
  is_show?: number;
  level?: number;
  parent_ids?: string;
  remarks?: string;
  jurisdiction?: string;
  create_time?: string;
  update_time?: string;
  items ?: any;
  identification ?: string;
  reason ?: string;
}