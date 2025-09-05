import { defineStore } from 'pinia';
import { LoginFormData } from '@/types/api/system/login';
import { UserState } from '@/types/store/user';
import { ElMessage } from 'element-plus';

import { localStorage } from '@/utils/storage';
import { login } from '@/api/login';
import { getUserInfo } from '@/api/system/user';
import { resetRouter } from '@/router';
import {CODES, CONFIG_DATA} from "@/utils/code";


const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: localStorage.get('access_token') || '',
    nickname: '',
    avatar: '',
    roles: [],
    perms: [],
  }),
  actions: {
    async RESET_STATE() {
      this.$reset();
    },
    /**
     * 登录
     */
    login(loginData: LoginFormData) {
      const { username, password } = loginData;
      return new Promise((resolve, reject) => {
        login({
          username: username.trim(),
          password: password,
        })
          .then((response) => {
            // @ts-ignore
            const { code, data, message} = response;
            if (code === CODES.ok.code) {
              localStorage.set(CONFIG_DATA.autoKey, data.access_token);
              localStorage.set(CONFIG_DATA.autoRefreshKey, data.refresh_token);
              // @ts-ignore
              this.token = data;

              resolve(data);
            } else {
              ElMessage.error(message)
              // @ts-ignore
              return reject(message);
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    /**
     *  获取用户信息（昵称、头像、角色集合、权限集合）
     */
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            if (!data) {
              return reject('Verification failed, please Login again.');
            }
            const { name, avatar, perms } = data;
            this.nickname = name;
            this.avatar = avatar;
            this.roles = ['ADMIN'];
            this.perms = perms;

            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    /**
     *  注销
     */
    logout() {
      return new Promise((resolve, reject) => {
        localStorage.remove(CONFIG_DATA.autoKey);
        localStorage.remove(CONFIG_DATA.autoRefreshKey);
        localStorage.remove(CONFIG_DATA.authKey);
        this.RESET_STATE();
        resetRouter();
        resolve(null);
      });
    },

    /**
     * 清除 Token
     */
    resetToken() {
      return new Promise((resolve) => {
        localStorage.remove(CONFIG_DATA.autoKey);
        localStorage.remove(CONFIG_DATA.autoRefreshKey);
        localStorage.remove(CONFIG_DATA.authKey);
        this.RESET_STATE();
        resolve(null);
      });
    },
  },
});

export default useUserStore;
