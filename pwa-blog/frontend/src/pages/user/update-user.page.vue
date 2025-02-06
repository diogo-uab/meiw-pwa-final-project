<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import { UpdateUserDtoSchema } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import UserForm from './components/user-form.vue';
import { useAuthStore } from '../../stores/auth.store';
import { getApiErrorMessage, getUserById, updateUser } from '../../api/api';

const route = useRoute();
const router = useRouter();
const userId = ref(String(route.params.id));
const authStore = useAuthStore();

watch(
  () => route.params.id,
  () => { userId.value = String(route.params.id); },
);

const queryClient = useQueryClient();

const {
  data: userData,
  isError: isErrorUserData,
  isPending: isPendingUserData,
} = useQuery({
  queryKey: ['user', { id: userId }],
  queryFn: () => getUserById(userId.value),
  select: (res) => res.data,
});

const [zodPlugin, submitHandler] = createZodPlugin(
  UpdateUserDtoSchema,
  async (data) => {
    try {
      const { data: updatedUserData } = await updateUser(userId.value, data);
      if (userId.value === authStore.user?._id)
        authStore.setUserData(updatedUserData);

      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', { id: updatedUserData._id }] });

      router.replace({ name: 'manage-users' });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Something went wrong while updating user. Please try again');
      toast(message, { type: 'error' });
    }
  },
);
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="text-2xl font-bold my-4">Update user</h1>
      <LoadingSpinner v-if="isPendingUserData" size="huge" class="self-center" />
      <FetchError v-else-if="isErrorUserData" label="Oops, failed to get user data" />
      <UserForm
        v-else-if="userData"
        submitLabel="Update user"
        :zodPlugin="zodPlugin"
        :submitHandler="submitHandler"
        :hasPasswordInput="false"
        :initialValues="userData"
      />
    </PageInnerContainer>
  </PageContainer>
</template>
