<script setup lang="ts">
import { ref, useId } from 'vue';
import { Icon } from '@iconify/vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useConfirm } from "primevue/useconfirm";
import { toast } from 'vue3-toastify';
import { submitForm } from '@formkit/core';
import { createZodPlugin } from '@formkit/zod';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import {
  CreateBlogCommentDtoSchema,
  type UpdateBlogCommentDtoType,
  type BlogCommentResponseDtoType,
  type BlogPostResponseDtoType,
} from '@pwa/shared';
import { getFormattedDateFromTimestamp } from '../../../utils/date';
import { deleteBlogComment, getApiErrorMessage, updateBlogComment } from '../../../api/api';

type BlogCommentItemProps = {
  comment: BlogCommentResponseDtoType,
  canManageComment?: boolean,
  isCommentFromPostAuthor?: boolean,
  displayCommentPost?: boolean,
};

const {
  comment,
  canManageComment = false,
  isCommentFromPostAuthor = false,
  displayCommentPost = false,
} = defineProps<BlogCommentItemProps>();

const editBlogCommentFormId = useId();
const isEditCommentDialogVisible = ref(false);
const postId = typeof comment.post === 'object' ? comment.post._id : comment.post;
const blogPost: BlogPostResponseDtoType | null =
  typeof comment.post === 'object' ? comment.post : null;

const queryClient = useQueryClient();
const { mutate, isPending } = useMutation({
  mutationFn: (data: UpdateBlogCommentDtoType) => updateBlogComment(comment._id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['blog-post-comments', { id: postId }] });
    queryClient.invalidateQueries({ queryKey: ['blog-comments-user'] });
    isEditCommentDialogVisible.value = false;
  },
  onError: (e) => {
    const message =
      getApiErrorMessage(e, 'Something went wrong while updating comment. Please try again');
    toast(message, { type: 'error' });
  },
});

const [zodPlugin, submitHandler] = createZodPlugin(
  CreateBlogCommentDtoSchema.omit({ post: true }),
  (data) => mutate({ ...data, post: postId }),
);

const handleDeleteComment = async (comment: BlogCommentResponseDtoType) => {
  try {
    await deleteBlogComment(comment._id);
    queryClient.invalidateQueries({ queryKey: ['blog-post-comments', { id: postId }] });
    queryClient.invalidateQueries({ queryKey: ['blog-comments-user'] });
  } catch (e) {
    const message =
      getApiErrorMessage(e, 'Something went wrong while deleting comment. Please try again');
    toast(message, { type: 'error' });
  }
};

const confirm = useConfirm();
const confirmDelete = (comment: BlogCommentResponseDtoType) => {
  confirm.require({
    message: 'Are you sure you want to delete this comment?',
    header: 'Delete comment',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => handleDeleteComment(comment),
  });
};
</script>

<template>
  <div class="flex flex-col py-2 px-4 border rounded-md gap-4">
    <RouterLink
      v-if="displayCommentPost && blogPost"
      :to="{ name: 'blog-post-details', params: { id: blogPost._id } }"
      class="flex flex-row items-center justify-between border-b pt-1 pb-2 rounded-sm hover:text-primary hover:bg-primary-50 transition-al"
    >
      <span class=" font-semibold underline">
        {{ blogPost.title }}
      </span>
      <Icon icon="mdi:arrow-right" class="text-xl" />
    </RouterLink>
    <div class="flex flex-row flex-wrap gap-2 items-center border-b pb-2">
      <Icon icon="mdi:user" class="text-primary" />
      <span>{{ comment.author.name }}</span>
      <template v-if="isCommentFromPostAuthor">
        <span>•</span>
        <span class="text-sm text-primary font-medium">Author</span>
      </template>
      <span>•</span>
      <span class="text-xs">{{ getFormattedDateFromTimestamp(comment.createdAt) }}</span>
      <span v-if="comment.updatedAt && comment.createdAt !== comment.updatedAt" class="text-xs">
        (Edited)
      </span>
    </div>
    <p class="whitespace-pre-wrap break-words">{{ comment.content }}</p>
    <div
      v-if="canManageComment"
      class="flex flex-row flex-wrap border-t pt-2 gap-4 justify-end"
    >
      <Button
        icon="pi pi-pencil !text-xs"
        rounded
        size="small"
        title="Edit"
        variant="outlined"
        pt:root:class="!h-6 !w-6"
        @click="isEditCommentDialogVisible = true"
      ></Button>
      <Button
        icon="pi pi-trash !text-xs"
        rounded
        size="small"
        title="Delete"
        variant="outlined"
        severity="danger"
        pt:root:class="!h-6 !w-6"
        @click="confirmDelete(comment)"
      ></Button>
    </div>
    <Dialog
      modal
      v-model:visible="isEditCommentDialogVisible"
      :draggable="false"
      header="Edit Comment"
      :style="{ width: '25rem' }"
    >
      <FormKit
        type="form"
        :id="editBlogCommentFormId"
        :plugins="[zodPlugin]"
        @submit="submitHandler"
        :actions="false"
        submit-label="Add comment"
      >
        <FormKit
          type="textarea"
          name="content"
          :value="comment.content"
          outer-class="w-full max-w-none"
        />
      </FormKit>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancel"
          outlined
          severity="secondary"
          @click="isEditCommentDialogVisible = false">
        </Button>
        <Button
          type="button"
          label="Save"
          @click="submitForm(editBlogCommentFormId)"
          :loading="isPending">
        </Button>
      </div>
    </Dialog>
  </div>
</template>
