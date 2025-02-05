<script setup lang="ts">
import Logo from '../../components/logo.vue';
</script>

<template>
  <div class="flex flex-col h-full w-full bg-gradient-to-r from-primary to-indigo-950">
    <div class="flex flex-col h-full max-w-screen-md w-full p-4 gap-2 items-center justify-center self-center">
      <div class="px-12 md:px-24 py-6 rounded-md border shadow-md bg-gray-50">
        <RouterLink :to="{ name: 'home' }">
          <Logo class="mb-6" logo-type="full" />
        </RouterLink>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
