<script setup lang="ts">
import Logo from './logo.vue';
</script>

<template>
  <div v-tw-merge  class="absolute z-20 top-0 right-0 bottom-0 left-0 bg-primary">
    <div class="flex h-full w-full items-center justify-center">
      <Logo logoType="full" variant="secondary" class="animate-pulse" />
    </div>
  </div>
</template>
