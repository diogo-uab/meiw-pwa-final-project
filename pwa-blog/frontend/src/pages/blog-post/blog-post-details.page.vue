<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { reset } from '@formkit/core'
import { createZodPlugin } from '@formkit/zod';
import { toast } from 'vue3-toastify';
import { Icon } from '@iconify/vue';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { useConfirm } from 'primevue/useconfirm';
import {
  CreateBlogCommentDtoSchema,
  type BlogCommentResponseDtoType,
  type BlogPostResponseDtoType,
} from '@pwa/shared';
import PageContainer from '../../components/page-container.vue';
import PageInnerContainer from '../../components/page-inner-container.vue';
import EmptyList from '../../components/empty-list.vue';
import FetchError from '../../components/fetch-error.vue';
import LoadingSpinner from '../../components/loading-spinner.vue';
import MarkdownRender from '../../components/markdown-render.vue';
import BlogCommentItem from './components/blog-comment-item.vue';
import {
  getBlogPostById,
  createBlogComment,
  getBlogCommentsByPostId,
  getApiErrorMessage,
  deleteBlogPost,
} from '../../api/api';
import { useAuthStore } from '../../stores/auth.store';
import { getFormattedDateFromTimestamp } from '../../utils/date';

const route = useRoute();
const router = useRouter();
const postId = ref(String(route.params.id));

// React to param change to ensure the appropriate data is fetched/displayed,
// as the same component instance can be reused.
// See [Vue Router Docs](https://router.vuejs.org/guide/essentials/dynamic-matching#Reacting-to-Params-Changes) for more details.
watch(() => route.params.id, () => {
  postId.value = String(route.params.id);
});

const authStore = useAuthStore();
const queryClient = useQueryClient();

const {
  data: blogPost,
  isError: isErrorBlogPost,
  isPending: isPendingBlogPost,
} = useQuery({
  queryKey: ['blog-post', { id: postId }],
  queryFn: () => getBlogPostById(postId.value),
  select: (res) => res.data,
});

const {
  data: comments,
  isError: isErrorComments,
  isPending: isPendingComments,
} = useQuery({
  queryKey: ['blog-post-comments', { id: postId }],
  queryFn: () => getBlogCommentsByPostId(postId.value),
  select: (res) => res.data,
});

const [zodPlugin, submitHandler] = createZodPlugin(
  CreateBlogCommentDtoSchema.omit({ post: true }),
  async (data) => {
    try {
       await createBlogComment({
        ...data,
        post: postId.value,
      });

      queryClient.invalidateQueries({ queryKey: ['blog-post-comments', { id: postId }] });
      reset('createCommentForm');
    } catch (e) {
      const message =
        getApiErrorMessage(e, 'Something went wrong while creating comment. Please try again');
      toast(message, { type: 'error' });
    }
  },
);

const isCommentFromPostAuthor = (
  post: BlogPostResponseDtoType,
  comment: BlogCommentResponseDtoType,
): boolean => {
  const postAuthorId = typeof post.author === 'string' ? post.author : post.author._id;
 return postAuthorId === comment.author._id;
};

const isCommentFromUser = (comment: BlogCommentResponseDtoType): boolean =>
  authStore.user?._id === comment.author._id;

const { mutate: deletePostMutation, isPending: isPendingDeletePost } = useMutation({
  mutationFn: () => deleteBlogPost(postId.value),
  onSuccess: () => {
    router.push({ name: 'home' });
    toast('Post deleted successfully', { type: 'success' });
  },
  onError: (e) => {
    const message =
      getApiErrorMessage(e, 'Something went wrong while deleting post. Please try again');
    toast(message, { type: 'error' });
  },
});

const confirm = useConfirm();
const confirmDelete = () => {
  confirm.require({
    header: 'Delete post',
    message: 'Are you sure you want to delete this post?',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      outlined: true,
      severity: 'secondary',
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: () => deletePostMutation(),
  });
};

const handleEditPost = () => {
  router.push({ name: 'blog-post-edit', params: { id: postId.value } });
};
</script>

<template>
  <PageContainer>
    <PageInnerContainer>
      <LoadingSpinner v-if="isPendingBlogPost" size="huge" class="self-center" />
      <FetchError v-else-if="isErrorBlogPost" label="Oops, failed to get post" />
      <div v-else-if="blogPost" class="flex flex-col gap-4 py-4">
        <h1 class="font-bold text-4xl mb-4">{{ blogPost.title }}</h1>
        <p class="text-sm">{{ blogPost.description }}</p>
        <div class="flex flex-row flex-wrap gap-2 justify-between">
          <div v-if="typeof blogPost.author === 'object'" class="flex flex-row items-center gap-2">
            <Icon icon="mdi:user" class="text-primary" />
            <span>{{ blogPost.author.name }}</span>
          </div>
          <div class="flex flex-row items-center gap-2">
            <Icon icon="mdi:calendar" class="text-primary" />
            <span class="text-xs">{{ getFormattedDateFromTimestamp(blogPost.createdAt) }}</span>
          </div>
        </div>
        <div v-if="authStore.isAdmin" class="flex flex-row flex-wrap items-center justify-end gap-6">
          <Button
            outlined
            severity="secondary"
            icon="pi pi-pencil"
            label="Edit"
            :disabled="isPendingDeletePost"
            @click="handleEditPost"
          >
          </Button>
          <Button
            severity="danger"
            icon="pi pi-trash"
            label="Delete"
            :loading="isPendingDeletePost"
            @click="confirmDelete">
          </Button>
        </div>
        <Divider class="!mt-0" />
        <MarkdownRender :source="blogPost.body" />
      </div>

      <Divider />

      <p class="font-bold text-xl mb-4">Comments</p>
      <p v-if="!authStore.isAuthenticated" class="mb-4">
        <RouterLink :to="{ name: 'login' }" class="text-primary underline">Login</RouterLink> or <RouterLink :to="{ name: 'register' }" class="text-primary underline">create an account</RouterLink> to add a new comment
      </p>
      <FormKit
        type="form"
        id="createCommentForm"
        :plugins="[zodPlugin]"
        @submit="submitHandler"
        :actions="false"
        :disabled="!authStore.isAuthenticated || isPendingBlogPost || isErrorBlogPost"
        #default="{ disabled, state }"
      >
        <FormKit
          type="textarea"
          id="content"
          name="content"
          placeholder="Write a new comment"
          validation-visibility="submit"
          outer-class="w-full max-w-none"
        />
        <div class="flex flex-row flex-wrap justify-end gap-4 mt-6">
          <Button
            label="Clear"
            outlined
            severity="secondary"
            :disabled="!!disabled || state.loading"
            @click="reset('createCommentForm')"
          ></Button>
          <Button
            type="submit"
            label="Add comment"
            :disabled="!!disabled"
            :loading="state.loading"
          ></Button>
        </div>
      </FormKit>

      <Divider />

      <LoadingSpinner v-if="isPendingComments" size="large" class="self-center" />
      <FetchError
        v-else-if="isErrorComments"
        label="Oops, failed to get post comments"
        iconClass="text-4xl"
      />
      <template v-else>
        <EmptyList v-if="!comments?.length" label="No comments yet" iconClass="text-4xl" />
        <div v-else class="flex flex-col gap-4">
          <BlogCommentItem
            v-for="comment in comments"
            :key="comment._id"
            :comment="comment"
            :canManageComment="isCommentFromUser(comment) || authStore.isAdmin"
            :isCommentFromPostAuthor="blogPost && isCommentFromPostAuthor(blogPost, comment)"
          />
        </div>
      </template>
    </PageInnerContainer>
  </PageContainer>
</template>
