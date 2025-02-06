<script setup lang="ts">
import { createZodPlugin } from '@formkit/zod';
import {
  CreateBlogPostDtoSchema,
  UpdateBlogPostDtoSchema,
  type CreateBlogPostDtoType,
  type UpdateBlogPostDtoType,
} from '@pwa/shared';
import Panel from 'primevue/panel';
import Button from 'primevue/button';
import MarkdownRender from '../../../components/markdown-render.vue';

type FormkitZodPlugin =
  ReturnType<typeof createZodPlugin<typeof CreateBlogPostDtoSchema | typeof UpdateBlogPostDtoSchema>>;

type BlogPostFormProps = {
  submitLabel?: string,
  initialValues?: Partial<CreateBlogPostDtoType | UpdateBlogPostDtoType>,
  zodPlugin: FormkitZodPlugin[0],
  submitHandler: FormkitZodPlugin[1],
};

const {
  submitLabel = 'Create post',
} = defineProps<BlogPostFormProps>();

const emit = defineEmits<{
  onCancel: [],
}>();
</script>

<template>
  <FormKit
    type="form"
    :plugins="[zodPlugin]"
    @submit="submitHandler"
    :actions="false"
    #default="{ value, state, disabled }"
  >
    <FormKit
      type="text"
      name="title"
      id="title"
      label="Title"
      :value="initialValues?.title"
      placeholder="Enter title"
      outer-class="w-full max-w-none"
    />
    <FormKit
      type="text"
      name="description"
      id="description"
      label="Description"
      :value="initialValues?.description"
      placeholder="Enter description"
      outer-class="w-full max-w-none"
    />
    <FormKit
      type="textarea"
      id="body"
      name="body"
      label="Body"
      :value="initialValues?.body"
      input-class="h-40"
      outer-class="w-full max-w-none"
    />
    <Panel v-if="typeof value?.body === 'string'" header="Preview" toggleable class="mb-3 !border-gray-200">
      <MarkdownRender :source="value.body" />
    </Panel>
    <div class="flex flex-row flex-wrap justify-end gap-4 mt-6">
      <Button
        label="Cancel"
        outlined
        severity="danger"
        :disabled="state.loading"
        @click="emit('onCancel')"
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
