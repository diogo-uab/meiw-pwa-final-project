<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import SplashScreen from './components/splash-screen.vue';
import { useAuthStore } from './stores/auth.store';

const authStore = useAuthStore();
</script>

<template>
  <main class="h-full">
    <SplashScreen v-if="!authStore.initialAuthGuardDone" />
    <RouterView />
    <ConfirmDialog :draggable="false" />
  </main>
</template>
