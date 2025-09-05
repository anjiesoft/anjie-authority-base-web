<template>
    <div class="tree-container">
  <el-select
        ref="singleTree"
        v-model="singleSelectTreeVal"
        class="vab-tree-select"
        clearable
        :placeholder="placeholder"
        popper-class="select-tree-popper"
        value-key="id"
        @clear="selectTreeClearHandle('single')"
      >
        <el-option :value="singleSelectTreeKey">
          <el-tree
            id="singleSelectTree"
            ref="singleSelectTree"
            :current-node-key="singleSelectTreeKey"
            :data="selectTreeData"
            :default-expanded-keys="selectTreeDefaultSelectedKeys"
            :highlight-current="true"
            :node-key="selectTreeDefaultProps.id"
            :props="selectTreeDefaultProps"
            @node-click="selectTreeNodeClick"
          >
            <template #defalut="{ node }" class="vab-custom-tree-node">
              <span class="vab-tree-item">{{ node.label }}</span>
            </template>
          </el-tree>
        </el-option>
      </el-select>
    </div>
</template>
