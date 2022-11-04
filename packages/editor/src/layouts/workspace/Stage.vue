<template>
  <scroll-viewer
    class="m-editor-stage"
    ref="stageWrap"
    :width="stageRect?.width"
    :height="stageRect?.height"
    :wrap-width="stageContainerRect?.width"
    :wrap-height="stageContainerRect?.height"
    :zoom="zoom"
  >
    <!--    画布的div-->
    <div
      class="m-editor-stage-container"
      ref="stageContainer"
      :style="`transform: scale(${zoom});`"
      @contextmenu="contextmenuHandler"
      @drop="dropHandler"
      @dragover="dragoverHandler"
    ></div>
    <teleport to="body">
      <viewer-menu ref="menu" :is-multi-select="isMultiSelect"></viewer-menu>
    </teleport>
  </scroll-viewer>
</template>

<script lang="ts" setup>
import { computed, inject, markRaw, onMounted, onUnmounted, ref, toRaw, watch, watchEffect } from 'vue';
import { cloneDeep } from 'lodash-es';

import type { MApp, MContainer, MNode, MPage } from '@tmagic/schema';
import StageCore, { calcValueByFontsize, getOffset, Runtime } from '@tmagic/stage';

import ScrollViewer from '../../components/ScrollViewer.vue';
import { Layout, Services, StageOptions, StageRect } from '../../type';
import { useStage } from '../../utils/stage';

import ViewerMenu from './ViewerMenu.vue';
// 宽高
let stage: StageCore | null = null;
// 运行时环境,vue2 vue3 react
let runtime: Runtime | null = null;
// 依赖注入services
const services = inject<Services>('services');
// 依赖注入options
const stageOptions = inject<StageOptions>('stageOptions');
// 反应式wrap
const stageWrap = ref<InstanceType<typeof ScrollViewer>>();
// 反应式Contaniner 里面是div
const stageContainer = ref<HTMLDivElement>();
// 反应式meun
const menu = ref<InstanceType<typeof ViewerMenu>>();
// 是不是多个选择
const isMultiSelect = computed(() => services?.editorService.get('nodes')?.length > 1);
// 画布大小
const stageRect = computed(() => services?.uiService.get<StageRect>('stageRect'));
// 跟画布大小一样
const stageContainerRect = computed(() => services?.uiService.get<StageRect>('stageContainerRect'));
// 根节点
const root = computed(() => services?.editorService.get<MApp>('root'));
// 页面
const page = computed(() => services?.editorService.get<MPage>('page'));
// 缩放
const zoom = computed(() => services?.uiService.get<number>('zoom') || 1);
// 节点
const node = computed(() => services?.editorService.get<MNode>('node'));
// watchEffect可以监听属性变化,并且自动管理依赖,在刚开始的时候也会立即执行
watchEffect(() => {
  // 没有获取到画布大小,返回
  if (stage) return;
  // 没有container大小,返回
  if (!stageContainer.value) return;
  // 根节点和渲染,运行时没有,返回
  if (!(stageOptions?.runtimeUrl || stageOptions?.render) || !root.value) return;
  // 根据参数更新stage
  stage = useStage(stageOptions);
  // 设置stage,标记为非响应式,应该是防止循环
  services?.editorService.set('stage', markRaw(stage));
  // stage挂在容器
  stage?.mount(stageContainer.value);
  // 如果节点没有id,返回
  if (!node.value?.id) return;
  // 运行时准备好了过后更新
  stage?.on('runtime-ready', (rt) => {
    runtime = rt;
    // toRaw返回的值是一个引用而非快照，需要cloneDeep
    root.value && runtime?.updateRootConfig?.(cloneDeep(toRaw(root.value)));
    page.value?.id && runtime?.updatePageId?.(page.value.id);
    setTimeout(() => {
      node.value && stage?.select(toRaw(node.value.id));
    });
  });
});
// 观察缩放的值
watch(zoom, (zoom) => {
  if (!stage || !zoom) return;
  stage.setZoom(zoom);
});
// 观察根节点的值,更新
watch(root, (root) => {
  if (runtime && root) {
    runtime.updateRootConfig?.(cloneDeep(toRaw(root)));
  }
});
// 改变ContainerReact
const resizeObserver = new ResizeObserver((entries) => {
  for (const { contentRect } of entries) {
    services?.uiService.set('stageContainerRect', {
      width: contentRect.width,
      height: contentRect.height,
    });
  }
});

//
onMounted(() => {
  stageWrap.value?.container && resizeObserver.observe(stageWrap.value.container);
});

onUnmounted(() => {
  stage?.destroy();
  resizeObserver.disconnect();
  services?.editorService.set('stage', null);
});

const contextmenuHandler = (e: MouseEvent) => {
  e.preventDefault();
  menu.value?.show(e);
};

const dragoverHandler = (e: DragEvent) => {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
};

const dropHandler = async (e: DragEvent) => {
  e.preventDefault();
  console.log('鼠标拖动');
  // 当前window doc
  const doc = stage?.renderer.contentWindow?.document;
  // 父节点
  const parentEl: HTMLElement | null | undefined = doc?.querySelector(`.${stageOptions?.containerHighlightClassName}`);
  // 父容器
  let parent: MContainer | undefined = page.value;
  // 如果父节点存在,去查找父容器
  if (parentEl) {
    parent = services?.editorService.getNodeById(parentEl.id, false) as MContainer;
  }

  if (e.dataTransfer && parent && stageContainer.value && stage) {
    // eslint-disable-next-line no-eval
    const config = eval(`(${e.dataTransfer.getData('data')})`);
    const layout = await services?.editorService.getLayout(parent);

    const containerRect = stageContainer.value.getBoundingClientRect();
    const { scrollTop, scrollLeft } = stage.mask;
    const { style = {} } = config;

    let top = 0;
    let left = 0;
    let position = 'relative';

    if (layout === Layout.ABSOLUTE) {
      position = 'absolute';
      top = e.clientY - containerRect.top + scrollTop;
      left = e.clientX - containerRect.left + scrollLeft;

      if (parentEl && doc) {
        const { left: parentLeft, top: parentTop } = getOffset(parentEl);
        left = left - calcValueByFontsize(doc, parentLeft);
        top = top - calcValueByFontsize(doc, parentTop);
      }
    }

    config.style = {
      ...style,
      position,
      top: top / zoom.value,
      left: left / zoom.value,
    };

    config.inputEvent = e;

    services?.editorService.add(config, parent);
  }
};
</script>
