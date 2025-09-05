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
      <el-form-item label="父级菜单" prop="parent_id" v-if="authTitles && shows.parent">
        <el-tree-select
          v-model="formData.parent_id"
          placeholder="选择上级菜单"
          :data=menuOptions
          append-to-body="true"
          filterable
          check-strictly
          :render-after-expand="false"
          :style="{width: '508px'}"
          @node-click="changeParent"
        />
      </el-form-item>

      <el-form-item label="类型" v-if="shows.type">
        <el-radio-group v-model="formData.type" @change="handChangeType">
          <el-radio :label="Numbers.authTypeDir" v-if="partenTypeDir">目录</el-radio>
          <el-radio :label="Numbers.authTypeWeb" v-if="partenTypeWeb">页面</el-radio>
          <el-radio :label="Numbers.authTypeUrl" v-if="partenTypeUrl">URL</el-radio>
          <el-radio :label="Numbers.authTypeButton" v-if="partenTypeButton">按钮</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入菜单名称" />
      </el-form-item>

      <el-form-item label="路由路径" v-if="shows.path" prop="path">
        <el-input v-model="formData.path" placeholder="路由路径" />
      </el-form-item>

      <el-form-item label="组件路径" v-if="shows.view_path" prop="view_path">
        <el-input
          v-model="formData.view_path"
          placeholder="path/index" >
          <template #prepend>src/views/</template>
          <template #append>.vue</template>
        </el-input>
      </el-form-item>

      <el-form-item label="接口地址" v-if="shows.api" prop="api">
        <el-input v-model="formData.api" placeholder="接口地址" />
      </el-form-item>
      <el-form-item label="权限表示" v-if="shows.identification" prop="identification">
        <el-input v-model="formData.identification" placeholder="权限表示" />
      </el-form-item>
      <el-form-item label="图标" v-if="shows.icon" prop="icon">
        <el-popover
          ref="popoverRef"
          placement="bottom-start"
          :width="570"
          trigger="click"
        >
          <template #reference>
            <el-input
              v-model="formData.icon"
              placeholder="点击选择图标"
              readonly
              @click="iconSelectVisible = true"
            >
              <template #prefix>
                <svg-icon :icon-class="formData.icon" />
              </template>
            </el-input>
          </template>

          <icon-select @selected="selected" />
        </el-popover>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="formData.remarks" 
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="备注" />
      </el-form-item>

      <el-form-item label="是否显示" v-if="shows.isShow">
        <el-radio-group v-model="formData.is_show">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">隐藏</el-radio>
        </el-radio-group>
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
} from '@/types/api/authority/index';
import {sortList, edit, detail} from "@/api/authority";
import {CODES, CONFIG_DATA, Numbers} from "@/utils/code";
import {Option} from "@/types/common";
import SvgIcon from '@/components/SvgIcon/index.vue';
import IconSelect from '@/components/IconSelect/index.vue';
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
  queryParams: {} as QueryParam,
  menuOptions: [] as Option[],
  iconSelectVisible: false,
  shows:{
    identification:true,
    icon:true,
    path:true,
    api:true,
    view_path:true,
    isShow:true,
    type:true,
    parent:true,
  },
  partenTypeDir:false,
  partenTypeWeb:false,
  partenTypeButton:false,
  partenTypeUrl:false,
  authTitles:false,
  authDetail:false,
  formData: {
    parent_id : Numbers.zero,
    is_show : Numbers.no,
    type: Numbers.authTypeWeb,
  } as FormParam,
  rules: {
    pid: [{ required: true, message: '请选择顶级菜单', trigger: 'blur' }],
    name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
    path: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    api: [{ required: true, message: '请输入API地址', trigger: 'blur' }],
    view_path: [{ required: true, message: '请输入页面地址', trigger: 'blur' }],
    identification: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
  },
})
const {
  formData,
  rules,
  menuOptions,
  iconSelectVisible,
  shows,
  partenTypeDir,
  partenTypeUrl,
  partenTypeWeb,
  partenTypeButton,
  authTitles,
} = toRefs(state);


const dialogClose = () => {
  emit("closeDialog", false);
};

const handSubmit = () => {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
        // if (props.dialog.id) 
        state.formData.project_id = props.dialog.project_id
        edit(props.dialog.id, state.formData).then((ret) => {
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

const handChangeType = () => {
    state.shows.icon = true
    state.shows.path = false
    state.shows.identification = true
    rules.value.path[0].required = true
  if (state.formData.type == Numbers.authTypeDir) {
    state.shows.path = true
    state.shows.view_path = false
    state.shows.api = false
    rules.value.api[0].required = false
    rules.value.view_path[0].required = false
  } else if (state.formData.type == Numbers.authTypeWeb) {
    state.shows.path = true
    state.shows.view_path = true
    state.shows.api = true
    rules.value.api[0].required = true
    rules.value.view_path[0].required = true
   } else if (state.formData.type == Numbers.authTypeUrl) {
    state.shows.path = true
    state.shows.view_path = false
    state.shows.api = false
    rules.value.api[0].required = false
    rules.value.view_path[0].required = false
  }else if (state.formData.type == Numbers.authTypeButton) {
    rules.value.path[0].required = false
    state.formData.icon = ''
    state.shows.view_path = false
    state.shows.icon = false
    state.formData.path = '/'
  }
}

function handleQuery() {
  const menuOptions: any[] = [];
  //@ts-ignore
  sortList({project_id:props.dialog.project_id}).then((data) => {
    const menuOption = { value: 0, label: '顶级菜单', children: data.data };
    //@ts-ignore
    if (data.code === CODES.ok.code) {
      menuOptions.push(menuOption);
    }

    state.menuOptions = menuOptions;
    
  });
}

function changeParent(obj:any) {
  allShow()
  if (!obj.type) {
    state.partenTypeButton = false
    state.partenTypeDir = true
    state.partenTypeWeb = false
    state.partenTypeUrl = true
    if (!obj.edit) {
      state.formData.type = Numbers.authTypeDir
      noShowApi()
      noShowViewPath()
    }
    
  } else if (obj.type == Numbers.authTypeDir) {
    state.partenTypeButton = false
    state.partenTypeDir = true
    state.partenTypeWeb = true
    state.partenTypeUrl = true
    if (!obj.edit) {
      state.formData.type = Numbers.authTypeWeb
    }
  } else if (obj.type == Numbers.authTypeWeb) {
    state.partenTypeButton = true
    state.partenTypeDir = false
    state.partenTypeWeb = false
    state.partenTypeUrl = false
    noShowIsShow()
    noShowIcon()
    noShowPath()
    noShowViewPath()
    
    if (!obj.edit) {
      state.formData.type = Numbers.authTypeButton
    }
  }
}

function selected(name: string) {
  state.formData.icon = name;
  state.iconSelectVisible = false;
}

function noShowApi() {
  state.shows.api = false
  rules.value.api[0].required = false
}

function noShowPath() {
  state.shows.path = false
  rules.value.path[0].required = false
}

function noShowIcon() {
  state.shows.icon = false
}

function noShowIsShow() {
  state.shows.isShow = false
}

function noShowViewPath() {
    rules.value.view_path[0].required = false
    state.shows.view_path = false
}

function allShow() {
  rules.value.view_path[0].required = true
  state.shows.view_path = true
  state.shows.isShow = true
  state.shows.icon = true
  state.shows.path = true
  rules.value.path[0].required = true
  state.shows.api = true
  rules.value.api[0].required = true
  state.shows.type = true
  state.shows.parent = true
}

function editParent() {
  allShow()
  state.shows.type = false
  state.shows.parent = false
  if (state.formData.type == Numbers.authTypeDir) {
    state.partenTypeButton = false
    state.partenTypeDir = true
    state.partenTypeWeb = true
    noShowViewPath()
    noShowApi()
  } else if (state.formData.type == Numbers.authTypeWeb) {
    state.partenTypeButton = false
    state.partenTypeDir = true
    state.partenTypeWeb = true
  } else if (state.formData.type == Numbers.authTypeUrl) {
    noShowApi()
    noShowViewPath()
  } else if (state.formData.type == Numbers.authTypeButton) {
    state.partenTypeButton = true
    state.partenTypeDir = false
    state.partenTypeWeb = false
    noShowIcon()
    noShowIsShow()
    noShowViewPath()
    noShowPath()
  }
}
const setDefData = () => {
  if (props.dialog.id) {
    if (!state.authDetail) {
      //@ts-ignore
      my.reminder('没有获取详情的权限')
      return 
    }
    detail(props.dialog.id).then((data) => {
      //@ts-ignore
      if (data.code === CODES.ok.code) {
        state.formData = data.data
        if (state.formData.type == Numbers.authTypeUrl && 
        state.formData.path != null && state.formData.path.length > 0) {
          state.formData.path = state.formData.path?.slice(1)
        }
        editParent()
      } else {
        //@ts-ignore
        my.reminder(data.message)
      }
    });
  } else {
    state.formData = {
      parent_id : Numbers.zero,
      is_show : Numbers.yes,
      type:Numbers.authTypeWeb,
      project_id:props.dialog.project_id
    } as FormParam
    changeParent({})
  }
}

function checkAuth() {
  state.authDetail = getAuthByKey(CONFIG_DATA.authorityDetailId) != '' ? true : false
  state.authTitles = getAuthByKey(CONFIG_DATA.authorityTitlesId) != '' ? true : false
  if (!state.authTitles) {
      //@ts-ignore
      my.reminder('没有获取下拉权限的权限')
  }
}

onMounted(() => {
  checkAuth()
  handleQuery()
  setDefData()
  handChangeType()
});

</script>

<style lang="scss" scoped>

</style>
