<template>
  <component :is="uiComponent.component">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { getConfig } from './config';

const uiComponent = getConfig('components').row;
</script>
