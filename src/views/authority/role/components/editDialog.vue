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
      <el-form-item label="角色名" prop="name">
        <el-input v-model="formData.name" placeholder="请输角色名" />
      </el-form-item>

      <el-form-item label="权限" prop="rules">
        <el-tree-select
          v-model="formData.rules"
          :data="menuOptions"
          show-checkbox
          multiple
          :render-after-expand="false"
          :style="{width: '508px'}"
        />
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
import { ElForm, ElPopover } from 'element-plus';
import {
  FormParam, QueryParam,
} from '@/types/api/authority/role';
import {edit, detail, auths} from "@/api/authority/role";
import {CODES, CONFIG_DATA} from "@/utils/code";
import useStore from "@/store";
import {Option} from "@/types/common";
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
  queryParams: {} as QueryParam,
  iconSelectVisible: false,
  menuOptions: [] as Option[],
  formData: {} as FormParam,
  roleDetail:false,
  authTitles:false,
  rules: {
    name: [{ required: true, message: '请输入角色', trigger: 'blur' }],
    rules: [{ required: true, message: '请选择权限', trigger: 'blur' }],
  },
})

const {
  formData,
  rules,
  menuOptions,
  queryParams,
  roleDetail,
  authTitles
} = toRefs(state);

const dialogClose = () => {
  emit("closeDialog", false);
};

const handSubmit = () => {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      edit(state.formData, props.dialog.project_id).then((ret) => {
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
    if (!state.roleDetail) {
      //@ts-ignore
      my.reminder('没有获取详情的权限')
      return 
    }
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
  const menuOptions: any[] = [];
  auths(props.dialog.project_id).then((data) => {
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      for (let i in data.data) {
        menuOptions.push(data.data[i]);
      }
      state.menuOptions = menuOptions;
    }
  });
}

function checkAuth() {
  state.roleDetail = getAuthByKey(CONFIG_DATA.roleDetailId) != '' ? true : false
  state.authTitles = getAuthByKey(CONFIG_DATA.authorityTitlesId) != '' ? true : false
  if (!state.authTitles) {
      //@ts-ignore
      my.reminder('没有获取下拉权限的权限')
  } else {
    handleQuery()
  }
}

onMounted(() => {
  checkAuth()
  setDefData()
});

</script>

<style lang="scss" scoped>

</style>
