<template>
  <div class="app-container" v-loading="loading">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :inline="true">
      <el-form-item>
        <el-input
          v-model="queryParams.name"
          placeholder="姓名"
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
        <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
        <el-button type="warning" :icon="Refresh" @click="handleRefresh">重置</el-button>
      </el-form-item>
      <el-form-item v-if="roleEdit">
        <el-button type="success" :icon="Plus" @click="handleEdit(0)">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <!-- <el-table
      ref="dataTableRef"
      :data="dataList"
      row-key="id"
      :tree-props="{children: 'children'}"
      highlight-current-row
      border
    >
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column label="账号" prop="username" width="100"/>
      <el-table-column label="姓名" prop="name" width="100"/>
      <el-table-column label="手机号" prop="phone" width="155"/>
      <el-table-column label="邮箱" prop="email" width="200"/>
      <el-table-column label="登录时间" prop="last_time" width="155"/>
      <el-table-column label="角色" prop="role_info" >
        <template #default="scope">
          <el-tag class="role-tag" v-for="item in scope.row.role_info">{{ item.name }}</el-tag>
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
      <el-table-column v-if="roleEdit || authPassword" label="操作" align="center" :width="editLen">
        <template #default="scope">
          <el-button
            v-if="roleEdit"
            type="primary"
            :icon="Edit"
            circle
            plain
            @click.stop="handleEdit(scope.row.id)"
          />

          <el-button
            v-if="authPassword"
            type="primary"
            :icon="Key"
            circle
            plain
            @click.stop="handlePassword(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table> -->

    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="handleQuery()"
    />
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
import {
  list,password,status
} from '@/api/authority/admin';

import { ElForm, ElMessageBox} from 'element-plus';
import { Plus, Search, Refresh} from '@element-plus/icons-vue';

import "@/styles/table.scss";
import {
  DataParam, QueryParam,
} from '@/types/api/authority/admin';
import EditDialog from "./components/editDialog.vue";
import useStore from "@/store";
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";
import { getAuthByKey } from '@/utils/filter';

const { my } = useStore();
const queryFormRef = ref(ElForm);

const state = reactive({
  loading: true,
  total: 0,
  queryParams: {} as QueryParam,
  dialog: { id : 0, visible: false , title:""},
  dataList: [] as DataParam[],
  roleEdit:false,
  roleList:false,
  pwdDialog:{id:0, password:"", show:false, load:false},
  roleStatus:false,
  roleDel:false,
  companyTitles:[],
  authPassword:false,
  listStatus:CODES.stauts,
  editLen:0,
});

const {
  loading,
  dialog,
  total,
  pwdDialog,
  queryParams,
  roleEdit,
  authPassword,
  roleStatus,
  listStatus,
  editLen,
  dataList
} = toRefs(state);

function handleRefresh() {
  state.queryParams = {} as QueryParam
}

function handleQuery() {
  state.loading = true;
  state.editLen = 0
  if (state.authPassword) {
    state.editLen += 100
  }
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

function changePassword() {
  if (state.pwdDialog.password.length < 5) {
    return my.reminder("密码小于5位");
  }

  password(state.pwdDialog.id, state.pwdDialog.password).then((data) => {
    state.pwdDialog.load=true  
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      state.pwdDialog.show = false
      state.pwdDialog.load=false
      return my.ok('修改成功');
    } else {
      state.pwdDialog.load=false
      //@ts-ignore
      return my.reminder(data.message);
    }
  });

}
function handlePassword(id:number) {
    state.pwdDialog.id = id
    state.pwdDialog.show = true
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
    title: id > 0 ? '编辑' : '添加',
    visible: true,
  };
}

const dialogClose = (e: boolean) => {
  state.dialog.visible = e
}

onMounted(() => {
  state.roleEdit = getAuthByKey(CONFIG_DATA.adminEditId) != '' ? true : false
  state.roleStatus = getAuthByKey(CONFIG_DATA.adminStatusId) != '' ? true : false
  state.roleList = getAuthByKey(CONFIG_DATA.adminListId) != '' ? true : false
  state.authPassword = getAuthByKey(CONFIG_DATA.adminPasswordId) != '' ? true : false
  handleQuery()
});
</script>
<style>
.role-tag {
    margin-bottom: 5px;
    margin-top: 5px;
}
</style>