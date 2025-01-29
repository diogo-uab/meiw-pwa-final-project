<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { twMerge } from '../utils/tailwind';

type FetchErrorProps = {
  label: string,
  labelClass?: string,
  iconClass?: string,
};

defineProps<FetchErrorProps>();
</script>

<template>
  <div class="flex flex-col gap-4 items-center" v-tw-merge>
    <Icon
      icon="mdi-error"
      :class="twMerge('text-red-500 text-8xl', iconClass)"
    />
    <p :class="twMerge('text-xl font-semibold', labelClass)">
      {{ label }}
    </p>
  </div>
</template>
