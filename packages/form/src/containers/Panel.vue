<template>
  <TMagicCard
    v-if="items && items.length"
    class="box-card m-form-panel"
    :body-style="{ display: expand ? 'block' : 'none' }"
  >
    <template #header>
      <div class="clearfix">
        <a href="javascript:" style="width: 100%; display: block" @click="expand = !expand">
          <TMagicIcon><CaretBottom v-if="expand" /><CaretRight v-else /></TMagicIcon> {{ filter(config.title) }}
          <span v-if="config && config.extra" v-html="config.extra" class="m-form-tip"></span>
        </a>
      </div>
    </template>

    <div>
      <slot></slot>

      <div v-if="config.schematic" style="display: flex">
        <div style="flex: 1">
          <Container
            v-for="(item, index) in items"
            :key="item[mForm?.keyProp || '__key'] ?? index"
            :config="item"
            :model="name ? model[name] : model"
            :prop="prop"
            :size="size"
            :label-width="config.labelWidth || labelWidth"
            @change="changeHandler"
          ></Container>
        </div>

        <img class="m-form-schematic" :src="config.schematic" />
      </div>

      <template v-else>
        <Container
          v-for="(item, index) in items"
          :key="item[mForm?.keyProp || '__key'] ?? index"
          :config="item"
          :model="name ? model[name] : model"
          :prop="prop"
          :size="size"
          :label-width="config.labelWidth || labelWidth"
          @change="changeHandler"
        ></Container>
      </template>
    </div>
  </TMagicCard>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { CaretBottom, CaretRight } from '@element-plus/icons-vue';

import { TMagicCard, TMagicIcon } from '@tmagic/design';

import { FormState, PanelConfig } from '../schema';
import { filterFunction } from '../utils/form';

import Container from './Container.vue';

const props = defineProps<{
  model: any;
  config: PanelConfig;
  name: string;
  labelWidth?: string;
  prop?: string;
  size?: string;
}>();

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');

const expand = ref(props.config.expand !== false);

const items = computed(() => props.config.items);

const filter = (config: any) => filterFunction(mForm, config, props);

const changeHandler = () => emit('change', props.model);
</script>
