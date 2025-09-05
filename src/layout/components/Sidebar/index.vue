<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :item="route"
          :key="route.path"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';
import useStore from '@/store';
import { Numbers } from '@/utils/code';
const { permission, setting, app } = useStore();

const route = useRoute();
const routes = computed(() => {
  // return permission.routes
 return setRoutes(permission.routes)
});

function setRoutes(data : any) {
  if (!data) {
    return []
  }
  var ret = [];
  for (var i=0;i< data.length ;i++) {
    // 权限写入缓存中
    //@ts-ignore
    if (data[i]['children'] == null || data[i]['children'].length < 1){
      if (data[i]['type'] == Numbers.authTypeUrl) {
        //TODO URL
        data[i] = {
              path: data[i]['path'],
              children: [
                  {
                      path: data[i]['path'].slice(1),
                      meta: { title: data[i]['meta']['title'], icon: data[i]['meta']['icon'] }
                  }
              ]
          }
      }
    } else {
      // @ts-ignore
      data[i]['children'] = setRoutes(data[i]['children'])
    }
    //@ts-ignore
    ret.push(data[i])
  }
  return ret
  
}
// TODO 
const showLogo = computed(() => setting.sidebarLogo);
const isCollapse = computed(() => !app.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>
