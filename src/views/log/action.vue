<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :inline="true">
      <el-form-item label="项目" prop="parent_id">
        <el-select v-model="queryParams.project_id" placeholder="Select" @change="handleQuery">
        <el-option
          v-for="item in sortListData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.admin_name"
          placeholder="真实姓名"
          autocomplete="off"
          style="width: 120px"
          clearable 
        />
      </el-form-item>
      <el-form-item>
        <el-select
            v-model="queryParams.type"
            placeholder="类型"
            clearable 
            style="width: 90px"
          >
            <el-option
              v-for="item in listType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="queryParams.time"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button type="warning" :icon="Refresh" @click="handleRefresh">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      ref="dataTableRef"
      :data="dataList"
      row-key="id"
      :tree-props="{children: 'children'}"
      highlight-current-row
      border
    >
      <el-table-column label="操作人员" fixed  prop="admin_name" width="100"/>
      <el-table-column label="类型" prop="type" align="center" width="90">
        <template #default="scope">
          <el-tag >{{ typeTitles[scope.row.type] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="IP" prop="ip" align="center" width="130"/>
      <el-table-column label="浏览器名称" prop="browser_name" width="130">
        <template #default="scope">
            <el-tooltip placement="top" trigger="click">
                <template #content> {{ scope.row.browser_name }} </template>
                <div class="overflow-ellipsis cursor-pointer">{{ scope.row.browser_name }}</div>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="浏览器版本" prop="browser_version" width="150"/>
      <el-table-column label="浏览器详细信息" prop="browser_info">
        <template #default="scope">
            <el-tooltip 
              placement="top" 
              trigger="click" 
            >
                <template #content> {{ scope.row.browser_info }} </template>
                <div class="overflow-ellipsis cursor-pointer">{{ scope.row.browser_info }}</div>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" width="300">
        <template #default="scope">
            <el-tooltip placement="bottom" trigger="click">
                <template #content><pre> {{ showContent(scope.row.content) }}</pre> </template>
                <div class="overflow-ellipsis cursor-pointer">{{ showContent(scope.row.content)}}</div>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="原因"  prop="reason" width="100">
        <template #default="scope">
            <div class="overflow-ellipsis">{{ scope.row.reason }}</div>
        </template>
      </el-table-column>
      <el-table-column label="模块" prop="module_name" align="center" width="110"/>
      <el-table-column label="登录时间" fixed="right" prop="create_time" width="160"/>
    </el-table>

    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="handleQuery()"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'role',
};
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs} from 'vue';
import {
  actionList as list
} from '@/api/log/index';

import { ElForm} from 'element-plus';
import {  Search, Refresh, Key} from '@element-plus/icons-vue';
import {
  SortName,
} from '@/types/api/authority/index';
import "@/styles/table.scss";
import {
 ActionQueryParam,ActionDataParam,
 ActionTypes
} from '@/types/api/log/login';
import useStore from "@/store";
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";
import {projectSortList} from '@/api/authority/index';
import { getAuthByKey } from '@/utils/filter';

const { my } = useStore();
const queryFormRef = ref(ElForm);
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])

const state = reactive({
  loading: true,
  total: 0,
  queryParams: {} as ActionQueryParam,
  dataList: [] as ActionDataParam[],
  listType:[] as ActionTypes[],
  publicProjectTitles:false,
  sortListData: [] as SortName[] ,
  projectSortList: false,
  logList:false,
  typeTitles :[],
});

const {
  loading,
  total,
  queryParams,
  listType,
  dataList,
  typeTitles,
  sortListData,
} = toRefs(state);

function handleRefresh() {
  state.queryParams = {} as ActionQueryParam
}

function handProjectOuery() {
  if (!state.publicProjectTitles) {
    //@ts-ignore
    my.reminder('没有项目下拉的权限')
    return
  }
  projectSortList().then((data) => {
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      //@ts-ignore
      state.sortListData = data.data;
      state.queryParams.project_id = state.sortListData[0]['id']
      handleQuery()
    } else {
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

function handleQuery() {
  state.loading = true;
  //@ts-ignore
  if (typeof state.queryParams.type == 'undefined') {
    //@ts-ignore
    state.queryParams.type = ''
  }
  list(state.queryParams).then((data) => {
    state.loading = false
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      //@ts-ignore
      state.dataList = data.data.items;
      //@ts-ignore
      state.total = data.data.count;
      //@ts-ignore
      state.listType = data.data.type
      //@ts-ignore
      data.data.type.forEach(element => {
        //@ts-ignore
        state.typeTitles[element.id] = element.name
      }); 
    } else {
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
  
}

function showContent(content:string) {
  return JSON.parse(content);
}

onMounted(() => {
  state.logList = getAuthByKey(CONFIG_DATA.logLoginId) != '' ? true : false
  state.publicProjectTitles = getAuthByKey(CONFIG_DATA.publicProjectTitlesId) != '' ? true : false
  handProjectOuery()
});
</script>

<style>
.overflow-ellipsis {
    overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-form--inline .el-form-item {
    margin-right: 10px;
}
.cursor-pointer {
    cursor: pointer;
}
</style>