<script setup lang="ts">
import { Icon } from '@iconify/vue';
import PageContainer from '../components/page-container.vue';
import PageInnerContainer from '../components/page-inner-container.vue';
</script>

<template>
  <PageContainer>
    <PageInnerContainer class="flex-1 items-center justify-center">
      <Icon icon="tabler:error-404" class="text-primary text-9xl" />
      <h1 class="font-bold text-3xl mb-2">Oops!</h1>
      <p class="font-bold text-xl">Page not found</p>
    </PageInnerContainer>
  </PageContainer>
</template>
