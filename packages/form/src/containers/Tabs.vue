<template>
  <TMagicTabs
    v-model="activeTabName"
    :class="config.dynamic ? 'magic-form-dynamic-tab' : 'magic-form-tab'"
    :type="config.tabType"
    :editable="config.editable || false"
    :tab-position="config.tabPosition || 'top'"
    @tab-click="tabClickHandler"
    @tab-add="onTabAdd"
    @tab-remove="onTabRemove"
  >
    <template v-for="(tab, tabIndex) in tabs">
      <TMagicTabPane
        v-if="display(tab.display) && tabItems(tab).length"
        :key="tab[mForm?.keyProp || '__key'] ?? tabIndex"
        :name="filter(tab.status) || tabIndex.toString()"
        :label="filter(tab.title)"
        :lazy="tab.lazy || false"
      >
        <Container
          v-for="item in tabItems(tab)"
          :key="item[mForm?.keyProp || '__key']"
          :config="item"
          :model="
            config.dynamic
              ? (name ? model[name] : model)[tabIndex]
              : tab.name
              ? (name ? model[name] : model)[tab.name]
              : name
              ? model[name]
              : model
          "
          :prop="config.dynamic ? `${prop}${prop ? '.' : ''}${String(tabIndex)}` : prop"
          :size="size"
          :label-width="tab.labelWidth || labelWidth"
          :expand-more="expandMore"
          @change="changeHandler"
        ></Container>
      </TMagicTabPane>
    </template>
  </TMagicTabs>
</template>

<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { cloneDeep } from 'lodash-es';

import { TMagicTabPane, TMagicTabs } from '@tmagic/design';

import { FormState, TabConfig, TabPaneConfig } from '../schema';
import { display as displayFunc, filterFunction } from '../utils/form';

import Container from './Container.vue';

const getActive = (mForm: FormState | undefined, props: any, activeTabName: string) => {
  const { config, model, prop } = props;
  const { active } = config;

  if (typeof active === 'function') return active(mForm, { model, formValue: mForm?.values, prop });
  if (+activeTabName >= props.config.items.length) return '0';
  if (typeof active !== 'undefined') return active;

  return '0';
};

const tabClick = (mForm: FormState | undefined, tab: any, props: any) => {
  const { config, model, prop } = props;

  // 兼容vue2的element-ui
  tab.name = tab.paneName;

  if (typeof config.onTabClick === 'function') {
    config.onTabClick(mForm, tab, { model, formValue: mForm?.values, prop, config });
  }

  const tabConfig = config.items.find((item: TabPaneConfig) => tab.name === item.status);
  if (tabConfig && typeof tabConfig.onTabClick === 'function') {
    tabConfig.onTabClick(mForm, tab, { model, formValue: mForm?.values, prop, config });
  }
};

const props = defineProps<{
  model: any;
  config: TabConfig;
  name: string;
  size?: string;
  labelWidth?: string;
  prop?: string;
  expandMore?: boolean;
}>();

const emit = defineEmits(['change']);

const mForm = inject<FormState | undefined>('mForm');
const activeTabName = ref(getActive(mForm, props, ''));

const tabs = computed(() => {
  if (props.config.dynamic) {
    if (!props.config.name) throw new Error('dynamic tab 必须配置name');
    return props.model[props.config.name] || [];
  }
  return props.config.items;
});

const filter = (config: any) => filterFunction(mForm, config, props);

watchEffect(() => {
  if (typeof props.config.activeChange === 'function') {
    props.config.activeChange(mForm, activeTabName.value, {
      model: props.model,
      prop: props.prop,
    });
  }
});

const tabItems = (tab: TabPaneConfig) => (props.config.dynamic ? props.config.items : tab.items);

const tabClickHandler = (tab: any) => tabClick(mForm, tab, props);

const onTabAdd = () => {
  if (!props.config.name) throw new Error('dynamic tab 必须配置name');

  if (typeof props.config.onTabAdd === 'function') {
    props.config.onTabAdd(mForm, {
      model: props.model,
      prop: props.prop,
      config: props.config,
    });
  } else if (tabs.value.length > 0) {
    const newObj = cloneDeep(tabs.value[0]);
    newObj.title = `标签${tabs.value.length + 1}`;
    props.model[props.config.name].push(newObj);
  }
  emit('change', props.model);
  mForm?.$emit('field-change', props.prop, props.model[props.config.name]);
};

const onTabRemove = (tabName: string) => {
  if (!props.config.name) throw new Error('dynamic tab 必须配置name');

  if (typeof props.config.onTabRemove === 'function') {
    props.config.onTabRemove(mForm, tabName, {
      model: props.model,
      prop: props.prop,
      config: props.config,
    });
  } else {
    props.model[props.config.name].splice(+tabName, 1);

    // 防止删除后没有选中的问题
    if (tabName < activeTabName.value || activeTabName.value >= props.model[props.config.name].length) {
      activeTabName.value = (+activeTabName.value - 1).toString();
      tabClick(mForm, { name: activeTabName.value }, props);
    }
  }
  emit('change', props.model);
  mForm?.$emit('field-change', props.prop, props.model[props.config.name]);
};

const display = (displayConfig: any) => displayFunc(mForm, displayConfig, props);

const changeHandler = () => {
  emit('change', props.model);
  if (typeof props.config.onChange === 'function') {
    props.config.onChange(mForm, { model: props.model, prop: props.prop, config: props.config });
  }
};
</script>
