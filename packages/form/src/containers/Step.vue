<template>
  <div>
    <TMagicSteps :active="active" align-center :space="config.space">
      <TMagicStep
        v-for="(item, index) in config.items"
        :key="item.__key"
        :title="item.title"
        :active="active"
        @click="stepClick(index)"
      ></TMagicStep>
    </TMagicSteps>

    <template v-for="(step, index) in config.items">
      <template v-for="item in step.items">
        <Container
          v-if="item"
          v-show="active - 1 === index"
          :key="item[mForm?.keyProp || '__key']"
          :config="item"
          :model="step.name ? model[step.name] : model"
          :prop="`${step.name}`"
          :size="size"
          :label-width="config.labelWidth || labelWidth"
          @change="changeHandler"
        ></Container>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, watchEffect } from 'vue';

import { TMagicStep, TMagicSteps } from '@tmagic/design';

import { FormState, StepConfig } from '../schema';

import Container from './Container.vue';

const props = withDefaults(
  defineProps<{
    model: any;
    config: StepConfig;
    stepActive?: number;
    labelWidth?: string;
    size?: string;
  }>(),
  {
    stepActive: 1,
  },
);

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');
const active = ref(1);

watchEffect(() => {
  active.value = props.stepActive;
});

const stepClick = (index: number) => {
  active.value = index + 1;
  mForm?.$emit('update:stepActive', active.value);
};

const changeHandler = () => {
  emit('change', props.model);
};
</script>
