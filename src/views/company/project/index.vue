<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :inline="true">
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleEdit(0)"
        >{{$t('navbar.add') }}</el-button
        >
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      ref="dataTableRef"
      :data="dataList"
      row-key="id"
      highlight-current-row
      border
    >
      <el-table-column label="ID" prop="id" width="100"/>
      <el-table-column label="项目名" prop="name" />
      <el-table-column label="备注" prop="remarks" align="center"/>
      <el-table-column label="添加时间" prop="create_time" align="center" width="155"/>
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
      <el-table-column v-if="roleEdit" label="操作" align="center" width="160">
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

import { ElForm, ElMessageBox} from 'element-plus';
import { Plus, Edit, User } from '@element-plus/icons-vue';

import {
  list,status
} from '@/api/company/project';

import {
  DataParam
} from '@/types/api/company/project';
import EditDialog from "./components/editDialog.vue";
import useStore from "@/store";
import {CODES, Numbers} from "@/utils/code";
import "@/styles/table.scss";
import { CONFIG_DATA } from '@/utils/code';
import { getAuthByKey } from '@/utils/filter';

const { my } = useStore();
const queryFormRef = ref(ElForm);

const state = reactive({
  loading: true,
  dialog: { id : 0, visible: false, title:'' },
  member: { id : 0, visible: false},
  dataList: [] as DataParam[],
  roleStatus:false,
  roleList:false,
  roleEdit:false,
});

const {
  loading,
  dialog,
  member,
  dataList,
  roleEdit,
  roleList,
  roleStatus,
} = toRefs(state);

function handleQuery() {
  if (!state.roleList) {
    //@ts-ignore
    my.reminder('没有权限')
    return
  }

  state.loading = true;
  list().then((res) => {
    state.loading = false;
    //@ts-ignore
    if (res.code === CODES.ok.code) {
      //@ts-ignore
      state.dataList = res.data;
    } else {
      //@ts-ignore
      return my.reminder(res.message);
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

function setStatus (obj:number, id: number, val: number, reasion:string)
{
  status(id, val, reasion).then((data) => {
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
    title: id > 0 ? '编辑' : '添加',
    visible: true,
  };
}

const dialogClose = (e: boolean) => {
  state.dialog.visible = e
}

const memberClose = (e: boolean) => {
  state.member.visible = e
}

onMounted(() => {
  state.roleList = getAuthByKey(CONFIG_DATA.projectListId) != '' ? true : false
  state.roleEdit = getAuthByKey(CONFIG_DATA.projectEditId) != '' ? true : false
  state.roleStatus = getAuthByKey(CONFIG_DATA.projectStatusId) != '' ? true : false
  handleQuery()
});
</script>
