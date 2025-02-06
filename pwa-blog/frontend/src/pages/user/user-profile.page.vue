<script setup lang="ts">
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import Divider from 'primevue/divider';
import { UpdateUserPasswordDtoSchema, UpdateUserProfileDtoSchema } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import { useAuthStore } from '../../stores/auth.store';
import {
  getMyUserInfo,
  updateUserProfile,
  updateUserPassword,
  getApiErrorMessage,
} from '../../api/api';
import {
  handleTogglePasswordVisibility,
  formkitAvailableEmailValidation,
} from '../../utils/form-input';

const authStore = useAuthStore();
const queryClient = useQueryClient();

const {
  data: userData,
  isError: isErrorUserData,
  isPending: isPendingUserData,
} = useQuery({
  queryKey: ['user-me', { id: authStore.user?._id }],
  queryFn: async () => {
    const { data } = await getMyUserInfo();
    authStore.setUserData(data);
    return data;
  },
});

const availableEmailValidation =
  computed(() => formkitAvailableEmailValidation(userData.value?.email));

const [zodPluginUserProfile, submitHandlerUserProfile] = createZodPlugin(
  UpdateUserProfileDtoSchema,
  async (data) => {
    try {
      await updateUserProfile(data);
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Oops, something went wrong while updating your profile. Please try again');
      toast(message, { type: 'error' });
    }
  },
);

const [zodPluginUserPassword, submitHandlerUserPassword] = createZodPlugin(
  UpdateUserPasswordDtoSchema,
  async (data) => {
    try {
      await updateUserPassword(data);
      queryClient.invalidateQueries({ queryKey: ['user-me'] });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Oops, something went wrong while updating your password. Please try again');
      toast(message, { type: 'error' });
    }
  },
);
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="text-3xl font-bold my-4">Profile</h1>
      <Divider />
      <LoadingSpinner v-if="isPendingUserData" size="huge" class="self-center" />
      <FetchError v-else-if="isErrorUserData" label="Failed to get user data" />
      <template v-else-if="userData">
        <h2 class="font-bold text-xl mb-6">Update profile</h2>
        <FormKit
          type="form"
          :plugins="[zodPluginUserProfile]"
          @submit="submitHandlerUserProfile"
          submit-label="Update profile"
        >
          <FormKit
            type="text"
            name="name"
            id="name"
            label="Name"
            :value="userData.name"
            placeholder="Enter name"
            outer-class="w-full max-w-none"
          />
          <FormKit
            type="text"
            name="email"
            id="email"
            label="Email"
            :value="userData.email"
            placeholder="Enter name"
            outer-class="w-full max-w-none"
            :validation="availableEmailValidation.validation"
            :validation-rules="availableEmailValidation.rules"
            :validation-messages="availableEmailValidation.messages"
          />
        </FormKit>

        <Divider />

        <h2 class="font-bold text-xl mb-6">Update password</h2>
        <FormKit
          type="form"
          :plugins="[zodPluginUserPassword]"
          @submit="submitHandlerUserPassword"
          submit-label="Update password"
        >
          <FormKit
            type="password"
            id="currentPassword"
            name="currentPassword"
            label="Current Password"
            placeholder="Enter current password"
            suffix-icon="eyeClosed"
            suffix-icon-class="hover:text-primary"
            @suffix-icon-click="handleTogglePasswordVisibility"
            outer-class="w-full max-w-none"
          />
          <FormKit
            type="password"
            id="newPassword"
            name="newPassword"
            label="New Password"
            placeholder="Enter new password"
            suffix-icon="eyeClosed"
            suffix-icon-class="hover:text-primary"
            @suffix-icon-click="handleTogglePasswordVisibility"
            outer-class="w-full max-w-none"
          />
        </FormKit>
      </template>
    </PageInnerContainer>
  </PageContainer>
</template>
