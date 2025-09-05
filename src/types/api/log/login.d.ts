import {PageQueryParam} from "@/types/api/base";

/**
 * 查询参数类型
 */
export interface QueryParam extends PageQueryParam {
  status?: number;
  size?: number;
  name?: string;
  time?:Array;
  auth:string;
  username?:string;
}

export interface DataParam {
  id: number;
  admin_id: number;
  username: string;
  name: string;
  browser_info: string;
  browser_name: string;
  browser_version: Array;
  ip: string;
  status: number;
  create_time:string;
  reason:string;
}

/**
 * 查询参数类型
 */
export interface ActionQueryParam extends PageQueryParam {
  size?: number;
  admin_name?: string;
  type?:number;
  module_name?:string;
  time?:Array;
  auth:string;
  project_id:number;
}

export interface ActionDataParam {
  id: number;
  admin_id: number;
  admin_name: string;
  type: string;
  browser_info: string;
  browser_name: string;
  browser_version: Array;
  ip: string;
  content: number;
  create_time:string;
  module_name:string;
  reason:string;
}

export interface ActionTypes {
  id:number;
  name:string;
}