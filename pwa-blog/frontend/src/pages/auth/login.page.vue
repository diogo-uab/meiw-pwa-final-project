<script setup lang="ts">
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useRouter, useRoute } from 'vue-router';
import { LoginRequestDtoSchema } from '@pwa/shared';
import AuthContainer from './auth-container.vue';
import { useAuthStore } from '../../stores/auth.store';
import { getApiErrorMessage, login } from '../../api/api';
import { handleTogglePasswordVisibility } from '../../utils/form-input';
import { handleNavigateOnAuthSuccess } from './utils';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const [zodPlugin, submitHandler] = createZodPlugin(
  LoginRequestDtoSchema,
  async (formData) => {
    try {
      const { data } = await login(formData);
      authStore.login(data);
      handleNavigateOnAuthSuccess(route, router);
    } catch (e) {
      toast(
        getApiErrorMessage(e, 'Something went wrong, please try again'),
        { type: 'error' },
      );
    }
  },
);
</script>

<template>
  <AuthContainer>
    <h1 class="font-black text-4xl text-primary mb-10">Login</h1>
    <FormKit type="form" :plugins="[zodPlugin]" @submit="submitHandler" submitLabel="Login">
      <FormKit
        type="text"
        name="email"
        id="email"
        label="Email"
        placeholder="Enter email"
      />
      <FormKit
        type="password"
        id="password"
        name="password"
        label="Password"
        placeholder="Enter password"
        suffix-icon="eyeClosed"
        suffix-icon-class="hover:text-primary"
        @suffix-icon-click="handleTogglePasswordVisibility"
      />
    </FormKit>
    <p class="text-sm">
      Don't have an account yet?
      <RouterLink :to="{ name: 'register' }" class="px-2 text-primary font-semibold underline">
        Register now
      </RouterLink>
    </p>
  </AuthContainer>
</template>
