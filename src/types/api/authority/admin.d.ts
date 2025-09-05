import {PageQueryParam} from "@/types/api/base";

/**
 * 查询参数类型
 */
export interface QueryParam extends PageQueryParam {
  status?: number;
  company_id?: number;
  size?: number;
  name?: string;
  auth:string;
}

export interface Option {
  value: string;
  label: string;
}

export interface DataParam {
  id: number;
  username: string;
  avatar: string;
  name: string;
  phone: string;
  email: string;
  roles: Array;
  last_time: string;
  status: number;
}

/**
 * 添加与编辑
 */
export interface FormParam {
  id?: number;
  username: string;
  name: string;
  phone: string;
  email:string
  password?: string;
  roles?: array;
  avatar ?: string
  company_id ?: number
  auth : string
}

export interface RoleOption {
  id: number;
  name: string;
  items?: RoleOption[];
}

export interface PwdOption {
  id: number;
  password: string;
}