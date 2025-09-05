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
        <el-button v-if="roleEdit && selectProjectId != ''" 
        type="success" :icon="Plus" @click="handleEdit(0)">
        {{$t('navbar.add') }}</el-button>
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
      <el-table-column label="序号" type="index" width="100"/>
      <el-table-column label="角色名" prop="name" width="180"/>
      <el-table-column label="权限" prop="auths" >
        <template #default="scope">
          <el-tag class="role-tag" v-for="item in scope.row.rule_items">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="roleStatus" label="状态" prop="status" align="center" width="70">
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
      <el-table-column v-if="roleEdit" label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
          v-if="roleEdit"
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
      @getDataList="handleQuery"
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
  list,status,edit
} from '@/api/authority/role';
import {projectSortList} from '@/api/authority/index';

import { ElForm, ElMessageBox} from 'element-plus';
import { Plus, Edit, Delete } from '@element-plus/icons-vue';


import {
  DataParam,
  AuthDataParam,
} from '@/types/api/authority/role';
import EditDialog from "./components/editDialog.vue";
import useStore from "@/store";
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";
import "@/styles/table.scss";
import { getAuthByKey } from '@/utils/filter';

const { my } = useStore();
const queryFormRef = ref(ElForm);

const state = reactive({
  loading: true,
  dialog: { id : 0, visible: false, title:"", project_id:"" },
  dataList: [] as DataParam[],
  roleEdit:false,
  roleStatus:false,
  roleList:false,
  publicProjectTitles:false,
  sortListData: [] as AuthDataParam,
  selectProjectId:'',
});

const {
  loading,
  dialog,
  dataList,
  roleStatus,
  roleEdit,
  roleList,
  publicProjectTitles,
  sortListData,
  selectProjectId,
} = toRefs(state);

function handleQuery() {
  state.loading = true;
  list(state.selectProjectId).then((data) => {
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
      //@ts-ignore
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
      obj.row.status = val == Numbers.one ? Numbers.two : Numbers.one
      //@ts-ignore
      return my.reminder(data.message);
    }
  });
}

function handleEdit(id : number) {
  state.dialog = {
    id: id,
    project_id: state.selectProjectId,
    title: id > 0 ? '编辑' : '添加',
    visible: true,
  };
}

const dialogClose = (e: boolean) => {
  state.dialog.visible = e
}

onMounted(() => {
  state.roleEdit = getAuthByKey(CONFIG_DATA.roleEdidId) != '' ? true : false
  state.roleStatus = getAuthByKey(CONFIG_DATA.roleStatusId) != '' ? true : false
  state.roleList = getAuthByKey(CONFIG_DATA.roleListId) != '' ? true : false
  state.publicProjectTitles = getAuthByKey(CONFIG_DATA.publicProjectTitlesId) != '' ? true : false
  handProjectOuery()

});
</script>
<style>
.role-tag {
    margin-bottom: 5px;
    margin-top: 5px;
}
</style>