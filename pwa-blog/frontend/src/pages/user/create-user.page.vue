<script setup lang="ts">
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { createZodPlugin } from '@formkit/zod';
import { useQueryClient } from '@tanstack/vue-query';
import { CreateUserDtoSchema } from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import UserForm from './components/user-form.vue';
import { createUser, getApiErrorMessage } from '../../api/api';

const router = useRouter();
const queryClient = useQueryClient();

const [zodPlugin, submitHandler] = createZodPlugin(
  CreateUserDtoSchema,
  async (data) => {
    try {
      await createUser(data);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.replace({ name: 'manage-users' });
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Smething went wrong while creating user. Please try again');
      toast(message, { type: 'error' });
    }
  },
);
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <h1 class="text-2xl font-bold my-4">Create user</h1>
      <UserForm
        submitLabel="Create user"
        :zodPlugin="zodPlugin"
        :submitHandler="submitHandler"
        :hasPasswordInput="true"
      />
    </PageInnerContainer>
  </PageContainer>
</template>
