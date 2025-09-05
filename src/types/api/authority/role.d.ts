import {PageQueryParam} from "@/types/api/base";

/**
 * 查询参数类型
 */
export interface QueryParam extends PageQueryParam {
  status?: number;
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


/**
 * 添加与编辑
 */
export interface FormParam {
  id?: number;
  name?: string;
  status?: number;
  rules?: array;
  auth:string;
  project_id:number;
}

export interface DataParam {
  id?: number;
  name?: string;
  status?: number;
  auths?: array;
}


export interface AuthDataParam {
  id?: number;
  value?: number;
  label?:string;
  id?: number;
  name?: string;
  status?: number;
  auths?: array;
}