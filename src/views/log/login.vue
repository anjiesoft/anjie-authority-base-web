<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :inline="true">
        <el-form-item>
        <el-input
          v-model="queryParams.username"
          placeholder="账号"
          autocomplete="off"
          style="width: 120px"
          clearable 
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="真实姓名"
          autocomplete="off"
          style="width: 120px"
          clearable 
        />
      </el-form-item>
      <el-form-item>
        <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable 
            style="width: 90px"
          >
            <el-option
              v-for="item in listStatus"
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
      <el-table-column label="账号" fixed prop="username" width="150" />
      <el-table-column label="真实姓名" prop="name" width="100"/>
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
            <el-tooltip placement="top" trigger="click">
                <template #content> {{ scope.row.browser_name }} </template>
                <div class="overflow-ellipsis cursor-pointer">{{ scope.row.browser_info }}</div>
            </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="失败原因"  prop="reason" width="150">
        <template #default="scope">
            <div class="overflow-ellipsis">{{ scope.row.reason }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center" width="70">
        <template #default="scope">
          <status :status="scope.row.status"/>
        </template>
      </el-table-column>
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
  loginList as list
} from '@/api/log/index';

import { ElForm} from 'element-plus';
import {  Search, Refresh, Key} from '@element-plus/icons-vue';
import Status from '@/components/ObStatus/index.vue';

import "@/styles/table.scss";
import {
 QueryParam,DataParam
} from '@/types/api/log/login';
import useStore from "@/store";
import {CODES} from "@/utils/code";

const { my } = useStore();
const queryFormRef = ref(ElForm);
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])

const state = reactive({
  loading: true,
  total: 0,
  queryParams: {} as QueryParam,
  dataList: [] as DataParam[],
  listStatus:CODES.stauts,
});

const {
  loading,
  total,
  queryParams,
  listStatus,
  dataList,
} = toRefs(state);

function handleRefresh() {
  state.queryParams = {} as QueryParam
}

function handleQuery() {
  state.loading = true;
  //@ts-ignore
  list(state.queryParams).then((data) => {
    state.loading = false;
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      //@ts-ignore
      state.dataList = data.data.items;
      //@ts-ignore
      state.total = data.data.count;
    } else {
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

onMounted(() => {
  handleQuery()
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