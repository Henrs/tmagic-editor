<template>
  <magic-ui-page :config="pageConfig"></magic-ui-page>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue';

import Core from '@tmagic/core';

export default defineComponent({
  name: 'App',

  setup() {
    const app = inject<Core | undefined>('app');
    const pageConfig = reactive(app?.page?.data || {});
    console.log('页面初始化配置', pageConfig);
    return {
      pageConfig,
    };
  },
});
</script>
