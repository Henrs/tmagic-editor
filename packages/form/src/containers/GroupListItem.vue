<template>
  <div class="m-fields-group-list-item">
    <div>
      <TMagicIcon style="margin-right: 7px" @click="expandHandler"
        ><CaretBottom v-if="expand" /><CaretRight v-else
      /></TMagicIcon>

      <TMagicButton text @click="expandHandler">{{ title }}</TMagicButton>

      <TMagicButton
        v-show="showDelete(parseInt(String(index)))"
        text
        :icon="Delete"
        style="color: #f56c6c"
        @click="removeHandler"
      ></TMagicButton>

      <template v-if="movable()">
        <TMagicButton v-show="index !== 0" text size="small" @click="changeOrder(-1)"
          >上移<TMagicIcon><CaretTop /></TMagicIcon
        ></TMagicButton>
        <TMagicButton v-show="index !== length - 1" text size="small" @click="changeOrder(1)"
          >下移<TMagicIcon><CaretBottom /></TMagicIcon
        ></TMagicButton>
      </template>

      <span v-if="itemExtra" v-html="itemExtra" class="m-form-tip"></span>
    </div>

    <Container
      v-if="expand"
      :config="rowConfig"
      :model="model"
      :labelWidth="labelWidth"
      :prop="`${prop}${prop ? '.' : ''}${String(index)}`"
      :size="size"
      @change="changeHandler"
    ></Container>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { CaretBottom, CaretRight, CaretTop, Delete } from '@element-plus/icons-vue';

import { TMagicButton, TMagicIcon } from '@tmagic/design';

import { FormState, GroupListConfig } from '../schema';
import { filterFunction } from '../utils/form';

import Container from './Container.vue';

const props = defineProps<{
  model: any;
  groupModel: any[];
  config: GroupListConfig;
  labelWidth?: string;
  prop?: string;
  size?: string;
  index: number;
}>();

const emit = defineEmits(['swap-item', 'remove-item', 'change']);

const mForm = inject<FormState | undefined>('mForm');
const expand = ref(false);

watchEffect(() => {
  expand.value = !props.index;
});

const rowConfig = computed(() => ({
  type: 'row',
  span: props.config.span || 24,
  items: props.config.items,
  labelWidth: props.config.labelWidth,
  [mForm?.keyProp || '__key']: `${props.config[mForm?.keyProp || '__key']}${String(props.index)}`,
}));

const title = computed(() => {
  if (props.config.titleKey && props.model[props.config.titleKey]) {
    return props.model[props.config.titleKey];
  }

  return `组 ${String(props.index)}`;
});

const length = computed(() => props.groupModel?.length || 0);

const itemExtra = computed(() => filterFunction(mForm, props.config.itemExtra, props));

const removeHandler = () => emit('remove-item', props.index);

const changeHandler = () => emit('change');

const expandHandler = () => {
  expand.value = !expand.value;
};

// 希望支持单行可控制是否显示删除按钮，不会影响现有逻辑
const showDelete = (index: number) => {
  const deleteFunc = props.config.delete;
  if (deleteFunc && typeof deleteFunc === 'function') {
    return deleteFunc(props.model, index, mForm?.values);
  }
  return true;
};

// 调换顺序
const changeOrder = (offset = 0) => emit('swap-item', props.index, `${String(props.index)}${offset}`);

const movable = () => {
  const { movable } = props.config;

  // 没有设置时，默认可移动
  if (movable === undefined) return true;
  if (typeof movable === 'function') {
    return movable(mForm, props.index || 0, props.model, props.groupModel);
  }
  return movable;
};
</script>
