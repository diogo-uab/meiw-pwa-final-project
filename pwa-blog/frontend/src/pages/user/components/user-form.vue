<script setup lang="ts">
import { computed } from 'vue';
import { createZodPlugin } from '@formkit/zod';
import {
  type CreateUserDtoType,
  type CreateUserDtoSchema,
  type UpdateUserDtoType,
  type UpdateUserDtoSchema,
  ROLES_LIST,
} from '@pwa/shared';
import Button from 'primevue/button';
import { formkitAvailableEmailValidation, handleTogglePasswordVisibility } from '../../../utils/form-input';
import { useRouter } from 'vue-router';

type FormkitZodPlugin =
  ReturnType<typeof createZodPlugin<typeof CreateUserDtoSchema | typeof UpdateUserDtoSchema>>;

type UserFormProps = {
  submitLabel?: string,
  initialValues?: Partial<CreateUserDtoType | UpdateUserDtoType>,
  zodPlugin: FormkitZodPlugin[0],
  submitHandler: FormkitZodPlugin[1],
  hasPasswordInput?: boolean,
};

const {
  submitLabel = 'Create user',
  hasPasswordInput = false,
  initialValues,
} = defineProps<UserFormProps>();

const availableEmailValidation =
  computed(() => formkitAvailableEmailValidation(initialValues?.email));

const router = useRouter();

const handleCancel = () => router.replace({ name: 'manage-users' });
</script>

<template>
  <FormKit
    type="form"
    :plugins="[zodPlugin]"
    @submit="submitHandler"
    :submit-label="submitLabel"
    :actions="false"
    #default="{ state, disabled }"
  >
    <FormKit
      type="text"
      name="name"
      id="name"
      label="Name"
      :value="initialValues?.name"
      placeholder="Enter name"
      outer-class="w-full max-w-none"
    />
    <FormKit
      type="text"
      name="email"
      id="email"
      label="Email"
      :value="initialValues?.email"
      placeholder="Enter name"
      outer-class="w-full max-w-none"
      :validation="availableEmailValidation.validation"
      :validation-rules="availableEmailValidation.rules"
      :validation-messages="availableEmailValidation.messages"
    />
    <FormKit
      v-if="hasPasswordInput"
      type="password"
      id="password"
      name="password"
      label="Password"
      placeholder="Enter password"
      suffix-icon="eyeClosed"
      suffix-icon-class="hover:text-primary"
      @suffix-icon-click="handleTogglePasswordVisibility"
      outer-class="w-full max-w-none"
    />
    <FormKit
      type="select"
      name="role"
      id="role"
      label="Role"
      selectIcon="caretDown"
      :value="initialValues?.role"
      :options="(ROLES_LIST as unknown as string[])"
      outer-class="w-full max-w-none"
    />
    <div class="flex flex-row flex-wrap justify-end gap-4 mt-6">
      <Button
        label="Cancel"
        outlined
        severity="danger"
        :disabled="state.loading"
        @click="handleCancel"
      ></Button>
      <Button
        type="submit"
        :label="submitLabel"
        :disabled="!!disabled"
        :loading="state.loading"
      ></Button>
    </div>
  </FormKit>
</template>
