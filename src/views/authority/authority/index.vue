<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :inline="true">
      <el-form-item label="项目" prop="parent_id">
        <el-select v-model="selectProjectId" placeholder="Select" @change="handleQuery">
        <el-option
          v-for="item in sortListData"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-if="authEdit && selectProjectId != 0" type="success" :icon="Plus" @click="handleEdit(0)">{{$t('navbar.add') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-if="authList"
      ref="dataTableRef"
      :data="dataList"
      row-key="id"
      :tree-props="{children: 'children'}"
      highlight-current-row
      border
    >
      <el-table-column fixed label="权限名" prop="name" min-width="200">
        <template #default="scope">
          {{scope.row.name}}
          <svg-icon
            :icon-class="scope.row.icon"
          />
        </template>
      </el-table-column>
      <el-table-column label="加载页面" prop="view_path" min-width="200"/>
      <el-table-column label="路由路径" prop="path" min-width="180">
        <template #default="scope">
          {{ getPath(scope.row.path, scope.row.type)}}
        </template>
      </el-table-column>
      <el-table-column label="接口地址" prop="api" min-width="185"/>
      <el-table-column label="权限标识" prop="identification" min-width="150"/>
      
      <el-table-column label="是否可见" prop="is_show" align="center" width="100">
        <template #default="scope">
          <status :status="scope.row.is_show"/>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" width="80">
        <template #default="scope">
          <el-tag>{{ getTypes(scope.row.type)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="authStatus" fixed="right" label="状态" prop="status" align="center" width="70">
        <template #default="scope">
          <el-switch
            @change="changeStatus(scope.row.id, $event, scope)"
            v-model="scope.row.status"
            inline-prompt
            :active-value=1
            :inactive-value=2
            active-text="开"
            inactive-text="关"
          />
        </template>
      </el-table-column>

      <el-table-column fixed="right" v-if="authEdit" label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
            v-if="authEdit"
            type="primary"
            :icon="Edit"
            circle
            plain
            @click.stop="handleEdit(scope.row.id)"
          />
          
        </template>
      </el-table-column>
    </el-table>

    <edit-dialog
      v-if="dialog.visible"
      :dialog="dialog"
      @closeDialog="dialogClose($event)"
      @getDataList="handleQuery()"
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
import {list,status,projectSortList,del} from '@/api/authority/index';

import { ElForm, ElMessageBox} from 'element-plus';
import { Plus, Edit } from '@element-plus/icons-vue';

import "@/styles/table.scss";
import {
  DataParam,
  SortName,
} from '@/types/api/authority/index';
import Status from '@/components/ObStatus/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import EditDialog from "./components/editDialog.vue";
import useStore from "@/store";
import { getAuthByKey } from "@/utils/filter";
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";

const { my } = useStore();
const queryFormRef = ref(ElForm);

const state = reactive({
  loading: true,
  dialog: { id : 0, visible: false, project_id: '', title:""},
  dataList: [] as DataParam[],
  authAdd: false,
  authEdit: false,
  authStatus: false,
  authDetail: false,
  authTitles: false,
  authList:false,
  publicProjectTitles:false,
  selectProjectId: 0,
  sortListData: [] as SortName[] ,
  num : Numbers,
});

const {
  loading,
  dialog,
  dataList,
  authEdit,
  authStatus,
  authList,
  selectProjectId,
  sortListData,
} = toRefs(state);

function getPath(path:string, type:number) {
  if (type == Numbers.authTypeUrl) {
    path = path.slice(1)
  }
  return path
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
      state.selectProjectId = state.sortListData[0]['id']
      handleQuery()
    } else {
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

function changeStatus(id:number, val: any, obj:number) {
  if (val == Numbers.statusForbidden) {
    ElMessageBox.prompt('确认禁用该数据项?', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then((value) => {
      setStatus(obj, id, val, value.value)
    }).catch(() => {
      //@ts-ignore
      obj.row.status = val == Numbers.one ? Numbers.two : Numbers.one
    });
  } else {
    setStatus(obj, id, val, "")
  }
}

function setStatus (obj:number, id: number, val: number, reason:string)
{
  status(id, val, reason).then((data) => {
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      //@ts-ignore
      obj.row.status = val
      //@ts-ignore
      state.row = val
      return my.ok('修改成功');
    } else {
      //@ts-ignore
      obj.row.status =  val == Numbers.one ? Numbers.two : Numbers.one
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

function handleQuery() {
  state.loading = true;
  list({
    project_id: state.selectProjectId,
    project: 0,
    auth: ''
  }).then((data) => {
    state.loading = false;
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      //@ts-ignore
      state.dataList = data.data;
    } else {
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

function handleEdit(id : number) {
 
  state.dialog = {
    id: id,
    //@ts-ignore
    project_id: state.selectProjectId,
    title: id > 0 ? '编辑' : '添加',
    visible: true,
  };
}

function getTypes(type: string | number) {
  let typeTitle = ''
  switch (type) {
    case Numbers.authTypeDir:
      typeTitle = '目录'
    break;
    case Numbers.authTypeWeb:
      typeTitle = '页面'
    break;
      case Numbers.authTypeButton:
        typeTitle = '按钮'
    break;
      case Numbers.authTypeUrl:
        typeTitle = '外链'
    break
  }

  return typeTitle;
}

const dialogClose = (e: boolean) => {
  state.dialog.visible = e
}

onMounted(() => {
  state.authEdit = getAuthByKey(CONFIG_DATA.authorityEditId) != '' ? true : false
  state.authStatus = getAuthByKey(CONFIG_DATA.authorityStatusId) != '' ? true : false
  state.publicProjectTitles = getAuthByKey(CONFIG_DATA.publicProjectTitlesId) != '' ? true : false
  state.authList = getAuthByKey(CONFIG_DATA.authorityListId) != '' ? true : false
  handProjectOuery()
});
</script>
