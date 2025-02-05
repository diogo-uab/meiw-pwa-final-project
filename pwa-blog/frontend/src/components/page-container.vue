<script setup lang="ts">
import PageHeader from './page-header.vue';
</script>

<template>
  <div class="flex flex-col min-h-full w-full" v-tw-merge>
    <PageHeader />
    <div class="mb-16"></div>
    <slot></slot>
  </div>
</template>
