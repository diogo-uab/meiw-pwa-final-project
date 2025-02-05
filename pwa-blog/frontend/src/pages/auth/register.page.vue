<script setup lang="ts">
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useRoute, useRouter } from 'vue-router';
import { RegisterRequestDtoSchema } from '@pwa/shared';
import AuthContainer from './auth-container.vue';
import { useAuthStore } from '../../stores/auth.store';
import { getApiErrorMessage, register } from '../../api/api';
import { handleNavigateOnAuthSuccess } from './utils';
import {
  handleTogglePasswordVisibility,
  formkitAvailableEmailValidation,
} from '../../utils/form-input';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const [zodPlugin, submitHandler] = createZodPlugin(
  RegisterRequestDtoSchema,
  async (formData) => {
    try {
      const { data } = await register(formData);
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

const availableEmailValidation = formkitAvailableEmailValidation();
</script>

<template>
  <AuthContainer>
    <h1 class="font-black text-4xl text-primary mb-10">Register</h1>
    <FormKit type="form" :plugins="[zodPlugin]" @submit="submitHandler" submitLabel="Register">
      <FormKit
        type="text"
        name="name"
        id="name"
        label="Name"
        placeholder="Enter your name"
      />
      <FormKit
        type="text"
        name="email"
        id="email"
        label="Email"
        placeholder="email@example.com"
        :validation="availableEmailValidation.validation"
        :validation-rules="availableEmailValidation.rules"
        :validation-messages="availableEmailValidation.messages"
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
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="px-2 text-primary font-semibold underline">
        Login here
      </RouterLink>
    </p>
  </AuthContainer>
</template>
