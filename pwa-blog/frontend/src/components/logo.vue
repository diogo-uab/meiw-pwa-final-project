<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { twMerge } from '../utils/tailwind';

type LogoProps = {
  logoType?: 'avatar-only' | 'full' | 'screen-size',
  variant?: 'primary' | 'secondary',
  textClass?: string,
};

const { variant = 'primary', logoType = 'screen-size' } = defineProps<LogoProps>();
</script>

<template>
  <div class="flex flex-row gap-2 items-center" v-tw-merge>
    <Avatar
      label="PB"
      size="normal"
      shape="circle"
      :pt:root:class="twMerge('!bg-primary', variant === 'secondary' && '!bg-white')"
      :pt:label:class="twMerge('font-bold text-white', variant === 'secondary' && 'text-primary')"
    />
    <span
      :class="twMerge(
        'font-extrabold hidden',
        logoType === 'screen-size' && 'md:block',
        logoType === 'full' && 'block',
        variant === 'secondary' && 'text-white',
        textClass,
      )"
    >
      PWA Blog
    </span>
  </div>
</template>
