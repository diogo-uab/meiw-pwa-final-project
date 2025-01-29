<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { twMerge } from '../utils/tailwind';

type EmptyListProps = {
  label: string,
  labelClass?: string,
  iconClass?: string,
};

defineProps<EmptyListProps>();
</script>

<template>
  <div class="flex flex-col gap-4 items-center" v-tw-merge>
    <Icon
      icon="fluent:emoji-sad-slight-20-regular"
      :class="twMerge('text-primary text-8xl', iconClass)"
    />
    <p :class="twMerge('text-xl font-semibold', labelClass)">
      {{ label }}
    </p>
  </div>
</template>
