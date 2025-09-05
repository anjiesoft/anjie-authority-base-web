import { PermissionState } from '@/types/store/permission';
import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { constantRoutes } from '@/router';
import { listRoutes } from '@/api/system/menu';
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";
import { localStorage } from '@/utils/storage';
import { fa } from 'element-plus/es/locale';

const modules = import.meta.glob('../../views/**/**.vue');
export const Layout = () => import('@/layout/index.vue');

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    if (roles.includes('ROOT')) {
      
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles !== undefined) {
        return (route.meta.roles as string[]).includes(role);
      }
    });
  }
  return false;
};

export const filterAsyncRoutes = (
  routes: RouteRecordRaw[],
  roles: string[]
) => {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmp = { ...route } as any;
    if (hasPermission(roles, tmp)) {
      if (tmp.component == 'Layout') {
        tmp.component = Layout;
      } else {
        const component = modules[`../../views/${tmp.component}.vue`] as any;
        if (component) {
          tmp.component = modules[`../../views/${tmp.component}.vue`];
        } else {
          tmp.component = modules[`../../views/error-page/404.vue`];
        }
      }
      res.push(tmp);
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
    }
  });
  return res;
};

const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    generateRoutes(roles: string[]) {
      return new Promise((resolve, reject) => {
        listRoutes({
          project_id:CONFIG_DATA.projectId
        })
          .then((response) => {
            // @ts-ignore
            if (response.code !== CODES.ok.code) {
              // @ts-ignore
              return reject(response.message || 'Error');
            }
            // @ts-ignore
            var routes = []
            localStorage.remove(CONFIG_DATA.authKey)
            routes = getRoutes(response.data['menu'])
            setAuths(response.data['auth'])
            localStorage.set(CONFIG_DATA.authKey, storageKeys)
            // @ts-ignore
            const accessedRoutes = filterAsyncRoutes(routes, roles);
            this.setRoutes(accessedRoutes);
            resolve(accessedRoutes);
          })
      });
    },
  },
});

const setAuths = (data: string[]) => {
  if (!data) {
    return
  }

  for (var i=0;i< data.length ;i++) {
    // @ts-ignore
    storageKeys[data[i]['identification']] = data[i]['identification']
  }
  
}

var storageKeys = {}
const getRoutes = (data : string[]) => {
  
  if (!data) {
    return []
  }
  var ret = [];
  for (var i=0;i< data.length ;i++) {
    // 权限写入缓存中
    // @ts-ignore
    if (data[i]['type'] !== Numbers.authTypeButton){
      var tmp = {};
      // @ts-ignore
      tmp["path"] = data[i]['path']
      // @ts-ignore
      if (data[i]['level'] == 1 ){
        // @ts-ignore
        tmp["component"] = "Layout"
        // @ts-ignore
        tmp["redirect"] = "/"
      } else {
        // @ts-ignore
        // tmp["component"] = "111"
        tmp["component"] = data[i]['view_path']
        // @ts-ignore
        tmp["name"] = data[i]['path']
      }
      // @ts-ignore
      tmp['meta'] = {}
      // @ts-ignore
      tmp['meta']["title"] = data[i]['name']
      // @ts-ignore
      tmp['type'] = data[i]['type']
      // @ts-ignore
      tmp['meta']["icon"] = data[i]['icon']
      // @ts-ignore
      if (data[i]['children'] == null || data[i]['children'].length < 1 || data[i]['type'] == Numbers.authTypeWeb){
        // @ts-ignore
        tmp['meta']["alwaysShow"] = false
      } else {
        // @ts-ignore
        tmp['meta']["alwaysShow"] = true
      }
      // @ts-ignore
      tmp['meta']["hidden"] = data[i]['is_show'] == 1 ? false : true
      // @ts-ignore
      tmp['meta']["roles"] = ["ADMIN"]
      // @ts-ignore
      tmp['meta']["keepAlive"] = true
      // @ts-ignore
      if (data[i]['children'] == null || data[i]['children'].length < 1){
        // @ts-ignore
        tmp["children"] = []
      } else {
        // @ts-ignore
        tmp["children"] = getRoutes(data[i]['children'])
      }
      //@ts-ignore
      ret.push(tmp)
      
    }
  }


  return ret
}

export default usePermissionStore;
