<template>
  <div class="component-container">
    <el-card class="project-card">
      <template #header>
        <span class="fw-b">项目简介</span>
      </template>
      <div class="project-card__main">
        <!-- 项目简介 -->
        <el-link target="_blank" type="primary" href="https://gitee.com/haoxr">
          安捷(Anjie)
        </el-link>
        服务端基于 Gin v1.10.1、Golang 1.24.3、
        前端基于 vue3-element-admin
        <el-link
          target="_blank"
          type="primary"
          href="https://gitee.com/youlaitech/youlai-mall"
          >后端微服务</el-link
        >
        、
        <el-link
          target="_blank"
          type="success"
          href="https://gitee.com/ymxnetg/authority-base-web"
          >前端管理</el-link
        >
        <el-divider />

        <!-- 源码地址 -->
        <el-row :gutter="10">
          <el-col :span="6">
            <el-badge value="免费开源" class="fw-b"> 项目地址 </el-badge>
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="warning"
              href="https://www.anjiesoft.com/"
              >官方文档</el-link
            >
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="primary"
              href="https://github.com/ymxnetg"
              >Github</el-link
            >
          </el-col>
          <el-col :span="6">
            <el-link
              target="_blank"
              type="success"
              href="https://gitee.com/ymxnetg"
              >码云</el-link
            >
          </el-col>
        </el-row>
        <el-divider />
        <!-- 技术栈 -->
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 后端技术栈 </el-col>
          <el-col :span="18">
            Gin、Validator、Jwt、Zap、Viper、Gorm...
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="10">
          <el-col :span="6" class="fw-b"> 前端技术栈 </el-col>
          <el-col :span="18">
            Vue3、TypeScript、Element-Plus、uni-app、vue3-element-admin ...
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'index'
};
</script>

<style lang="scss" scoped>
.component-container {
  .project-card {
    font-size: 14px;

    &__main {
      line-height: 28px;
      height: 320px;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }

  .fw-b {
    font-weight: bold;
  }
}
</style>
