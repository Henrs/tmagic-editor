<template>
  <TMagicTabPane v-if="config" :name="config.text">
    <template #label>
      <div :key="config.text">
        <m-icon v-if="config.icon" :icon="config.icon"></m-icon>
        <div v-if="config.text" class="magic-editor-tab-panel-title">{{ config.text }}</div>
      </div>
    </template>

    <component :is="config.component" v-bind="config.props || {}" v-on="config?.listeners || {}">
      <template #component-list-panel-header v-if="data === 'component-list' || config.slots?.componentListPanelHeader">
        <slot v-if="data === 'component-list'" name="component-list-panel-header"></slot>
        <component v-else-if="config.slots?.componentListPanelHeader" :is="config.slots.componentListPanelHeader" />
      </template>

      <template
        #component-list-item="{ component }"
        v-if="data === 'component-list' || config.slots?.componentListItem"
      >
        <slot v-if="data === 'component-list'" name="component-list-item" :component="component"></slot>
        <component
          v-else-if="config.slots?.componentListItem"
          :is="config.slots.componentListItem"
          :component="component"
        />
      </template>

      <template #layer-panel-header v-if="data === 'layer' || config.slots?.layerPanelHeader">
        <slot v-if="data === 'layer'" name="layer-panel-header"></slot>
        <component v-else-if="config.slots?.layerPanelHeader" :is="config.slots.layerPanelHeader" />
      </template>

      <template #code-block-panel-header v-if="data === 'code-block' || config.slots?.codeBlockPanelHeader">
        <slot v-if="data === 'code-block'" name="code-block-panel-header"></slot>
        <component v-else-if="config.slots?.codeBlockPanelHeader" :is="config.slots.codeBlockPanelHeader" />
      </template>

      <template #code-block-panel-tool="{ id, data }" v-if="data === 'code-block' || config.slots?.codeBlockPanelTool">
        <slot v-if="data === 'code-block'" name="code-block-panel-tool" :id="id" :data="data"></slot>
        <component v-else-if="config.slots?.codeBlockPanelTool" :is="config.slots.codeBlockPanelTool" />
      </template>

      <template
        #code-block-edit-panel-header="{ id }"
        v-if="data === 'code-block' || config.slots?.codeBlockEditPanelHeader"
      >
        <slot v-if="data === 'code-block'" name="code-block-edit-panel-header" :id="id"></slot>
        <component v-else-if="config.slots?.codeBlockEditPanelHeader" :is="config.slots.codeBlockEditPanelHeader" />
      </template>

      <template
        #layer-node-content="{ data: nodeData, node }"
        v-if="data === 'layer' || config.slots?.layerNodeContent"
      >
        <slot v-if="data === 'layer'" name="layer-node-content" :data="nodeData" :node="node"></slot>
        <component
          v-else-if="config.slots?.layerNodeContent"
          :is="config.slots.layerNodeContent"
          :data="nodeData"
          :node="node"
        />
      </template>
    </component>
  </TMagicTabPane>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { Coin, EditPen, Files } from '@element-plus/icons-vue';

import { TMagicTabPane } from '@tmagic/design';

import MIcon from '../../components/Icon.vue';
import { SideComponent, SideItem } from '../../type';

import CodeBlockList from './code-block/CodeBlockList.vue';
import ComponentListPanel from './ComponentListPanel.vue';
import LayerPanel from './LayerPanel.vue';

const props = defineProps<{
  data?: SideItem;
}>();

const config = computed<SideComponent | undefined>(() => {
  if (typeof props.data !== 'string') {
    return props.data;
  }

  switch (props.data) {
    case 'component-list':
      return {
        type: 'component',
        icon: Coin,
        text: '组件',
        component: ComponentListPanel,
        slots: {},
      };
    case 'layer':
      return {
        type: 'component',
        icon: Files,
        text: '已选组件',
        component: LayerPanel,
        slots: {},
      };
    case 'code-block':
      return {
        type: 'component',
        icon: EditPen,
        text: '代码编辑',
        component: CodeBlockList,
        slots: {},
      };
    default:
      return undefined;
  }
});
</script>
