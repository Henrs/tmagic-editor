<template>
  <TMagicTableColumn type="expand">
    <template #default="scope">
      <MTable
        v-if="config.table"
        :show-header="false"
        :columns="config.table"
        :data="(config.prop && scope.row[config.prop]) || []"
      ></MTable>
      <MForm
        v-if="config.form"
        :config="config.form"
        :init-values="config.values || (config.prop && scope.row[config.prop]) || {}"
      ></MForm>
    </template>
  </TMagicTableColumn>
</template>

<script lang="ts" setup>
import { TMagicTableColumn } from '@tmagic/design';
import { MForm } from '@tmagic/form';

import { ColumnConfig } from './schema';
import MTable from './Table.vue';

withDefaults(
  defineProps<{
    config: ColumnConfig;
  }>(),
  {
    config: () => ({}),
  },
);
</script>
