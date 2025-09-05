<template>
  <el-dialog
    :title="dialog.title"
    v-model="dialog.visible"
    width="650px"
    append-to-body
    destroy-on-close
    :close-on-click-modal=false
    @close="dialogClose()"
  >
    <el-form
      ref="dataFormRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="账号" prop="username" maxlength="30">
        <el-input
          v-model="formData.username"
          placeholder="账号"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item v-if="!props.dialog.id" label="密码" prop="password" maxlength="30">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="姓名" maxlength="30"/>
      </el-form-item>

      <el-form-item label="电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="电话" maxlength="15"/>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" placeholder="邮箱" maxlength="100"/>
      </el-form-item>

      <el-form-item label="角色" prop="roles">
        <el-select
          v-model="formData.roles"
          multiple
          placeholder="角色，可多个"
          style="width: 508px"
        >
          <el-option-group
            v-for="group in roleOptions"
            :key="group.id"
            :label="group.name"
          >
            <el-option
              v-for="item in group.items"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-option-group>
        </el-select>
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handSubmit">确 定</el-button>
        <el-button @click="dialogClose">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue';
import { ElForm } from 'element-plus';
import {
  FormParam, QueryParam,
  RoleOption,
} from '@/types/api/authority/admin';
import {edit, detail, roles} from "@/api/authority/admin";
import {CODES, CONFIG_DATA} from "@/utils/code";
import useStore from "@/store";
import { getAuthByKey } from '@/utils/filter';

const emit = defineEmits(["closeDialog", 'getDataList']);
const props = defineProps({
  dialog: {
    type: Object,
    default: {title : '添加', data : {} as FormParam, visible : false}
  }
});

const dataFormRef = ref(ElForm);
const { my } = useStore();

const state = reactive({
  roleOptions :[] as RoleOption[],
  queryParams: {} as QueryParam,
  iconSelectVisible: false,
  formData: {} as FormParam,
  projectList: [],
  rules: {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: props.dialog.id ? false : true, message: '请输入密码', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入点化', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  },
  roleEdit:false,
  roleDetail:false,
  roleRoles:false,
})

const {
  formData,
  rules,
  roleOptions,
} = toRefs(state);

const dialogClose = () => {
  emit("closeDialog", false);
};

const handSubmit = () => {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      //@ts-ignore
      edit(state.formData).then((ret) => {
        //@ts-ignore
        if (ret.code === CODES.ok.code) {
          dialogClose()
          emit("getDataList");
        } else {
          //@ts-ignore
          my.reminder(ret.message)
        }
      }).catch(() => {
        my.reminder('系统错误')
      });
    }
  });
}

const setDefData = () => {
  if (props.dialog.id) {
    //@ts-ignore
    detail(props.dialog.id).then((data) => {
      //@ts-ignore
      if (data.code === CODES.ok.code) {
        state.formData = data.data
      } else {
        //@ts-ignore
        my.reminder(data.message)
      }
    });
  } else {
    state.formData = {} as FormParam
  }
}


function handleQuery() {
  if (!state.roleRoles) {
    //@ts-ignore
    my.reminder('没有权限')
    return 
  }
  roles().then((data) => {
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      state.roleOptions = data.data;
    } else {
      //@ts-ignore
      my.reminder(data.message)
    }
  });
}

onMounted(() => {
  state.roleEdit = getAuthByKey(CONFIG_DATA.adminEditId) != '' ? true : false
  state.roleDetail = getAuthByKey(CONFIG_DATA.adminDetailId) != '' ? true : false
  state.roleRoles = getAuthByKey(CONFIG_DATA.adminRoleId) != '' ? true : false
  
  handleQuery()
  setDefData()
});

</script>

<style lang="scss" scoped>

</style>
