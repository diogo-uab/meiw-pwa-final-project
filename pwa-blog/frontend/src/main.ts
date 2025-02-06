import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { plugin as formkitPlugin } from '@formkit/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import './index.css';
import 'primeicons/primeicons.css';
import 'vue3-toastify/dist/index.css';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import App from './app.vue';
import { router } from './router';
import formkitConfig from './config/formkit.config';
import { PrimeVuePreset } from './config/prime-vue-theme';
import { setupAxiosInterceptors } from './api/interceptors';
import { setDefaultAuthorizationHeader } from './api/api';
import { setupAuthGuards } from './router/guards';
import { tailwindMergeDirective } from './directives/tw-merge.directive';

const pinia = createPinia();

setupAuthGuards(router);

const app = createApp(App)
  .use(pinia)
  .use(router)
  .use(formkitPlugin, formkitConfig)
  .use(VueQueryPlugin)
  .use(Vue3Toastify, { theme: 'light', clearOnUrlChange: false } as ToastContainerOptions)
  .use(PrimeVue, {
    ptOptions: { mergeSections: true, mergeProps: true },
    theme: {
      preset: PrimeVuePreset,
      options: { darkModeSelector: '.dark-mode-disabled' },
    },
  })
  .use(ConfirmationService)
  .directive('twMerge', tailwindMergeDirective);

setupAxiosInterceptors(router);
setDefaultAuthorizationHeader(); // Requires pinia to be initialized first

app.mount('#app');
