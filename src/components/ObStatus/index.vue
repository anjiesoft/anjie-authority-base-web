<template>
  <div aria-hidden="true" class="svg-icon" align="content">
    <el-icon v-if="status === 1">
      <CircleCheckFilled color="#67c23a"/>
    </el-icon>
    <el-icon v-else>
      <CircleCloseFilled color="#f56c6c" />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import {CircleCheckFilled, CircleCloseFilled} from '@element-plus/icons-vue'

const props = defineProps({
  status: {
    type: Number,
    default: 1
  },
});

</script>

<style scoped>
.svg-icon {
  font-size: 20px;
}
</style>
