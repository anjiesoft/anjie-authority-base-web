<template>
  <el-dialog
    :title="dialog.title"
    v-model="dialog.visible"
    width="430px"
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
      <el-form-item label="项目名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入项目名" maxlength="100"/>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" 
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="备注" />
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
} from '@/types/api/company/project';
import {edit, detail} from "@/api/company/project";
import {CODES, CONFIG_DATA} from "@/utils/code";
import useStore from "@/store";
import { getAuthByKey } from '@/utils/filter';

const emit = defineEmits(["closeDialog", 'getDataList']);
const props = defineProps({
  dialog: {
    type: Object,
    default: {
      title : '添加',
      visible : false,
    }
  }
});

const dataFormRef = ref(ElForm);
const { my } = useStore();

const state = reactive({
  queryParams: {} as QueryParam,
  iconSelectVisible: false,
  formData: {
  } as FormParam,
  roleEdit:false,
  roleDetail:false,
  rules: {
    name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
  },
})

const {
  formData,
  queryParams,
  roleEdit,
  rules,
  roleDetail,
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

onMounted(() => {
  state.roleEdit = getAuthByKey(CONFIG_DATA.projectEditId) != '' ? true : false
  state.roleDetail = getAuthByKey(CONFIG_DATA.projectDetailId) != '' ? true : false
  setDefData()
});

</script>

<style lang="scss" scoped>
.el-select {
    width: 100%;
}
</style>