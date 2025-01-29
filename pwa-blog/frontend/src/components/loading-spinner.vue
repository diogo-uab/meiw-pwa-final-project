<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { twMerge } from '../utils/tailwind';

type LoadingSpinnerProps = {
  icon?: string,
  size?: 'small' | 'normal' | 'large' | 'huge',
  variant?: 'primary' | 'secondary',
};

const {
  icon = 'line-md:loading-twotone-loop',
  size = 'normal',
  variant = 'primary',
} = defineProps<LoadingSpinnerProps>();
</script>

<template>
  <Icon
    v-tw-merge
    :icon="icon"
    :class="twMerge(
      'text-primary text-2xl',
      size === 'small' && 'text-base',
      size === 'large' && 'text-6xl',
      size === 'huge' && 'text-9xl',
      variant === 'secondary' && 'text-white',
    )"
  />
</template>
