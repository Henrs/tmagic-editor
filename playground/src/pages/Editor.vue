<template>
  <!--  整个主要的页面和一些基础配置-->
  <div class="editor-app">
    <m-editor
      v-model="value"
      ref="editor"
      :menu="menu"
      :runtime-url="runtimeUrl"
      :props-configs="propsConfigs"
      :props-values="propsValues"
      :event-method-list="eventMethodList"
      :component-group-list="componentGroupList"
      :default-selected="defaultSelected"
      :moveable-options="moveableOptions"
      :auto-scroll-into-view="true"
      :stage-rect="stageRect"
    >
      <template #workspace-content>
        <DeviceGroup v-model="stageRect"></DeviceGroup>
      </template>
    </m-editor>

    <el-dialog
      v-model="previewVisible"
      destroy-on-close
      class="pre-viewer"
      title="预览"
      :width="stageRect && stageRect.width"
    >
      <iframe v-if="previewVisible" width="100%" :height="stageRect && stageRect.height" :src="previewUrl"></iframe>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { Coin, Connection, Document } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import serialize from 'serialize-javascript';

import { editorService, MenuBarData, MoveableOptions, TMagicEditor } from '@tmagic/editor';
import type { Id, MContainer, MNode } from '@tmagic/schema';
import { NodeType } from '@tmagic/schema';
import StageCore from '@tmagic/stage';
import { asyncLoadJs } from '@tmagic/utils';

import DeviceGroup from '../components/DeviceGroup.vue';
import componentGroupList from '../configs/componentGroupList';
import dsl from '../configs/dsl';

const { VITE_RUNTIME_PATH, VITE_ENTRY_PATH } = import.meta.env;

const runtimeUrl = `${VITE_RUNTIME_PATH}/playground/index.html`;
const router = useRouter();
// ref 是响应式编程的api 类似rxswift 的 behaviorreplay
const editor = ref<InstanceType<typeof TMagicEditor>>();
const previewVisible = ref(false);
// 首页默认的dsl
const value = ref(dsl);
// 默认选择的节点
const defaultSelected = ref(dsl.items[0].id);
// 空的键值属性
const propsValues = ref<Record<string, any>>({});
// 初始化空的属性配置
const propsConfigs = ref<Record<string, any>>({});
// 初始化空的事件方法
const eventMethodList = ref<Record<string, any>>({});
// 限制滑步的默认大小
const stageRect = ref({
  width: 375,
  height: 817,
});
// 预览页面地址
const previewUrl = computed(
  () => `${VITE_RUNTIME_PATH}/page/index.html?localPreview=1&page=${editor.value?.editorService.get('page').id}`,
);
// 顶部导航栏工具条
const menu: MenuBarData = {
  left: [
    {
      type: 'text',
      text: 'iOSUI布局辅助工具',
    },
  ],
  center: ['delete', 'undo', 'redo', 'guides', 'rule', 'zoom'],
  right: [
    {
      type: 'button',
      text: 'Form Playground',
      handler: () => router.push('form'),
    },
    {
      type: 'button',
      text: 'Table Playground',
      handler: () => router.push('table'),
    },
    '/',
    {
      type: 'button',
      text: '预览',
      icon: Connection,
      handler: async (services) => {
        if (services?.editorService.get<Map<Id, Id>>('modifiedNodeIds').size > 0) {
          try {
            await ElMessageBox.confirm('有修改未保存，是否先保存再预览', '提示', {
              confirmButtonText: '保存并预览',
              cancelButtonText: '预览',
              type: 'warning',
            });
            save();
            ElMessage.success('保存成功');
          } catch (e) {
            console.error(e);
          }
        }
        previewVisible.value = true;
      },
    },
    {
      type: 'button',
      text: '保存',
      icon: Coin,
      handler: () => {
        save();
        ElMessage.success('保存成功');
      },
    },
    '/',
    {
      type: 'button',
      icon: Document,
      tooltip: '源码',
      handler: (service) => service?.uiService.set('showSrc', !service?.uiService.get('showSrc')),
    },
  ],
};
// 可移动的组件配置,这里判断了是不是page page是不移动的
const moveableOptions = (core?: StageCore): MoveableOptions => {
  const options: MoveableOptions = {};
  const id = core?.dr?.target?.id;

  if (!id || !editor.value) return options;

  const node = editor.value.editorService.getNodeById(id);

  if (!node) return options;

  const isPage = node.type === NodeType.PAGE;

  options.draggable = !isPage;
  options.resizable = !isPage;
  options.rotatable = !isPage;

  return options;
};
// 保存页面
const save = () => {
  localStorage.setItem(
    'magicDSL',
    serialize(toRaw(value.value), {
      space: 2,
      unsafe: true,
    }).replace(/"(\w+)":\s/g, '$1: '),
  );
  editor.value?.editorService.resetModifiedNodeId();
};

asyncLoadJs(`${VITE_ENTRY_PATH}/config/index.umd.js`).then(() => {
  propsConfigs.value = (globalThis as any).magicPresetConfigs;
});
asyncLoadJs(`${VITE_ENTRY_PATH}/value/index.umd.js`).then(() => {
  propsValues.value = (globalThis as any).magicPresetValues;
});
asyncLoadJs(`${VITE_ENTRY_PATH}/event/index.umd.js`).then(() => {
  eventMethodList.value = (globalThis as any).magicPresetEvents;
});

save();

editorService.usePlugin({
  beforeDoAdd: (config: MNode, parent?: MContainer | null) => {
    if (config.type === 'overlay') {
      config.style = {
        ...config.style,
        left: 0,
        top: 0,
      };

      return [config, editorService.get('page')];
    }

    return [config, parent];
  },
});
</script>

<style lang="scss">
html {
  overflow: hidden;
}
#app {
  width: 100%;
  height: 100%;
  display: flex;
}

.editor-app {
  width: 100%;
  height: 100%;

  .m-editor {
    flex: 1;
    height: 100%;
  }

  .el-overlay-dialog {
    display: flex;
  }

  .pre-viewer {
    margin: auto;

    .el-dialog__body {
      padding: 0;
    }
  }

  .menu-left {
    .menu-item-text {
      margin-left: 10px;
    }
  }
}
</style>
