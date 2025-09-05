<template>
  <el-dialog
    :title="dialog.title"
    v-model="dialog.show"
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
      <el-form-item label="密码" prop="password" maxlength="30">
        <el-input
          v-model="formData.password"
          type="password"
          placeholder="密码"
          show-password
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
import { reactive, ref, toRefs } from 'vue';
import { ElForm } from 'element-plus';
import {
  PwdOption
} from '@/types/api/authority/admin';
import {password} from "@/api/authority/admin";
import {CODES} from "@/utils/code";
import useStore from "@/store";

const emit = defineEmits(["closeDialog"]);
const props = defineProps({
  dialog: {
    type: Object,
    default: {title : '添加', data : {} as PwdOption, visible : false},
  }
});

const dataFormRef = ref(ElForm);
const { my } = useStore();

const state = reactive({
  iconSelectVisible: false,
  formData: {} as PwdOption,
  rules: {
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  },
  roleRoles:false,
})

const {
  formData,
  rules,
} = toRefs(state);

const dialogClose = () => {
  emit("closeDialog", false);
};

const handSubmit = () => {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      password(props.dialog.id, state.formData.password).then((data) => {
        //@ts-ignore
        if (data.code === CODES.ok.code) {
          dialogClose()
          return my.ok('修改成功');
        } else {
          //@ts-ignore
          return my.reminder(data.message);
        }
      });
    }
  });
}

</script>

<style lang="scss" scoped>

</style>
