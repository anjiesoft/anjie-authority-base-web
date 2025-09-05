export interface UserState {
  token: string;
  nickname: string;
  avatar: string;
  id: number | null, //登录用户ID
  phone: string, //手机号
  email: string, //邮箱
  create_time: string, //创建时间
  userState: number, //状态 1正常 2禁用
  roles: string[];
  perms: string[];
}
