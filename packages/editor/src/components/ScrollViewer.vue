<template>
  <div class="m-editor-scroll-viewer-container" ref="container">
    <div ref="el" :style="style">
      <slot></slot>
    </div>
    <!-- 垂直和水平滚动条-->
    <ScrollBar
      v-if="scrollHeight > wrapHeight"
      :scroll-size="scrollHeight"
      :size="wrapHeight"
      :pos="vOffset"
      @scroll="vScrollHandler"
    ></ScrollBar>
    <ScrollBar
      v-if="scrollWidth > wrapWidth"
      :is-horizontal="true"
      :scroll-size="scrollWidth"
      :pos="hOffset"
      :size="wrapWidth"
      @scroll="hScrollHandler"
    ></ScrollBar>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { ScrollViewerEvent } from '../type';
import { ScrollViewer } from '../utils/scroll-viewer';

import ScrollBar from './ScrollBar.vue';

const props = withDefaults(
  defineProps<{
    width?: number;
    height?: number;
    wrapWidth?: number;
    wrapHeight?: number;
    zoom?: number;
  }>(),
  {
    width: 0,
    height: 0,
    wrapWidth: 0,
    wrapHeight: 0,
    zoom: 1,
  },
);

const container = ref<HTMLDivElement>();
const el = ref<HTMLDivElement>();
const style = computed(
  () => `
        width: ${props.width}px;
        height: ${props.height}px;
        position: absolute;
        margin-top: 30px;
      `,
);

const scrollWidth = ref(0);
const scrollHeight = ref(0);

let scrollViewer: ScrollViewer;

onMounted(() => {
  if (!container.value || !el.value) return;
  scrollViewer = new ScrollViewer({
    container: container.value,
    target: el.value,
    zoom: props.zoom,
  });

  scrollViewer.on('scroll', (data: ScrollViewerEvent) => {
    hOffset.value = data.scrollLeft;
    vOffset.value = data.scrollTop;
    scrollWidth.value = data.scrollWidth;
    scrollHeight.value = data.scrollHeight;
  });
});

onUnmounted(() => {
  scrollViewer.destroy();
});

watch(
  () => props.zoom,
  () => {
    scrollViewer.setZoom(props.zoom);
  },
);

const vOffset = ref(0);
const vScrollHandler = (delta: number) => {
  vOffset.value += delta;
  scrollViewer.scrollTo({
    top: vOffset.value,
  });
};
const hOffset = ref(0);
const hScrollHandler = (delta: number) => {
  hOffset.value += delta;
  scrollViewer.scrollTo({
    left: hOffset.value,
  });
};

defineExpose({
  container,
});
</script>
