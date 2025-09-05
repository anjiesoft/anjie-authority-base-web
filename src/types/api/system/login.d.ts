/**
 * 登录表单类型声明
 */
export interface LoginFormData {
  username: string;
  password: string;
}

/**
 * 登录表单类型声明
 */
export interface Login2FormData {
  name: string;
  pwd: string;
}

/**
 * 登录响应类型声明
 */
export interface LoginResponseData {
  refresh_token: any;
  access_token:any;
  code: number;
  data: string,
  message: string;
}

/**
 * 验证码类型声明
 */
export interface Captcha {
  img: string;
  uuid: string;
}
